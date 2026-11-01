import { describe, expect, it } from 'vitest';
import { allAdventures, getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { checkAdventure, MIN_BOARD } from '@/lib/admin/content-check';

describe('admin content check', () => {
  it('finds no errors and no warnings in the shipped stories', () => {
    for (const a of allAdventures) {
      expect(checkAdventure(a, answerKeys[a.slug]).issues, a.slug).toEqual([]);
    }
  });

  it('reports what would break a story', () => {
    const a = structuredClone(getAdventure('neckar-ring')!);
    a.chapters[0]!.reward = 'ghost-item';
    a.chapters[1]!.puzzle.hints.pop();
    a.chapters[2]!.title.nl = '';
    a.people[0]!.notes.push({ after: 'box', when: 'box:nope', text: a.people[0]!.notes[0]!.text });
    a.board = [{ id: 'q', after: 'nope', question: a.title, deduction: a.title }];
    const key = { ...answerKeys['neckar-ring']! };
    delete key['ledger'];

    const issues = checkAdventure(a, key).issues;
    const messages = issues.map((i) => `${i.level} ${i.where}: ${i.message}`);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^error chapter “box”: Rewards an item that does not exist/),
        expect.stringMatching(/^warning chapter “whispers”: Has 2 hints/),
        expect.stringMatching(/^error chapter “ledger”: No accepted answer/),
        expect.stringMatching(/^error person “hedda”: A note depends on a story choice that does not exist/),
        expect.stringMatching(/^error board “q”: Opens after a chapter that does not exist/),
        expect.stringMatching(/^error board “q”: No accepted answer/),
        expect.stringMatching(/^warning chapters\[2\]\.title: Empty text in NL/),
      ]),
    );
  });

  it('gives the numbers the overview shows', () => {
    const r = checkAdventure(getAdventure('lost-manuscript')!, answerKeys['lost-manuscript']);
    expect(r.stats).toMatchObject({ chapters: 8, board: 4, choices: 1, simulatedCheckpoints: 8 });
    expect(checkAdventure(getAdventure('neckar-ring')!, answerKeys['neckar-ring']).stats.choices).toBe(1);
  });
});

// Every published adventure offers the same experience. A new story that misses a feature fails here (and
// in CI) with a message that says what to add; docs/NEW-ADVENTURE.md is the checklist.
describe('feature parity across adventures', () => {
  for (const a of allAdventures.filter((x) => x.status === 'published')) {
    it(`${a.slug} has every feature: cutscenes, evidence board, story choice, 3D finale`, () => {
      expect(a.chapters.every((c) => c.scenes?.intro), 'an intro cutscene for every chapter').toBe(true);
      expect(a.chapters.some((c) => c.scenes?.success), 'success cutscenes').toBe(true);
      expect(a.board?.length ?? 0, 'evidence board questions').toBeGreaterThanOrEqual(MIN_BOARD);
      expect(a.chapters.some((c) => c.choice), 'a story choice').toBe(true);
      expect(a.ending.artifact, 'a 3D artifact for the finale').toBeTruthy();
    });
  }

  it('a published story stripped of its extras is refused; as a draft it only warns', () => {
    const bare = structuredClone(getAdventure('het-duivelshuis')!);
    bare.chapters = bare.chapters.map(({ scenes: _scenes, choice: _choice, ...c }) => c);
    bare.board = [];
    delete bare.ending.artifact;
    const errors = checkAdventure(bare, answerKeys['het-duivelshuis']).issues.filter((i) => i.level === 'error').map((i) => i.message);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/No intro cutscene/),
        expect.stringMatching(/evidence board needs at least 3/),
        expect.stringMatching(/at least one story choice/),
        expect.stringMatching(/No 3D artifact/),
      ]),
    );
    // As a draft the missing features are only warnings. (The journal notes and endings that still name the
    // removed choice stay errors: they point at nothing, published or not.)
    const parity = /No intro cutscene|No success cutscene|evidence board needs|at least one story choice|No 3D artifact/;
    const draft = checkAdventure({ ...bare, status: 'draft' }, answerKeys['het-duivelshuis']).issues;
    expect(draft.filter((i) => i.level === 'error' && parity.test(i.message))).toEqual([]);
    expect(draft.filter((i) => i.level === 'warning' && parity.test(i.message)).length).toBeGreaterThan(0);
  });
});
