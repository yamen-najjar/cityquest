import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { chose, fitToAdventure, newProgress, parseProgress, reduce, type Progress } from '@/lib/engine/progress';

const team = { name: 'Owls', players: 2 };

describe('story choices in the content', () => {
  for (const a of adventures) {
    it(`${a.slug}: every "when" names a real choice and option`, () => {
      const options = new Set(a.chapters.flatMap((c) => (c.choice?.options ?? []).map((o) => `${c.id}:${o.id}`)));
      const whens = [
        ...a.people.flatMap((p) => p.notes.map((n) => n.when)),
        ...(a.ending.revealIf ?? []).map((r) => r.when),
        ...a.ending.decision.choices.flatMap((c) => (c.epilogueIf ?? []).map((e) => e.when)),
      ].filter((w): w is string => !!w);
      for (const w of whens) expect(options, w).toContain(w);
      for (const r of a.ending.revealIf ?? []) {
        if (r.after !== undefined) expect(r.after).toBeLessThan(a.ending.reveal.en.length);
      }
      for (const c of a.chapters) {
        if (!c.choice) continue;
        expect(c.choice.options.length, c.id).toBeGreaterThanOrEqual(2);
        expect(new Set(c.choice.options.map((o) => o.id)).size, c.id).toBe(c.choice.options.length);
      }
    });
  }

  it('The Neckar Ring branches after Hedda’s letter, and every ending answers both choices', () => {
    const a = getAdventure('neckar-ring')!;
    expect(a.chapters.find((c) => c.id === 'letter')?.choice?.options.map((o) => o.id)).toEqual(['forgive', 'confront']);
    for (const ending of a.ending.decision.choices) {
      expect((ending.epilogueIf ?? []).map((e) => e.when).sort(), ending.id).toEqual(['letter:confront', 'letter:forgive']);
    }
  });
});

describe('story choices in the engine', () => {
  const a = getAdventure('neckar-ring')!;
  const ids = a.chapters.map((c) => c.id);
  const solvedThrough = (last: string): Progress => {
    let p = newProgress(a.slug, team, 1);
    for (const c of a.chapters) {
      p = reduce(reduce(p, { type: 'arrive' }), { type: 'solve', chapterId: c.id, reward: c.reward });
      if (c.id === last) return p;
      p = reduce(p, { type: 'next', chapterCount: ids.length });
    }
    return p;
  };

  it('a choice is made only after its chapter is solved, and only once', () => {
    const early = reduce(newProgress(a.slug, team, 1), { type: 'choose', chapterId: 'letter', optionId: 'forgive' });
    expect(early.choices).toEqual({});
    let p = reduce(solvedThrough('letter'), { type: 'choose', chapterId: 'letter', optionId: 'confront' });
    p = reduce(p, { type: 'choose', chapterId: 'letter', optionId: 'forgive' });
    expect(p.choices).toEqual({ letter: 'confront' });
    expect(chose(p, 'letter:confront')).toBe(true);
    expect(chose(p, 'letter:forgive')).toBe(false);
    expect(chose(p, undefined)).toBe(true);
  });

  it('survives a save, gives older saves no choices, and drops choices for chapters no longer solved', () => {
    const p = reduce(solvedThrough('letter'), { type: 'choose', chapterId: 'letter', optionId: 'forgive' });
    expect(parseProgress(JSON.parse(JSON.stringify(p)), a.slug)?.choices).toEqual({ letter: 'forgive' });
    const old = JSON.parse(JSON.stringify(p)) as Record<string, unknown>;
    delete old.choices;
    expect(parseProgress(old, a.slug)?.choices).toEqual({});
    expect(parseProgress({ ...old, choices: { letter: 42, '': 'x' } }, a.slug)?.choices).toEqual({});
    const rolledBack = fitToAdventure({ ...p, solved: p.solved.filter((id) => id !== 'letter') }, ids, a.items.map((i) => i.id));
    expect(rolledBack.choices).toEqual({});
  });
});
