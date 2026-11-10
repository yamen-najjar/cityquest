// Offline grading must give exactly the verdict the server gives: the pack is built with the server's
// normalisation, the browser grades with gradeWithPack, and these tests hold the two together.
import { describe, expect, it } from 'vitest';
import { adventures } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { gradeWithPack } from '@/lib/engine/answer-pack';
import { buildAnswerPack, packVersion } from '@/lib/engine/answer-pack.server';
import { checkAnswer } from '@/lib/engine/check.server';
import { encodeReport } from '@/lib/engine/report';

const split = (name: string): [string, string | undefined] => {
  const [id, variant] = name.split('@');
  return [id!, variant];
};

describe('answer pack', () => {
  it('holds hashes only, never a plain answer, and a fresh salt each time', async () => {
    const a = (await buildAnswerPack('lost-manuscript'))!;
    const b = (await buildAnswerPack('lost-manuscript'))!;
    expect(a.salt).not.toBe(b.salt);
    expect(a.keys.clockmaker).not.toEqual(b.keys.clockmaker);
    const text = JSON.stringify(Object.values(a.keys));
    for (const key of Object.values(answerKeys['lost-manuscript']!)) {
      for (const plain of key.accepted) if (plain.length > 3) expect(text).not.toContain(plain);
    }
    expect(a.keys.clockmaker!.every((h) => /^[0-9a-f]{64}$/.test(h))).toBe(true);
    expect(a.version).toBe(packVersion('lost-manuscript'));
    expect(a.version).toBe(b.version);
  });

  it('gives every adventure and key a pack that agrees with the server on all its accepted answers and wrong ones', async () => {
    for (const adv of adventures) {
      const pack = (await buildAnswerPack(adv.slug))!;
      expect(pack.paid).toBe(!adv.isDemo);
      for (const [name, { accepted }] of Object.entries(answerKeys[adv.slug]!)) {
        const [chapterId, variant] = split(name);
        const guesses = name.startsWith('report') ? [accepted[0]!, 'who=nobody'] : [...accepted, 'definitely-wrong-9', ''];
        for (const answer of guesses) {
          const server = checkAnswer(adv.slug, { chapterId, answer, variant });
          if (!server.ok) continue;
          const local = await gradeWithPack(pack, chapterId, answer, variant);
          expect(local?.correct, `${adv.slug} ${name} "${answer}"`).toBe(server.correct);
          expect(local?.confirmed ?? [], `${adv.slug} ${name} confirmed`).toEqual(server.confirmed ?? []);
        }
      }
    }
  });

  it('normalises like the server: case, umlauts, articles, Arabic letters and digits', async () => {
    const pack = (await buildAnswerPack('lost-manuscript'))!;
    const cases: [string, string, boolean][] = [
      ['message', '  THE Tower! ', true],
      ['message', 'Türm', true],
      ['message', 'Tower of London', false],
      ['message', 'البُرج', true],
      ['message', 'برج', true],
      ['study', 'Zur Truhe am Fluss', true],
      ['study', 'DE KIST', true],
      ['clockmaker', '٧٣٤٧', true],
      ['clockmaker', '7 3 4 7', true],
      ['clockmaker', '7348', false],
      ['clockmaker', '', false],
    ];
    for (const [chapterId, answer, expected] of cases) {
      const server = checkAnswer('lost-manuscript', { chapterId, answer });
      expect(server.ok && server.correct, `server ${chapterId} ${answer}`).toBe(expected);
      expect((await gradeWithPack(pack, chapterId, answer))?.correct, `pack ${chapterId} ${answer}`).toBe(expected);
    }
  });

  it('uses the variant key where there is one and the original elsewhere', async () => {
    const pack = (await buildAnswerPack('lost-manuscript'))!;
    expect((await gradeWithPack(pack, 'verdict', 'anna+brass-key', 'anna'))?.correct).toBe(true);
    expect((await gradeWithPack(pack, 'verdict', 'kehl+second-half', 'anna'))?.correct).toBe(false);
    expect((await gradeWithPack(pack, 'verdict', 'kehl+second-half'))?.correct).toBe(true);
    // No "message@anna" key: the original answer stands in the replay.
    expect((await gradeWithPack(pack, 'message', 'tower', 'anna'))?.correct).toBe(true);
    expect(await gradeWithPack(pack, 'no-such-chapter', 'x')).toBeNull();
  });

  it('grades the case report slot by slot, with the same confirmed slots as the server', async () => {
    const pack = (await buildAnswerPack('lost-manuscript'))!;
    const right = { helper: 'anna', how: 'door', when: 'between', who: 'kehl', why: 'lock' };
    const attempts = [
      right,
      { ...right, why: 'sell' }, // 4 right: confirmed, not solved
      { ...right, why: 'sell', who: 'anna' }, // 3 right
      { ...right, why: 'sell', who: 'anna', how: 'window' }, // 2 right: nothing confirmed
      { who: 'kehl' }, // incomplete
    ];
    for (const picks of attempts) {
      const answer = encodeReport(picks);
      const server = checkAnswer('lost-manuscript', { chapterId: 'report', answer });
      const local = await gradeWithPack(pack, 'report', answer);
      expect(local).toEqual({ correct: server.ok && server.correct, confirmed: server.ok ? (server.confirmed ?? []) : [] });
    }
    expect((await gradeWithPack(pack, 'report', encodeReport(right)))?.correct).toBe(true);
    expect((await gradeWithPack(pack, 'report', encodeReport({ ...right, why: 'sell' })))?.confirmed).toHaveLength(4);
    const second = { helper: 'anna', how: 'door', when: 'between', who: 'anna', why: 'sell' };
    expect((await gradeWithPack(pack, 'report', encodeReport(second), 'anna'))?.correct).toBe(true);
    expect((await gradeWithPack(pack, 'report', encodeReport(second)))?.correct).toBe(false);
  });

  it('knows nothing about unknown adventures', async () => {
    expect(await buildAnswerPack('nope')).toBeNull();
    expect(packVersion('nope')).toBeNull();
  });
});
