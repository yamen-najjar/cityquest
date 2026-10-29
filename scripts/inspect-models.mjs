// Lists each downloaded model's nodes, the size of its bounding box (metres) and its file sizes.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'public', 'assets', 'ph', 'models');
for (const id of readdirSync(root)) {
  const dir = join(root, id);
  const gltf = JSON.parse(readFileSync(join(dir, `${id}.gltf`), 'utf8'));
  const size = (p) => statSync(join(dir, p)).size;
  let total = 0;
  const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(join(d, e.name)) : (total += statSync(join(d, e.name)).size)));
  walk(dir);
  // Bounds from POSITION accessors' min / max (ignores node transforms, good enough to judge scale).
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const m of gltf.meshes ?? []) for (const p of m.primitives) {
    const a = gltf.accessors[p.attributes.POSITION];
    a.min?.forEach((v, i) => (min[i] = Math.min(min[i], v)));
    a.max?.forEach((v, i) => (max[i] = Math.max(max[i], v)));
  }
  const dims = max.map((v, i) => (v - min[i]).toFixed(2)).join(' x ');
  const nodes = (gltf.nodes ?? []).map((n) => n.name + (n.translation ? `@[${n.translation.map((v) => v.toFixed(2))}]` : '')).join(', ');
  const images = (gltf.images ?? []).map((im) => `${im.uri} ${(size(im.uri) / 1024).toFixed(0)}K`).join(', ');
  console.log(`\n${id}  total ${(total / 1048576).toFixed(1)} MB  mesh bounds ${dims}\n  nodes: ${nodes}\n  images: ${images}`);
}
