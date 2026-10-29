// Fetches a scene's files ahead of time (while the player is busy with a puzzle), so the next cutscene
// starts without a loading pause. Uses the same caches as the real loaders; nothing is built here.
import type { ActorKind, Scene, SceneSet } from '@/content/types';
import { hdri, model, surface, type HdriId, type ModelId, type Surface } from '../assets';

const STREET: Surface[] = ['cobblestone_floor_001', 'medieval_wall_01', 'plastered_stone_wall'];

const SETS: Record<SceneSet, { hdri: HdriId; surfaces: Surface[]; models: ModelId[] }> = {
  room: { hdri: 'decor_shop', surfaces: ['old_wood_floor', 'plastered_stone_wall'], models: ['WoodenTable_01'] },
  shop: { hdri: 'decor_shop', surfaces: ['old_wood_floor', 'plastered_stone_wall', 'dark_wooden_planks'], models: ['wooden_bookshelf_worn', 'Lantern_01'] },
  square: { hdri: 'cobblestone_street_night', surfaces: [...STREET, 'castle_brick_01'], models: ['large_castle_door', 'street_lamp_01'] },
  workshop: { hdri: 'carpentry_shop_01', surfaces: ['old_wood_floor', 'plastered_stone_wall', 'dark_wooden_planks'], models: ['wall_clock', 'vintage_grandfather_clock_01'] },
  riverbank: { hdri: 'cobblestone_street_night', surfaces: [...STREET, 'castle_brick_01', 'dark_wooden_planks'], models: ['street_lamp_01'] },
  archive: { hdri: 'cobblestone_street_night', surfaces: [...STREET, 'castle_brick_01'], models: ['large_castle_door'] },
  alley: { hdri: 'cobblestone_street_night', surfaces: STREET, models: ['street_lamp_01'] },
  lanes: { hdri: 'cobblestone_street_night', surfaces: STREET, models: ['street_lamp_01'] },
  bridge: { hdri: 'cobblestone_street_night', surfaces: [...STREET, 'castle_brick_01'], models: ['street_lamp_01'] },
};

const ACTOR_MODELS: Partial<Record<ActorKind, ModelId>> = {
  chest: 'treasure_chest',
  cabinet: 'GothicCabinet_01',
  lantern: 'Lantern_01',
  door: 'large_castle_door',
};
const FIGURES: ActorKind[] = ['old-woman', 'woman', 'man', 'girl'];

export function preloadScene(scene: Scene | undefined) {
  if (!scene) return;
  const set = SETS[scene.set];
  const jobs: Promise<unknown>[] = [hdri(set.hdri), ...set.surfaces.map((s) => surface(s)), ...set.models.map((m) => model(m))];
  for (const a of scene.actors) {
    const m = ACTOR_MODELS[a.kind];
    if (m) jobs.push(model(m));
    if (FIGURES.includes(a.kind)) jobs.push(surface('rough_linen'));
    if (a.kind === 'box') jobs.push(surface('dark_wooden_planks'));
  }
  void Promise.allSettled(jobs);
}
