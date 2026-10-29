import 'server-only';
import type { AnswerKey } from './types';

// Accepted answers, kept out of the browser bundle: the game screen sends a guess to
// /api/game/[slug]/check and only learns whether it was right. Phase 2 moves this into a table that
// only the service role can read. Every language's answer is accepted in every language.
//
// Formats by puzzle type: choice and logic puzzles take the choice id; order puzzles the piece ids in
// order ("bacd"); deductions "suspect+item"; locks and Morse the digits.
export const answerKeys: Record<string, AnswerKey> = {
  'lost-manuscript': {
    message: { accepted: ['tower', 'turm', 'toren', 'برج'] },
    witnesses: { accepted: ['clara'] },
    clockmaker: { accepted: ['7347'] },
    study: {
      accepted: [
        'river', 'the river', 'chest', 'the chest', 'chest by the river', 'the chest by the river', 'riverside', 'riverbank',
        'fluss', 'am fluss', 'zum fluss', 'truhe', 'die truhe', 'truhe am fluss', 'zur truhe am fluss', 'flussufer',
        'rivier', 'de rivier', 'kist', 'de kist', 'kist bij de rivier', 'naar de kist bij de rivier', 'bij de rivier', 'rivieroever',
        'نهر', 'النهر', 'عند النهر', 'الصندوق', 'صندوق', 'الصندوق عند النهر', 'ضفة النهر',
      ],
    },
    chest: { accepted: ['lantern-map'] },
    signal: { accepted: ['1847'] },
    mirror: { accepted: ['stories', 'story', 'geschichten', 'geschichte', 'verhalen', 'verhaal', 'حكايات', 'حكاية', 'حكايا'] },
    verdict: { accepted: ['kehl+second-half', 'kehl+whole-letter'] },
  },
  'neckar-ring': {
    box: { accepted: ['369'] },
    whispers: {
      accepted: ['bookbinder', 'book binder', 'a bookbinder', 'buchbinder', 'buchbinderin', 'ein buchbinder', 'boekbinder', 'een boekbinder', 'boekbindster', 'مجلد', 'مجلدة', 'مجلد الكتب', 'مجلدة الكتب', 'مجلد كتب'],
    },
    watchman: { accepted: ['hedda'] },
    chase: { accepted: ['narrow'] },
    ledger: { accepted: ['bacd'] },
    goldsmith: { accepted: ['valen', 'فالين', 'فالن'] },
    letter: {
      accepted: [
        'forgive', 'forgive me', 'forgive her', 'forgiveness', 'to forgive her',
        'verzeihen', 'verzeih', 'verzeih mir', 'vergeben', 'vergebung', 'verzeihung', 'ihr verzeihen',
        'vergeef', 'vergeef me', 'vergeven', 'vergiffenis', 'haar vergeven', 'vergeef haar',
        'سامحني', 'سامحها', 'المسامحة', 'مسامحة', 'أن أسامحها', 'العفو', 'الصفح', 'السماح',
      ],
    },
    bridge: { accepted: ['valen+hallmark-rubbing', 'valen+ledger-page'] },
  },
};
