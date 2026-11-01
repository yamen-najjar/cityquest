import { describe, expect, it } from 'vitest';
import { allAdventures, getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { checkAdventure } from '@/lib/admin/content-check';

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
    expect(r.stats).toMatchObject({ chapters: 8, board: 4, choices: 0, simulatedCheckpoints: 8 });
    expect(checkAdventure(getAdventure('neckar-ring')!, answerKeys['neckar-ring']).stats.choices).toBe(1);
  });
});
