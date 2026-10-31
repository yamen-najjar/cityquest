import { localize } from '../translations';
import type { Adventure, Authored, Scene } from '../types';
import { lostManuscript } from './lost-manuscript';
import { neckarRing } from './neckar-ring';
import { manuscriptScenes, ringScenes } from './scenes';

type AuthoredScenes = Record<string, { intro?: Authored<Scene>; success?: Authored<Scene> }>;

/** Attaches each chapter's cutscenes, kept in scenes.ts so the story files stay readable. */
function withScenes(a: Authored<Adventure>, scenes: AuthoredScenes): Authored<Adventure> {
  return { ...a, chapters: a.chapters.map((c) => (scenes[c.id] ? { ...c, scenes: scenes[c.id] } : c)) };
}

// Phase 2 replaces this list with a Supabase query; drafts stay out of every public page. The stories are
// written in German, English and Arabic; localize() adds the languages kept in content/translations.
const all: Adventure[] = [withScenes(lostManuscript, manuscriptScenes), withScenes(neckarRing, ringScenes)].map((a) => localize<Adventure>(a));

export const adventures = all.filter((a) => a.status === 'published');

/** Every adventure including drafts. For admin/server use only — never a public page. */
export const allAdventures = all;

export function getAdventure(slug: string): Adventure | undefined {
  return adventures.find((a) => a.slug === slug);
}

/** Look up any adventure including drafts. Admin preview only; public pages use getAdventure. */
export function getAdventureAny(slug: string): Adventure | undefined {
  return all.find((a) => a.slug === slug);
}

export function adventuresIn(city: string): Adventure[] {
  return adventures.filter((a) => a.city === city);
}
