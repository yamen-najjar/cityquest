// The places scenes happen in. Surfaces are CC0 PBR textures, furniture and lamps are CC0 models and the
// light comes from an HDR environment plus a few real light sources with soft shadows (see ../assets.ts).
// Units are metres; the floor is y = 0 and the camera usually looks towards -z.
import * as THREE from 'three';
import type { SceneSet } from '@/content/types';
import { hdri, model, surface, tiledBox, tiledPlane, type HdriId } from '../assets';

export type Tick = (time: number) => void;

export interface BuiltSet {
  tick: Tick;
  environment: { id: HdriId; intensity: number };
}

const plain = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function mesh(geo: THREE.BufferGeometry, m: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0, cast = true): THREE.Mesh {
  const out = new THREE.Mesh(geo, m);
  out.position.set(x, y, z);
  out.castShadow = cast;
  out.receiveShadow = true;
  return out;
}

async function ground(root: THREE.Object3D, w = 40, d = 40, z = 0) {
  const m = await surface('cobblestone_floor_001');
  const g = mesh(tiledPlane(w, d, 1.6), m, 0, 0, z, false);
  g.rotation.x = -Math.PI / 2;
  root.add(g);
}

/** Night sky colour, fog and a cold moonlight that casts the long shadows. */
function night(scene: THREE.Scene, root: THREE.Object3D, color = 0x0a1020, fogNear = 9, fogFar = 34) {
  scene.background = new THREE.Color(color);
  scene.fog = new THREE.Fog(color, fogNear, fogFar);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 16), new THREE.MeshBasicMaterial({ color: 0xfff1cf, fog: false }));
  moon.position.set(9, 15, -28);
  root.add(moon);
  const light = new THREE.DirectionalLight(0x9fb6e8, 0.75);
  light.position.set(7, 14, -6);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 50 });
  light.shadow.bias = -0.0005;
  root.add(light, new THREE.HemisphereLight(0x41558a, 0x0b0f18, 0.35));
}

/** An iron street lamp with a warm, flickering light at its head. */
async function lamp(root: THREE.Object3D, x: number, z: number, turn = 0): Promise<Tick> {
  const post = await model('street_lamp_01');
  post.position.set(x, 0, z);
  post.rotation.y = turn;
  root.add(post);
  // The lantern hangs from the arm, about 3.4 m up.
  const head = new THREE.Vector3(0.28, 3.42, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), turn).add(new THREE.Vector3(x, 0, z));
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }));
  bulb.position.copy(head);
  const light = new THREE.PointLight(0xffb866, 4.5, 10, 2);
  light.position.copy(head).y -= 0.1;
  root.add(bulb, light);
  const phase = x * 3.1 + z;
  return (t) => (light.intensity = 4.3 + Math.sin(t * 9 + phase) * 0.18 + Math.sin(t * 23 + phase) * 0.12);
}

/** House fronts along x, facing +z: plastered walls, slate roofs, lit and dark windows with frames. */
async function facades(root: THREE.Object3D, from: number, to: number, seed: number): Promise<THREE.Group> {
  const r = rand(seed);
  const walls = await Promise.all([
    surface('medieval_wall_01', [1, 1], 0xd9cbb4),
    surface('medieval_wall_01', [1, 1], 0xb4a48e),
    surface('plastered_stone_wall', [1, 1], 0xc9c0b0),
  ]);
  const roofM = plain(0x1d2128, { roughness: 0.6 });
  const frameM = plain(0x2a1a10, { roughness: 0.7 });
  const lit = new THREE.MeshStandardMaterial({ color: 0xffcf8a, emissive: 0xffb45c, emissiveIntensity: 1.25 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0b1018, roughness: 0.12, metalness: 0.9 });
  const g = new THREE.Group();
  // Windows, frames and sills are instanced: a street has hundreds, and each instanced kind is one
  // draw call instead of one per window, which is what keeps a phone smooth.
  const at = { frame: [] as THREE.Vector3[], sill: [] as THREE.Vector3[], lit: [] as THREE.Vector3[], dark: [] as THREE.Vector3[] };
  for (let x = from; x < to; ) {
    const w = 2.4 + r() * 1.8;
    const h = 5 + r() * 3.5;
    const house = mesh(tiledBox(w, h, 1.2, 1.6), walls[Math.floor(r() * walls.length)]!, x + w / 2, h / 2, 0);
    const roof = mesh(new THREE.ConeGeometry(w * 0.74, 1.6, 4), roofM, x + w / 2, h + 0.8, 0);
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.55;
    g.add(house, roof);
    for (let wy = 1.6; wy < h - 0.9; wy += 1.7) {
      for (let wx = x + 0.75; wx < x + w - 0.5; wx += 1.05) {
        // The frame sits on the wall (front face at 0.62); the glass just in front of it, leaving a border.
        at.frame.push(new THREE.Vector3(wx, wy, 0.6));
        at.sill.push(new THREE.Vector3(wx, wy - 0.46, 0.66));
        (r() > 0.7 ? at.lit : at.dark).push(new THREE.Vector3(wx, wy, 0.625));
      }
    }
    x += w + 0.04;
  }
  const instanced = (geo: THREE.BufferGeometry, m: THREE.Material, list: THREE.Vector3[]) => {
    if (!list.length) return;
    const im = new THREE.InstancedMesh(geo, m, list.length);
    const matrix = new THREE.Matrix4();
    list.forEach((v, i) => im.setMatrixAt(i, matrix.makeTranslation(v.x, v.y, v.z)));
    im.receiveShadow = true;
    g.add(im);
  };
  instanced(new THREE.BoxGeometry(0.62, 0.92, 0.04), frameM, at.frame);
  instanced(new THREE.BoxGeometry(0.7, 0.06, 0.14), frameM, at.sill);
  instanced(new THREE.PlaneGeometry(0.5, 0.8), lit, at.lit);
  instanced(new THREE.PlaneGeometry(0.5, 0.8), dark, at.dark);
  root.add(g);
  return g;
}

/** A room: floor, three walls, a ceiling beam or two. */
async function room(root: THREE.Object3D, w = 8, d = 7, h = 3.4) {
  const [floorM, wallM] = await Promise.all([surface('old_wood_floor'), surface('plastered_stone_wall', [1, 1], 0xb8a890)]);
  const floor = mesh(tiledPlane(w, d, 2), floorM, 0, 0, 0, false);
  floor.rotation.x = -Math.PI / 2;
  const back = mesh(tiledPlane(w, h, 2.2), wallM, 0, h / 2, -d / 2, false);
  const left = mesh(tiledPlane(d, h, 2.2), wallM, -w / 2, h / 2, 0, false);
  left.rotation.y = Math.PI / 2;
  const right = mesh(tiledPlane(d, h, 2.2), wallM, w / 2, h / 2, 0, false);
  right.rotation.y = -Math.PI / 2;
  root.add(floor, back, left, right);
  const beamM = plain(0x2b1b10, { roughness: 0.8 });
  for (const z of [-2, 0.5]) root.add(mesh(new THREE.BoxGeometry(w, 0.22, 0.25), beamM, 0, h - 0.11, z));
}

/** A hanging lamp: warm bulb, glow, and a spotlight casting soft shadows down. */
function hangingLamp(root: THREE.Object3D, x: number, y: number, z: number, power = 40): Tick {
  const shade = mesh(new THREE.ConeGeometry(0.22, 0.18, 24, 1, true), plain(0x2b2b2b, { metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide }), x, y + 0.08, z, false);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe2b0 }));
  bulb.position.set(x, y, z);
  const cord = mesh(new THREE.CylinderGeometry(0.006, 0.006, 1), plain(0x111111), x, y + 0.65, z, false);
  const spot = new THREE.SpotLight(0xffc27a, power, 12, 1.05, 0.65, 1.6);
  spot.position.set(x, y, z);
  spot.target.position.set(x, 0, z);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0008;
  const fill = new THREE.PointLight(0xffb066, 2.2, 6, 2);
  fill.position.set(x, y - 0.2, z);
  root.add(shade, bulb, cord, spot, spot.target, fill);
  return (t) => (spot.intensity = power * (0.97 + Math.sin(t * 7) * 0.02 + Math.sin(t * 19) * 0.01));
}

/** A wall clock whose hands really turn. */
async function clock(root: THREE.Object3D, x: number, y: number, z: number, scale: number, speed: number): Promise<Tick> {
  const c = await model('wall_clock');
  c.position.set(x, y, z);
  c.scale.setScalar(scale);
  root.add(c);
  const minute = c.getObjectByName('wall_clock_minute_hand');
  const second = c.getObjectByName('wall_clock_second_hand');
  const hour = c.getObjectByName('wall_clock_hours_hand');
  return (t) => {
    if (second) second.rotation.z = -t * speed * 6;
    if (minute) minute.rotation.z = -t * speed * 0.4 - 1;
    if (hour) hour.rotation.z = -t * speed * 0.035 - 2;
  };
}

function water(root: THREE.Object3D, w: number, d: number, z: number, y = -0.6): Tick {
  const geo = new THREE.PlaneGeometry(w, d, 60, 30);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0b1a2c, roughness: 0.05, metalness: 0.85 }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(0, y, z);
  m.receiveShadow = true;
  root.add(m);
  const pos = geo.attributes.position!;
  const base = Float32Array.from(pos.array as Float32Array);
  return (t) => {
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]!;
      const yy = base[i * 3 + 1]!;
      pos.setZ(i, Math.sin(x * 1.1 + t * 1.3) * 0.05 + Math.cos(yy * 1.5 + t * 0.9) * 0.04);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  };
}

/** Builds a set into `root` and returns its idle animation and the HDR light it wants. */
export async function buildSet(set: SceneSet, scene: THREE.Scene, root: THREE.Object3D): Promise<BuiltSet> {
  const ticks: Tick[] = [];
  let environment: BuiltSet['environment'] = { id: 'cobblestone_street_night', intensity: 0.35 };

  switch (set) {
    case 'room': {
      scene.background = new THREE.Color(0x05080f);
      await room(root, 6, 5, 3);
      const table = await model('WoodenTable_01');
      table.scale.set(0.8, 1.4, 1.1);
      root.add(table);
      const win = mesh(new THREE.PlaneGeometry(1.1, 1.3), new THREE.MeshStandardMaterial({ color: 0x1c3a5e, emissive: 0x24477a, emissiveIntensity: 1.4 }), 1.2, 1.7, -2.49, false);
      const moon = new THREE.SpotLight(0x9fb6e8, 22, 9, 0.55, 0.7, 1.4);
      moon.position.set(1.4, 2.4, -2.3);
      moon.target.position.set(0, 0.75, 0.2);
      moon.castShadow = true;
      moon.shadow.mapSize.set(1024, 1024);
      root.add(win, moon, moon.target, new THREE.AmbientLight(0x1a2338, 0.4));
      environment = { id: 'decor_shop', intensity: 0.06 };
      break;
    }
    case 'shop': {
      scene.background = new THREE.Color(0x0d0907);
      await room(root, 8, 7, 3.4);
      for (const x of [-2.3, -0.7, 0.9, 2.5]) {
        const shelf = await model('wooden_bookshelf_worn');
        shelf.position.set(x, 0, -3.15);
        root.add(shelf);
      }
      // Jars, boxes and lanterns on the shelves.
      const r = rand(7);
      const glass = [0x6b8f71, 0x8b5e3c, 0x5c7c99, 0xb8914a, 0x7a6a9b];
      for (const y of [0.42, 0.9, 1.38]) {
        for (let x = -2.9; x < 3.1; x += 0.22 + r() * 0.2) {
          const h = 0.12 + r() * 0.18;
          const jar = mesh(
            new THREE.CylinderGeometry(0.045 + r() * 0.03, 0.055, h, 16),
            new THREE.MeshStandardMaterial({ color: glass[Math.floor(r() * glass.length)]!, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.85 }),
            x,
            y + h / 2,
            -3.05,
          );
          root.add(jar);
        }
      }
      for (const x of [-1.6, 1.8]) {
        const l = await model('Lantern_01');
        l.position.set(x, 1.86, -3.05);
        l.scale.setScalar(1.3);
        root.add(l);
      }
      const wood = await surface('dark_wooden_planks', [1, 1], 0xc8a888);
      root.add(mesh(tiledBox(2.6, 0.9, 0.7, 1.2), wood, 0, 0.45, -0.6), mesh(tiledBox(2.8, 0.06, 0.8, 1.2), wood, 0, 0.92, -0.6));
      // The lamp hangs over the customer's side of the counter, so the owner is lit from the front.
      ticks.push(hangingLamp(root, 0.5, 2.6, 0.35, 26));
      const fill = new THREE.PointLight(0xffb066, 1.2, 6, 2);
      fill.position.set(-2, 1.6, -1.6);
      root.add(fill, new THREE.AmbientLight(0x2a1c12, 0.35));
      environment = { id: 'decor_shop', intensity: 0.12 };
      break;
    }
    case 'square': {
      night(scene, root);
      await ground(root);
      const row = await facades(root, -15, 15, 11);
      row.position.z = -9.5;
      const brick = await surface('castle_brick_01', [5, 4]);
      const tower = mesh(new THREE.CylinderGeometry(1.4, 1.6, 10, 24), brick, 0, 5, -5);
      const roof = mesh(new THREE.ConeGeometry(1.85, 2.6, 24), plain(0x1d2128, { roughness: 0.6 }), 0, 11.3, -5);
      root.add(tower, roof);
      for (const y of [3.2, 5.6, 8]) {
        root.add(mesh(new THREE.PlaneGeometry(0.42, 0.75), new THREE.MeshStandardMaterial({ color: 0xffcf8a, emissive: 0xffb45c, emissiveIntensity: y === 5.6 ? 2.4 : 1 }), 0, y, -3.52, false));
      }
      const door = await model('large_castle_door');
      door.scale.setScalar(0.55);
      door.position.set(0, 0, -3.45);
      root.add(door);
      ticks.push(await lamp(root, -2.8, -2.6, Math.PI), await lamp(root, 2.8, -2.6, 0));
      break;
    }
    case 'workshop': {
      scene.background = new THREE.Color(0x0b0806);
      await room(root, 8, 7, 3.4);
      const wood = await surface('dark_wooden_planks', [1, 1], 0xc8a888);
      root.add(mesh(tiledBox(2.4, 0.08, 0.9, 1.2), wood, -1.6, 0.9, -2.2), mesh(tiledBox(2.3, 0.86, 0.8, 1.2), wood, -1.6, 0.43, -2.2));
      ticks.push(
        await clock(root, -2.4, 2.25, -3.47, 1.6, 1),
        await clock(root, -1.1, 2.6, -3.47, 1.1, 1.6),
        await clock(root, 0.3, 2.1, -3.47, 2, 0.7),
        await clock(root, 3.2, 2.5, -3.47, 1.3, 1.2),
      );
      const tall = await model('vintage_grandfather_clock_01');
      tall.position.set(3.4, 0, -2.9);
      tall.rotation.y = -0.4;
      root.add(tall);
      const minute = tall.getObjectByName('vintage_grandfather_clock_01_MinuteHand');
      const hour = tall.getObjectByName('vintage_grandfather_clock_01_HourHand');
      ticks.push((t) => {
        if (minute) minute.rotation.z = -t * 0.5;
        if (hour) hour.rotation.z = -t * 0.04 - 1.3;
      });
      ticks.push(hangingLamp(root, -1.3, 2.6, -1.5, 40));
      root.add(new THREE.AmbientLight(0x241a12, 0.35));
      environment = { id: 'carpentry_shop_01', intensity: 0.12 };
      break;
    }
    case 'riverbank': {
      night(scene, root);
      await ground(root, 40, 14, 2);
      const brick = await surface('castle_brick_01', [20, 1]);
      root.add(mesh(new THREE.BoxGeometry(40, 1.2, 0.6), brick, 0, -0.5, -5.3));
      ticks.push(water(root, 50, 14, -12.3, -0.9));
      const far = await facades(root, -22, 22, 23);
      far.position.z = -19;
      ticks.push(await lamp(root, -0.6, -3.7, 0));
      const wood = await surface('dark_wooden_planks', [1, 1], 0xc8a888);
      root.add(mesh(tiledBox(1.6, 0.07, 0.45, 1), wood, -2.4, 0.46, -3.6));
      for (const x of [-3.1, -1.7]) root.add(mesh(new THREE.BoxGeometry(0.06, 0.46, 0.4), plain(0x151515, { metalness: 0.8 }), x, 0.23, -3.6));
      break;
    }
    case 'archive': {
      night(scene, root);
      await ground(root);
      const stone = await surface('castle_brick_01', [3, 0.3]);
      for (let i = 0; i < 5; i++) root.add(mesh(tiledBox(7 - i * 0.2, 0.18, 0.5, 1.2), stone, 0, 0.09 + i * 0.18, -2 - i * 0.5));
      const facadeM = await surface('castle_brick_01', [5, 4]);
      root.add(mesh(new THREE.BoxGeometry(11, 8, 1), facadeM, 0, 4.9, -5.6));
      const columnM = await surface('plastered_stone_wall', [1, 2], 0xd8cfc0);
      for (const x of [-2.8, -1.5, 1.5, 2.8]) root.add(mesh(new THREE.CylinderGeometry(0.24, 0.27, 4.4, 20), columnM, x, 3.1, -4.75));
      const door = await model('large_castle_door');
      door.scale.setScalar(0.72);
      door.position.set(0, 0.9, -5.05);
      root.add(door);
      const glow = new THREE.PointLight(0xffc27a, 10, 7, 2);
      glow.position.set(0, 2.4, -4.2);
      root.add(glow);
      break;
    }
    case 'alley':
    case 'lanes': {
      night(scene, root, 0x070b14, 5, 26);
      await ground(root, 8, 70, -20);
      // Two rows of houses facing each other along -z: rotated a quarter turn, a row's x becomes depth.
      const left = await facades(root, -6, 44, 31);
      left.rotation.y = Math.PI / 2;
      left.position.x = -2.5;
      const right = await facades(root, -44, 6, 37);
      right.rotation.y = -Math.PI / 2;
      right.position.x = 2.5;
      if (set === 'lanes') {
        const wallM = await surface('medieval_wall_01', [1, 1], 0xb4a48e);
        root.add(mesh(tiledBox(1.4, 7, 1, 1.6), wallM, -2.0, 3.5, -16), mesh(tiledBox(0.9, 7, 1, 1.6), wallM, 0, 3.5, -16), mesh(tiledBox(1.4, 7, 1, 1.6), wallM, 2.0, 3.5, -16));
        ticks.push(await lamp(root, -1.5, -15.2, Math.PI), await lamp(root, 1.5, -15.2, 0));
      }
      ticks.push(await lamp(root, -1.9, -4, 0), await lamp(root, 1.9, -10, Math.PI));
      break;
    }
    case 'bridge': {
      night(scene, root);
      const deckM = await surface('cobblestone_floor_001', [2, 24]);
      root.add(mesh(new THREE.BoxGeometry(3.8, 0.3, 46), deckM, 0, -0.15, -10));
      const railM = await surface('castle_brick_01', [20, 0.5]);
      for (const x of [-1.85, 1.85]) {
        root.add(mesh(new THREE.BoxGeometry(0.22, 1.0, 46), railM, x, 0.5, -10));
      }
      for (let z = 6; z > -32; z -= 9) ticks.push(await lamp(root, -1.75, z, Math.PI), await lamp(root, 1.75, z - 4.5, 0));
      ticks.push(water(root, 70, 70, -10, -4));
      const far = await facades(root, -32, 32, 41);
      far.position.z = -36;
      break;
    }
  }
  return { tick: (t) => ticks.forEach((f) => f(t)), environment };
}

/** Preloads the environment image, so the first frame is already lit. */
export function loadEnvironment(id: HdriId) {
  return hdri(id);
}
