'use client';

import type { Choice, InventoryItem, Person } from '@/content/types';
import type { Locale } from '@/i18n/config';
import { ItemIcon } from '../ItemIcon';
import { initials } from './Interrogation';

/** The accusation: pick who did it, and lay down the item that proves it. */
export function Deduction({
  suspects,
  people,
  items,
  value,
  onChange,
  locale,
  labels,
}: {
  suspects: Choice[];
  people: Person[];
  items: InventoryItem[];
  value: { suspect: string | null; proof: string | null };
  onChange: (v: { suspect: string | null; proof: string | null }) => void;
  locale: Locale;
  labels: { who: string; proof: string };
}) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm text-ivory-mute">{labels.who}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {suspects.map((s) => {
            const person = people.find((p) => p.id === s.id);
            const active = value.suspect === s.id;
            return (
              <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${active ? 'border-gold bg-gold/10' : 'border-white/15 hover:border-white/30'}`}>
                <input type="radio" name="suspect" className="sr-only" checked={active} onChange={() => onChange({ ...value, suspect: s.id })} />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-lg text-gold" aria-hidden="true">
                  {initials(s.label[locale])}
                </span>
                <span>
                  <span className="block font-semibold">{s.label[locale]}</span>
                  {person && <span className="block text-xs text-ivory-mute">{person.role[locale]}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm text-ivory-mute">{labels.proof}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {items.map((it) => {
            const active = value.proof === it.id;
            return (
              <label key={it.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${active ? 'border-gold bg-gold/10' : 'border-white/15 hover:border-white/30'}`}>
                <input type="radio" name="proof" className="sr-only" checked={active} onChange={() => onChange({ ...value, proof: it.id })} />
                <ItemIcon icon={it.icon} className="h-7 w-7" />
                <span className="text-sm">{it.name[locale]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

/** Pick two items to put together. */
export function Combine({
  items,
  selected,
  onChange,
  locale,
  labels,
}: {
  items: InventoryItem[];
  selected: string[];
  onChange: (ids: string[]) => void;
  locale: Locale;
  labels: { pick: string };
}) {
  return (
    <fieldset>
      <legend className="text-sm text-ivory-mute">{labels.pick}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((it) => {
          const active = selected.includes(it.id);
          return (
            <label key={it.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${active ? 'border-gold bg-gold/10' : 'border-white/15 hover:border-white/30'}`}>
              <input
                type="checkbox"
                className="accent-[#DDB66A]"
                checked={active}
                onChange={() => onChange(active ? selected.filter((x) => x !== it.id) : [...selected, it.id].slice(-2))}
              />
              <ItemIcon icon={it.icon} className="h-7 w-7" />
              <span className="text-sm">{it.name[locale]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
