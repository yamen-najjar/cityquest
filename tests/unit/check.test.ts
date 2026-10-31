import { describe, expect, it } from 'vitest';
import { adventures } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { checkAnswer, resolveGuess } from '@/lib/engine/check.server';
import { ALPHABETS, caesar } from '@/components/game/puzzles/CipherWheel';
import { MORSE_DIGITS } from '@/components/game/puzzles/Morse';

const yes = { ok: true, correct: true };
const no = { ok: true, correct: false };
const check = (slug: string, chapterId: string, answer: string) => checkAnswer(slug, { chapterId, answer });

describe('checkAnswer: The Lost Manuscript', () => {
  const c = (id: string, ans: string) => check('lost-manuscript', id, ans);
  it('accepts the solution of every chapter, in every language', () => {
    for (const ans of ['TOWER', 'Turm', 'برج', 'البرج']) expect(c('message', ans)).toEqual(yes);
    expect(c('witnesses', 'clara')).toEqual(yes);
    for (const ans of ['7347', '7 3 4 7', '٧٣٤٧']) expect(c('clockmaker', ans)).toEqual(yes);
    for (const ans of ['the river', 'Truhe am Fluss', 'النهر', 'chest']) expect(c('study', ans)).toEqual(yes);
    expect(c('chest', 'lantern-map')).toEqual(yes);
    for (const ans of ['1847', '١٨٤٧']) expect(c('signal', ans)).toEqual(yes);
    for (const ans of ['stories', 'Geschichten', 'حكايات']) expect(c('mirror', ans)).toEqual(yes);
    for (const ans of ['kehl+second-half', 'kehl+whole-letter']) expect(c('verdict', ans)).toEqual(yes);
  });
  it('rejects wrong answers', () => {
    expect(c('message', 'bridge')).toEqual(no);
    expect(c('witnesses', 'ben')).toEqual(no);
    expect(c('clockmaker', '3473')).toEqual(no);
    expect(c('study', 'archive')).toEqual(no);
    expect(c('chest', 'brass-key')).toEqual(no);
    expect(c('signal', '1874')).toEqual(no);
    expect(c('mirror', 'seirots')).toEqual(no);
    expect(c('verdict', 'kehl+brass-key')).toEqual(no);
    expect(c('verdict', 'clara+second-half')).toEqual(no);
  });
});

describe('checkAnswer: The Neckar Ring', () => {
  const c = (id: string, ans: string) => check('neckar-ring', id, ans);
  it('accepts the solution of every chapter, in every language', () => {
    for (const ans of ['369', '٣٦٩']) expect(c('box', ans)).toEqual(yes);
    for (const ans of ['Bookbinder', 'book binder', 'Buchbinder', 'مجلّد', 'المجلد', 'مجلدة الكتب']) expect(c('whispers', ans)).toEqual(yes);
    expect(c('watchman', 'hedda')).toEqual(yes);
    expect(c('chase', 'narrow')).toEqual(yes);
    expect(c('ledger', 'bacd')).toEqual(yes);
    for (const ans of ['VALEN', 'فالين']) expect(c('goldsmith', ans)).toEqual(yes);
    for (const ans of ['Forgive me', 'forgiveness', 'Verzeih mir', 'vergeben', 'سامحني', 'المسامحة']) expect(c('letter', ans)).toEqual(yes);
    for (const ans of ['valen+hallmark-rubbing', 'valen+ledger-page']) expect(c('bridge', ans)).toEqual(yes);
  });
  it('rejects wrong answers', () => {
    expect(c('box', '396')).toEqual(no);
    expect(c('whispers', 'mira')).toEqual(no);
    expect(c('watchman', 'kaspar')).toEqual(no);
    expect(c('chase', 'stone')).toEqual(no);
    expect(c('ledger', 'abcd')).toEqual(no);
    expect(c('goldsmith', 'nelav')).toEqual(no);
    expect(c('letter', 'afraid')).toEqual(no);
    expect(c('bridge', 'hedda+hedda-letter')).toEqual(no);
    expect(c('bridge', 'valen+chalk-sign')).toEqual(no);
  });
});

describe('checkAnswer: requests', () => {
  it('refuses malformed requests', () => {
    expect(checkAnswer('nope', { chapterId: 'message', answer: 'x' })).toMatchObject({ ok: false, status: 404 });
    expect(checkAnswer('lost-manuscript', { chapterId: 'nope', answer: 'x' })).toMatchObject({ ok: false, status: 404 });
    expect(checkAnswer('lost-manuscript', { chapterId: 'box', answer: '369' })).toMatchObject({ ok: false, status: 404 });
    expect(checkAnswer('lost-manuscript', { chapterId: 'message' })).toMatchObject({ ok: false, status: 400 });
    expect(checkAnswer('lost-manuscript', { chapterId: 'message', answer: 'x'.repeat(201) })).toMatchObject({ ok: false, status: 400 });
    expect(checkAnswer('lost-manuscript', null)).toMatchObject({ ok: false, status: 400 });
  });
});

describe('resolveGuess', () => {
  it('resolves a valid guess with the chapter index used for order gating', () => {
    const r = resolveGuess('lost-manuscript', { chapterId: 'clockmaker', answer: '7347' });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.adventure.slug).toBe('lost-manuscript');
      expect(r.chapterId).toBe('clockmaker');
      expect(r.chapterIndex).toBe(2); // message, witnesses, clockmaker
      expect(r.accepted).toContain('7347');
      expect(r.answer).toBe('7347');
    }
  });

  it('gives the first chapter index 0 and never checks correctness', () => {
    const r = resolveGuess('lost-manuscript', { chapterId: 'message', answer: 'totally wrong' });
    expect(r).toMatchObject({ ok: true, chapterIndex: 0 });
  });

  it('mirrors checkAnswer error shapes (unknown adventure/chapter, bad body)', () => {
    expect(resolveGuess('nope', { chapterId: 'message', answer: 'x' })).toMatchObject({ ok: false, status: 404 });
    expect(resolveGuess('lost-manuscript', { chapterId: 'nope', answer: 'x' })).toMatchObject({ ok: false, status: 404 });
    expect(resolveGuess('lost-manuscript', { chapterId: 'message' })).toMatchObject({ ok: false, status: 400 });
  });
});

describe('content', () => {
  it('has two published adventures', () => {
    expect(adventures.map((a) => a.slug)).toEqual(['lost-manuscript', 'neckar-ring']);
  });

  for (const a of adventures) {
    describe(a.slug, () => {
      it('has an answer key for every chapter, and no answer data in the public object', () => {
        for (const c of a.chapters) expect(answerKeys[a.slug]?.[c.id]?.accepted.length, c.id).toBeGreaterThan(0);
        expect(JSON.stringify(a)).not.toContain('accepted');
      });

      it('has eight chapters, each with three hints, clues and a simulated checkpoint with manual confirmation', () => {
        expect(a.chapters).toHaveLength(8);
        expect(new Set(a.chapters.map((c) => c.id)).size).toBe(8);
        for (const c of a.chapters) {
          expect(c.puzzle.hints, c.id).toHaveLength(3);
          expect(c.clues?.length, c.id).toBeGreaterThan(0);
          expect(c.checkpoint.simulated).toBe(true);
          expect(c.checkpoint.verification).toContain('manual');
        }
      });

      it('has DB-safe chapter ids (the solves gating depends on the chapter_id check constraint)', () => {
        // Must match supabase/migrations/..._entitlements_and_solves.sql: ^[a-z0-9-]+$, max 64 chars.
        // A chapter id that fails this would make recordSolve throw and soft-lock a paid player.
        for (const c of a.chapters) {
          expect(c.id, c.id).toMatch(/^[a-z0-9-]+$/);
          expect(c.id.length, c.id).toBeLessThanOrEqual(64);
        }
      });

      it('every QR checkpoint has a well-formed, unique code (Phase 4)', () => {
        const seen = new Set<string>();
        for (const c of a.chapters) {
          const cp = c.checkpoint;
          if (cp.verification.includes('qr')) {
            expect(cp.code, c.id).toBeTruthy();
            expect(cp.code!, c.id).toMatch(/^cq-[a-z0-9-]+$/);
            expect(seen.has(cp.code!), `${c.id} duplicate code ${cp.code}`).toBe(false);
            seen.add(cp.code!);
          }
        }
      });

      it('every GPS checkpoint has valid, unique Heidelberg coordinates (Phase 4)', () => {
        const seen = new Set<string>();
        for (const c of a.chapters) {
          const cp = c.checkpoint;
          if (cp.verification.includes('gps')) {
            expect(cp.coordinates, c.id).toBeDefined();
            const { lat, lng } = cp.coordinates!;
            expect(Number.isFinite(lat) && Number.isFinite(lng), c.id).toBe(true);
            // Heidelberg bounding box.
            expect(lat, c.id).toBeGreaterThan(49.38);
            expect(lat, c.id).toBeLessThan(49.44);
            expect(lng, c.id).toBeGreaterThan(8.65);
            expect(lng, c.id).toBeLessThan(8.75);
          }
          if (cp.coordinates) {
            const key = `${cp.coordinates.lat},${cp.coordinates.lng}`;
            expect(seen.has(key), `${c.id} duplicate ${key}`).toBe(false);
            seen.add(key);
          }
        }
      });

      it('uses at least six different puzzle types', () => {
        expect(new Set(a.chapters.map((c) => c.puzzle.type)).size).toBeGreaterThanOrEqual(6);
      });

      it('only rewards items that exist, and inventory puzzles come after their items', () => {
        const ids = new Set(a.items.map((i) => i.id));
        const collected: string[] = [];
        for (const c of a.chapters) {
          if (c.puzzle.fromInventory || c.puzzle.type === 'deduction') expect(collected.length).toBeGreaterThan(0);
          if (c.reward) {
            expect(ids.has(c.reward)).toBe(true);
            collected.push(c.reward);
          }
        }
        for (const combo of a.combinations ?? []) {
          for (const id of combo.from.split('+')) expect(ids.has(id)).toBe(true);
          expect(ids.has(combo.to)).toBe(true);
        }
      });

      it('every person appears in a real chapter, and interviews and suspects name real people', () => {
        const chapterIds = a.chapters.map((c) => c.id);
        const peopleIds = new Set(a.people.map((p) => p.id));
        for (const person of a.people) {
          expect(chapterIds).toContain(person.appears);
          for (const n of person.notes) expect(chapterIds).toContain(n.after);
        }
        for (const c of a.chapters) {
          if (c.puzzle.interview) expect(peopleIds.has(c.puzzle.interview.person)).toBe(true);
          if (c.puzzle.type === 'deduction') for (const s of c.puzzle.choices ?? []) expect(peopleIds.has(s.id), s.id).toBe(true);
        }
      });

      it('choice puzzles have choices and the ending at least two decisions', () => {
        for (const c of a.chapters) if (['logic', 'multiple-choice', 'interrogate', 'deduction'].includes(c.puzzle.type)) expect(c.puzzle.choices?.length).toBeGreaterThan(1);
        expect(a.ending.decision.choices.length).toBeGreaterThanOrEqual(2);
      });
    });
  }

  it('the order puzzle is shown scrambled, and solves to its accepted order', () => {
    const ledger = adventures.find((a) => a.slug === 'neckar-ring')!.chapters.find((c) => c.id === 'ledger')!;
    const shown = ledger.puzzle.pieces!.map((x) => x.id).join('');
    expect(shown).not.toBe('bacd');
    expect([...shown].sort().join('')).toBe('abcd');
  });

  it('the cipher-wheel letter decodes with the key the story gives (five hallmarks)', () => {
    const letter = adventures.find((a) => a.slug === 'neckar-ring')!.chapters.find((c) => c.id === 'letter')!;
    const n = (l: 'de' | 'en' | 'ar') => ALPHABETS[l].length;
    expect(caesar(letter.puzzle.material!.en[0]!, n('en') - 5, ALPHABETS.en)).toBe('FORGIVE ME. I WAS AFRAID.');
    expect(caesar(letter.puzzle.material!.de[0]!, n('de') - 5, ALPHABETS.de)).toBe('VERZEIH MIR. ICH HATTE ANGST.');
    expect(caesar(letter.puzzle.material!.ar[0]!, n('ar') - 5, ALPHABETS.ar)).toBe('سامحني لقد خفت');
    expect(caesar(letter.puzzle.material!.nl[0]!, 26 - 5, ALPHABETS.nl)).toBe('VERGEEF ME. IK WAS BANG.');
  });

  it('accepts the Dutch answers', () => {
    expect(check('lost-manuscript', 'message', 'de toren')).toEqual(yes);
    expect(check('lost-manuscript', 'study', 'Kist bij de rivier')).toEqual(yes);
    expect(check('lost-manuscript', 'mirror', 'Verhalen')).toEqual(yes);
    expect(check('neckar-ring', 'whispers', 'een boekbinder')).toEqual(yes);
    expect(check('neckar-ring', 'letter', 'Vergeef me')).toEqual(yes);
  });

  it('the Morse signal spells the accepted code', () => {
    const signal = adventures.find((a) => a.slug === 'lost-manuscript')!.chapters.find((c) => c.id === 'signal')!;
    const byCode = Object.fromEntries(Object.entries(MORSE_DIGITS).map(([d, m]) => [m, d]));
    const digits = signal.puzzle.morse!.split(' ').map((m) => byCode[m]).join('');
    expect(answerKeys['lost-manuscript']!['signal']!.accepted).toContain(digits);
  });
});
