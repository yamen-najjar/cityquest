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
  /** Evidence-board questions answered, by question id. */
  deductions: string[];
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
  | { type: 'deduce'; questionId: string }
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
    deductions: [],
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
    case 'deduce':
      return p.deductions.includes(a.questionId) ? p : { ...p, deductions: [...p.deductions, a.questionId] };
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

/** Experience: 100 a chapter, 15 less a hint in classic mode (never below 40), 25 a star, 30 a deduction on the evidence board, 200 for finishing. */
export function xpFor(p: Progress): number {
  let xp = 0;
  const hintCost = p.mode === 'classic' ? 15 : 0;
  for (const id of p.solved) xp += Math.max(40, 100 - hintCost * (p.hintsUsed[id] ?? 0)) + 25 * starsFor(p, id);
  xp += 30 * p.deductions.length;
  if (isFinished(p)) xp += p.mode === 'expert' ? 300 : 200;
  return xp;
}

const MODES_SET = new Set<string>(MODES);
const STAGES = new Set<string>(['travel', 'puzzle', 'solved']);
/** Ids in a save are short slugs; anything longer is not ours. */
const ID_MAX = 80;
/** No adventure has anywhere near this many chapters, items or questions; caps what a bad save can hold. */
const LIST_MAX = 200;

const isId = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= ID_MAX;
const isTime = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

/** Unique ids, in order, dropping anything that is not one. */
function idList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter(isId))].slice(0, LIST_MAX);
}

/** { id: count } with whole, non-negative counts only. */
function counts(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [k, n] of Object.entries(v).slice(0, LIST_MAX)) {
    if (isId(k) && typeof n === 'number' && Number.isInteger(n) && n >= 0) out[k] = Math.min(n, 1_000_000);
  }
  return out;
}

/** { chapterId: [questionId, …] }. */
function askedMap(v: unknown): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [k, ids] of Object.entries(v).slice(0, LIST_MAX)) if (isId(k)) out[k] = idList(ids);
  return out;
}

/**
 * Accepts only a well-formed saved object; anything else (an old version, a hand-edited value) starts over.
 * The core fields must be right, or the save is refused; the rest is repaired field by field (a wrong type
 * becomes its empty value), so one bad field cannot crash the game or poison every later calculation.
 */
export function parseProgress(raw: unknown, adventure: string): Progress | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const p = raw as Record<string, unknown>;
  if (p.version !== 2 || p.adventure !== adventure) return null;
  if (typeof p.chapter !== 'number' || !Number.isInteger(p.chapter) || p.chapter < 0 || p.chapter > LIST_MAX) return null;
  if (!STAGES.has(p.stage as string)) return null;
  if (!Array.isArray(p.solved) || !Array.isArray(p.inventory)) return null;
  const team = p.team as Partial<Team> | null | undefined;
  if (!team || typeof team !== 'object' || typeof team.name !== 'string') return null;

  const now = Date.now();
  const startedAt = isTime(p.startedAt) ? p.startedAt : now;
  return {
    version: 2,
    adventure,
    mode: MODES_SET.has(p.mode as string) ? (p.mode as Mode) : 'classic',
    chapter: p.chapter,
    stage: p.stage as Stage,
    solved: idList(p.solved),
    inventory: idList(p.inventory),
    hintsUsed: counts(p.hintsUsed),
    wrongAttempts: counts(p.wrongAttempts),
    asked: askedMap(p.asked),
    notes: typeof p.notes === 'string' ? p.notes.slice(0, MAX_NOTES) : '',
    // Older saves have no board yet: an empty one.
    deductions: idList(p.deductions),
    decision: isId(p.decision) ? p.decision : null,
    team: clampTeam({ name: team.name, players: Number(team.players) }),
    startedAt,
    finishedAt: isTime(p.finishedAt) ? p.finishedAt : null,
    elapsedMs: isTime(p.elapsedMs) ? p.elapsedMs : 0,
    // A non-finite value here would make every merge comparison fall through, so use a usable timestamp.
    lastActiveAt: isTime(p.lastActiveAt) ? p.lastActiveAt : startedAt,
  };
}

/**
 * Fits a parsed save to the adventure as it exists now: drops chapter and item ids it no longer has and
 * keeps the chapter index in range. Without this, a save with a chapter index past the end (corrupt, or
 * from an edited story) skipped straight to the finale.
 */
export function fitToAdventure(p: Progress, chapterIds: readonly string[], itemIds: readonly string[], boardIds: readonly string[] = []): Progress {
  const chapters = new Set(chapterIds);
  const items = new Set(itemIds);
  const solved = p.solved.filter((id) => chapters.has(id));
  const count = chapterIds.length;
  // The furthest a save can honestly be: the first chapter not yet solved, or the end if all are.
  const firstOpen = chapterIds.findIndex((id) => !solved.includes(id));
  const reachable = firstOpen === -1 ? count : firstOpen;
  const chapter = Math.min(p.chapter, reachable);
  let stage = p.stage;
  // Pulled back to the first open chapter: start it from its checkpoint.
  if (chapter === count || chapter < p.chapter) stage = 'travel';
  else if (stage === 'solved' && !solved.includes(chapterIds[chapter]!)) stage = 'puzzle';
  const finished = p.decision !== null && chapter === count;
  return {
    ...p,
    chapter,
    stage,
    solved,
    inventory: p.inventory.filter((id) => items.has(id)),
    deductions: p.deductions.filter((id) => boardIds.includes(id)),
    decision: finished ? p.decision : null,
    finishedAt: finished ? p.finishedAt : null,
  };
}
