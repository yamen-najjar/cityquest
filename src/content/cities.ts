import { localize } from './translations';
import type { Authored, City } from './types';

// Only cities with real, playable content are listed. New cities arrive through the admin dashboard
// (Phase 2) as rows in the same shape.
const authored: Authored<City>[] = [
  {
    slug: 'heidelberg',
    name: { de: 'Heidelberg', en: 'Heidelberg', ar: 'هايدلبرغ' },
    region: { de: 'Baden-Württemberg, Deutschland', en: 'Baden-Württemberg, Germany', ar: 'بادن-فورتمبيرغ، ألمانيا' },
    country: 'DE',
    status: 'available',
    pilot: true,
    intro: {
      de: 'Eine Stadt am Neckar zwischen Altstadtgassen, Brücke und Schlossberg. Unsere Pilotstadt: Hier entsteht das erste CityQuest-Abenteuer.',
      en: 'A city on the Neckar, between old-town lanes, the bridge and the castle hill. Our pilot city, where the first CityQuest adventure is being built.',
      ar: 'مدينة على نهر نيكار، بين أزقة البلدة القديمة والجسر وتلة القلعة. مدينتنا التجريبية، حيث تُبنى أول مغامرة من CityQuest.',
    },
    center: { lat: 49.4093, lng: 8.6937 },
  },
];

export const cities: City[] = localize<City[]>(authored);

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
