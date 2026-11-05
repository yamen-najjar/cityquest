import { describe, expect, it } from 'vitest';
import { adventures, getAdventure } from '@/content/adventures';
import { inbox, inSeason, trustWith } from '@/lib/engine/kit';
import { newProgress, reduce, type Progress } from '@/lib/engine/progress';

const a = getAdventure('lost-manuscript')!;
const OFF = new Date(2026, 5, 15);
const HALLOWEEN = new Date(2026, 9, 31);
const CHRISTMAS = new Date(2026, 11, 24);

function at(solved: string[], replies: Record<string, string> = {}): Progress {
  let p = newProgress(a.slug, { name: 'Owls', players: 2 }, 1);
  p = { ...p, solved };
  for (const [messageId, replyId] of Object.entries(replies)) p = reduce(p, { type: 'reply', messageId, replyId });
  return p;
}

describe('seasons', () => {
  it('Halloween is 25 October to 2 November; winter is December to 6 January', () => {
    expect([new Date(2026, 9, 24), new Date(2026, 9, 25), new Date(2026, 10, 2), new Date(2026, 10, 3)].map((d) => inSeason('halloween', d))).toEqual([false, true, true, false]);
    expect([new Date(2026, 10, 30), CHRISTMAS, new Date(2027, 0, 6), new Date(2027, 0, 7)].map((d) => inSeason('winter', d))).toEqual([false, true, true, false]);
  });
  it('a seasonal message arrives only in its season, and stays once read', () => {
    const ids = (p: Progress, d: Date) => inbox(a, p, d).map((m) => m.id);
    const p = at([]);
    expect(ids(p, OFF)).not.toContain('vii-halloween');
    expect(ids(p, HALLOWEEN)).toContain('vii-halloween');
    expect(ids(p, HALLOWEEN)).not.toContain('vii-winter');
    expect(ids(p, CHRISTMAS)).toContain('vii-winter');
    expect(ids({ ...p, phoneRead: ['vii-halloween'] }, OFF)).toContain('vii-halloween');
  });
});

describe('trust', () => {
  it('a warm reply earns trust, and trust brings a message that a cold one does not', () => {
    const warm = at(['message', 'witnesses', 'clockmaker'], { 'clara-log': 'safe' });
    const neutral = at(['message', 'witnesses', 'clockmaker'], { 'clara-log': 'why' });
    expect(trustWith(a, warm, 'clara')).toBe(1);
    expect(trustWith(a, neutral, 'clara')).toBe(0);
    expect(inbox(a, warm, OFF).map((m) => m.id)).toContain('clara-bonus');
    expect(inbox(a, neutral, OFF).map((m) => m.id)).not.toContain('clara-bonus');
  });
  it('the Neckar Ring: Mira writes differently to a team that trusts her and one that does not', () => {
    const ring = getAdventure('neckar-ring')!;
    const base = { ...newProgress(ring.slug, { name: 'X', players: 2 }, 1), solved: ring.chapters.slice(0, 5).map((c) => c.id) };
    const ids = (replyId: string) => inbox(ring, reduce(base, { type: 'reply', messageId: 'mira-windows', replyId }), OFF).map((m) => m.id);
    expect(ids('how')).toContain('mira-bonus');
    expect(ids('how')).not.toContain('mira-cold');
    expect(ids('trust')).toContain('mira-cold');
    expect(ids('trust')).not.toContain('mira-bonus');
  });
  it('every story has walks, trust and both seasons', () => {
    for (const s of adventures) {
      expect(s.chapters.slice(1).every((c) => c.walk?.length), s.slug).toBe(true);
      expect(s.phone!.some((m) => m.trust), s.slug).toBe(true);
      expect(new Set(s.phone!.flatMap((m) => (m.season ? [m.season] : [])))).toEqual(new Set(['halloween', 'winter']));
    }
  });
});
