// The case report's rules. Pure, shared by the server (grading) and the client (encoding the picks).

/** Nothing is confirmed until at least this many answers are right together (no guessing slot by slot). */
export const REPORT_CONFIRM = 3;

/** "slot=option;slot=option", sorted by slot, so the order of picking never matters. */
export function encodeReport(picks: Record<string, string>): string {
  return Object.entries(picks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slot, option]) => `${slot}=${option}`)
    .join(';');
}

export function decodeReport(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of s.split(';')) {
    const [slot, option] = part.split('=');
    if (slot && option) out[slot.trim()] = option.trim();
  }
  return out;
}

/**
 * Grades a filed report against the key. It is solved only when every slot is right. Below
 * `REPORT_CONFIRM` right answers the team learns nothing; at or above it, which slots are right.
 */
export function gradeReport(answer: string, key: string): { correct: boolean; confirmed: string[] } {
  const given = decodeReport(answer);
  const right = decodeReport(key);
  const slots = Object.keys(right);
  const ok = slots.filter((slot) => given[slot] === right[slot]);
  return { correct: slots.length > 0 && ok.length === slots.length, confirmed: ok.length >= REPORT_CONFIRM ? ok.sort() : [] };
}
