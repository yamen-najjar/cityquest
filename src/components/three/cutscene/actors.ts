// The people and props a scene can place. Figures are stylised (a robed body, head, hair, arms that
// can reach out) but dressed in a real linen texture; the chest, cabinet, lantern and door are CC0
// models whose lids, doors and leaves really open. Each actor exposes the handles the actions drive.
import * as THREE from 'three';
import type { ActorKind } from '@/content/types';
import { model, surface } from '../assets';
import { buildModel } from '../models';

type Cloth = (color: number) => THREE.Material;

/** Linen-woven cloth in any colour, sharing one set of textures. */
async function clothMaker(): Promise<Cloth> {
  const base = await surface('rough_linen', [4, 4]);
  base.normalScale.set(1.6, 1.6);
  const made = new Map<number, THREE.MeshStandardMaterial>();
  return (color) => {
    let m = made.get(color);
    if (!m) {
      m = base.clone();
      m.color.setHex(color);
      m.metalness = 0;
      m.metalnessMap = null;
      made.set(color, m);
    }
    return m;
  };
}

export interface ActorHandle {
  group: THREE.Group;
  /** Materials faded by appear / vanish, with their full opacity. */
  fade: { m: THREE.Material; full: number }[];
  open?: (p: number) => void;
  reach?: (p: number) => void;
  glow?: (p: number) => void;
  shatter?: (p: number) => void;
  idle?: (t: number) => void;
}

const std = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });

/** Positions (and optionally rotates) a mesh and returns it, for one-line building. */
function place(mesh: THREE.Mesh, at: [number, number, number], rot?: [number, number, number]): THREE.Mesh {
  mesh.position.set(...at);
  if (rot) mesh.rotation.set(...rot);
  return mesh;
}

function collectFade(group: THREE.Object3D, full = 1): ActorHandle['fade'] {
  const out: ActorHandle['fade'] = [];
  group.traverse((o) => {
    const m = (o as THREE.Mesh).material;
    for (const mm of Array.isArray(m) ? m : m ? [m] : []) {
      mm.transparent = true;
      out.push({ m: mm, full: mm.opacity < 1 ? mm.opacity : full });
    }
  });
  return out;
}

interface FigureStyle {
  robe: number;
  skin: number;
  hair: number;
  hairStyle: 'bun' | 'long' | 'short' | 'braid';
  height: number;
  hunch?: number;
  shawl?: number;
  apron?: number;
}

/** A robed figure about `height` metres tall, facing +z. */
function figure(s: FigureStyle, cloth: Cloth): ActorHandle {
  const k = s.height / 1.65;
  const group = new THREE.Group();
  const upper = new THREE.Group();
  // A long coat or dress: wider at the hem, a waist, then shoulders.
  const robeProfile = [
    [0, 0], [0.33, 0], [0.31, 0.06], [0.26, 0.4], [0.2, 0.72], [0.18, 0.88], [0.21, 1.02], [0.2, 1.1], [0.12, 1.17], [0, 1.18],
  ].map(([x, y]) => new THREE.Vector2(x! * k, y! * k));
  const robe = new THREE.Mesh(new THREE.LatheGeometry(robeProfile, 40), cloth(s.robe));
  robe.scale.z = 0.78; // bodies are deeper side to side than front to back
  robe.castShadow = true;
  group.add(robe);
  if (s.apron) {
    const apron = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * k, 0.29 * k, 0.6 * k, 16, 1, true, -0.9, 1.8), cloth(s.apron));
    (apron.material as THREE.Material).side = THREE.DoubleSide;
    apron.position.y = 0.45 * k;
    group.add(apron);
  }

  upper.position.y = 1.0 * k;
  upper.rotation.x = s.hunch ?? 0;
  group.add(upper);

  const skin = new THREE.MeshPhysicalMaterial({ color: s.skin, roughness: 0.62, sheen: 0.15, sheenColor: new THREE.Color(0xffd0b0), sheenRoughness: 0.7 });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045 * k, 0.055 * k, 0.12 * k, 16), skin);
  neck.position.y = 0.2 * k;
  // A head that is an egg rather than a ball, with a nose, brows, ears and a mouth line.
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.115 * k, 32, 24), skin);
  head.position.y = 0.355 * k;
  head.scale.set(0.86, 1.1, 0.95);
  head.castShadow = true;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.018 * k, 0.05 * k, 12), skin);
  nose.position.set(0, 0.345 * k, 0.108 * k);
  nose.rotation.x = Math.PI / 2 - 0.35;
  const eyeM = new THREE.MeshStandardMaterial({ color: 0x15100c, roughness: 0.15 });
  const browM = new THREE.MeshStandardMaterial({ color: s.hair, roughness: 0.9 });
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.012 * k, 10, 8), eyeM);
    eye.position.set(side * 0.036 * k, 0.37 * k, 0.096 * k);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.034 * k, 0.007 * k, 0.01 * k), browM);
    brow.position.set(side * 0.037 * k, 0.392 * k, 0.098 * k);
    brow.rotation.z = side * -0.12;
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.02 * k, 10, 8), skin);
    ear.scale.set(0.5, 1, 0.8);
    ear.position.set(side * 0.1 * k, 0.355 * k, 0);
    upper.add(eye, brow, ear);
  }
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.03 * k, 0.005 * k, 0.006 * k), new THREE.MeshStandardMaterial({ color: 0x6b3a32 }));
  mouth.position.set(0, 0.312 * k, 0.1 * k);
  upper.add(neck, head, nose, mouth);

  const hairM = std(s.hair, { roughness: 0.75 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.122 * k, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hairM);
  cap.position.y = 0.37 * k;
  cap.scale.set(0.9, 1.05, 1);
  cap.rotation.x = -0.32;
  upper.add(cap);
  if (s.hairStyle === 'bun') {
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.07 * k, 16, 12), hairM);
    bun.position.set(0, 0.47 * k, -0.08 * k);
    upper.add(bun);
  } else if (s.hairStyle === 'long') {
    const fall = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * k, 0.14 * k, 0.4 * k, 24, 1, true, Math.PI * 0.6, Math.PI * 0.8), std(s.hair, { side: THREE.DoubleSide, roughness: 0.75 }));
    fall.position.set(0, 0.2 * k, -0.02 * k);
    upper.add(fall);
  } else if (s.hairStyle === 'braid') {
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.04 * k, 10, 8), hairM);
      b.position.set(0.06 * k, (0.3 - i * 0.08) * k, -0.1 * k);
      upper.add(b);
    }
  }

  if (s.shawl) {
    // A shawl draped over the shoulders: a flattened ring that falls lower at the back.
    const shawl = new THREE.Mesh(new THREE.TorusGeometry(0.16 * k, 0.075 * k, 16, 40), cloth(s.shawl));
    shawl.rotation.x = Math.PI / 2 - 0.25;
    shawl.scale.set(1.05, 0.85, 0.4);
    shawl.position.set(0, 0.1 * k, -0.01 * k);
    upper.add(shawl);
  }

  // Arms hang from shoulder pivots; reaching swings the right arm forward.
  const arms: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.2 * k, 0.1 * k, 0);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.048 * k, 0.36 * k, 6, 16), cloth(s.robe));
    arm.position.y = -0.22 * k;
    arm.castShadow = true;
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.042 * k, 16, 12), skin);
    hand.scale.set(0.8, 1.2, 0.6);
    hand.position.y = -0.46 * k;
    pivot.add(arm, hand);
    pivot.rotation.z = side * 0.12;
    upper.add(pivot);
    arms.push(pivot);
  }

  return {
    group,
    fade: collectFade(group),
    reach: (p) => {
      arms[1]!.rotation.x = -1.25 * p;
      arms[1]!.rotation.z = 0.12 - 0.25 * p;
    },
    idle: (t) => {
      upper.rotation.z = Math.sin(t * 1.3 + s.height) * 0.015;
      upper.position.y = 1.0 * k + Math.sin(t * 2) * 0.004;
    },
  };
}

/** The Grey Collector: tall, a long coat and a wide hat, no face. Half there. */
function ghost(): ActorHandle {
  const outer = new THREE.Group();
  // The sway moves an inner group, so it adds to whatever position the scene gives the actor.
  const group = new THREE.Group();
  outer.add(group);
  const coat = std(0x6b7280, { transparent: true, opacity: 0.72, emissive: 0x1d2433, emissiveIntensity: 0.6 });
  const profile = [[0, 0], [0.42, 0], [0.36, 0.7], [0.26, 1.5], [0.22, 1.85], [0, 1.9]].map(([x, y]) => new THREE.Vector2(x!, y!));
  group.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 20), coat));
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), std(0x0b0f18, { transparent: true, opacity: 0.85 }));
  face.position.y = 2.05;
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 24), std(0x2b2f38, { transparent: true, opacity: 0.85 }));
  brim.position.y = 2.18;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.28, 20), std(0x2b2f38, { transparent: true, opacity: 0.85 }));
  crown.position.y = 2.34;
  group.add(face, brim, crown);
  return {
    group: outer,
    fade: collectFade(group),
    idle: (t) => {
      group.rotation.z = Math.sin(t * 0.9) * 0.02;
      group.position.y = Math.sin(t * 1.4) * 0.03;
    },
  };
}

function glowLight(color: number, distance: number) {
  const l = new THREE.PointLight(color, 0, distance, 1.5);
  return l;
}

async function woodenBox(): Promise<ActorHandle> {
  const group = new THREE.Group();
  const wood = await surface('dark_wooden_planks', [0.35, 0.35], 0xd9b48c);
  const dark = std(0x2a1810);
  group.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.24), wood), [0, 0.07, 0]));
  const inside = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.2), std(0x6b1e2a));
  inside.position.y = 0.13;
  group.add(inside);
  const lid = new THREE.Group();
  lid.position.set(0, 0.14, -0.12);
  const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.25), wood);
  lidMesh.position.set(0, 0.025, 0.12);
  const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.01), std(0xb8914a, { metalness: 0.9, roughness: 0.3 }));
  clasp.position.set(0, 0, 0.25);
  lid.add(lidMesh, clasp);
  group.add(lid);
  void dark;
  const light = glowLight(0xc8d6ff, 0.8);
  light.position.set(0, 0.16, 0.05);
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    open: (p) => (lid.rotation.x = -1.9 * p),
    glow: (p) => (light.intensity = 0.9 * p),
  };
}

function smallRing(): ActorHandle {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 16, 48), new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 1, roughness: 0.32, emissive: 0x8899bb, emissiveIntensity: 0 }));
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const light = glowLight(0xcfe0ff, 1.6);
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    glow: (p) => {
      light.intensity = 0.5 * p;
      (ring.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 * p;
    },
    idle: (t) => (ring.rotation.z = t * 0.8),
  };
}

function lantern(): ActorHandle {
  const group = new THREE.Group();
  const frame = std(0x1c1c1c, { metalness: 0.7, roughness: 0.4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xffc56b, emissiveIntensity: 2.2 });
  group.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, 0.16), glass), [0, 0.12, 0]));
  group.add(place(new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.08, 4), frame), [0, 0.26, 0], [0, Math.PI / 4, 0]));
  group.add(place(new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 16), frame), [0, 0.33, 0]));
  const light = new THREE.PointLight(0xffc56b, 1.4, 3, 1.8);
  light.position.set(0.1, 0.14, 0.1);
  group.add(light);
  return { group, fade: collectFade(group), idle: (t) => (light.intensity = 1.3 + Math.sin(t * 13) * 0.12 + Math.sin(t * 5) * 0.1) };
}

function chest(): ActorHandle {
  const group = new THREE.Group();
  const iron = std(0x3a3f47, { metalness: 0.85, roughness: 0.45 });
  const band = std(0x6b5a3a, { metalness: 0.9, roughness: 0.35 });
  group.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.36, 0.45), iron), [0, 0.18, 0]));
  for (const x of [-0.25, 0.25]) group.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.37, 0.46), band), [x, 0.18, 0]));
  // The lid hinges along the back edge.
  const lid = new THREE.Group();
  lid.position.set(0, 0.36, -0.225);
  lid.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.09, 0.47), iron), [0, 0.045, 0.235]));
  for (const x of [-0.25, 0.25]) lid.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.48), band), [x, 0.045, 0.235]));
  group.add(lid);
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.4), std(0x15100b));
  inside.rotation.x = -Math.PI / 2;
  inside.position.y = 0.355;
  group.add(inside);
  const light = glowLight(0xffe3a3, 2.5);
  light.position.y = 0.6;
  group.add(light);
  return { group, fade: collectFade(group), open: (p) => (lid.rotation.x = -1.7 * p), glow: (p) => (light.intensity = 5 * p) };
}

function cabinet(): ActorHandle {
  const group = new THREE.Group();
  const wood = std(0x4a2e1c, { roughness: 0.7 });
  group.add(place(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.4), wood), [0, 0.8, 0]));
  const inner = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.45), std(0x1a100a));
  inner.position.set(0, 0.8, 0.201);
  group.add(inner);
  const doors: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.4, 0.8, 0.21);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.55, 0.03), std(0x5a3820, { roughness: 0.6 }));
    door.position.x = -side * 0.2;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), std(0xb8914a, { metalness: 0.9 }));
    knob.position.set(-side * 0.36, 0, 0.03);
    pivot.add(door, knob);
    group.add(pivot);
    doors.push(pivot);
  }
  const light = glowLight(0xffe3a3, 2.5);
  light.position.set(0, 0.9, 0.3);
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    open: (p) => doors.forEach((d, i) => (d.rotation.y = (i ? 1 : -1) * 1.9 * p)),
    glow: (p) => (light.intensity = 4 * p),
  };
}

/** A wall mirror made of shards, so it can break. */
function mirror(): ActorHandle {
  const group = new THREE.Group();
  const frame = std(0xb8914a, { metalness: 0.9, roughness: 0.3 });
  const w = 0.9;
  const h = 1.3;
  for (const [fw, fh, x, y] of [[w + 0.12, 0.06, 0, h / 2], [w + 0.12, 0.06, 0, -h / 2], [0.06, h, -w / 2, 0], [0.06, h, w / 2, 0]] as const) {
    group.add(place(new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.05), frame), [x, y, 0]));
  }
  const glass = new THREE.MeshStandardMaterial({
    color: 0xb8c6da,
    metalness: 0.5,
    roughness: 0.08,
    emissive: 0x31405a,
    emissiveIntensity: 0.6,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const shards: { mesh: THREE.Mesh; dir: THREE.Vector3; spin: THREE.Vector3 }[] = [];
  const cols = 4;
  const rows = 5;
  let seed = 17;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x0 = -w / 2 + (i * w) / cols;
      const y0 = -h / 2 + (j * h) / rows;
      const x1 = x0 + w / cols;
      const y1 = y0 + h / rows;
      for (const tri of [[[x0, y0], [x1, y0], [x1, y1]], [[x0, y0], [x1, y1], [x0, y1]]]) {
        const cx = (tri[0]![0]! + tri[1]![0]! + tri[2]![0]!) / 3;
        const cy = (tri[0]![1]! + tri[1]![1]! + tri[2]![1]!) / 3;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(tri.flatMap(([x, y]) => [x! - cx, y! - cy, 0]), 3));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, glass);
        mesh.position.set(cx, cy, 0.01);
        group.add(mesh);
        shards.push({
          mesh,
          dir: new THREE.Vector3(cx * 2 + (rnd() - 0.5), cy + rnd() * 0.5, 0.6 + rnd()),
          spin: new THREE.Vector3(rnd() * 6, rnd() * 6, rnd() * 6),
        });
      }
    }
  }
  const home = shards.map((s) => s.mesh.position.clone());
  return {
    group,
    fade: collectFade(group),
    shatter: (p) => {
      shards.forEach((s, i) => {
        const h0 = home[i]!;
        s.mesh.position.set(h0.x + s.dir.x * p, h0.y + s.dir.y * p - 2.2 * p * p, h0.z + s.dir.z * p);
        s.mesh.rotation.set(s.spin.x * p, s.spin.y * p, s.spin.z * p);
      });
      glass.opacity = 1 - Math.max(0, p - 0.6) / 0.4;
    },
  };
}

function phone(): ActorHandle {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.008, 0.17), std(0x111318, { roughness: 0.3, metalness: 0.5 })));
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 240;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0b1324';
  ctx.fillRect(0, 0, 128, 240);
  ctx.fillStyle = '#DDB66A';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('VII', 64, 80);
  ctx.fillStyle = 'rgba(248,244,236,0.8)';
  for (let i = 0; i < 5; i++) ctx.fillRect(18, 115 + i * 20, 92 - (i % 2) * 30, 6);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const screenM = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0 });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.15), screenM);
  screen.rotation.x = -Math.PI / 2;
  screen.position.y = 0.0045;
  group.add(screen);
  const light = glowLight(0xbfd0ff, 1.2);
  light.position.y = 0.15;
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    glow: (p) => {
      screenM.emissiveIntensity = 1.4 * p;
      light.intensity = 1.5 * p;
    },
  };
}

function door(): ActorHandle {
  const group = new THREE.Group();
  const frame = std(0x2a1810);
  group.add(place(new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.12, 0.2), frame), [0, 2.15, 0]));
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 2.1), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffc56b, emissiveIntensity: 0 }));
  inside.position.set(0, 1.05, -0.02);
  group.add(inside);
  const pivot = new THREE.Group();
  pivot.position.set(-0.53, 0, 0);
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.05, 2.1, 0.06), std(0x4a2e1c, { roughness: 0.7 }));
  leaf.position.set(0.525, 1.05, 0);
  // The chalk sign over the door.
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xf5f0e6, emissive: 0xf5f0e6, emissiveIntensity: 0.4, transparent: true, opacity: 0.85 }));
  sign.position.set(0, 2.35, 0.11);
  group.add(sign);
  pivot.add(leaf);
  group.add(pivot);
  const light = glowLight(0xffc56b, 5);
  light.position.set(0, 1.2, 0.6);
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    open: (p) => {
      pivot.rotation.y = -1.5 * p;
      (inside.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.55 * p;
      light.intensity = 3 * p;
    },
  };
}

/** Glowing writing on a wall, only there while the ring shines on it. */
function writing(): ActorHandle {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.strokeStyle = '#cfe0ff';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  let seed = 5;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let row = 0; row < 3; row++) {
    let x = 40;
    const y = 60 + row * 70;
    while (x < 470) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 10, y - 30 * rnd(), x + 20, y + 25 * rnd(), x + 30, y - 10);
      ctx.stroke();
      x += 34 + rnd() * 14;
    }
  }
  const tex = new THREE.CanvasTexture(c);
  const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), m);
  mesh.scale.x = -1; // mirror writing
  const group = new THREE.Group().add(mesh);
  return { group, fade: [], glow: (p) => (m.opacity = p) };
}

function fromModel(kind: 'book' | 'map' | 'page' | 'key', scale: number): ActorHandle {
  const spec =
    kind === 'book' ? ({ kind: 'book' } as const) : kind === 'map' ? ({ kind: 'map' } as const) : kind === 'key' ? ({ kind: 'key' } as const) : ({ kind: 'paper', art: 'lines' } as const);
  const group = new THREE.Group();
  const model = buildModel(spec);
  model.scale.setScalar(scale);
  group.add(model);
  const light = glowLight(0xffe3a3, 1.2);
  light.position.y = 0.2;
  group.add(light);
  return { group, fade: collectFade(group), glow: (p) => (light.intensity = 1.1 * p) };
}

/** The Poly Haven treasure chest; its lid is its own node, hinged at the back. */
async function realChest(): Promise<ActorHandle> {
  const group = new THREE.Group();
  const m = await model('treasure_chest');
  m.scale.setScalar(0.8);
  group.add(m);
  const lid = m.getObjectByName('treasure_chest_lid');
  const light = glowLight(0xffe3a3, 2.5);
  light.position.set(0, 0.45, 0.05);
  group.add(light);
  return { group, fade: collectFade(group), open: (p) => lid && (lid.rotation.x = -1.5 * p), glow: (p) => (light.intensity = 3 * p) };
}

/** The Gothic cabinet: four doors on their own hinges. */
async function realCabinet(): Promise<ActorHandle> {
  const group = new THREE.Group();
  const m = await model('GothicCabinet_01');
  m.scale.setScalar(0.62);
  group.add(m);
  const doors = [1, 2, 3, 4].map((i) => m.getObjectByName(`GothicCabinet_01_door${i}`)).filter((d): d is THREE.Object3D => !!d);
  const light = glowLight(0xffe3a3, 2.5);
  light.position.set(0, 1.0, 0.45);
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    open: (p) => doors.forEach((d) => (d.rotation.y = (d.position.x < 0 ? -1 : 1) * 1.9 * p)),
    glow: (p) => (light.intensity = 0.9 * p),
  };
}

/** The brass lantern, its glass lit from inside. */
async function realLantern(): Promise<ActorHandle> {
  const group = new THREE.Group();
  const m = await model('Lantern_01');
  m.scale.setScalar(1.25);
  group.add(m);
  const glass = m.getObjectByName('Lantern_01_glass') as THREE.Mesh | undefined;
  if (glass) {
    const g = (glass.material as THREE.MeshStandardMaterial).clone();
    g.emissive = new THREE.Color(0xffb45c);
    g.emissiveIntensity = 2.5;
    glass.material = g;
  }
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
  flame.position.y = 0.15;
  const light = new THREE.PointLight(0xffb866, 1.6, 3.5, 2);
  light.position.y = 0.16;
  group.add(flame, light);
  return { group, fade: collectFade(group), idle: (t) => (light.intensity = 1.5 + Math.sin(t * 13) * 0.12 + Math.sin(t * 5) * 0.1) };
}

/** A castle door: the right leaf swings open onto a warm, lit room. */
async function realDoor(): Promise<ActorHandle> {
  const group = new THREE.Group();
  const m = await model('large_castle_door');
  m.scale.setScalar(0.6);
  group.add(m);
  const leaf = m.getObjectByName('large_castle_door_right');
  // The lit room behind the doorway, kept inside the arch.
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.8), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffb45c, emissiveIntensity: 0 }));
  inside.position.set(0, 0.92, -0.05);
  group.add(inside);
  const light = glowLight(0xffc27a, 6);
  light.position.set(0, 1.4, 0.8);
  group.add(light);
  return {
    group,
    fade: collectFade(group),
    open: (p) => {
      if (leaf) leaf.rotation.y = 1.4 * p;
      (inside.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 * p;
      light.intensity = 4 * p;
    },
  };
}

let clothPromise: Promise<Cloth> | null = null;

export async function buildActor(kind: ActorKind): Promise<ActorHandle> {
  const cloth = () => (clothPromise ??= clothMaker());
  switch (kind) {
    case 'old-woman':
      return figure({ robe: 0x3b2f4a, skin: 0xb9805e, hair: 0x8e8e94, hairStyle: 'bun', height: 1.6, hunch: 0.15, shawl: 0x6b4a3a }, await cloth());
    case 'woman':
      return figure({ robe: 0x2f4a3b, skin: 0xd9a37f, hair: 0x3a2416, hairStyle: 'long', height: 1.66, apron: 0x8b6a4a }, await cloth());
    case 'man':
      return figure({ robe: 0x2a3a58, skin: 0xc68f6b, hair: 0x1a1410, hairStyle: 'short', height: 1.78 }, await cloth());
    case 'girl':
      return figure({ robe: 0x5a2f3b, skin: 0xe8c0a0, hair: 0x8b5a2b, hairStyle: 'braid', height: 1.62 }, await cloth());
    case 'ghost':
      return ghost();
    case 'phone':
      return phone();
    case 'box':
      return woodenBox();
    case 'ring':
      return smallRing();
    case 'lantern':
      return realLantern();
    case 'chest':
      return realChest();
    case 'cabinet':
      return realCabinet();
    case 'mirror':
      return mirror();
    case 'door':
      return realDoor();
    case 'writing':
      return writing();
    case 'book':
      return fromModel('book', 0.22);
    case 'map':
      return fromModel('map', 0.2);
    case 'page':
      return fromModel('page', 0.18);
    case 'key':
      return fromModel('key', 0.12);
  }
}
