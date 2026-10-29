export function SectionHeading({ eyebrow, title, text, id, level = 2 }: { eyebrow?: string; title: string; text?: string; id?: string; level?: 1 | 2 }) {
  const H = level === 1 ? 'h1' : 'h2';
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H id={id} className={`mt-2 font-display font-semibold leading-tight ${level === 1 ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
        {title}
      </H>
      <div className="gold-rule mt-4" />
      {text && <p className="mt-4 text-ivory-dim">{text}</p>}
    </div>
  );
}
