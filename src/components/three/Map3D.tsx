'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Chapter } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { buildActor } from './cutscene/actors';
import { report3DFailure } from './support';
import { gridTexture, labelTexture } from './textures';
import { Viewer } from './viewer';

/** Map coordinates (0-100 by 0-70, as in the 2D demo map) to the ground plane. */
function toWorld(x: number, y: number): THREE.Vector3 {
  return new THREE.Vector3((x - 50) / 10, 0, (y - 35) / 10);
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * The checkpoints as a small diorama: an imagined river, hills and roofs, a dashed route and a marker per
 * checkpoint. Like the 2D map it is a sketch of the story, not of real streets. Drag to turn it.
 */
export default function Map3D({
  chapters,
  current,
  solved,
  locale,
  labels,
}: {
  chapters: Chapter[];
  current: number;
  solved: string[];
  locale: Locale;
  labels: { title: string; note: string; destination: string; done: string };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = JSON.stringify({ current, solved, ids: chapters.map((c) => c.id) });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let v: Viewer;
    try {
      v = new Viewer(canvas, {
        camera: [0, 7.2, 7.4],
        target: [0, 0, 0.3],
        fov: 40,
        drag: { yaw: [-0.8, 0.8], pitch: [-0.12, 0.3] },
        initialYaw: 0,
      });
    } catch (err) {
      report3DFailure(err);
      return;
    }
    const root = v.root;

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(11, 8), new THREE.MeshStandardMaterial({ map: gridTexture(), roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    root.add(ground);

    // An imagined river: a flattened tube along a curve.
    const river = new THREE.CatmullRomCurve3(
      [[-2, 52], [20, 47], [35, 54], [55, 50], [75, 44], [102, 46]].map(([x, y]) => toWorld(x!, y!).setY(0.01)),
    );
    const water = new THREE.Mesh(
      new THREE.TubeGeometry(river, 120, 0.42, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x1c3a5e, roughness: 0.15, metalness: 0.4, emissive: 0x0b1c33 }),
    );
    water.scale.y = 0.06;
    root.add(water);

    // Hills along the back edge.
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x13213a, roughness: 1, flatShading: true });
    [[-4, -3.2, 1.3], [-1.5, -3.6, 1.0], [2.5, -3.4, 1.6], [4.6, -3.1, 1.1]].forEach(([x, z, h]) => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(1.4, h!, 7), hillMat);
      hill.position.set(x!, h! / 2, z!);
      root.add(hill);
    });

    // Rooftops, placed by a fixed seed and kept off the route.
    const r = rand(42);
    const wall = new THREE.MeshStandardMaterial({ color: 0x1c2e4a, roughness: 0.9 });
    const roof = new THREE.MeshStandardMaterial({ color: 0x0f1828, roughness: 0.9 });
    const lit = new THREE.MeshStandardMaterial({ color: 0xddb66a, emissive: 0xddb66a, emissiveIntensity: 0.8 });
    const points = chapters.map((c) => toWorld(c.checkpoint.mapPosition.x, c.checkpoint.mapPosition.y));
    for (let i = 0; i < 46; i++) {
      const p = new THREE.Vector3((r() - 0.5) * 10, 0, (r() - 0.5) * 6.2 - 0.6);
      if (points.some((q) => q.distanceTo(p) < 0.75) || Math.abs(p.z - river.getPointAt(Math.min(1, Math.max(0, (p.x + 5.2) / 10.4))).z) < 0.6) continue;
      const h = 0.18 + r() * 0.3;
      const house = new THREE.Mesh(new THREE.BoxGeometry(0.32, h, 0.32), wall);
      house.position.set(p.x, h / 2, p.z);
      const top = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.2, 4), roof);
      top.position.set(p.x, h + 0.1, p.z);
      top.rotation.y = Math.PI / 4;
      root.add(house, top);
      if (r() > 0.55) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.07), lit);
        win.position.set(p.x, h * 0.6, p.z + 0.161);
        root.add(win);
      }
    }

    // The route, dashed in gold.
    const routeGeo = new THREE.BufferGeometry().setFromPoints(points.map((p) => p.clone().setY(0.05)));
    const route = new THREE.Line(routeGeo, new THREE.LineDashedMaterial({ color: 0xddb66a, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.8 }));
    route.computeLineDistances();
    root.add(route);

    // Checkpoint markers.
    const parsed = JSON.parse(state) as { current: number; solved: string[]; ids: string[] };
    points.forEach((p, i) => {
      const id = parsed.ids[i]!;
      const done = parsed.solved.includes(id);
      const here = i === parsed.current;
      const color = done ? 0xddb66a : here ? 0xf8f4ec : 0x273c5e;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.11, here ? 0.9 : 0.55, 16),
        new THREE.MeshStandardMaterial({ color, emissive: here || done ? color : 0x000000, emissiveIntensity: here ? 0.5 : 0.25 }),
      );
      const height = here ? 0.9 : 0.55;
      pillar.position.set(p.x, height / 2, p.z);
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: labelTexture(String(i + 1), done ? '#DDB66A' : here ? '#F8F4EC' : '#273C5E', '#0B1324'), depthTest: false }),
      );
      label.position.set(p.x, height + 0.32, p.z);
      label.scale.setScalar(here ? 0.62 : 0.48);
      root.add(pillar, label);
      if (here) {
        const halo = new THREE.Mesh(
          new THREE.RingGeometry(0.28, 0.42, 48),
          new THREE.MeshBasicMaterial({ color: 0xddb66a, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
        );
        halo.rotation.x = -Math.PI / 2;
        halo.position.set(p.x, 0.02, p.z);
        const glow = new THREE.PointLight(0xddb66a, 2.5, 3);
        glow.position.set(p.x, 0.8, p.z);
        root.add(halo, glow);
      }
    });

    // The journey: a small figure walks from the last checkpoint to this one.
    const from = points[parsed.current - 1];
    const to = points[parsed.current];
    let cancelled = false;
    if (from && to) {
      void buildActor('man').then(({ group: walker }) => {
        if (cancelled) return;
        walker.scale.setScalar(0.3);
        walker.rotation.y = Math.atan2(to.x - from.x, to.z - from.z);
        const lamp = new THREE.PointLight(0xffc56b, 1.6, 1.4);
        lamp.position.y = 0.6;
        walker.add(lamp);
        walker.position.copy(from);
        root.add(walker);
        let time = 0;
        const duration = 3.4;
        v.addTween((dt) => {
          if (cancelled) return false;
          time += dt;
          const p = Math.min(1, time / duration);
          walker.position.lerpVectors(from, to, p * p * (3 - 2 * p));
          walker.position.y = p < 1 ? Math.abs(Math.sin(p * Math.PI * 10)) * 0.05 : 0;
          return p < 1;
        });
      });
    }

    v.invalidate();
    return () => {
      cancelled = true;
      v.dispose();
    };
  }, [state, chapters]);

  const here = chapters[current];
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#0E1A2E]">
      <canvas ref={canvasRef} role="img" aria-label={`${labels.title}. ${labels.note}`} className="block h-60 w-full cursor-grab active:cursor-grabbing sm:h-72" />
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs">
        {here ? (
          <span>
            <span className="text-ivory-mute">{labels.destination}: </span>
            <span className="text-ivory">{here.checkpoint.name[locale]}</span>
          </span>
        ) : (
          <span className="text-gold">{labels.done}</span>
        )}
        <span className="text-ivory-mute">{labels.note}</span>
      </figcaption>
    </figure>
  );
}
