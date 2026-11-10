'use client';

import type { CaseDocument, WebPage } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionary';

// Labels stay in the page's font (a monospace font breaks Arabic joining); values and receipt titles in
// Latin script get the typewriter look.
const PAPER: Record<CaseDocument['style'], string> = {
  receipt: 'mx-auto max-w-xs bg-[#f3eee2] text-[#2b2620] shadow-[0_8px_30px_rgba(0,0,0,.45)] [clip-path:polygon(0_0,100%_0,100%_97%,95%_100%,90%_97%,85%_100%,80%_97%,75%_100%,70%_97%,65%_100%,60%_97%,55%_100%,50%_97%,45%_100%,40%_97%,35%_100%,30%_97%,25%_100%,20%_97%,15%_100%,10%_97%,5%_100%,0_97%)]',
  ticket: 'bg-[#e9dcc0] text-[#2b2620] border-2 border-dashed border-[#8a7a5a]',
  calllog: 'bg-[#101826] text-ivory border border-white/15',
  note: 'bg-[#f6efd8] font-display text-[#2b2620] -rotate-1 shadow-[0_8px_30px_rgba(0,0,0,.45)]',
  newspaper: 'bg-[#ece7dc] text-[#1d1b18] font-display',
};

/**
 * A document the team can read, styled like the real thing. Rows can be tapped: to choose the line that
 * contradicts a claim (`onPickRow`), or to look closer at one that hides a secret (`onSecret`).
 */
export function CaseDocumentView({
  doc,
  locale,
  t,
  pickedRow,
  onPickRow,
  found,
  onSecret,
}: {
  doc: CaseDocument;
  locale: Locale;
  t: Dictionary['game'];
  pickedRow?: number | null;
  onPickRow?: (row: number) => void;
  found?: string[];
  onSecret?: (id: string) => void;
}) {
  return (
    <article className={`rounded-lg p-5 ${PAPER[doc.style]}`} aria-label={doc.title[locale]}>
      <h3 className={`text-center font-semibold ${doc.style === 'newspaper' ? 'border-b-2 border-current pb-2 text-2xl' : 'text-sm uppercase tracking-widest rtl:tracking-normal'}`}>{doc.title[locale]}</h3>
      <ul className="mt-4 space-y-1">
        {doc.rows.map((row, i) => {
          const picked = pickedRow === i;
          const secret = row.secret && onSecret && !found?.includes(row.secret) ? row.secret : null;
          const content = (
            <>
              <span className="min-w-0 flex-1 text-start">{row.label[locale]}</span>
              <span className="shrink-0 font-mono font-semibold tabular-nums" dir="ltr">
                {row.value}
              </span>
            </>
          );
          return (
            <li key={i}>
              {onPickRow ? (
                <button
                  type="button"
                  aria-pressed={picked}
                  onClick={() => onPickRow(i)}
                  className={`flex w-full gap-3 rounded px-2 py-1.5 text-sm transition ${picked ? 'bg-danger/20 outline outline-2 outline-danger' : 'hover:bg-black/10'}`}
                >
                  {content}
                </button>
              ) : (
                <div className="flex gap-3 px-2 py-1.5 text-sm">{content}</div>
              )}
              {secret && (
                <button type="button" onClick={() => onSecret!(secret)} className="ms-2 inline-flex min-h-[32px] items-center gap-1 text-xs font-semibold underline decoration-dotted hover:opacity-100">
                  <span aria-hidden="true">🔍</span> {t.phone.lookCloser}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {doc.note && <p className="mt-4 border-t border-current/20 pt-3 text-xs italic opacity-80">{doc.note[locale]}</p>}
    </article>
  );
}

/** A page of a fictional website, in a minimal browser frame. Every site is marked as part of the story. */
export function WebPageView({ page, locale, t }: { page: WebPage; locale: Locale; t: Dictionary['game'] }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/15 bg-[#f7f5f0] text-[#1c1c1c]">
      <div className="flex items-center gap-2 bg-[#dcd8cf] px-3 py-2 text-xs" dir="ltr">
        <span className="flex gap-1" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#c0574a]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#d9a441]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#5a9a5a]" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded bg-white/80 px-2 py-0.5 font-mono">{page.address}</span>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8a2b2b]">{page.site}</p>
        <h3 className="mt-2 font-display text-2xl leading-tight">{page.title[locale]}</h3>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          {page.body[locale].map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <p className="mt-5 border-t border-black/10 pt-2 text-[11px] text-black/70">{t.phone.fictional}</p>
      </div>
    </article>
  );
}
