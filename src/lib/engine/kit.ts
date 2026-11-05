// The investigation kit's rules: what is unlocked when, what the team holds, and how lead answers are
// written. Pure, so the phone, the journal, the report, the server's answer key and the tests all agree.
import type { Adventure, CaseDocument, Lead, PhoneMessage, Trigger, WebPage } from '@/content/types';
import type { Progress } from './progress';

/** Whether a trigger has happened: 'start', a solved chapter, 'board:<id>', 'lead:<id>' or 'choice:<chapter>:<option>'. */
export function unlocked(p: Progress, when: Trigger): boolean {
  if (when === 'start') return true;
  if (when.startsWith('board:')) return p.deductions.includes(when.slice(6));
  if (when.startsWith('lead:')) return p.leadsSolved.includes(when.slice(5));
  if (when.startsWith('choice:')) {
    const [, chapterId, optionId] = when.split(':');
    return !!chapterId && p.choices[chapterId] === optionId;
  }
  return p.solved.includes(when);
}

/** The messages that have arrived, in the order the story sends them. */
export function inbox(a: Adventure, p: Progress): PhoneMessage[] {
  return (a.phone ?? []).filter((m) => unlocked(p, m.when));
}

export function unread(a: Adventure, p: Progress): PhoneMessage[] {
  return inbox(a, p).filter((m) => !p.phoneRead.includes(m.id));
}

/** Leads open to the team: those whose chapter is solved. Later ones stay hidden. */
export function visibleLeads(a: Adventure, p: Progress): Lead[] {
  return (a.leads ?? []).filter((l) => p.solved.includes(l.after));
}

/** Documents the team holds: attached to a message that arrived, or handed over with an open lead. */
export function documentsHeld(a: Adventure, p: Progress): CaseDocument[] {
  const ids = new Set<string>();
  for (const m of inbox(a, p)) if (m.document) ids.add(m.document);
  for (const l of visibleLeads(a, p)) for (const d of l.documents ?? []) ids.add(d);
  return (a.documents ?? []).filter((d) => ids.has(d.id));
}

export function pagesHeld(a: Adventure, p: Progress): WebPage[] {
  const ids = new Set(inbox(a, p).flatMap((m) => (m.page ? [m.page] : [])));
  return (a.pages ?? []).filter((pg) => ids.has(pg.id));
}

/** A confrontation is answered with the document line that contradicts the claim: "documentId:rowIndex". */
export function confrontAnswer(documentId: string, row: number): string {
  return `${documentId}:${row}`;
}

/** A timeline is answered with the event ids in the order the team put them in. */
export function timelineAnswer(order: readonly string[]): string {
  return order.join('');
}
