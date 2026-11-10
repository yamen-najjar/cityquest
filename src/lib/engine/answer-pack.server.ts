import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { answerKeys } from '@/content/answers.server';
import { getAdventure } from '@/content/adventures';
import { hashValue, reportPart, type AnswerPack } from './answer-pack';
import { normalizeAnswer } from './normalize';
import { decodeReport } from './report';

/** A fingerprint of the adventure's answer key. Changes whenever an accepted answer does. */
export function packVersion(slug: string): string | null {
  const key = answerKeys[slug];
  return key ? createHash('sha256').update(JSON.stringify(key)).digest('hex').slice(0, 16) : null;
}

/** Builds the pack for one adventure with a fresh salt. Plain answers never leave this function. */
export async function buildAnswerPack(slug: string, salt = randomBytes(16).toString('hex')): Promise<AnswerPack | null> {
  const adventure = getAdventure(slug);
  const key = answerKeys[slug];
  const version = packVersion(slug);
  if (!adventure || !key || !version) return null;
  const keys: AnswerPack['keys'] = {};
  const reports: NonNullable<AnswerPack['reports']> = {};
  for (const [name, { accepted }] of Object.entries(key)) {
    const isReport = name === 'report' || name.startsWith('report@');
    if (isReport) {
      // Only the first accepted string is the key, as in grade(): its slots are hashed one by one.
      const right = decodeReport(accepted[0] ?? '');
      reports[name] = Object.keys(right);
      keys[name] = await Promise.all(Object.entries(right).map(([slot, option]) => hashValue(salt, name, reportPart(slot, option))));
    } else {
      const values = [...new Set(accepted.map(normalizeAnswer).filter(Boolean))];
      keys[name] = await Promise.all(values.map((v) => hashValue(salt, name, v)));
    }
  }
  return { version, salt, paid: !adventure.isDemo, keys, ...(Object.keys(reports).length ? { reports } : {}) };
}
