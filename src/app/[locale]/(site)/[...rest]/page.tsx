import { notFound } from 'next/navigation';

// Any unknown path under a language renders the localised 404 inside the site layout.
export default function CatchAll() {
  notFound();
}
