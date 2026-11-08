import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { commonsUrl, getPhoto, type Photo, type PhotoId } from '@/content/photos';
import type { Locale } from '@/i18n/config';
import { fmt } from '@/i18n/fmt';

/** A photograph at its real size; the layout decides how it is cropped (object-fit: cover, never stretched). */
export function PhotoImage({
  id,
  locale,
  sizes,
  priority = false,
  className,
  style,
}: {
  id: PhotoId;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const photo = getPhoto(id);
  return <Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt[locale]} sizes={sizes} priority={priority} className={className} style={style} />;
}

/** "Foto: Author, Licence, Wikimedia Commons", the last part linking to the file page. */
export function PhotoCredit({ photo, template }: { photo: Photo; template: string }) {
  const parts: ReactNode[] = fmt(template, { author: '\u0001', licence: '\u0002', source: '\u0003' })
    .split(/(\u0001|\u0002|\u0003)/)
    .map((piece, i) => {
      if (piece === '\u0001') return <bdi key={i}>{photo.author}</bdi>;
      if (piece === '\u0002') return <bdi key={i}>{photo.licence}</bdi>;
      if (piece === '\u0003') {
        return (
          <a key={i} href={commonsUrl(photo)} rel="noopener noreferrer" target="_blank">
            Wikimedia Commons
          </a>
        );
      }
      return piece;
    });
  return <>{parts}</>;
}

/** The credit alone, as a paragraph. */
export function CreditLine({ id, template, className = '' }: { id: PhotoId; template: string; className?: string }) {
  return (
    <p className={`tp-credit ${className}`.trim()}>
      <PhotoCredit photo={getPhoto(id)} template={template} />
    </p>
  );
}

/** A caption: bold lead-in, the rest of the sentence, then the credit. */
export function PhotoCaption({
  id,
  locale,
  template,
  className = '',
  as: Tag = 'figcaption',
}: {
  id: PhotoId;
  locale: Locale;
  template: string;
  className?: string;
  as?: 'figcaption' | 'p';
}) {
  const photo = getPhoto(id);
  return (
    <Tag className={`tp-credit ${className}`.trim()}>
      <strong>{photo.title[locale]}</strong> {photo.text[locale]} <PhotoCredit photo={photo} template={template} />
    </Tag>
  );
}
