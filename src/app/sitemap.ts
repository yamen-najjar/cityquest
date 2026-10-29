import type { MetadataRoute } from 'next';
import { adventures } from '@/content/adventures';
import { cities } from '@/content/cities';
import { locales } from '@/i18n/config';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/cities', '/adventures', ...cities.map((c) => `/cities/${c.slug}`), ...adventures.map((a) => `/adventures/${a.slug}`)];
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${siteUrl}/${l}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : path.startsWith('/adventures/') ? 0.9 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${siteUrl}/${x}${path}`])) },
    })),
  );
}
