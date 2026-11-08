import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { adventures } from '@/content/adventures';
import { commonsUrl, photoList } from '@/content/photos';
import { getPresentation, presentedSlugs } from '@/content/presentation';
import { locales } from '@/i18n/config';

/** Width and height of a JPEG, read from its start-of-frame marker. */
function jpegSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error(`bad marker in ${file}`);
    const marker = buf[i + 1] as number;
    const length = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + length;
  }
  throw new Error(`no size in ${file}`);
}

describe('photo registry', () => {
  it('has a file of the stated size for every photo, at most 2000 px on the long edge', () => {
    for (const p of photoList) {
      const size = jpegSize(join(process.cwd(), 'public', p.src));
      expect(size, p.id).toEqual({ width: p.width, height: p.height });
      expect(Math.max(p.width, p.height), p.id).toBeLessThanOrEqual(2000);
    }
  });

  it('credits every photo, with alt text and a caption in every language', () => {
    for (const p of photoList) {
      expect(p.author && p.licence, p.id).toBeTruthy();
      expect(commonsUrl(p), p.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:[^ ]+$/);
      for (const l of locales) {
        expect(p.alt[l].trim().length, `${p.id} alt ${l}`).toBeGreaterThan(20);
        expect(p.title[l].trim().length && p.text[l].trim().length, `${p.id} caption ${l}`).toBeGreaterThan(0);
      }
    }
  });

  it('gives every published story a presentation that points at known photos', () => {
    const ids = new Set(photoList.map((p) => p.id));
    for (const a of adventures) {
      expect(presentedSlugs, a.slug).toContain(a.slug);
      const p = getPresentation(a.slug);
      for (const id of [p.photo, ...p.settingPhotos]) expect(ids.has(id), `${a.slug} ${id}`).toBe(true);
    }
  });
});
