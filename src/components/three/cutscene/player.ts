// Turns a Scene (data) into a pose at any time t. Evaluating from scratch at each t, instead of
// stepping, makes skipping, replaying and reduced motion (jump to the last frame) all the same call.
import * as THREE from 'three';
import type { Scene, SceneAction, Vec3 } from '@/content/types';
import { hdri } from '../assets';
import type { Viewer } from '../viewer';
import { buildActor, type ActorHandle } from './actors';
import { buildSet } from './sets';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Smooth start and end. */
const ease = (x: number) => x * x * (3 - 2 * x);
const v3 = (a: Vec3) => new THREE.Vector3(...a);

interface Prepared {
  action: SceneAction;
  /** For move / walk / turn / rise: the value when this action starts. */
  from?: THREE.Vector3 | number;
}

export class ScenePlayer {
  private actors = new Map<string, { h: ActorHandle; start: THREE.Vector3; turn: number; hidden: boolean }>();
  private prepared: Prepared[] = [];
  private setIdle: (t: number) => void;
  private shots: { t: number; camera: THREE.Vector3; look: THREE.Vector3 }[];

  /** Loads the set, its lighting and every actor, then returns a player ready at t = 0. */
  static async create(scene: Scene, viewer: Viewer): Promise<ScenePlayer> {
    const built = await buildSet(scene.set, viewer.scene, viewer.root);
    const [env, handles] = await Promise.all([hdri(built.environment.id), Promise.all(scene.actors.map((a) => buildActor(a.kind)))]);
    viewer.setEnvironment(env, built.environment.intensity);
    const player = new ScenePlayer(scene, viewer.root, viewer.camera, built.tick, handles);
    // Shadows from and onto everything in the set.
    viewer.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.receiveShadow = true;
    });
    player.apply(0);
    return player;
  }

  private constructor(
    private readonly scene: Scene,
    root: THREE.Object3D,
    private readonly camera: THREE.PerspectiveCamera,
    tick: (t: number) => void,
    handles: ActorHandle[],
  ) {
    this.setIdle = tick;
    scene.actors.forEach((a, i) => {
      const h = handles[i]!;
      h.group.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) o.castShadow = true;
      });
      h.group.position.set(...a.at);
      h.group.rotation.y = a.turn ?? 0;
      h.group.scale.setScalar(a.scale ?? 1);
      root.add(h.group);
      this.actors.set(a.id, { h, start: v3(a.at), turn: a.turn ?? 0, hidden: !!a.hidden });
    });
    // Work out where each move starts: where the previous move of the same actor ended.
    const pos = new Map<string, THREE.Vector3>();
    const turn = new Map<string, number>();
    const rise = new Map<string, number>();
    for (const action of [...scene.actions].sort((x, y) => x.t - y.t)) {
      const actor = this.actors.get(action.id);
      if (!actor) continue;
      if (action.do === 'move' || action.do === 'walk') {
        const from = pos.get(action.id) ?? actor.start.clone();
        this.prepared.push({ action, from });
        pos.set(action.id, v3(action.to));
      } else if (action.do === 'turn') {
        this.prepared.push({ action, from: turn.get(action.id) ?? actor.turn });
        turn.set(action.id, action.to);
      } else if (action.do === 'rise') {
        const from = rise.get(action.id) ?? 0;
        this.prepared.push({ action, from });
        rise.set(action.id, from + action.by);
      } else {
        this.prepared.push({ action });
      }
    }
    this.shots = [...scene.shots].sort((x, y) => x.t - y.t).map((s) => ({ t: s.t, camera: v3(s.camera), look: v3(s.look) }));
  }

  get duration() {
    return this.scene.duration;
  }

  /** Poses everything for time t (seconds). */
  apply(t: number) {
    this.setIdle(t);
    const state = new Map<string, { pos: THREE.Vector3; turn: number; rise: number; opacity: number; open?: number; reach?: number; glow?: number; shatter?: number; shake: number }>();
    for (const [id, a] of this.actors) {
      state.set(id, { pos: a.start.clone(), turn: a.turn, rise: 0, opacity: a.hidden ? 0 : 1, shake: 0 });
    }
    for (const { action, from } of this.prepared) {
      if (t < action.t) continue;
      const s = state.get(action.id)!;
      const p = ease(clamp01((t - action.t) / Math.max(0.001, action.d)));
      switch (action.do) {
        case 'move':
        case 'walk': {
          s.pos.lerpVectors(from as THREE.Vector3, v3(action.to), p);
          if (action.do === 'walk' && p < 1) s.pos.y += Math.abs(Math.sin(p * Math.PI * 6)) * 0.04;
          break;
        }
        case 'turn':
          s.turn = THREE.MathUtils.lerp(from as number, action.to, p);
          break;
        case 'rise':
          s.rise = (from as number) + action.by * p;
          break;
        case 'appear':
          s.opacity = p;
          break;
        case 'vanish':
          s.opacity = 1 - p;
          break;
        case 'open':
          s.open = p;
          break;
        case 'close':
          s.open = 1 - p;
          break;
        case 'glow':
          s.glow = p;
          break;
        case 'reach':
          s.reach = p;
          break;
        case 'shatter':
          s.shatter = p;
          break;
        case 'shake':
          if (p < 1) s.shake = 1 - p;
          break;
      }
    }
    for (const [id, a] of this.actors) {
      const s = state.get(id)!;
      const g = a.h.group;
      g.position.copy(s.pos);
      g.position.y += s.rise;
      if (s.shake) g.position.x += Math.sin(t * 60) * 0.015 * s.shake;
      g.rotation.y = s.turn;
      g.visible = s.opacity > 0.01;
      for (const f of a.h.fade) f.m.opacity = f.full * s.opacity;
      if (s.open !== undefined) a.h.open?.(s.open);
      if (s.reach !== undefined) a.h.reach?.(s.reach);
      if (s.glow !== undefined) a.h.glow?.(s.glow);
      if (s.shatter !== undefined) a.h.shatter?.(s.shatter);
      a.h.idle?.(t);
    }
    this.placeCamera(t);
  }

  private placeCamera(t: number) {
    const shots = this.shots;
    if (!shots.length) return;
    let i = 0;
    while (i < shots.length - 1 && t >= shots[i + 1]!.t) i++;
    const a = shots[i]!;
    const b = shots[Math.min(i + 1, shots.length - 1)]!;
    const p = b === a ? 1 : ease(clamp01((t - a.t) / (b.t - a.t)));
    this.camera.position.lerpVectors(a.camera, b.camera, p);
    const look = new THREE.Vector3().lerpVectors(a.look, b.look, p);
    if (this.scene.handheld) {
      this.camera.position.y += Math.sin(t * 9) * 0.035;
      this.camera.position.x += Math.sin(t * 4.5) * 0.025;
    }
    this.camera.lookAt(look);
  }
}
