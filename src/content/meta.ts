// The mystery behind the mysteries: every story hides one lantern sign (Adventure.token). Together their
// fragments make one sentence, and with the last sign the Lantern Keepers write to the team.
import { localize } from './translations';
import type { Authored, Localized } from './types';

export interface MetaMystery {
  title: Localized;
  intro: Localized;
  from: Localized;
  solved: Localized<string[]>;
}

export const meta = localize<MetaMystery>({
  title: { de: 'Die Laternenhüter', en: 'The Lantern Keepers', ar: 'حرّاس الفوانيس' },
  intro: {
    de: 'In jedem Fall hat jemand eine kleine Laterne hinterlassen: ein Zeichen, kaum größer als ein Daumennagel. Wer alle findet, liest einen Satz – und bekommt Post.',
    en: 'In every case someone has left a small lantern: a sign hardly bigger than a thumbnail. Whoever finds them all reads one sentence — and gets a letter.',
    ar: 'في كل قضية ترك أحدهم فانوساً صغيراً: علامة بالكاد أكبر من ظفر الإبهام. من يجدها كلها يقرأ جملة واحدة — وتصله رسالة.',
  },
  from: { de: 'Die Laternenhüter', en: 'The Lantern Keepers', ar: 'حرّاس الفوانيس' },
  solved: {
    de: [
      'Ihr habt uns gefunden. Das gelingt nicht vielen.',
      'Wir sind keine Geheimgesellschaft, nur Menschen, die Dinge aufbewahren: ein Buch, einen Namen, ein Hauptbuch voller Fremder. Wir hinterlassen Laternen für die, die genau hinsehen.',
      'Ihr habt genau hingesehen. Wenn ihr das nächste Mal in einer fremden Stadt eine kleine Laterne in einen Stein geritzt seht, wisst ihr, dass jemand an euch gedacht hat.',
    ],
    en: [
      'You found us. Not many do.',
      'We are no secret society, only people who keep things: a book, a name, a ledger full of strangers. We leave lanterns for those who look closely.',
      'You looked closely. Next time you see a small lantern scratched into a stone in a strange city, you will know someone was thinking of you.',
    ],
    ar: [
      'لقد وجدتمونا. قلّة يفعلون ذلك.',
      'لسنا جمعية سرية، بل أناس يحفظون الأشياء: كتاباً، واسماً، ودفتراً مليئاً بالغرباء. نترك الفوانيس لمن ينظر عن قرب.',
      'لقد نظرتم عن قرب. في المرة القادمة التي ترون فيها فانوساً صغيراً محفوراً في حجر بمدينة غريبة، ستعرفون أن أحداً فكّر فيكم.',
    ],
  },
} satisfies Authored<MetaMystery>);
