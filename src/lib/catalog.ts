import type { Adventure, Difficulty, GroupType, Theme } from '@/content/types';
import { normalizeAnswer } from './engine/normalize';

export interface CatalogFilters {
  q?: string;
  city?: string;
  theme?: Theme;
  duration?: 'short' | 'medium' | 'long';
  difficulty?: Difficulty;
  group?: GroupType;
}

const themes: Theme[] = ['mystery', 'treasure', 'escape', 'detective'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
const groups: GroupType[] = ['friends', 'family', 'couples', 'corporate'];
const durations = ['short', 'medium', 'long'] as const;

/** Reads filters from a query string, dropping anything that is not a known value. */
export function parseFilters(sp: Record<string, string | string[] | undefined>): CatalogFilters {
  const one = (k: string) => (typeof sp[k] === 'string' ? (sp[k] as string) : undefined);
  const pick = <T extends string>(k: string, allowed: readonly T[]) => {
    const v = one(k);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
  };
  return {
    q: one('q')?.slice(0, 80) || undefined,
    city: one('city')?.slice(0, 40) || undefined,
    theme: pick('theme', themes),
    duration: pick('duration', durations),
    difficulty: pick('difficulty', difficulties),
    group: pick('group', groups),
  };
}

function inDuration(a: Adventure, d: CatalogFilters['duration']): boolean {
  if (!d) return true;
  const { min, max } = a.durationMinutes;
  if (d === 'short') return min <= 90;
  if (d === 'medium') return min < 150 && max >= 90;
  return max > 150;
}

/**
 * Search matches the title and tagline in every language, plus extra terms the page supplies (city and
 * theme names in every language), so "Heidelberg Mystery" or "هايدلبرغ" both find the demo.
 */
export function filterAdventures(list: Adventure[], f: CatalogFilters, extraTerms: (a: Adventure) => string[] = () => []): Adventure[] {
  const words = (f.q ?? '').split(/\s+/).map(normalizeAnswer).filter(Boolean);
  return list.filter((a) => {
    if (f.city && a.city !== f.city) return false;
    if (f.theme && a.theme !== f.theme) return false;
    if (f.difficulty && a.difficulty !== f.difficulty) return false;
    if (f.group && !a.groupTypes.includes(f.group)) return false;
    if (!inDuration(a, f.duration)) return false;
    if (words.length) {
      const hay = [...Object.values(a.title), ...Object.values(a.tagline), ...extraTerms(a)].map(normalizeAnswer);
      // Every word must appear somewhere.
      if (!words.every((w) => hay.some((h) => h.includes(w)))) return false;
    }
    return true;
  });
}

export const filterOptions = { themes, difficulties, groups, durations };
