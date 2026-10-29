// The 3D models, built from primitives and canvas textures. Each returns a group centred on the origin,
// about 2 units across, so every viewer can frame them the same way.
import * as THREE from 'three';
import type { ModelSpec } from '@/content/types';
import { dialTexture, engravingTexture, hallmarkTexture, paperTexture } from './textures';

const silver = (map?: THREE.Texture) =>
  new THREE.MeshStandardMaterial({ color: 0xdfe3e8, metalness: 1, roughness: 0.28, map: map ?? null });
const brass = () => new THREE.MeshStandardMaterial({ color: 0xc9a35c, metalness: 1, roughness: 0.35 });

export function buildModel(spec: ModelSpec): THREE.Group {
  switch (spec.kind) {
    case 'ring':
      return ring(spec.hallmarks);
    case 'key':
      return key();
    case 'paper':
      return paper(spec.art, spec.torn);
    case 'map':
      return foldedMap();
    case 'leather':
      return leather();
    case 'book':
      return book();
  }
}

/** A silver band lying flat. The hallmarks are stamped on the inside, so the ring must be turned to read them. */
function ring(hallmarks?: string[]): THREE.Group {
  const g = new THREE.Group();
  const h = 0.62;
  const outerTex = engravingTexture();
  outerTex.repeat.x = 3;
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, h, 128, 1, true), silver(outerTex));
  const innerMat = hallmarks?.length
    ? new THREE.MeshStandardMaterial({ map: hallmarkTexture(hallmarks), metalness: 0.6, roughness: 0.35, side: THREE.BackSide })
    : new THREE.MeshStandardMaterial({ color: 0xc9cdd2, metalness: 1, roughness: 0.3, side: THREE.BackSide });
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, h, 128, 1, true), innerMat);
  const rimGeo = new THREE.RingGeometry(1.0, 1.2, 128);
  const top = new THREE.Mesh(rimGeo, silver());
  top.rotation.x = -Math.PI / 2;
  top.position.y = h / 2;
  const bottom = new THREE.Mesh(rimGeo.clone(), silver());
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -h / 2;
  g.add(outer, inner, top, bottom);
  return g;
}

function key(): THREE.Group {
  const g = new THREE.Group();
  const m = brass();
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.09, 20, 64), m);
  bow.position.x = -0.95;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.5, 24), m);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = 0.1;
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 12, 32), m);
  collar.rotation.y = Math.PI / 2;
  collar.position.x = -0.5;
  g.add(bow, shaft, collar);
  [0.55, 0.72].forEach((x, i) => {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28 + i * 0.1, 0.07), m);
    tooth.position.set(x, -0.16 - i * 0.05, 0);
    g.add(tooth);
  });
  g.rotation.z = 0.25;
  return g;
}

/** Remaps a ShapeGeometry's UVs to 0-1 over its bounding box. */
function fitUVs(geo: THREE.BufferGeometry, w: number, h: number) {
  const pos = geo.attributes.position!;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

/** Bends a flat sheet a little, like paper that has been folded and carried. */
function curl(geo: THREE.BufferGeometry, amount: number, halfWidth: number) {
  const pos = geo.attributes.position!;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / halfWidth;
    pos.setZ(i, amount * x * x);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function paper(art: Parameters<typeof paperTexture>[0], torn?: boolean): THREE.Group {
  const w = 1.5;
  const h = 2;
  let geo: THREE.BufferGeometry;
  if (torn) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, -h / 2);
    s.lineTo(w / 2, -h / 2);
    s.lineTo(w / 2, h / 2 - 0.1);
    // A ragged top edge where the sheet was torn.
    for (let i = 1; i <= 14; i++) s.lineTo(w / 2 - (i * w) / 14, h / 2 - 0.1 + (i % 2 ? 0.09 : -0.04) + (i % 3) * 0.03);
    s.lineTo(-w / 2, -h / 2);
    geo = new THREE.ShapeGeometry(s, 8);
    fitUVs(geo, w, h);
  } else {
    geo = new THREE.PlaneGeometry(w, h, 16, 1);
  }
  curl(geo, 0.14, w / 2);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: paperTexture(art), side: THREE.DoubleSide, roughness: 0.95 }));
  return new THREE.Group().add(mesh);
}

function foldedMap(): THREE.Group {
  const geo = new THREE.PlaneGeometry(2.1, 1.6, 3, 1);
  const pos = geo.attributes.position!;
  for (let i = 0; i < pos.count; i++) {
    const col = Math.round((pos.getX(i) / 2.1 + 0.5) * 3);
    pos.setZ(i, col % 2 ? 0.22 : 0);
  }
  geo.computeVertexNormals();
  const tex = paperTexture('lanterns', 680, 512);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9 }));
  mesh.position.z = -0.11;
  return new THREE.Group().add(mesh);
}

function leather(): THREE.Group {
  const brown = new THREE.MeshStandardMaterial({ color: 0x5a3420, roughness: 0.8 });
  const front = new THREE.MeshStandardMaterial({ map: paperTexture('stamps', 256, 1024), roughness: 0.75 });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.04), [brown, brown, brown, brown, front, brown]);
  return new THREE.Group().add(mesh);
}

function book(): THREE.Group {
  const g = new THREE.Group();
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x3a1e14, roughness: 0.7 });
  const coverMat = new THREE.MeshStandardMaterial({ map: paperTexture('codex-cover'), roughness: 0.65 });
  const pagesMat = new THREE.MeshStandardMaterial({ color: 0xeee2c4, roughness: 0.95 });
  const front = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.08), [leatherMat, leatherMat, leatherMat, leatherMat, coverMat, leatherMat]);
  front.position.z = 0.22;
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.08), leatherMat);
  back.position.z = -0.22;
  const pages = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.9, 0.38), pagesMat);
  pages.position.x = 0.03;
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2, 24, 1, false, Math.PI, Math.PI), leatherMat);
  spine.position.x = -0.73;
  const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.52), brass());
  clasp.position.x = 0.76;
  g.add(front, back, pages, spine, clasp);
  return g;
}

export interface LockModel {
  group: THREE.Group;
  dials: THREE.Object3D[];
  shackle: THREE.Group;
}

/** Angle that brings digit d of a dial to the front. */
export function dialAngle(d: number): number {
  return ((d + 0.5) * Math.PI * 2) / 10;
}

/** A brass padlock with one turning dial per digit. */
export function buildLock(digits: number): LockModel {
  const group = new THREE.Group();
  const width = 0.52 * digits + 0.6;
  const height = 1.35;
  const depth = 0.55;
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb38a45, metalness: 0.9, roughness: 0.38 });

  const shape = new THREE.Shape();
  const r = 0.16;
  const x0 = -width / 2;
  const y0 = -height / 2;
  shape.moveTo(x0 + r, y0);
  shape.lineTo(x0 + width - r, y0);
  shape.quadraticCurveTo(x0 + width, y0, x0 + width, y0 + r);
  shape.lineTo(x0 + width, y0 + height - r);
  shape.quadraticCurveTo(x0 + width, y0 + height, x0 + width - r, y0 + height);
  shape.lineTo(x0 + r, y0 + height);
  shape.quadraticCurveTo(x0, y0 + height, x0, y0 + height - r);
  shape.lineTo(x0, y0 + r);
  shape.quadraticCurveTo(x0, y0, x0 + r, y0);
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 }),
    bodyMat,
  );
  body.position.z = -depth / 2;
  group.add(body);

  // A dark window the dials sit in.
  const slot = new THREE.Mesh(
    new THREE.BoxGeometry(0.52 * digits + 0.08, 0.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x1a140c, roughness: 0.9 }),
  );
  slot.position.set(0, -0.12, depth / 2 + 0.02);
  group.add(slot);

  const dialTex = dialTexture();
  const dials: THREE.Object3D[] = [];
  for (let i = 0; i < digits; i++) {
    const pivot = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.44, 48),
      [new THREE.MeshStandardMaterial({ map: dialTex, metalness: 0.7, roughness: 0.35 }), bodyMat, bodyMat],
    );
    mesh.rotation.z = Math.PI / 2;
    pivot.add(mesh);
    pivot.position.set((i - (digits - 1) / 2) * 0.52, -0.12, depth / 2 - 0.08);
    pivot.rotation.x = dialAngle(0);
    pivot.userData.index = i;
    mesh.userData.index = i;
    group.add(pivot);
    dials.push(pivot);
  }

  const shackle = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xd5d8dc, metalness: 1, roughness: 0.22 });
  const span = Math.min(width * 0.32, 0.62);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(span, 0.09, 20, 48, Math.PI), steel);
  arc.position.y = 0.55;
  const legGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.62, 20);
  const left = new THREE.Mesh(legGeo, steel);
  left.position.set(-span, 0.26, 0);
  const right = new THREE.Mesh(legGeo.clone(), steel);
  right.position.set(span, 0.26, 0);
  shackle.add(arc, left, right);
  // Pivot around the left leg so the shackle can swing open.
  shackle.position.set(-span, height / 2 - 0.05, 0);
  for (const c of shackle.children) c.position.x += span;
  group.add(shackle);

  return { group, dials, shackle };
}
