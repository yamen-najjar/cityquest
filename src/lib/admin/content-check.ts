// The admin console's content check: everything a story editor would have to keep consistent, checked over
// the stories as they ship today. It is the first step towards an adventure editor: before anything can be
// edited in the console, the console must be able to say what "valid" means. Pure, so it is unit-tested.
import type { Adventure, AnswerKey } from '@/content/types';
import { locales } from '@/i18n/config';

export type Issue = { level: 'error' | 'warning'; where: string; message: string };

export interface ContentReport {
  slug: string;
  title: string;
  status: Adventure['status'];
  stats: { chapters: number; puzzleTypes: number; hints: number; clues: number; items: number; people: number; board: number; choices: number; simulatedCheckpoints: number };
  issues: Issue[];
}

/** Every localized text (an object with all four language keys) in the adventure, with where it sits. */
function* localizedTexts(value: unknown, path: string): Generator<{ path: string; text: Record<string, unknown> }> {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* localizedTexts(value[i], `${path}[${i}]`);
    return;
  }
  const obj = value as Record<string, unknown>;
  if (locales.every((l) => l in obj)) {
    yield { path, text: obj };
    return;
  }
  for (const [k, v] of Object.entries(obj)) yield* localizedTexts(v, path ? `${path}.${k}` : k);
}

const isEmpty = (v: unknown) => (typeof v === 'string' ? !v.trim() : Array.isArray(v) ? v.length === 0 || v.some((x) => typeof x === 'string' && !x.trim()) : v == null);

export function checkAdventure(a: Adventure, key: AnswerKey | undefined): ContentReport {
  const issues: Issue[] = [];
  const error = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  const chapterIds = a.chapters.map((c) => c.id);
  const itemIds = new Set(a.items.map((i) => i.id));
  const peopleIds = new Set(a.people.map((p) => p.id));
  const options = new Set(a.chapters.flatMap((c) => (c.choice?.options ?? []).map((o) => `${c.id}:${o.id}`)));

  if (new Set(chapterIds).size !== chapterIds.length) error('chapters', 'Two chapters share an id.');
  for (const c of a.chapters) {
    const at = `chapter “${c.id}”`;
    if (!key?.[c.id]?.accepted.length) error(at, 'No accepted answer in answers.server.ts: the puzzle can never be solved.');
    if (c.puzzle.hints.length !== 3) warn(at, `Has ${c.puzzle.hints.length} hints; every puzzle is meant to have 3 (the last one the solution).`);
    if (!c.clues?.length) warn(at, 'Adds no clue to the journal.');
    if (c.reward && !itemIds.has(c.reward)) error(at, `Rewards an item that does not exist: “${c.reward}”.`);
    if (c.puzzle.interview && !peopleIds.has(c.puzzle.interview.person)) error(at, `Interviews a person who does not exist: “${c.puzzle.interview.person}”.`);
    if (['logic', 'multiple-choice', 'interrogate', 'deduction'].includes(c.puzzle.type) && (c.puzzle.choices?.length ?? 0) < 2) error(at, 'A choice puzzle needs at least two choices.');
    if (!c.checkpoint.simulated && !c.checkpoint.coordinates) warn(at, 'Marked as a validated checkpoint but has no coordinates.');
  }
  for (const p of a.people) {
    if (!chapterIds.includes(p.appears)) error(`person “${p.id}”`, `Appears in a chapter that does not exist: “${p.appears}”.`);
    for (const n of p.notes) {
      if (!chapterIds.includes(n.after)) error(`person “${p.id}”`, `A note follows a chapter that does not exist: “${n.after}”.`);
      if (n.when && !options.has(n.when)) error(`person “${p.id}”`, `A note depends on a story choice that does not exist: “${n.when}”.`);
    }
  }
  for (const q of a.board ?? []) {
    const at = `board “${q.id}”`;
    if (!chapterIds.includes(q.after)) error(at, `Opens after a chapter that does not exist: “${q.after}”.`);
    if (!key?.[`board:${q.id}`]?.accepted.length) error(at, 'No accepted answer: the question can never be worked out.');
  }
  for (const combo of a.combinations ?? []) {
    for (const id of [...combo.from.split('+'), combo.to]) if (!itemIds.has(id)) error('combinations', `Uses an item that does not exist: “${id}”.`);
  }
  const whens = [
    ...(a.ending.revealIf ?? []).map((r) => ['ending reveal', r.when] as const),
    ...a.ending.decision.choices.flatMap((c) => (c.epilogueIf ?? []).map((e) => [`ending “${c.id}”`, e.when] as const)),
  ];
  for (const [where, when] of whens) if (!options.has(when)) error(where, `Depends on a story choice that does not exist: “${when}”.`);
  if (a.ending.decision.choices.length < 2) error('ending', 'The final decision needs at least two choices.');

  for (const { path, text } of localizedTexts(a, '')) {
    for (const l of locales) if (isEmpty(text[l])) warn(path || 'adventure', `Empty text in ${l.toUpperCase()}.`);
  }

  return {
    slug: a.slug,
    title: a.title.en,
    status: a.status,
    stats: {
      chapters: a.chapters.length,
      puzzleTypes: new Set(a.chapters.map((c) => c.puzzle.type)).size,
      hints: a.chapters.reduce((n, c) => n + c.puzzle.hints.length, 0),
      clues: a.chapters.reduce((n, c) => n + (c.clues?.length ?? 0), 0),
      items: a.items.length,
      people: a.people.length,
      board: a.board?.length ?? 0,
      choices: a.chapters.filter((c) => c.choice).length,
      simulatedCheckpoints: a.chapters.filter((c) => c.checkpoint.simulated).length,
    },
    issues,
  };
}
