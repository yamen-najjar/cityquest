// Second truths: on a replay the same story can have another culprit. A variant overrides parts of the
// adventure by id (see Variant in content/types.ts); answers that change live server-side as
// "<key>@<variant id>". Pure, so the client, the server and the tests agree.
import type { Adventure, Variant } from '@/content/types';

/** The variant with this id, if the adventure has it. */
export function variantOf(a: Adventure, id: string | null | undefined): Variant | undefined {
  return id ? a.variants?.find((v) => v.id === id) : undefined;
}

/** The adventure as a variant tells it. Unknown or no variant: the adventure unchanged. */
export function applyVariant(a: Adventure, id: string | null | undefined): Adventure {
  const v = variantOf(a, id);
  if (!v) return a;
  return {
    ...a,
    appliedVariant: v.id,
    chapters: a.chapters.map((c) => {
      const o = v.chapters?.[c.id];
      if (!o) return c;
      return {
        ...c,
        story: o.story ?? c.story,
        success: o.success ?? c.success,
        // A cutscene tells the original truth: a chapter whose story or ending changes drops that scene.
        scenes: c.scenes && { intro: o.story ? undefined : c.scenes.intro, success: o.success ? undefined : c.scenes.success },
        puzzle: { ...c.puzzle, prompt: o.prompt ?? c.puzzle.prompt, hints: o.hints ?? c.puzzle.hints, junior: o.junior ?? c.puzzle.junior },
      };
    }),
    people: a.people.map((p) => (v.notes?.[p.id] ? { ...p, notes: [...(p.notes ?? []), ...v.notes[p.id]!] } : p)),
    phone: [...(a.phone ?? []).map((m) => (v.phoneText?.[m.id] ? { ...m, text: v.phoneText[m.id]! } : m)), ...(v.phone ?? [])],
    ending: { ...a.ending, reveal: v.ending?.reveal ?? a.ending.reveal, revealIf: v.ending?.revealIf ?? a.ending.revealIf },
  };
}

/**
 * The truth a replay tells: after the original comes each variant in turn, then the original again.
 * `previous` is the variant of the game just finished (null for the original).
 */
export function nextVariant(a: Adventure, previous: string | null): string | null {
  const order = [null, ...(a.variants ?? []).map((v) => v.id)];
  const i = order.indexOf(previous);
  return order[(i + 1) % order.length] ?? null;
}
