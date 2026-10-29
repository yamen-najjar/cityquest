import type { Authored, Scene, SceneLine, Voice } from '../types';

type Scenes = Record<string, { intro?: Authored<Scene>; success?: Authored<Scene> }>;

// The cutscenes of both demo adventures, as data. Coordinates are metres: y is up, the camera usually
// looks towards -z. Each set (see components/three/cutscene/sets.ts) places its furniture around the origin.

/** A subtitle line: from t for d seconds, voiced as `voice`, in German, English and Arabic. */
const say = (t: number, d: number, voice: Voice, de: string, en: string, ar: string): Authored<SceneLine> => ({ t, d, voice, text: { de, en, ar } });

// ------------------------------------------------------------------ The Lost Manuscript

export const manuscriptScenes: Scenes = {
  message: {
    intro: {
      set: 'room',
      duration: 6,
      actors: [{ id: 'phone', kind: 'phone', at: [0, 0.79, 0], turn: 0.3 }],
      shots: [
        { t: 0, camera: [0, 1.9, 3], look: [0, 0.8, 0] },
        { t: 5.5, camera: [0.12, 1.2, 0.42], look: [0, 0.79, 0] },
      ],
      actions: [
        { t: 1.2, d: 0.5, do: 'glow', id: 'phone' },
        { t: 1.2, d: 1.4, do: 'shake', id: 'phone' },
      ],
    },
  },
  witnesses: {
    intro: {
      set: 'square',
      duration: 7,
      actors: [
        { id: 'anna', kind: 'woman', at: [-1.3, 0, -2.4], turn: 0.25 },
        { id: 'ben', kind: 'man', at: [0, 0, -2.7] },
        { id: 'clara', kind: 'girl', at: [1.3, 0, -2.4], turn: -0.25 },
      ],
      shots: [
        { t: 0, camera: [0, 4, 7], look: [0, 6, -5] },
        { t: 3, camera: [0, 2.4, 3.5], look: [0, 3, -4] },
        { t: 6.5, camera: [0.4, 1.6, 1.2], look: [0, 1.3, -2.5] },
      ],
      lines: [say(1.5, 3, 'man', 'Wir hatten in jener Nacht Dienst. Einer von uns hat den Schlüssel genommen.', 'We were on duty that night. One of us took the key.', 'كنا في الحراسة تلك الليلة. أحدنا أخذ المفتاح.')],
      actions: [
        { t: 4.5, d: 0.8, do: 'turn', id: 'clara', to: -0.6 },
        { t: 5.6, d: 0.8, do: 'turn', id: 'clara', to: -0.2 },
      ],
    },
    success: {
      set: 'square',
      duration: 5,
      actors: [
        { id: 'anna', kind: 'woman', at: [-1.3, 0, -2.4], turn: 0.25 },
        { id: 'ben', kind: 'man', at: [0, 0, -2.7] },
        { id: 'clara', kind: 'girl', at: [1.3, 0, -2.4], turn: -0.25 },
        { id: 'key', kind: 'key', at: [0.65, 1.05, -0.65], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0.4, 1.6, 1.2], look: [0.6, 1.3, -2] },
        { t: 4.5, camera: [0.5, 1.4, 0.5], look: [0.6, 1.1, -0.7] },
      ],
      lines: [say(2.2, 2.6, 'girl', 'VII hat mich gebeten, ihn zu verstecken.', 'VII asked me to hide it.', 'VII طلب مني أن أخبّئه.')],
      actions: [
        { t: 0.4, d: 1.6, do: 'walk', id: 'clara', to: [0.6, 0, -1.1] },
        { t: 0.4, d: 0.6, do: 'turn', id: 'clara', to: 0 },
        { t: 2.0, d: 0.8, do: 'reach', id: 'clara' },
        { t: 2.4, d: 0.6, do: 'appear', id: 'key' },
        { t: 2.4, d: 1.2, do: 'glow', id: 'key' },
      ],
    },
  },
  clockmaker: {
    intro: {
      set: 'workshop',
      duration: 7,
      actors: [{ id: 'cabinet', kind: 'cabinet', at: [1.6, 0, -3.0] }],
      shots: [
        { t: 0, camera: [0, 1.65, 3.2], look: [0, 1.8, -3] },
        { t: 3.5, camera: [-0.4, 1.6, 0.8], look: [-0.8, 2.2, -3.4] },
        { t: 6.5, camera: [0.7, 1.5, 0.2], look: [1.6, 1.0, -2.8] },
      ],
      actions: [],
      handheld: true,
    },
    success: {
      set: 'workshop',
      duration: 5,
      actors: [
        { id: 'cabinet', kind: 'cabinet', at: [1.6, 0, -3.0] },
        { id: 'map', kind: 'map', at: [1.6, 0.85, -2.75], hidden: true },
      ],
      shots: [
        { t: 0, camera: [1.2, 1.4, -0.6], look: [1.6, 1.0, -2.8] },
        { t: 4.5, camera: [1.4, 1.3, -1.3], look: [1.6, 1.1, -2.8] },
      ],
      actions: [
        { t: 0.5, d: 1.4, do: 'open', id: 'cabinet' },
        { t: 0.8, d: 1.2, do: 'glow', id: 'cabinet' },
        { t: 1.6, d: 0.6, do: 'appear', id: 'map' },
        { t: 1.6, d: 1.6, do: 'rise', id: 'map', by: 0.3 },
        { t: 1.8, d: 1, do: 'glow', id: 'map' },
      ],
    },
  },
  chest: {
    intro: {
      set: 'riverbank',
      duration: 7,
      actors: [{ id: 'chest', kind: 'chest', at: [0.6, 0, -3.0], turn: -0.2 }],
      shots: [
        { t: 0, camera: [-1.5, 1.65, 5], look: [0, 1.4, -6] },
        { t: 6.5, camera: [0.2, 1.4, -0.6], look: [0.6, 0.3, -3] },
      ],
      actions: [],
      handheld: true,
    },
    success: {
      set: 'riverbank',
      duration: 5,
      actors: [
        { id: 'chest', kind: 'chest', at: [0.6, 0, -3.0], turn: -0.2 },
        { id: 'page', kind: 'page', at: [0.6, 0.35, -3.0], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0.9, 1.2, -1.2], look: [0.6, 0.35, -3] },
        { t: 4.5, camera: [0.8, 1.1, -1.7], look: [0.6, 0.6, -3] },
      ],
      actions: [
        { t: 0.6, d: 1.4, do: 'open', id: 'chest' },
        { t: 0.8, d: 1.2, do: 'glow', id: 'chest' },
        { t: 1.6, d: 0.6, do: 'appear', id: 'page' },
        { t: 1.6, d: 2, do: 'rise', id: 'page', by: 0.45 },
        { t: 1.8, d: 1, do: 'glow', id: 'page' },
      ],
    },
  },
  mirror: {
    intro: {
      set: 'archive',
      duration: 7,
      actors: [
        { id: 'elise', kind: 'old-woman', at: [0, 0.9, -4.0], turn: Math.PI },
        { id: 'lantern', kind: 'lantern', at: [0.36, 1.45, -3.85] },
      ],
      shots: [
        { t: 0, camera: [0, 1.8, 7], look: [0, 2.5, -5] },
        { t: 6.5, camera: [0, 1.6, 0.6], look: [0, 1.5, -4] },
      ],
      lines: [say(5, 2, 'old', 'Lies die Seite.', 'Read the page.', 'اقرأ الصفحة.')],
      actions: [{ t: 3.6, d: 1.6, do: 'turn', id: 'elise', to: 0 }],
    },
    success: {
      set: 'archive',
      duration: 5,
      actors: [
        { id: 'elise', kind: 'old-woman', at: [0, 0.9, -4.0] },
        { id: 'lantern', kind: 'lantern', at: [0.36, 1.45, -3.85] },
        { id: 'book', kind: 'book', at: [0, 1.6, -3.55], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0, 1.6, 0.6], look: [0, 1.5, -4] },
        { t: 4.5, camera: [0.2, 1.75, -1.6], look: [0, 1.6, -3.6] },
      ],
      lines: [say(1.4, 3, 'old', 'Ich heiße Elise.', 'My name is Elise.', 'اسمي إليزه.')],
      actions: [
        { t: 0.6, d: 0.9, do: 'reach', id: 'elise' },
        { t: 1.2, d: 0.8, do: 'appear', id: 'book' },
        { t: 1.2, d: 1.6, do: 'glow', id: 'book' },
        { t: 1.6, d: 1.8, do: 'rise', id: 'book', by: 0.12 },
      ],
    },
  },
  study: {
    intro: {
      set: 'workshop',
      duration: 7,
      actors: [
        { id: 'keeper', kind: 'woman', at: [1.8, 0, -0.6], turn: -0.9 },
        { id: 'page', kind: 'page', at: [-1.6, 0.96, -2.2], turn: 0.3 },
      ],
      shots: [
        { t: 0, camera: [2.2, 1.65, 3.2], look: [1.6, 1.4, -0.8] },
        { t: 3.2, camera: [0.8, 1.6, 1.4], look: [-1.4, 1.1, -2.2] },
        { t: 6.6, camera: [-1.0, 1.55, -0.6], look: [-1.6, 0.95, -2.2] },
      ],
      lines: [say(0.8, 2.6, 'woman', 'Der Professor ist gerade fort. Sehr eilig.', 'The professor has just left. In a great hurry.', 'الأستاذ خرج للتو. على عجل.')],
      actions: [
        { t: 4, d: 1.4, do: 'glow', id: 'page' },
      ],
      handheld: true,
    },
    success: {
      set: 'workshop',
      duration: 5,
      actors: [{ id: 'half', kind: 'page', at: [-1.5, 0.96, -2.15], hidden: true }],
      shots: [
        { t: 0, camera: [-1.0, 1.5, -0.6], look: [-1.5, 0.95, -2.2] },
        { t: 4.5, camera: [-1.2, 1.4, -1.0], look: [-1.5, 1.2, -2.2] },
      ],
      actions: [
        { t: 0.6, d: 0.8, do: 'appear', id: 'half' },
        { t: 0.8, d: 2.2, do: 'rise', id: 'half', by: 0.3 },
        { t: 1, d: 1.2, do: 'glow', id: 'half' },
      ],
    },
  },
  signal: {
    intro: {
      set: 'riverbank',
      duration: 8,
      actors: [{ id: 'far', kind: 'lantern', at: [3.2, 2.6, -18.3], scale: 4, hidden: true }],
      shots: [
        { t: 0, camera: [0.6, 1.3, -1.5], look: [0.6, 0.3, -3] },
        { t: 2.2, camera: [0.6, 1.6, -2.2], look: [3.2, 2.8, -18] },
        { t: 8, camera: [0.8, 1.6, -2.6], look: [3.2, 2.8, -18] },
      ],
      actions: [
        // Short, long, short: the lantern starts signalling.
        { t: 2.6, d: 0.1, do: 'appear', id: 'far' },
        { t: 2.9, d: 0.1, do: 'vanish', id: 'far' },
        { t: 3.3, d: 0.1, do: 'appear', id: 'far' },
        { t: 4.2, d: 0.1, do: 'vanish', id: 'far' },
        { t: 4.6, d: 0.1, do: 'appear', id: 'far' },
        { t: 4.9, d: 0.1, do: 'vanish', id: 'far' },
        { t: 5.5, d: 0.1, do: 'appear', id: 'far' },
        { t: 6.4, d: 0.1, do: 'vanish', id: 'far' },
        { t: 6.8, d: 0.1, do: 'appear', id: 'far' },
      ],
    },
  },
  verdict: {
    intro: {
      set: 'archive',
      duration: 7,
      actors: [
        { id: 'elise', kind: 'old-woman', at: [0, 0.9, -4.0] },
        { id: 'lantern', kind: 'lantern', at: [0.36, 1.45, -3.85] },
      ],
      shots: [
        { t: 0, camera: [-3, 1.7, 2.5], look: [0, 1.5, -4] },
        { t: 6.5, camera: [-0.4, 1.6, 0.2], look: [0, 1.6, -4] },
      ],
      lines: [
        say(1, 3, 'old', 'Wer immer es war, wusste genau, wonach er suchte.', 'Whoever it was knew exactly what they were looking for.', 'أيّاً كان، فقد كان يعرف بالضبط عمّا يبحث.'),
        say(4.3, 2.4, 'old', 'Wer war es?', 'Who was it?', 'من كان؟'),
      ],
      actions: [{ t: 0.5, d: 1.2, do: 'reach', id: 'elise' }],
    },
    success: {
      set: 'archive',
      duration: 6.5,
      actors: [
        { id: 'elise', kind: 'old-woman', at: [0, 0.9, -4.0] },
        { id: 'lantern', kind: 'lantern', at: [0.36, 1.45, -3.85] },
        { id: 'kehl', kind: 'man', at: [3.6, 0, 0.6], turn: -1.2 },
      ],
      shots: [
        { t: 0, camera: [-1.6, 1.7, 2.6], look: [1.2, 1.3, -1.4] },
        { t: 6.2, camera: [-1.2, 1.65, 1.6], look: [1.2, 1.4, -1.6] },
      ],
      lines: [
        say(2.6, 2, 'old', 'Albrecht … ausgerechnet du.', 'Albrecht… you of all people.', 'ألبرشت… أنت بالذات؟'),
        say(4.6, 1.9, 'man', 'Ich wollte ihn nur schützen.', 'I only wanted to protect it.', 'أردت فقط أن أحميها.'),
      ],
      actions: [
        { t: 0.3, d: 2.4, do: 'walk', id: 'kehl', to: [1.4, 0, -1.4] },
        { t: 2.6, d: 0.8, do: 'turn', id: 'kehl', to: Math.PI * 0.85 },
      ],
    },
  },
};

// ------------------------------------------------------------------ The Neckar Ring

export const ringScenes: Scenes = {
  box: {
    intro: {
      set: 'shop',
      duration: 7,
      actors: [
        { id: 'owner', kind: 'old-woman', at: [0, 0, -1.3] },
        { id: 'box', kind: 'box', at: [0.15, 0.95, -0.85], turn: 0.15 },
      ],
      shots: [
        { t: 0, camera: [-1.2, 1.7, 3.2], look: [0, 1.4, -1.5] },
        { t: 3, camera: [-0.3, 1.65, 1.6], look: [0, 1.3, -1.2] },
        { t: 6.5, camera: [0, 1.55, 0.85], look: [0.05, 1.1, -0.4] },
      ],
      lines: [say(2.4, 3.2, 'old', 'Das gehört dir. Es hat lange auf dich gewartet.', 'This is yours. It has been waiting for you for a long time.', 'هذا لك. كان ينتظرك منذ زمن طويل.')],
      actions: [
        { t: 2.2, d: 1.0, do: 'reach', id: 'owner' },
        { t: 2.8, d: 2.2, do: 'move', id: 'box', to: [0.05, 0.95, -0.3] },
        { t: 2.8, d: 2.2, do: 'turn', id: 'box', to: 0 },
      ],
    },
    success: {
      set: 'shop',
      duration: 6,
      actors: [
        { id: 'owner', kind: 'old-woman', at: [0, 0, -1.3] },
        { id: 'box', kind: 'box', at: [0.05, 0.95, -0.3] },
        { id: 'ring', kind: 'ring', at: [0.05, 1.03, -0.3], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0, 1.5, 0.75], look: [0.05, 1.12, -0.3] },
        { t: 3.6, camera: [0, 1.45, 0.55], look: [0.05, 1.3, -0.3] },
        { t: 5.6, camera: [0, 1.42, 0.62], look: [0, 1.3, 0] },
      ],
      lines: [say(3.6, 2.2, 'ghost', 'Du hast ihn gefunden … und ich werde dich finden.', 'You found it… and I will find you.', 'وجدتَه… وأنا سأجدك.')],
      actions: [
        { t: 0.6, d: 1.3, do: 'open', id: 'box' },
        { t: 0.8, d: 1.2, do: 'glow', id: 'box' },
        { t: 1.4, d: 0.6, do: 'appear', id: 'ring' },
        { t: 1.4, d: 1.8, do: 'rise', id: 'ring', by: 0.2 },
        { t: 1.5, d: 1, do: 'glow', id: 'ring' },
        // The ring floats to you: it is on your finger now.
        { t: 3.8, d: 1.6, do: 'move', id: 'ring', to: [0, 1.06, 0.08] },
      ],
    },
  },
  whispers: {
    intro: {
      set: 'alley',
      duration: 8,
      actors: [
        { id: 'writing', kind: 'writing', at: [-1.86, 1.9, -4], turn: Math.PI / 2 },
        { id: 'collector', kind: 'ghost', at: [0.3, 0, -13], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0.6, 1.6, 2], look: [-1.9, 1.9, -4] },
        { t: 3.6, camera: [0.4, 1.6, 0.6], look: [-1.9, 1.9, -4] },
        { t: 4.6, camera: [0.3, 1.6, 0.4], look: [0.2, 1.5, -12] },
        { t: 8, camera: [0.3, 1.6, 0.3], look: [0.2, 1.5, -12] },
      ],
      lines: [say(4.6, 1.6, 'ghost', 'Ich sehe dich.', 'I see you.', 'أراك.')],
      actions: [
        { t: 1, d: 1.6, do: 'glow', id: 'writing' },
        { t: 4.4, d: 0.5, do: 'appear', id: 'collector' },
        { t: 6.2, d: 0.35, do: 'vanish', id: 'collector' },
      ],
    },
  },
  chase: {
    intro: {
      set: 'lanes',
      duration: 7,
      actors: [
        { id: 'c1', kind: 'ghost', at: [1.7, 0, -6], hidden: true, turn: -0.6 },
        { id: 'c2', kind: 'ghost', at: [-1.7, 0, -9.5], hidden: true, turn: 0.6 },
      ],
      shots: [
        { t: 0, camera: [0, 1.6, 4], look: [0, 1.5, -12] },
        { t: 6.5, camera: [0, 1.6, -11], look: [0, 1.6, -20] },
      ],
      actions: [
        { t: 1.6, d: 0.3, do: 'appear', id: 'c1' },
        { t: 2.6, d: 0.3, do: 'vanish', id: 'c1' },
        { t: 3.6, d: 0.3, do: 'appear', id: 'c2' },
        { t: 4.6, d: 0.3, do: 'vanish', id: 'c2' },
      ],
      handheld: true,
    },
    success: {
      set: 'lanes',
      duration: 6,
      actors: [
        { id: 'door', kind: 'door', at: [0.82, 0, -21] },
        { id: 'mira', kind: 'woman', at: [0.82, 0, -20.7], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0, 1.6, -11], look: [0.82, 1.5, -20] },
        { t: 3, camera: [0.82, 1.6, -16], look: [0.82, 1.4, -21] },
        { t: 5.6, camera: [0.82, 1.6, -17.4], look: [0.82, 1.3, -21] },
      ],
      lines: [say(4.3, 1.6, 'woman', 'Ich bin Mira. Komm rein, schnell.', 'I’m Mira. Come in, quickly.', 'أنا ميرا. ادخل، بسرعة.')],
      actions: [
        { t: 2.8, d: 1.4, do: 'open', id: 'door' },
        { t: 3.6, d: 0.8, do: 'appear', id: 'mira' },
        { t: 4.4, d: 0.8, do: 'reach', id: 'mira' },
      ],
      handheld: true,
    },
  },
  goldsmith: {
    intro: {
      set: 'workshop',
      duration: 8,
      actors: [
        { id: 'mira', kind: 'woman', at: [-1.6, 0, -2.95] },
        { id: 'ring', kind: 'ring', at: [-1.4, 0.96, -2.0] },
        { id: 'mirror', kind: 'mirror', at: [1.4, 1.75, -3.38] },
        { id: 'collector', kind: 'ghost', at: [1.4, 0, -3.0], hidden: true, scale: 0.9 },
      ],
      shots: [
        { t: 0, camera: [0, 1.65, 3], look: [-1.2, 1.3, -2.5] },
        { t: 4, camera: [-0.5, 1.5, 0.4], look: [-1.5, 1.1, -2.3] },
        { t: 5.6, camera: [-0.2, 1.6, 0.4], look: [1.4, 1.7, -3.3] },
        { t: 8, camera: [-0.1, 1.6, 0.3], look: [1.4, 1.7, -3.3] },
      ],
      lines: [say(2.4, 3, 'woman', 'Der Fluch bricht nur dort, wo er seinen Namen verkauft hat.', 'The curse only breaks where he sold his name.', 'اللعنة لا تنكسر إلا حيث باع اسمه.')],
      actions: [
        { t: 1.5, d: 1.2, do: 'glow', id: 'ring' },
        { t: 2.5, d: 1.0, do: 'reach', id: 'mira' },
        { t: 5.8, d: 0.4, do: 'appear', id: 'collector' },
        { t: 7.0, d: 0.3, do: 'vanish', id: 'collector' },
      ],
    },
    success: {
      set: 'workshop',
      duration: 5,
      actors: [
        { id: 'mira', kind: 'woman', at: [-1.6, 0, -2.95], turn: 0.7 },
        { id: 'mirror', kind: 'mirror', at: [1.4, 1.75, -3.38] },
      ],
      shots: [
        { t: 0, camera: [0.3, 1.6, -0.2], look: [1.4, 1.7, -3.3] },
        { t: 4.5, camera: [0.1, 1.55, 0.3], look: [1.3, 1.3, -3.1] },
      ],
      lines: [say(2.6, 1.8, 'woman', 'Er weiß jetzt, dass wir ihn kennen.', 'He knows we have it now.', 'صار يعرف أننا نعرفه.')],
      actions: [
        { t: 0.3, d: 0.7, do: 'shake', id: 'mirror' },
        { t: 1.0, d: 1.8, do: 'shatter', id: 'mirror' },
      ],
    },
  },
  bridge: {
    intro: {
      set: 'bridge',
      duration: 8,
      actors: [{ id: 'collector', kind: 'ghost', at: [5.5, -10, -10], hidden: true, scale: 3.2, turn: -0.7 }],
      shots: [
        { t: 0, camera: [0, 1.6, 6], look: [0, 1.6, -20] },
        { t: 3, camera: [0.9, 1.6, 1], look: [3, -2, -8] },
        { t: 8, camera: [1.2, 1.7, 0.4], look: [5, 1, -10] },
      ],
      lines: [say(4.6, 2.6, 'ghost', 'Ein Name für einen Namen.', 'A name for a name.', 'اسم مقابل اسم.')],
      actions: [
        { t: 3.2, d: 1, do: 'appear', id: 'collector' },
        { t: 3.2, d: 3.6, do: 'rise', id: 'collector', by: 6.5 },
      ],
    },
    success: {
      set: 'bridge',
      duration: 5,
      actors: [
        { id: 'collector', kind: 'ghost', at: [5.5, -3.5, -10], scale: 3.2, turn: -0.7 },
        { id: 'ring', kind: 'ring', at: [0.25, 1.35, -0.2] },
      ],
      shots: [
        { t: 0, camera: [1.2, 1.7, 0.4], look: [5, 1, -10] },
        { t: 2.4, camera: [0.6, 1.65, 0.6], look: [-3, 1.4, 8] },
        { t: 5, camera: [0.5, 1.6, 0.5], look: [-3, 1.4, 8] },
      ],
      actions: [
        { t: 1.6, d: 1.6, do: 'vanish', id: 'collector' },
        { t: 2.6, d: 1.4, do: 'move', id: 'ring', to: [0.2, 1.4, 1.3] },
        { t: 2.6, d: 1.2, do: 'glow', id: 'ring' },
      ],
    },
  },
  watchman: {
    intro: {
      set: 'square',
      duration: 7.5,
      actors: [
        { id: 'kaspar', kind: 'man', at: [0.8, 0, -2.0], turn: -0.5 },
        { id: 'lantern', kind: 'lantern', at: [1.12, 0.98, -1.75] },
      ],
      shots: [
        { t: 0, camera: [-2.5, 1.7, 5], look: [0, 3, -4] },
        { t: 4, camera: [-0.4, 1.65, 1.6], look: [0.8, 1.5, -2] },
        { t: 7.5, camera: [0.1, 1.62, 0.4], look: [0.8, 1.55, -2] },
      ],
      lines: [say(4.4, 3, 'man', 'Noch einer mit dem Silberring …', 'Another one with the silver ring…', 'واحد آخر بالخاتم الفضي…')],
      actions: [
        { t: 3.2, d: 1.2, do: 'turn', id: 'kaspar', to: -0.15 },
        { t: 3.8, d: 1.2, do: 'rise', id: 'lantern', by: 0.35 },
      ],
    },
  },
  ledger: {
    intro: {
      set: 'workshop',
      duration: 7,
      actors: [
        { id: 'mira', kind: 'woman', at: [-1.6, 0, -2.95] },
        { id: 'page', kind: 'page', at: [-1.5, 0.96, -2.05], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0.6, 1.65, 2.6], look: [-1.4, 1.3, -2.6] },
        { t: 6.6, camera: [-0.9, 1.5, -0.3], look: [-1.5, 1.05, -2.2] },
      ],
      lines: [say(2.2, 3.2, 'woman', 'Jemand hat diese Seite zerrissen.', 'Someone tore this page apart.', 'أحدهم مزّق هذه الصفحة.')],
      actions: [
        { t: 1.6, d: 1, do: 'reach', id: 'mira' },
        { t: 2.2, d: 0.8, do: 'appear', id: 'page' },
        { t: 2.4, d: 1.4, do: 'glow', id: 'page' },
      ],
    },
  },
  letter: {
    intro: {
      set: 'workshop',
      duration: 7,
      actors: [
        { id: 'mira', kind: 'woman', at: [-1.6, 0, -2.95] },
        { id: 'box', kind: 'box', at: [-1.45, 0.94, -2.1] },
        { id: 'note', kind: 'page', at: [-1.45, 1.0, -2.1], hidden: true },
      ],
      shots: [
        { t: 0, camera: [0.4, 1.6, 1.8], look: [-1.45, 1.1, -2.2] },
        { t: 6.6, camera: [-1.1, 1.45, -0.7], look: [-1.45, 1.1, -2.1] },
      ],
      lines: [say(2.6, 2.8, 'woman', 'Da ist etwas im Futter.', 'There’s something in the lining.', 'هناك شيء في البطانة.')],
      actions: [
        { t: 1, d: 1.2, do: 'open', id: 'box' },
        { t: 2.6, d: 0.6, do: 'appear', id: 'note' },
        { t: 2.6, d: 2.2, do: 'rise', id: 'note', by: 0.3 },
        { t: 3, d: 1, do: 'glow', id: 'note' },
      ],
    },
  },
};
