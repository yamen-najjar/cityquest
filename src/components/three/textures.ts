// Textures drawn on a 2D canvas at runtime: paper, leather, digits, engravings. Nothing is downloaded.
import * as THREE from 'three';
import type { PaperArt } from '@/content/types';

export const GOLD = '#DDB66A';
export const INK = '#2B2118';

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

function toTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Deterministic noise, so a texture looks the same every time. */
function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function paperBase(ctx: CanvasRenderingContext2D, w: number, h: number, tone = '#E9DDC3', seed = 7) {
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, w, h);
  const r = rand(seed);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(90,60,30,${r() * 0.06})`;
    ctx.fillRect(r() * w, r() * h, 2 + r() * 6, 2 + r() * 6);
  }
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(80,50,20,0.35)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function scribbleLines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, rows: number, gap: number, seed = 3) {
  const r = rand(seed);
  ctx.strokeStyle = 'rgba(43,33,24,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < rows; i++) {
    ctx.beginPath();
    const yy = y + i * gap;
    ctx.moveTo(x, yy);
    let xx = x;
    const end = x + w * (0.6 + r() * 0.4);
    while (xx < end) {
      xx += 8 + r() * 10;
      ctx.lineTo(xx, yy + (r() - 0.5) * 6);
    }
    ctx.stroke();
  }
}

function sun(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * s * 1.4, y + Math.sin(a) * s * 1.4);
    ctx.lineTo(x + Math.cos(a) * s * 1.9, y + Math.sin(a) * s * 1.9);
    ctx.stroke();
  }
}

function moon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, bg: string) {
  ctx.beginPath();
  ctx.arc(x, y, s, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(x + s * 0.5, y - s * 0.15, s * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? s * 0.45 : s;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/** A sheet for the letter, map, page and other paper items. */
export function paperTexture(art: PaperArt, w = 512, h = 680): THREE.CanvasTexture {
  const [c, ctx] = canvas(w, h);
  if (art === 'quill') {
    // Chalk on a dark slate.
    ctx.fillStyle = '#2A2F36';
    ctx.fillRect(0, 0, w, h);
    const r = rand(11);
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255,255,255,${r() * 0.04})`;
      ctx.fillRect(r() * w, r() * h, 3, 3);
    }
    ctx.strokeStyle = 'rgba(245,240,230,0.9)';
    ctx.fillStyle = 'rgba(245,240,230,0.22)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Quill: a feather vane around the upper two thirds of the shaft, then the bare nib.
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(400, 130);
    ctx.bezierCurveTo(330, 150, 230, 300, 205, 410);
    ctx.bezierCurveTo(260, 380, 400, 260, 400, 130);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 3; // barbs
    for (let i = 1; i < 9; i++) {
      const t = i / 9;
      const x = 400 - t * 195;
      const y = 130 + t * 280;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 26 + t * 6, y - 4);
      ctx.moveTo(x, y);
      ctx.lineTo(x + 22 - t * 6, y - 10);
      ctx.stroke();
    }
    ctx.lineWidth = 8; // shaft and nib
    ctx.beginPath();
    ctx.moveTo(405, 120);
    ctx.lineTo(150, 545);
    ctx.stroke();
    ctx.lineWidth = 9; // needle
    ctx.beginPath();
    ctx.moveTo(120, 160);
    ctx.lineTo(400, 530);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(130, 172, 10, 20, -0.65, 0, Math.PI * 2);
    ctx.stroke();
    return toTexture(c);
  }
  if (art === 'stamps') {
    ctx.fillStyle = '#6B3F22';
    ctx.fillRect(0, 0, w, h);
    const r = rand(5);
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(0,0,0,${r() * 0.12})`;
      ctx.fillRect(r() * w, r() * h, 2, 2);
    }
    ctx.strokeStyle = 'rgba(221,182,106,0.85)';
    ctx.fillStyle = 'rgba(221,182,106,0.85)';
    ctx.lineWidth = 4;
    ctx.font = 'bold 44px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const marks = ['♛', '✦', '◆', '✚', '❖'];
    marks.forEach((m, i) => {
      const y = 90 + i * 125;
      ctx.strokeRect(w / 2 - 60, y - 45, 120, 90);
      ctx.fillText(m, w / 2 - 15, y);
      ctx.font = 'bold 26px Georgia, serif';
      ctx.fillText(String(i + 1), w / 2 + 35, y + 22);
      ctx.font = 'bold 44px Georgia, serif';
    });
    return toTexture(c);
  }
  if (art === 'codex-cover') {
    ctx.fillStyle = '#3A1E14';
    ctx.fillRect(0, 0, w, h);
    const r = rand(9);
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${r() * 0.15})`;
      ctx.fillRect(r() * w, r() * h, 2, 2);
    }
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, w - 92, h - 92);
    // A lantern emblem.
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.moveTo(w / 2, 220);
    ctx.lineTo(w / 2 + 60, 290);
    ctx.lineTo(w / 2 + 45, 420);
    ctx.lineTo(w / 2 - 45, 420);
    ctx.lineTo(w / 2 - 60, 290);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F8E7BE';
    ctx.beginPath();
    ctx.arc(w / 2, 335, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = GOLD;
    ctx.fillRect(w / 2 - 70, 420, 140, 16);
    ctx.font = 'italic 46px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Codex Lumen', w / 2, 540);
    return toTexture(c);
  }

  paperBase(ctx, w, h, art === 'rubbing' ? '#EFEAE0' : '#E9DDC3', art.length * 13);
  ctx.fillStyle = INK;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  if (art === 'suns') {
    scribbleLines(ctx, 50, 90, w - 100, 7, 42, 4);
    sun(ctx, 110, 470, 24);
    sun(ctx, 210, 470, 24);
    sun(ctx, 310, 470, 24);
    moon(ctx, 150, 590, 30, '#E2D3B5');
    star(ctx, 330, 590, 34);
  } else if (art === 'lanterns') {
    // Drawn on a 512 x 680 sketch, scaled to whatever sheet size the model asks for.
    ctx.save();
    ctx.scale(w / 512, h / 680);
    ctx.strokeStyle = 'rgba(43,90,140,0.7)';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(-20, 520);
    ctx.bezierCurveTo(150, 450, 300, 600, w + 20, 500);
    ctx.stroke();
    const pts = [
      [90, 140], [220, 110], [360, 160], [140, 290], [300, 300], [420, 380], [250, 520],
    ];
    ctx.fillStyle = '#B8914A';
    for (const [x, y] of pts) {
      ctx.beginPath();
      ctx.arc(x!, y!, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x! - 3, y! + 14, 6, 18);
    }
    ctx.strokeStyle = '#8B1E1E';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(225, 495);
    ctx.lineTo(275, 545);
    ctx.moveTo(275, 495);
    ctx.lineTo(225, 545);
    ctx.stroke();
    ctx.restore();
  } else if (art === 'rubbing') {
    ctx.fillStyle = 'rgba(60,60,70,0.55)';
    for (let y = 60; y < h - 60; y += 4) ctx.fillRect(60, y, w - 120, 2);
    ctx.fillStyle = '#EFEAE0';
    ctx.font = 'bold 120px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('VALEN', w / 2, h / 2 + 40);
  } else {
    scribbleLines(ctx, 50, 90, w - 100, 12, 44, 8);
  }
  return toTexture(c);
}

/** Digits 0-9 around a dial's rim; each digit takes a tenth of the circumference. */
export function dialTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(1024, 128);
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, '#6E5A34');
  g.addColorStop(0.5, '#C9A35C');
  g.addColorStop(1, '#6E5A34');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 128);
  ctx.fillStyle = '#1B140C';
  ctx.font = 'bold 84px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let d = 0; d < 10; d++) {
    ctx.save();
    ctx.translate(d * 102.4 + 51.2, 66);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(String(d), 0, 0);
    ctx.restore();
    ctx.fillRect(d * 102.4, 0, 2, 128);
  }
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

/**
 * The inside of the ring: the goldsmith's hallmarks, evenly spaced, in the order they are stamped. Drawn
 * mirrored because the texture is seen from inside the band.
 */
export function hallmarkTexture(marks: string[]): THREE.CanvasTexture {
  const [c, ctx] = canvas(2048, 160);
  const g = ctx.createLinearGradient(0, 0, 0, 160);
  g.addColorStop(0, '#9FA4AB');
  g.addColorStop(0.5, '#E2E5E9');
  g.addColorStop(1, '#8D9299');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2048, 160);
  ctx.font = 'bold 92px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const step = 2048 / marks.length;
  marks.forEach((m, i) => {
    const x = step * i + step / 2;
    ctx.strokeStyle = 'rgba(40,42,48,0.75)';
    ctx.lineWidth = 5;
    ctx.strokeRect(x - 110, 22, 220, 116);
    ctx.fillStyle = 'rgba(30,32,38,0.9)';
    ctx.fillText(m, x, 84);
  });
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.x = -1; // seen from the inside
  return t;
}

/** Fine engraving on the outside of the ring. */
export function engravingTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(1024, 96);
  ctx.fillStyle = '#C9CDD2';
  ctx.fillRect(0, 0, 1024, 96);
  ctx.strokeStyle = 'rgba(50,52,58,0.55)';
  ctx.lineWidth = 3;
  for (let x = 0; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 48);
    ctx.bezierCurveTo(x + 16, 14, x + 48, 82, x + 64, 48);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 32, 48, 5, 0, Math.PI * 2);
    ctx.stroke();
  }
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

/** A small round label with a number, for checkpoint markers on the 3D map. */
export function labelTexture(text: string, fill: string, color: string): THREE.CanvasTexture {
  const [c, ctx] = canvas(128, 128);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 68);
  return toTexture(c);
}

export function gridTexture(): THREE.CanvasTexture {
  const [c, ctx] = canvas(512, 512);
  ctx.fillStyle = '#0E1A2E';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(248,244,236,0.05)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }
  return toTexture(c);
}
