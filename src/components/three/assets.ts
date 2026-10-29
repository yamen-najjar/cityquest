// Loads the CC0 Poly Haven assets in public/assets/ph (see scripts/fetch-assets.mjs): PBR surfaces,
// HDR lighting and glTF models. Every file is fetched once per page and shared.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const BASE = '/assets/ph';

export type Surface =
  | 'cobblestone_floor_001'
  | 'medieval_wall_01'
  | 'castle_brick_01'
  | 'old_wood_floor'
  | 'dark_wooden_planks'
  | 'plastered_stone_wall'
  | 'rough_linen';

export type HdriId = 'cobblestone_street_night' | 'decor_shop' | 'carpentry_shop_01';

export type ModelId =
  | 'treasure_chest'
  | 'Lantern_01'
  | 'wall_clock'
  | 'GothicCabinet_01'
  | 'wooden_bookshelf_worn'
  | 'street_lamp_01'
  | 'large_castle_door'
  | 'WoodenTable_01'
  | 'vintage_grandfather_clock_01';

const cache = new Map<string, Promise<unknown>>();
function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  let p = cache.get(key) as Promise<T> | undefined;
  if (!p) {
    p = load();
    cache.set(key, p);
    p.catch(() => cache.delete(key));
  }
  return p;
}

const textureLoader = new THREE.TextureLoader();

function texture(url: string, srgb: boolean): Promise<THREE.Texture> {
  return once(url, async () => {
    const t = await textureLoader.loadAsync(url);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  });
}

/** Repeats a shared texture without duplicating its image. */
function repeated(t: THREE.Texture, r: [number, number]): THREE.Texture {
  const c = t.clone();
  c.repeat.set(...r);
  c.needsUpdate = true;
  return c;
}

/**
 * A PBR material for a surface, `repeat` tiles across the mesh's UVs. `tint` multiplies the colour
 * (several houses from one wall texture). rough_linen has no colour map: it gives cloth its weave.
 */
export async function surface(id: Surface, repeat: [number, number] = [1, 1], tint = 0xffffff): Promise<THREE.MeshStandardMaterial> {
  const dir = `${BASE}/tex/${id}`;
  const [diffuse, normal, arm] = await Promise.all([
    id === 'rough_linen' ? Promise.resolve(null) : texture(`${dir}/Diffuse.jpg`, true),
    texture(`${dir}/nor_gl.jpg`, false),
    texture(`${dir}/arm.jpg`, false),
  ]);
  const armR = repeated(arm, repeat);
  return new THREE.MeshStandardMaterial({
    color: tint,
    map: diffuse ? repeated(diffuse, repeat) : null,
    normalMap: repeated(normal, repeat),
    normalScale: new THREE.Vector2(1, 1),
    aoMap: armR,
    roughnessMap: armR,
    metalnessMap: armR,
    metalness: 1, // scaled by the map's blue channel: stone and wood stay non-metal
    roughness: 1,
  });
}

const hdrLoader = new HDRLoader();

export function hdri(id: HdriId): Promise<THREE.DataTexture> {
  return once(`hdri:${id}`, async () => {
    const t = await hdrLoader.loadAsync(`${BASE}/hdri/${id}.hdr`);
    t.mapping = THREE.EquirectangularReflectionMapping;
    return t;
  });
}

// The models are Meshopt-compressed (about a third of their original size), so the loader needs the decoder.
const gltfLoader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

/** A fresh copy of a model, every mesh casting and receiving shadows. */
export async function model(id: ModelId): Promise<THREE.Group> {
  const gltf = await once(`model:${id}`, () => gltfLoader.loadAsync(`${BASE}/models/${id}/${id}.gltf`));
  const copy = gltf.scene.clone(true);
  copy.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return copy;
}

/**
 * Scales a box's UVs to its size, so a texture tiles at a real-world scale (`metres` per tile) instead
 * of stretching once over each face.
 */
export function tiledBox(w: number, h: number, d: number, metres = 1.5): THREE.BoxGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv!;
  // Face order: +x, -x, +y, -y, +z, -z; four vertices each.
  const faces: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  faces.forEach(([fu, fv], f) => {
    for (let i = 0; i < 4; i++) {
      const k = f * 4 + i;
      uv.setXY(k, (uv.getX(k) * fu) / metres, (uv.getY(k) * fv) / metres);
    }
  });
  return geo;
}

/** A floor or ground plane with its texture tiled every `metres`. */
export function tiledPlane(w: number, d: number, metres = 2): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(w, d);
  const uv = geo.attributes.uv!;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / metres, (uv.getY(i) * d) / metres);
  return geo;
}
