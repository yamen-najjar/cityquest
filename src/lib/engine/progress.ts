// The game state machine. Pure functions only: the same reducer runs against localStorage today and
// against a server-saved progress row in Phase 2, and the tests drive it directly.

export type Stage = 'travel' | 'puzzle' | 'solved';

/**
 * Difficulty, chosen at the start. junior: like relaxed, with each puzzle explained for young detectives; relaxed: hints cost nothing; classic: hints cost experience;
 * expert: no hints at all and the timer is always shown.
 */
export type Mode = 'junior' | 'relaxed' | 'classic' | 'expert';
export const MODES: Mode[] = ['junior', 'relaxed', 'classic', 'expert'];

/** Modes in which the pursuer only threatens and never catches: junior (young detectives) and relaxed. */
export function gentle(mode: Mode): boolean {
  return mode === 'junior' || mode === 'relaxed';
}

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
  /** Story choices made, as chapterId -> optionId. */
  choices: Record<string, string>;
  /** Times the pursuer caught the team (0-2; the second time the case is lost). */
  caught: number;
  /** Steps the pursuer was pushed back after catching the team, so the danger starts over from there. */
  relief: number;
  /** The item the pursuer took at the first catch, until the team wins it back. */
  seized: string | null;
  /** The first catch is being dealt with (the recovery puzzle is open). */
  recovering: boolean;
  /** Phone messages already seen, by id. */
  phoneRead: string[];
  /** Replies sent on the phone, as messageId -> replyId. */
  replies: Record<string, string>;
  /** Leads followed up (solved), by id. */
  leadsSolved: string[];
  /** Secrets found, by id. */
  secrets: string[];
  /** The case report: the options picked so far, the slots the game confirmed, tries, and how it ended. */
  reportPicks: Record<string, string>;
  reportConfirmed: string[];
  reportTries: number;
  reportDone: 'solved' | 'revealed' | null;
  /** The second truth this game tells (a variant id), or null for the original. */
  variant: string | null;
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
  | { type: 'choose'; chapterId: string; optionId: string }
  | { type: 'caught'; now: number }
  | { type: 'recover' }
  | { type: 'read'; ids: string[] }
  | { type: 'reply'; messageId: string; replyId: string }
  | { type: 'lead'; leadId: string }
  | { type: 'discover'; secretId: string }
  | { type: 'reportPick'; slotId: string; optionId: string }
  | { type: 'reportResult'; confirmed: string[]; solved: boolean }
  | { type: 'reportReveal' }
  | { type: 'next'; chapterCount: number }
  | { type: 'decide'; choiceId: string; chapterCount: number; now: number }
  | { type: 'tick'; now: number }
  | { type: 'team'; team: Team };

export const MAX_TEAM = 5;
export const MAX_NOTES = 4000;

export function newProgress(adventure: string, team: Team, now: number, mode: Mode = 'classic', variant: string | null = null): Progress {
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
    choices: {},
    caught: 0,
    relief: 0,
    seized: null,
    recovering: false,
    phoneRead: [],
    replies: {},
    leadsSolved: [],
    secrets: [],
    reportPicks: {},
    reportConfirmed: [],
    reportTries: 0,
    reportDone: null,
    variant,
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
    case 'choose':
      // Made once, after the chapter is solved; a choice is never changed afterwards.
      if (!p.solved.includes(a.chapterId) || p.choices[a.chapterId]) return p;
      return { ...p, choices: { ...p.choices, [a.chapterId]: a.optionId } };
    case 'caught': {
      if (p.decision || p.caught >= 2) return p;
      if (p.caught === 1) return { ...p, caught: 2, recovering: false, decision: LOST, finishedAt: a.now };
      // First catch: the pursuer takes the newest item and falls back to the second level.
      const item = p.inventory.at(-1) ?? null;
      return {
        ...p,
        caught: 1,
        recovering: true,
        seized: item,
        inventory: item ? p.inventory.slice(0, -1) : p.inventory,
        relief: p.relief + Math.max(0, pressure(p) - 2),
      };
    }
    case 'recover':
      if (!p.recovering) return p;
      return { ...p, recovering: false, seized: null, inventory: p.seized && !p.inventory.includes(p.seized) ? [...p.inventory, p.seized] : p.inventory };
    case 'read': {
      const fresh = a.ids.filter((id) => !p.phoneRead.includes(id));
      return fresh.length ? { ...p, phoneRead: [...p.phoneRead, ...fresh] } : p;
    }
    case 'reply':
      // One answer per message; what was said stays said.
      return p.replies[a.messageId] ? p : { ...p, replies: { ...p.replies, [a.messageId]: a.replyId } };
    case 'lead':
      return p.leadsSolved.includes(a.leadId) ? p : { ...p, leadsSolved: [...p.leadsSolved, a.leadId] };
    case 'reportPick':
      // A confirmed slot is settled; the rest stay open until the report is done.
      if (p.reportDone || p.reportConfirmed.includes(a.slotId)) return p;
      return { ...p, reportPicks: { ...p.reportPicks, [a.slotId]: a.optionId } };
    case 'reportResult':
      if (p.reportDone) return p;
      return {
        ...p,
        reportTries: p.reportTries + 1,
        reportConfirmed: [...new Set([...p.reportConfirmed, ...a.confirmed])],
        reportDone: a.solved ? 'solved' : null,
      };
    case 'reportReveal':
      return p.reportDone ? p : { ...p, reportDone: 'revealed' };
    case 'discover':
      return p.secrets.includes(a.secretId) ? p : { ...p, secrets: [...p.secrets, a.secretId] };
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

/** Whether the team made the story choice "chapterId:optionId". Content without a condition always shows. */
export function chose(p: Pick<Progress, 'choices'>, when: string | undefined): boolean {
  if (!when) return true;
  const [chapterId, optionId] = when.split(':');
  return !!chapterId && p.choices[chapterId] === optionId;
}

/** The decision recorded when the pursuer caught the team a second time: the case is lost. */
export const LOST = 'lost';

export function isLost(p: Pick<Progress, 'decision'>): boolean {
  return p.decision === LOST;
}

/**
 * What feeds the pursuer: every hint, and in expert mode (no hints) every third wrong answer, less the
 * steps he was pushed back after a catch.
 */
export function pressure(p: Progress): number {
  const wrong = Object.values(p.wrongAttempts).reduce((a, b) => a + b, 0);
  return Math.max(0, totalHints(p) + (p.mode === 'expert' ? Math.floor(wrong / 3) : 0) - p.relief);
}

/** How close the pursuer is now, 0 (far) to levels - 1 (right behind you). */
export function threatLevel(p: Progress, levels: number): number {
  return pursuitLevel(pressure(p), levels);
}

/** True when the pursuer has reached the team and may catch them (never in junior or relaxed mode). */
export function canCatch(p: Progress, levels: number): boolean {
  return !gentle(p.mode) && !p.decision && p.caught < 2 && !p.recovering && threatLevel(p, levels) >= levels - 1;
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

/**
 * Experience: 100 a chapter, 15 less a hint in classic mode (never below 40), 25 a star, 30 a deduction on
 * the evidence board, 40 a lead, 20 a secret, 100 for a case report filed without giving up, 200 for
 * finishing (300 in expert mode).
 */
export function xpFor(p: Progress): number {
  let xp = 0;
  const hintCost = p.mode === 'classic' ? 15 : 0;
  for (const id of p.solved) xp += Math.max(40, 100 - hintCost * (p.hintsUsed[id] ?? 0)) + 25 * starsFor(p, id);
  xp += 30 * p.deductions.length + 40 * p.leadsSolved.length + 20 * p.secrets.length;
  if (p.reportDone === 'solved') xp += 100;
  if (isFinished(p) && !isLost(p)) xp += p.mode === 'expert' ? 300 : 200;
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

/** { chapterId: optionId }. */
function choiceMap(v: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [k, id] of Object.entries(v).slice(0, LIST_MAX)) if (isId(k) && isId(id)) out[k] = id;
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
    choices: choiceMap(p.choices),
    caught: typeof p.caught === 'number' && Number.isInteger(p.caught) ? Math.min(2, Math.max(0, p.caught)) : 0,
    relief: typeof p.relief === 'number' && Number.isInteger(p.relief) && p.relief >= 0 ? Math.min(p.relief, 1000) : 0,
    seized: isId(p.seized) ? p.seized : null,
    recovering: p.recovering === true,
    phoneRead: idList(p.phoneRead),
    replies: choiceMap(p.replies),
    leadsSolved: idList(p.leadsSolved),
    secrets: idList(p.secrets),
    reportPicks: choiceMap(p.reportPicks),
    reportConfirmed: idList(p.reportConfirmed),
    reportTries: typeof p.reportTries === 'number' && Number.isInteger(p.reportTries) && p.reportTries >= 0 ? Math.min(p.reportTries, 1000) : 0,
    reportDone: p.reportDone === 'solved' || p.reportDone === 'revealed' ? p.reportDone : null,
    variant: typeof p.variant === 'string' && /^[a-z0-9-]{1,40}$/.test(p.variant) ? p.variant : null,
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
  // A lost case is finished wherever it stopped; any other decision only stands at the end.
  const finished = p.decision === LOST || (p.decision !== null && chapter === count);
  return {
    ...p,
    chapter,
    stage,
    solved,
    inventory: p.inventory.filter((id) => items.has(id)),
    seized: p.seized && items.has(p.seized) ? p.seized : null,
    deductions: p.deductions.filter((id) => boardIds.includes(id)),
    // A choice only stands for a chapter that is still solved.
    choices: Object.fromEntries(Object.entries(p.choices).filter(([id]) => solved.includes(id))),
    decision: finished ? p.decision : null,
    finishedAt: finished ? p.finishedAt : null,
  };
}
