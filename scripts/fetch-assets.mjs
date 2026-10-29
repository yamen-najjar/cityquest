// Downloads the CC0 assets the cutscenes use from Poly Haven (https://polyhaven.com, CC0 1.0: no
// attribution required, credited anyway in public/assets/ph/CREDITS.md) into public/assets/ph/.
// Run once: node scripts/fetch-assets.mjs. Re-running skips files that already exist.
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const OUT = join(process.cwd(), 'public', 'assets', 'ph');

/** Textures: which maps to fetch (1k JPG). arm = ambient occlusion / roughness / metalness packed. */
const textures = {
  cobblestone_floor_001: ['Diffuse', 'nor_gl', 'arm'],
  medieval_wall_01: ['Diffuse', 'nor_gl', 'arm'],
  castle_brick_01: ['Diffuse', 'nor_gl', 'arm'],
  old_wood_floor: ['Diffuse', 'nor_gl', 'arm'],
  dark_wooden_planks: ['Diffuse', 'nor_gl', 'arm'],
  plastered_stone_wall: ['Diffuse', 'nor_gl', 'arm'],
  rough_linen: ['nor_gl', 'arm'],
};
const hdris = ['cobblestone_street_night', 'decor_shop', 'carpentry_shop_01'];
const models = [
  'treasure_chest',
  'Lantern_01',
  'wall_clock',
  'GothicCabinet_01',
  'wooden_bookshelf_worn',
  'street_lamp_01',
  'large_castle_door',
  'WoodenTable_01',
  'vintage_grandfather_clock_01',
];

const MAGIC = {
  jpg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  hdr: [0x23, 0x3f], // "#?"
};

async function api(path) {
  const res = await fetch(`https://api.polyhaven.com/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

/** Only https downloads from Poly Haven's file host, written inside OUT. */
async function download(url, file) {
  const u = new URL(url);
  if (u.protocol !== 'https:' || !u.hostname.endsWith('polyhaven.org')) throw new Error(`unexpected host: ${url}`);
  const target = normalize(file);
  if (!target.startsWith(OUT + sep)) throw new Error(`path escapes the asset folder: ${file}`);
  if (existsSync(target)) return;
  mkdirSync(dirname(target), { recursive: true });
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`${url}: HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(target));
  const ext = target.split('.').pop();
  const magic = MAGIC[ext];
  if (magic) {
    const { readFileSync, rmSync } = await import('node:fs');
    const head = readFileSync(target).subarray(0, magic.length);
    if (!magic.every((b, i) => head[i] === b)) {
      rmSync(target);
      throw new Error(`${target} is not a ${ext} file`);
    }
  }
  console.log('  saved', target.slice(OUT.length + 1));
}

const credits = ['# Asset credits', '', 'All assets below are from Poly Haven (https://polyhaven.com), licensed CC0 1.0.', ''];

for (const [id, maps] of Object.entries(textures)) {
  console.log('texture', id);
  const files = await api(`files/${id}`);
  for (const m of maps) {
    const f = files[m]?.['1k']?.jpg;
    if (!f) throw new Error(`${id}: no 1k ${m}`);
    await download(f.url, join(OUT, 'tex', id, `${m}.jpg`));
  }
  credits.push(`- Texture: ${id} (https://polyhaven.com/a/${id})`);
}

for (const id of hdris) {
  console.log('hdri', id);
  const files = await api(`files/${id}`);
  await download(files.hdri['1k'].hdr.url, join(OUT, 'hdri', `${id}.hdr`));
  credits.push(`- HDRI: ${id} (https://polyhaven.com/a/${id})`);
}

for (const id of models) {
  console.log('model', id);
  const files = await api(`files/${id}`);
  const g = files.gltf['1k'].gltf;
  await download(g.url, join(OUT, 'models', id, `${id}.gltf`));
  for (const [rel, inc] of Object.entries(g.include)) {
    if (rel.includes('..') || rel.startsWith('/')) throw new Error(`${id}: bad include path ${rel}`);
    await download(inc.url, join(OUT, 'models', id, rel));
  }
  credits.push(`- Model: ${id} (https://polyhaven.com/a/${id})`);
}

writeFileSync(join(OUT, 'CREDITS.md'), credits.join('\n') + '\n');
console.log('done');
