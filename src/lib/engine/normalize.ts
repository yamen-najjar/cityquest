// Answer normalisation shared by every text-like puzzle. Players type on phones, in three languages,
// often with autocorrect, so case, accents, Arabic letter variants, articles and spacing never decide
// whether an answer is right.

const ARABIC_DIACRITICS = /[ً-ٰٟـ]/g; // harakat, superscript alef, tatweel
const LEADING_ARTICLE = /^(the|a|der|die|das|ein|de|het|een|al)\s+/;

export function normalizeAnswer(raw: string): string {
  let s = raw.normalize('NFKC').trim().toLowerCase();
  s = s.replace(ARABIC_DIACRITICS, '');
  s = s
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');
  // Eastern Arabic and Persian digits to ASCII, for number codes typed on an Arabic keyboard.
  s = s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  s = s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
  // German umlauts and other Latin accents: ü -> u (also accepts "ue" via the answer list).
  s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss');
  s = s.replace(LEADING_ARTICLE, '');
  s = s.replace(/[^\p{L}\p{N}]+/gu, '');
  // The Arabic definite article, written joined to the word.
  if (s.startsWith('ال') && s.length > 3) s = s.slice(2);
  return s;
}

export function matchesAnswer(input: string, accepted: readonly string[]): boolean {
  const n = normalizeAnswer(input);
  if (!n) return false;
  return accepted.some((a) => normalizeAnswer(a) === n);
}
