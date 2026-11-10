// The answer pack's format and hashing, shared by the server (which builds it) and the browser (which
// grades offline against it). Web Crypto only, so the same code runs in both and the two cannot drift.
//
// A pack holds no plain answers. Every accepted answer is stored as SHA-256(salt \0 key \0 value) in hex,
// where `value` is normalizeAnswer(accepted) for text-like keys. The case report is graded slot by slot,
// so for its keys each "slot=option" of the answer is hashed on its own (value = "slot=option").
import { normalizeAnswer } from './normalize';
import { REPORT_CONFIRM, decodeReport } from './report';

export interface AnswerPack {
  /** A hash of this adventure's answer key: when it changes, a stored pack is stale. */
  version: string;
  /** Random per response, so a pack cannot be matched against a precomputed table. */
  salt: string;
  /** True for an adventure that must be bought: its correct offline answers are queued for the server. */
  paid: boolean;
  /** The adventure's variant ids: a guess naming any other variant is refused, as the server refuses it. */
  variants?: string[];
  /** Answer key ("chapter", "chapter@variant", "board:x", "lead:x", "recover", "report"…) → hashes. */
  keys: Record<string, string[]>;
  /** For case-report keys: the slot ids that must all be right (non-secret, but needed to count them). */
  reports?: Record<string, string[]>;
}

export interface Verdict {
  correct: boolean;
  confirmed?: string[];
}

const SEP = '\u0000';

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function sha256Hex(text: string): Promise<string> {
  return toHex(await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

/** The hash stored in a pack for one key and one (already normalised) value. */
export const hashValue = (salt: string, key: string, value: string) => sha256Hex(`${salt}${SEP}${key}${SEP}${value}`);

/** Hashes one slot=option pair of a case report. */
export const reportPart = (slot: string, option: string) => `${slot}=${option}`;

/** The key a guess is graded against: "key@variant" where the pack has it, else "key" (as resolveGuess does). */
export function packKeyFor(pack: AnswerPack, chapterId: string, variant: string | null | undefined): string | null {
  // hasOwn: a chapter called "constructor" must not find Object.prototype's.
  if (variant && Object.hasOwn(pack.keys, `${chapterId}@${variant}`)) return `${chapterId}@${variant}`;
  return Object.hasOwn(pack.keys, chapterId) ? chapterId : null;
}

/** The longest answer the server accepts (check.server.ts); a longer one is refused there, so here too. */
export const MAX_ANSWER_LENGTH = 200;

/** Grades a guess against a pack, giving exactly the verdict the server's check route would give. */
export async function gradeWithPack(pack: AnswerPack, chapterId: string, answer: string, variant?: string | null): Promise<Verdict | null> {
  if (answer.length > MAX_ANSWER_LENGTH) return null;
  // An unknown variant is an invalid request on the server, not a reason to fall back to the original.
  if (variant && pack.variants && !pack.variants.includes(variant)) return null;
  const key = packKeyFor(pack, chapterId, variant);
  if (!key) return null;
  const hashes = new Set(pack.keys[key]);
  const slots = pack.reports && Object.hasOwn(pack.reports, key) ? pack.reports[key] : undefined;
  if (chapterId === 'report' && slots) {
    const given = decodeReport(answer);
    const right: string[] = [];
    for (const slot of slots) {
      const option = given[slot];
      if (option !== undefined && hashes.has(await hashValue(pack.salt, key, reportPart(slot, option)))) right.push(slot);
    }
    return { correct: slots.length > 0 && right.length === slots.length, confirmed: right.length >= REPORT_CONFIRM ? right.sort() : [] };
  }
  const n = normalizeAnswer(answer);
  if (!n) return { correct: false };
  return { correct: hashes.has(await hashValue(pack.salt, key, n)) };
}
