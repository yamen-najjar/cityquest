import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { contextOf, earned } from '@/lib/engine/achievements';
import { checkAnswer } from '@/lib/engine/check.server';
import { newProgress, parseProgress, reduce, xpFor } from '@/lib/engine/progress';
import { decodeReport, encodeReport, gradeReport, REPORT_CONFIRM } from '@/lib/engine/report';

describe('grading a case report', () => {
  const key = 'a=1;b=2;c=3;d=4;e=5';
  it('confirms nothing below three right answers, then names exactly the right ones', () => {
    expect(gradeReport('a=1;b=2;c=9;d=9;e=9', key)).toEqual({ correct: false, confirmed: [] });
    expect(gradeReport('a=1;b=2;c=3;d=9;e=9', key)).toEqual({ correct: false, confirmed: ['a', 'b', 'c'] });
    expect(gradeReport('e=5;d=4;c=3;b=2;a=1', key)).toEqual({ correct: true, confirmed: ['a', 'b', 'c', 'd', 'e'] });
    expect(REPORT_CONFIRM).toBe(3);
  });
  it('encodes picks independent of order', () => {
    expect(encodeReport({ b: '2', a: '1' })).toBe('a=1;b=2');
    expect(decodeReport('a=1;;b=2;junk')).toEqual({ a: '1', b: '2' });
  });
});

describe('case reports in the stories', () => {
  for (const a of adventures) {
    it(`${a.slug}: trying one question at a time reveals nothing (no slot-by-slot guessing)`, () => {
      expect(a.report!.slots.length).toBeGreaterThanOrEqual(5);
      // A script trying each option of each question on its own never gets a confirmation back.
      const truth: Record<string, string> = {};
      for (const s of a.report!.slots) {
        for (const o of s.options) {
          const r = checkAnswer(a.slug, { chapterId: 'report', answer: encodeReport({ ...truth, [s.id]: o.id }) });
          if (r.ok && r.confirmed?.includes(s.id)) truth[s.id] = o.id;
        }
      }
      // With fewer than three right nothing is ever confirmed, so the brute force above must fail early on.
      expect(Object.keys(truth).length).toBe(0);
    });
  }

  it('the right report solves the case; three right answers confirm three; two confirm nothing', () => {
    const r = (answer: string) => checkAnswer('het-duivelshuis', { chapterId: 'report', answer });
    expect(r('ledger=names;proof=glove;since=gate;who=koster;why=sell')).toMatchObject({ ok: true, correct: true });
    expect(r('ledger=names;proof=glove;since=gate;who=bram;why=protect')).toMatchObject({ ok: true, correct: false, confirmed: ['ledger', 'proof', 'since'] });
    expect(r('ledger=names;proof=glove;since=river;who=bram;why=protect')).toMatchObject({ ok: true, correct: false, confirmed: [] });
  });
});

describe('the case report in a save', () => {
  const a = getAdventure('lost-manuscript')!;
  it('picks, confirmations and the outcome are kept; confirmed slots lock; a solved report earns XP and Case closed', () => {
    let p = newProgress(a.slug, { name: 'Owls', players: 2 }, 1);
    p = reduce(p, { type: 'reportPick', slotId: 'who', optionId: 'kehl' });
    p = reduce(p, { type: 'reportResult', confirmed: ['who'], solved: false });
    p = reduce(p, { type: 'reportPick', slotId: 'who', optionId: 'ben' });
    expect(p.reportPicks.who).toBe('kehl');
    expect(p.reportTries).toBe(1);
    const before = xpFor(p);
    p = reduce(p, { type: 'reportResult', confirmed: ['why'], solved: true });
    expect(p.reportDone).toBe('solved');
    expect(xpFor(p)).toBe(before + 100);
    expect(earned(p, contextOf(a))).toContain('case-closed');
    expect(reduce(p, { type: 'reportReveal' }).reportDone).toBe('solved');
    const saved = parseProgress(JSON.parse(JSON.stringify(p)), a.slug)!;
    expect([saved.reportPicks, saved.reportConfirmed, saved.reportTries, saved.reportDone]).toEqual([p.reportPicks, p.reportConfirmed, p.reportTries, 'solved']);
  });
  it('giving up shows the truth but earns nothing', () => {
    const p = reduce(newProgress(a.slug, { name: 'Owls', players: 2 }, 1), { type: 'reportReveal' });
    expect(p.reportDone).toBe('revealed');
    expect(earned(p, contextOf(a))).not.toContain('case-closed');
  });
});
