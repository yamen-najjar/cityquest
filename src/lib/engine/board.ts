// The evidence board's shared rules: which questions are open, which evidence the team holds, and how an
// answer is written. Pure, so the client, the server answer key and the tests all agree.
import type { Adventure, BoardQuestion } from '@/content/types';
import type { Progress } from './progress';

/** "person|card+card", the cards sorted so the order they were pinned in never matters. */
export function boardAnswer(person: string, cards: readonly string[]): string {
  return `${person}|${[...cards].sort().join('+')}`;
}

/** Questions the team can see: those whose chapter is solved. Later ones stay hidden, so nothing is spoiled. */
export function visibleQuestions(a: Adventure, p: Progress): BoardQuestion[] {
  return (a.board ?? []).filter((q) => p.solved.includes(q.after));
}

export type EvidenceCard =
  | { id: string; kind: 'item'; itemId: string }
  | { id: string; kind: 'clue'; chapterId: string; index: number }
  | { id: string; kind: 'said'; chapterId: string; personId: string; questionId: string };

/** Every piece of evidence the team holds right now: items carried, clues found, answers heard. */
export function evidenceCards(a: Adventure, p: Progress): EvidenceCard[] {
  const items: EvidenceCard[] = p.inventory.filter((id) => a.items.some((i) => i.id === id)).map((id) => ({ id: `item:${id}`, kind: 'item', itemId: id }));
  const clues: EvidenceCard[] = a.chapters
    .filter((c) => p.solved.includes(c.id))
    .flatMap((c) => (c.clues ?? []).map((_, index) => ({ id: `clue:${c.id}-${index}`, kind: 'clue' as const, chapterId: c.id, index })));
  const said: EvidenceCard[] = a.chapters.flatMap((c) => {
    const interview = c.puzzle.interview;
    if (!interview) return [];
    return (p.asked[c.id] ?? [])
      .filter((qid) => interview.questions.some((q) => q.id === qid))
      .map((qid) => ({ id: `said:${c.id}-${qid}`, kind: 'said' as const, chapterId: c.id, personId: interview.person, questionId: qid }));
  });
  return [...items, ...clues, ...said];
}

/** People the team has met so far (the same rule the journal uses). */
export function peopleMet(a: Adventure, p: Progress) {
  const reached = (chapterId: string) => {
    const i = a.chapters.findIndex((c) => c.id === chapterId);
    return i !== -1 && i <= p.chapter;
  };
  return a.people.filter((person) => reached(person.appears));
}
