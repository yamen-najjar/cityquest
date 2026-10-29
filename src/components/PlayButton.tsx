'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localProgressStore } from '@/lib/engine/storage';
import { isFinished } from '@/lib/engine/progress';

/** "Play" for a new player, "Continue" when a saved game exists, "Play again" once it is finished. */
export function PlayButton({ href, slug, labels }: { href: string; slug: string; labels: { play: string; continue: string; replay: string } }) {
  const [label, setLabel] = useState(labels.play);
  useEffect(() => {
    const p = localProgressStore.load(slug);
    if (p) setLabel(isFinished(p) ? labels.replay : labels.continue);
  }, [slug, labels]);
  return (
    <Link href={href} className="btn-gold w-full px-7 text-base">
      {label}
    </Link>
  );
}
