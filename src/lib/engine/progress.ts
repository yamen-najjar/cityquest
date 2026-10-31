// The game state machine. Pure functions only: the same reducer runs against localStorage today and
// against a server-saved progress row in Phase 2, and the tests drive it directly.

export type Stage = 'travel' | 'puzzle' | 'solved';

/**
 * Difficulty, chosen at the start. relaxed: hints cost nothing; classic: hints cost experience;
 * expert: no hints at all and the timer is always shown.
 */
export type Mode = 'relaxed' | 'classic' | 'expert';
export const MODES: Mode[] = ['relaxed', 'classic', 'expert'];

export interface Team {
  name: string;
  players: number;
}

export interface Progress {
  /** 2: the eight-chapter stories. A version 1 save is from the old five-chapter ones and starts over. */
  version: 2;
  adventure: string;
  mode: Mode;
  /** Index of the current chapter. Equal to chapterCount once every chapter is solved. */
  chapter: number;
  stage: Stage;
  solved: string[];
  inventory: string[];
  hintsUsed: Record<string, number>;
  wrongAttempts: Record<string, number>;
  /** Interrogation questions already asked, per chapter; the journal keeps the transcript. */
  asked: Record<string, string[]>;
  /** The player's own notes, from the journal. */
  notes: string;
  decision: string | null;
  team: Team;
  startedAt: number;
  finishedAt: number | null;
  /** Total of time spent playing, so a resumed game does not count the hours it sat closed. */
  elapsedMs: number;
  lastActiveAt: number;
}

export type Action =
  | { type: 'arrive' }
  | { type: 'wrong'; chapterId: string }
  | { type: 'hint'; chapterId: string; available: number }
  | { type: 'ask'; chapterId: string; questionId: string }
  | { type: 'solve'; chapterId: string; reward?: string }
  | { type: 'combine'; from: string[]; to: string }
  | { type: 'notes'; text: string }
  | { type: 'next'; chapterCount: number }
  | { type: 'decide'; choiceId: string; chapterCount: number; now: number }
  | { type: 'tick'; now: number }
  | { type: 'team'; team: Team };

export const MAX_TEAM = 5;
export const MAX_NOTES = 4000;

export function newProgress(adventure: string, team: Team, now: number, mode: Mode = 'classic'): Progress {
  return {
    version: 2,
    adventure,
    mode,
    chapter: 0,
    stage: 'travel',
    solved: [],
    inventory: [],
    hintsUsed: {},
    wrongAttempts: {},
    asked: {},
    notes: '',
    decision: null,
    team: clampTeam(team),
    startedAt: now,
    finishedAt: null,
    elapsedMs: 0,
    lastActiveAt: now,
  };
}

export function clampTeam(team: Team): Team {
  const players = Math.min(MAX_TEAM, Math.max(1, Math.round(Number(team.players) || 1)));
  return { name: team.name.trim().slice(0, 40), players };
}

/** Gaps longer than this (the phone locked, the tab closed) are not counted as playing time. */
const IDLE_GAP_MS = 5 * 60 * 1000;

export function reduce(p: Progress, a: Action): Progress {
  switch (a.type) {
    case 'arrive':
      return p.stage === 'travel' ? { ...p, stage: 'puzzle' } : p;
    case 'wrong':
      return {
        ...p,
        wrongAttempts: { ...p.wrongAttempts, [a.chapterId]: (p.wrongAttempts[a.chapterId] ?? 0) + 1 },
      };
    case 'hint': {
      if (p.mode === 'expert') return p;
      const used = p.hintsUsed[a.chapterId] ?? 0;
      if (used >= a.available) return p;
      return { ...p, hintsUsed: { ...p.hintsUsed, [a.chapterId]: used + 1 } };
    }
    case 'ask': {
      const asked = p.asked[a.chapterId] ?? [];
      if (asked.includes(a.questionId)) return p;
      return { ...p, asked: { ...p.asked, [a.chapterId]: [...asked, a.questionId] } };
    }
    case 'solve': {
      if (p.solved.includes(a.chapterId)) return p;
      const inventory = a.reward && !p.inventory.includes(a.reward) ? [...p.inventory, a.reward] : p.inventory;
      return { ...p, stage: 'solved', solved: [...p.solved, a.chapterId], inventory };
    }
    case 'combine': {
      if (!a.from.every((id) => p.inventory.includes(id)) || p.inventory.includes(a.to)) return p;
      return { ...p, inventory: [...p.inventory.filter((id) => !a.from.includes(id)), a.to] };
    }
    case 'notes':
      return { ...p, notes: a.text.slice(0, MAX_NOTES) };
    case 'next':
      if (p.stage !== 'solved') return p;
      return { ...p, chapter: Math.min(p.chapter + 1, a.chapterCount), stage: 'travel' };
    case 'decide':
      if (p.decision || p.chapter < a.chapterCount) return p;
      return { ...p, decision: a.choiceId, finishedAt: a.now };
    case 'tick': {
      if (p.finishedAt) return p;
      const gap = a.now - p.lastActiveAt;
      const add = gap > 0 && gap < IDLE_GAP_MS ? gap : 0;
      return { ...p, elapsedMs: p.elapsedMs + add, lastActiveAt: a.now };
    }
    case 'team':
      return { ...p, team: clampTeam(a.team) };
  }
}

export function isFinished(p: Progress): boolean {
  return p.decision !== null;
}

export function totalHints(p: Progress): number {
  return Object.values(p.hintsUsed).reduce((a, b) => a + b, 0);
}

/** How close a pursuer is: 0 with no hints, one level nearer for every two hints, capped at the last level. */
export function pursuitLevel(hints: number, levels: number): number {
  return Math.max(0, Math.min(levels - 1, Math.ceil(hints / 2)));
}

/** Combined pieces of a key are looked up in sorted order, so "b+a" and "a+b" are the same pair. */
export function combinationKey(ids: string[]): string {
  return [...ids].sort().join('+');
}

/**
 * Stars for a solved chapter: three without hints or wrong answers, two with at most one hint and two
 * wrong answers, one otherwise. 0 while unsolved.
 */
export function starsFor(p: Progress, chapterId: string): 0 | 1 | 2 | 3 {
  if (!p.solved.includes(chapterId)) return 0;
  const hints = p.hintsUsed[chapterId] ?? 0;
  const wrong = p.wrongAttempts[chapterId] ?? 0;
  if (hints === 0 && wrong === 0) return 3;
  if (hints <= 1 && wrong <= 2) return 2;
  return 1;
}

export function totalStars(p: Progress): number {
  return p.solved.reduce((s, id) => s + starsFor(p, id), 0);
}

/** 0-3: Rookie, Investigator, Detective, Master detective, by the share of stars earned. */
export function rankFor(stars: number, chapters: number): 0 | 1 | 2 | 3 {
  const share = chapters ? stars / (chapters * 3) : 0;
  if (share >= 0.9) return 3;
  if (share >= 0.7) return 2;
  if (share >= 0.45) return 1;
  return 0;
}

/** Experience: 100 a chapter, 15 less a hint in classic mode (never below 40), 25 a star, 200 for finishing. */
export function xpFor(p: Progress): number {
  let xp = 0;
  const hintCost = p.mode === 'classic' ? 15 : 0;
  for (const id of p.solved) xp += Math.max(40, 100 - hintCost * (p.hintsUsed[id] ?? 0)) + 25 * starsFor(p, id);
  if (isFinished(p)) xp += p.mode === 'expert' ? 300 : 200;
  return xp;
}

const MODES_SET = new Set<string>(MODES);

/** Accepts only a well-formed saved object; anything else (an old version, a hand-edited value) starts over. */
export function parseProgress(raw: unknown, adventure: string): Progress | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<Progress>;
  if (p.version !== 2 || p.adventure !== adventure) return null;
  if (typeof p.chapter !== 'number' || !['travel', 'puzzle', 'solved'].includes(p.stage as string)) return null;
  if (!Array.isArray(p.solved) || !Array.isArray(p.inventory)) return null;
  if (!p.team || typeof p.team.name !== 'string') return null;
  return {
    ...(p as Progress),
    mode: MODES_SET.has(p.mode as string) ? (p.mode as Mode) : 'classic',
    hintsUsed: p.hintsUsed ?? {},
    wrongAttempts: p.wrongAttempts ?? {},
    asked: p.asked ?? {},
    notes: typeof p.notes === 'string' ? p.notes.slice(0, MAX_NOTES) : '',
    decision: p.decision ?? null,
    finishedAt: p.finishedAt ?? null,
    elapsedMs: p.elapsedMs ?? 0,
    // Guard against a non-finite value (corrupt or hand-edited remote data): a NaN here would make every
    // merge comparison fall through, so clamp it to a usable timestamp.
    lastActiveAt: Number.isFinite(p.lastActiveAt) ? (p.lastActiveAt as number) : Date.now(),
  };
}
