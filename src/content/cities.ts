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
  {
    slug: 'arnhem',
    name: { de: 'Arnheim', en: 'Arnhem', ar: 'أرنم' },
    region: { de: 'Gelderland, Niederlande', en: 'Gelderland, Netherlands', ar: 'غيلدرلاند، هولندا' },
    country: 'NL',
    status: 'available',
    pilot: false,
    intro: {
      de: 'Eine Stadt am Nederrijn, zwischen dem Teufelshaus, der Eusebiuskirche und den Hügeln des Sonsbeek-Parks. Hier spielt unser erstes niederländisches Detektivabenteuer.',
      en: 'A city on the Lower Rhine, between the Devil’s House, the Eusebius church and the hills of Sonsbeek park. The setting of our first Dutch detective adventure.',
      ar: 'مدينة على نهر الراين السفلي، بين «بيت الشيطان» وكنيسة أوزيبيوس وتلال حديقة سونسبيك. مسرح أول مغامرة بوليسية هولندية لنا.',
    },
    center: { lat: 51.9806, lng: 5.9089 },
  },
];

export const cities: City[] = localize<City[]>(authored);

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
