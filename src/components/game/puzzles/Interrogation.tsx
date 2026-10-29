'use client';

import type { Person, Question } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { speak } from '@/lib/audio';

/** "Prof. Albrecht Kehl" -> "AK": titles ending in a full stop are skipped. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w && !w.endsWith('.'))
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
}

/**
 * A conversation: the player picks questions, the person answers. Answers stay on screen (and in the
 * journal), because the puzzle is answered from what was said.
 */
export function Interrogation({
  person,
  questions,
  asked,
  onAsk,
  locale,
  labels,
}: {
  person: Person;
  questions: Question[];
  asked: string[];
  onAsk: (id: string) => void;
  locale: Locale;
  labels: { ask: string; allAsked: string };
}) {
  const open = questions.filter((q) => !asked.includes(q.id));
  return (
    <section className="rounded-2xl border border-white/10 bg-navy p-4" aria-label={person.name[locale]}>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-xl text-gold" aria-hidden="true">
          {initials(person.name[locale])}
        </span>
        <div>
          <p className="font-semibold">{person.name[locale]}</p>
          <p className="text-xs text-ivory-mute">{person.role[locale]}</p>
        </div>
      </div>
      <ol className="mt-4 space-y-3" aria-live="polite">
        {asked.map((id) => {
          const q = questions.find((x) => x.id === id);
          if (!q) return null;
          return (
            <li key={id} className="space-y-2">
              <p className="ms-auto w-fit max-w-[85%] rounded-2xl rounded-ee-sm bg-gold/15 px-4 py-2 text-sm text-gold">{q.q[locale]}</p>
              <p className="w-fit max-w-[90%] rounded-2xl rounded-es-sm bg-white/5 px-4 py-2 text-ivory">{q.a[locale]}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-4">
        {open.length ? (
          <>
            <p className="text-xs text-ivory-mute">{labels.ask}</p>
            <div className="mt-2 flex flex-col gap-2">
              {open.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-start text-sm hover:border-gold/60 hover:bg-gold/5"
                  onClick={() => {
                    onAsk(q.id);
                    speak(q.a[locale], locale, person.voice);
                  }}
                >
                  “{q.q[locale]}”
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-ivory-mute">{labels.allAsked}</p>
        )}
      </div>
    </section>
  );
}
