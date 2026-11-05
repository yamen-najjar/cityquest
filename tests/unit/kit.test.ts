import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { answerKeys } from '@/content/answers.server';
import { checkAnswer } from '@/lib/engine/check.server';
import { confrontAnswer, documentsHeld, inbox, timelineAnswer, unlocked, unread, visibleLeads } from '@/lib/engine/kit';
import { newProgress, parseProgress, reduce, xpFor, type Progress } from '@/lib/engine/progress';

const team = { name: 'Owls', players: 2 };
const withKit = adventures.filter((a) => a.phone?.length);

function solvedThrough(slug: string, last: string): Progress {
  const a = getAdventure(slug)!;
  let p = newProgress(slug, team, 1);
  for (const c of a.chapters) {
    p = reduce(reduce(p, { type: 'arrive' }), { type: 'solve', chapterId: c.id, reward: c.reward });
    if (c.id === last) return p;
    p = reduce(p, { type: 'next', chapterCount: a.chapters.length });
  }
  return p;
}

describe('investigation kit content', () => {
  it('exists for The Lost Manuscript', () => {
    expect(withKit.map((a) => a.slug)).toContain('lost-manuscript');
  });

  for (const a of withKit) {
    describe(a.slug, () => {
      const chapters = new Set(a.chapters.map((c) => c.id));
      const people = new Set(a.people.map((x) => x.id));
      const docs = new Map((a.documents ?? []).map((d) => [d.id, d]));
      const secretIds = new Set((a.secrets ?? []).map((s) => s.id));
      const validTrigger = (w: string) =>
        w === 'start' ||
        chapters.has(w) ||
        (w.startsWith('board:') && (a.board ?? []).some((q) => `board:${q.id}` === w)) ||
        (w.startsWith('lead:') && (a.leads ?? []).some((l) => `lead:${l.id}` === w)) ||
        (w.startsWith('choice:') && a.chapters.some((c) => c.choice?.options.some((o) => `choice:${c.id}:${o.id}` === w)));

      it('every message comes from a real person (or a withheld number), on a real trigger, with real attachments', () => {
        const ids = new Set<string>();
        for (const m of a.phone!) {
          expect(ids.has(m.id), m.id).toBe(false);
          ids.add(m.id);
          expect(m.from === 'unknown' || people.has(m.from), m.id).toBe(true);
          expect(validTrigger(m.when), `${m.id}: ${m.when}`).toBe(true);
          if (m.document) expect(docs.has(m.document), m.id).toBe(true);
          if (m.page) expect((a.pages ?? []).some((pg) => pg.id === m.page), m.id).toBe(true);
          if (m.kind === 'call') expect(m.lines?.length, m.id).toBeGreaterThan(0);
          if (m.kind === 'web') expect(m.page, m.id).toBeTruthy();
          if (m.replies) expect(m.replies.length, m.id).toBeGreaterThanOrEqual(2);
        }
      });

      it('every lead is answerable on the server, and its answer points at real content', () => {
        for (const l of a.leads ?? []) {
          expect(chapters.has(l.after), l.id).toBe(true);
          expect(l.hints, l.id).toHaveLength(3);
          const accepted = answerKeys[a.slug]?.[`lead:${l.id}`]?.accepted ?? [];
          expect(accepted.length, l.id).toBeGreaterThan(0);
          for (const d of l.documents ?? []) expect(docs.has(d), `${l.id}: ${d}`).toBe(true);
          if (l.kind === 'confront') {
            expect(l.person && people.has(l.person) && l.claim, l.id).toBeTruthy();
            for (const ans of accepted) {
              const [docId, row] = ans.split(':');
              expect(l.documents, `${l.id}: ${ans}`).toContain(docId);
              expect(docs.get(docId!)!.rows[Number(row)], `${l.id}: ${ans}`).toBeTruthy();
            }
          }
          if (l.kind === 'timeline') {
            const ids = l.events!.map((e) => e.id);
            for (const ans of accepted) expect([...ans].sort().join(''), l.id).toBe([...ids].sort().join(''));
            expect(timelineAnswer(ids), `${l.id} is shown already solved`).not.toBe(accepted[0]);
          }
          if (l.kind === 'echo') expect(l.echo, l.id).toBeTruthy();
          if (l.kind === 'listen') expect(l.recording?.some((r) => r.quiet), l.id).toBe(true);
        }
      });

      it('every secret can be found, and every place that hides one names a real secret', () => {
        const hidden = [
          ...(a.documents ?? []).flatMap((d) => d.rows.flatMap((r) => (r.secret ? [r.secret] : []))),
          ...(a.leads ?? []).flatMap((l) => (l.echo?.secret ? [l.echo.secret.id] : [])),
        ];
        for (const s of hidden) expect(secretIds.has(s), s).toBe(true);
        for (const s of secretIds) expect(hidden, s).toContain(s);
      });
    });
  }
});

describe('investigation kit rules', () => {
  const a = getAdventure('lost-manuscript')!;

  it('messages arrive with the story, never ahead of it', () => {
    const start = newProgress(a.slug, team, 1);
    expect(inbox(a, start).map((m) => m.when)).toEqual(['start']);
    const later = solvedThrough(a.slug, 'witnesses');
    expect(inbox(a, later).every((m) => unlocked(later, m.when))).toBe(true);
    expect(inbox(a, later).some((m) => m.when === 'study')).toBe(false);
    expect(unread(a, later).length).toBe(inbox(a, later).length);
    const read = reduce(later, { type: 'read', ids: inbox(a, later).map((m) => m.id) });
    expect(unread(a, read)).toEqual([]);
  });

  it('documents come with the messages and leads that hand them over', () => {
    expect(documentsHeld(a, newProgress(a.slug, team, 1))).toEqual([]);
    expect(documentsHeld(a, solvedThrough(a.slug, 'witnesses')).map((d) => d.id)).toContain('duty-log');
    expect(visibleLeads(a, solvedThrough(a.slug, 'witnesses')).map((l) => l.id)).toEqual(['anna-alibi']);
  });

  it('replies, leads and secrets are recorded once, saved, and worth experience', () => {
    let p = solvedThrough(a.slug, 'witnesses');
    const before = xpFor(p);
    p = reduce(p, { type: 'reply', messageId: 'clara-log', replyId: 'why' });
    p = reduce(p, { type: 'reply', messageId: 'clara-log', replyId: 'safe' });
    p = reduce(p, { type: 'lead', leadId: 'anna-alibi' });
    p = reduce(p, { type: 'lead', leadId: 'anna-alibi' });
    p = reduce(p, { type: 'discover', secretId: 'lantern-mark' });
    expect(p.replies).toEqual({ 'clara-log': 'why' });
    expect(p.leadsSolved).toEqual(['anna-alibi']);
    expect(xpFor(p)).toBe(before + 40 + 20);
    const saved = parseProgress(JSON.parse(JSON.stringify(p)), a.slug)!;
    expect([saved.replies, saved.leadsSolved, saved.secrets]).toEqual([p.replies, p.leadsSolved, p.secrets]);
  });

  it('the server checks lead answers', () => {
    const check = (id: string, answer: string) => checkAnswer('lost-manuscript', { chapterId: `lead:${id}`, answer });
    expect(check('anna-alibi', confrontAnswer('duty-log', 0))).toEqual({ ok: true, correct: true });
    expect(check('anna-alibi', confrontAnswer('duty-log', 1))).toEqual({ ok: true, correct: false });
    expect(check('night', timelineAnswer(['k', 'a', 't', 'g']))).toEqual({ ok: true, correct: true });
    expect(check('night', timelineAnswer(['t', 'g', 'k', 'a']))).toEqual({ ok: true, correct: false });
    expect(check('house', 'vii')).toEqual({ ok: true, correct: true });
    expect(check('voicemail', 'Mitternacht')).toEqual({ ok: true, correct: true });
    expect(check('nope', 'x')).toMatchObject({ ok: false, status: 404 });
  });
});
