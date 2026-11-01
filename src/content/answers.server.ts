import 'server-only';
import { boardAnswer } from '@/lib/engine/board';
import type { AnswerKey } from './types';

// Accepted answers, kept out of the browser bundle: the game screen sends a guess to
// /api/game/[slug]/check and only learns whether it was right. Phase 2 moves this into a table that
// only the service role can read. Every language's answer is accepted in every language.
//
// Formats by puzzle type: choice and logic puzzles take the choice id; order puzzles the piece ids in
// order ("bacd"); deductions "suspect+item"; locks and Morse the digits.
//
// Evidence-board questions are keyed "board:<id>" and answered "person|card+card", the two evidence
// cards sorted (see BoardQuestion in types.ts). board() builds that string, so the order never matters.
const board = (person: string, ...cards: string[]) => boardAnswer(person, cards);

export const answerKeys: Record<string, AnswerKey> = {
  'lost-manuscript': {
    'board:liar': { accepted: [board('anna', 'item:brass-key', 'clue:witnesses-0')] },
    'board:who-is-k': {
      accepted: [
        board('kehl', 'clue:clockmaker-1', 'clue:study-1'),
        board('kehl', 'clue:clockmaker-1', 'clue:study-0'),
        board('kehl', 'clue:clockmaker-1', 'clue:study-2'),
        board('kehl', 'clue:clockmaker-1', 'item:second-half'),
      ],
    },
    'board:footprints': { accepted: [board('kehl', 'clue:chest-0', 'clue:study-0')] },
    'board:signal': { accepted: [board('elise', 'clue:signal-0', 'clue:mirror-0'), board('vii', 'clue:signal-0', 'clue:mirror-0')] },
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
  'het-duivelshuis': {
    message: {
      accepted: [
        'devils', 'the devils', 'devil',
        'duivels', 'de duivels', 'duivel', 'duivelshuis', 'het duivelshuis',
        'teufel', 'die teufel', 'der teufel', 'teufelshaus',
        'شياطين', 'الشياطين', 'شيطان',
      ],
    },
    duivels: { accepted: ['middle'] },
    sabelspoort: { accepted: ['eusebius'] },
    carillon: { accepted: ['9472'] },
    sonsbeek: {
      accepted: [
        'rhine', 'the rhine', 'to the rhine', 'to the rhine before midnight', 'river', 'the river', 'quay', 'the quay',
        'rijn', 'de rijn', 'naar de rijn', 'naar de rijn voor middernacht', 'rivier', 'de rivier', 'rijnkade', 'kade',
        'rhein', 'der rhein', 'zum rhein', 'kai', 'rheinkai', 'fluss', 'am fluss', 'zum fluss',
        'نهر', 'النهر', 'نهر الراين', 'الراين', 'إلى نهر الراين', 'الرصيف',
      ],
    },
    rijnkade: { accepted: ['1545'] },
    archief: { accepted: ['iron-key'] },
    aanklacht: { accepted: ['koster+whole-ledger', 'koster+ledger-left'] },
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
