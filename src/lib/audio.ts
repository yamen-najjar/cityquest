'use client';

// Sound for the game, synthesised with the Web Audio API: nothing to download. Ambience per place (wind,
// water, ticking clocks, a distant bell), short effects (right, wrong, unlock, item) and Morse beeps.
// Nothing plays until the player has pressed something (browsers require it) and a mute switch is saved.
import type { SceneSet } from '@/content/types';

const MUTE_KEY = 'cityquest:muted';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambience: { stop: () => void; set: string } | null = null;

export function isMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* per page only */
  }
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.05);
  window.dispatchEvent(new CustomEvent('cityquest:muted', { detail: muted }));
}

/** Creates (or resumes) the audio context. Call from a click or key handler. */
export function unlockAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = isMuted() ? 0 : 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function noiseBuffer(c: AudioContext, seconds: number): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // Brown-ish noise: softer than white noise, like wind or distant water.
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.2, to?: AudioNode) {
  if (!ctx || !master) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(to ?? master);
  o.start(start);
  o.stop(start + dur + 0.05);
}

export type Sfx = 'correct' | 'wrong' | 'unlock' | 'item' | 'page' | 'hint' | 'stinger';

export function sfx(kind: Sfx) {
  const c = unlockAudio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  switch (kind) {
    case 'correct':
      tone(523.25, t, 0.35, 'triangle', 0.18);
      tone(783.99, t + 0.12, 0.5, 'triangle', 0.16);
      break;
    case 'wrong':
      tone(130, t, 0.25, 'sawtooth', 0.06);
      tone(110, t + 0.08, 0.3, 'sawtooth', 0.05);
      break;
    case 'unlock':
      tone(1800, t, 0.05, 'square', 0.05);
      tone(900, t + 0.09, 0.08, 'square', 0.06);
      tone(300, t + 0.2, 0.25, 'triangle', 0.12);
      break;
    case 'item':
      [880, 1108.7, 1318.5, 1760].forEach((f, i) => tone(f, t + i * 0.07, 0.4, 'sine', 0.09));
      break;
    case 'page':
      tone(2400, t, 0.06, 'triangle', 0.02);
      break;
    case 'hint':
      tone(659.25, t, 0.3, 'sine', 0.1);
      break;
    case 'stinger':
      tone(98, t, 2.2, 'sawtooth', 0.05);
      tone(103.8, t, 2.2, 'sawtooth', 0.04);
      tone(196, t + 0.05, 1.6, 'triangle', 0.05);
      break;
  }
}

/** Plays a Morse signal: '.' short, '-' long, ' ' a letter gap. Returns its length in seconds. */
export function playMorse(code: string, unit = 0.16, onFlash?: (on: boolean, at: number) => void): number {
  const c = unlockAudio();
  let at = 0;
  for (const ch of code) {
    if (ch === '.' || ch === '-') {
      const len = ch === '.' ? unit : unit * 3;
      if (c) tone(660, c.currentTime + 0.05 + at, len, 'sine', 0.15);
      onFlash?.(true, at);
      onFlash?.(false, at + len);
      at += len + unit;
    } else {
      at += unit * 2;
    }
  }
  return at;
}

/** Layered, looping ambience for a place: noise beds plus a few synthesised details. */
export function playAmbience(set: SceneSet | 'menu') {
  const c = unlockAudio();
  if (!c || !master) return;
  if (ambience?.set === set) return;
  ambience?.stop();
  const out = c.createGain();
  out.gain.value = 0;
  out.gain.linearRampToValueAtTime(1, c.currentTime + 2);
  out.connect(master);
  const nodes: AudioScheduledSourceNode[] = [];
  const timers: number[] = [];

  const bed = (cutoff: number, gain: number, q = 0.7) => {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 4);
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.value = gain;
    src.connect(f).connect(g).connect(out);
    src.start();
    nodes.push(src);
    // A slow swell, like gusts.
    const lfo = c.createOscillator();
    const lg = c.createGain();
    lfo.frequency.value = 0.07 + Math.random() * 0.05;
    lg.gain.value = gain * 0.5;
    lfo.connect(lg).connect(g.gain);
    lfo.start();
    nodes.push(lfo);
  };
  const every = (ms: number, fn: () => void) => timers.push(window.setInterval(fn, ms));
  const tick = (freq: number, gain: number) => tone(freq, c.currentTime + 0.01, 0.03, 'square', gain, out);
  const bell = () => {
    const t = c.currentTime + 0.01;
    [392, 784, 1176].forEach((f, i) => tone(f, t, 3.5 - i, 'sine', 0.03 / (i + 1), out));
  };

  switch (set) {
    case 'room':
      bed(300, 0.08);
      every(1000, () => tick(1800, 0.008));
      break;
    case 'shop':
      bed(220, 0.06);
      every(1000, () => tick(2200, 0.012));
      every(1000, () => window.setTimeout(() => tick(1700, 0.009), 500));
      break;
    case 'workshop':
      bed(200, 0.05);
      every(1000, () => tick(2000, 0.012));
      every(750, () => tick(1500, 0.009));
      every(1333, () => tick(2600, 0.007));
      break;
    case 'riverbank':
    case 'bridge':
      bed(900, 0.12, 0.3); // water
      bed(400, 0.07); // wind
      every(23000, bell);
      break;
    default:
      bed(500, 0.09); // night wind in the streets
      every(19000, bell);
  }
  ambience = {
    set,
    stop: () => {
      out.gain.cancelScheduledValues(c.currentTime);
      out.gain.setTargetAtTime(0, c.currentTime, 0.4);
      timers.forEach((id) => window.clearInterval(id));
      window.setTimeout(() => nodes.forEach((n) => n.stop()), 1500);
    },
  };
}

export function stopAmbience() {
  ambience?.stop();
  ambience = null;
}

// ------------------------------------------------------------------ Speech

const VOICE_KEY = 'cityquest:voices';

export function voicesOn(): boolean {
  try {
    return window.localStorage.getItem(VOICE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setVoicesOn(on: boolean) {
  try {
    window.localStorage.setItem(VOICE_KEY, on ? 'on' : 'off');
  } catch {
    /* per page only */
  }
  if (!on) window.speechSynthesis?.cancel();
}

const VOICE_STYLE: Record<string, { pitch: number; rate: number }> = {
  narrator: { pitch: 1, rate: 1 },
  old: { pitch: 0.75, rate: 0.85 },
  woman: { pitch: 1.15, rate: 1 },
  man: { pitch: 0.8, rate: 0.95 },
  girl: { pitch: 1.35, rate: 1.05 },
  ghost: { pitch: 0.1, rate: 0.7 },
};

const LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB', nl: 'nl-NL', ar: 'ar' };

/** True when the device can speak this language at all. */
export function canSpeak(locale: string): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const lang = LANG[locale] ?? locale;
  const voices = window.speechSynthesis.getVoices();
  return voices.length === 0 || voices.some((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
}

/** Reads text aloud in the device's own voice for that language. Returns false if it cannot. */
export function speak(text: string, locale: string, voice = 'narrator', queue = false): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis || isMuted() || !voicesOn()) return false;
  const synth = window.speechSynthesis;
  if (!queue) synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const lang = LANG[locale] ?? locale;
  u.lang = lang;
  const match = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (match) u.voice = match;
  const style = VOICE_STYLE[voice] ?? VOICE_STYLE.narrator!;
  u.pitch = style.pitch;
  u.rate = style.rate;
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
}
