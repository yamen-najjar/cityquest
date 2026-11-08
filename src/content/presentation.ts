// How each story is shown on the site pages: which photographs, where it starts, which lines of its
// own text are used. Only presentation lives here; every fact (duration, distance, price, chapters,
// languages) is read from the adventure itself.
import type { PhotoId } from './photos';
import type { Localized } from './types';

export interface StoryPresentation {
  /** The photograph that stands for the story on the home page and on its own page. */
  photo: PhotoId;
  /** A different photograph for the story's band on the home page, when the main one is already the hero there. */
  homePhoto?: PhotoId;
  /** Further photographs on the story page, in reading order. */
  settingPhotos: PhotoId[];
  /**
   * True when the chapters are set at real places (Arnhem). The Heidelberg stories deliberately use invented
   * places, so their photographs show the setting only and say so.
   */
  realPlaces: boolean;
  /** Where the team starts, short (facts table). */
  start: Localized;
  /** Where the team starts, as a sentence opener (facts line). */
  startLine: Localized;
  /** Public coordinates of the meeting area, when the story names a real start. */
  coordinates?: { lat: number; lng: number; place: Localized };
  /**
   * Which lines of the first chapter's text open the story on the page: `quote` is the message or the
   * words that start it, `after` the line that follows. Indices into chapters[0].story.
   */
  opening: { quote: number; after: number };
  /** Which `overview` lines of the adventure are shown under "How to play". */
  playLines: number[];
}

const presentationBySlug: Record<string, StoryPresentation> = {
  'het-duivelshuis': {
    photo: 'arnhem-duivelshuis-detail',
    homePhoto: 'arnhem-duivelshuis-2024',
    settingPhotos: ['arnhem-eusebius-duivelshuis', 'arnhem-duivelshuis-2024', 'arnhem-eusebius'],
    realPlaces: true,
    start: {
      nl: 'Korenmarkt, Arnhem',
      de: 'Korenmarkt, Arnheim',
      en: 'Korenmarkt, Arnhem',
      ar: 'ساحة كورنمارخت، أرنم',
    },
    startLine: { nl: 'Start op de Korenmarkt', de: 'Start am Korenmarkt', en: 'Starts at the Korenmarkt', ar: 'تبدأ عند ساحة كورنمارخت' },
    coordinates: {
      lat: 51.9842,
      lng: 5.9064,
      place: { nl: 'Korenmarkt, Arnhem', de: 'Korenmarkt, Arnheim', en: 'Korenmarkt, Arnhem', ar: 'ساحة كورنمارخت، أرنم' },
    },
    opening: { quote: 1, after: 2 },
    playLines: [0, 1, 3],
  },
  'lost-manuscript': {
    photo: 'heidelberg-bridge-night-2',
    settingPhotos: ['heidelberg-bridge-night', 'heidelberg-bridgegate-night', 'heidelberg-bridge-night-3'],
    realPlaces: false,
    start: { nl: 'Oude binnenstad, Heidelberg', de: 'Altstadt, Heidelberg', en: 'Old town, Heidelberg', ar: 'المدينة القديمة، هايدلبرغ' },
    startLine: { nl: 'Start in de oude binnenstad', de: 'Start in der Altstadt', en: 'Starts in the old town', ar: 'تبدأ في المدينة القديمة' },
    opening: { quote: 1, after: 2 },
    playLines: [0, 1, 3],
  },
  'neckar-ring': {
    photo: 'heidelberg-bridge-night-3',
    settingPhotos: ['heidelberg-bridge-night', 'heidelberg-bridgegate-night', 'heidelberg-bridge-night-2'],
    realPlaces: false,
    start: { nl: 'Oude binnenstad, Heidelberg', de: 'Altstadt, Heidelberg', en: 'Old town, Heidelberg', ar: 'المدينة القديمة، هايدلبرغ' },
    startLine: { nl: 'Start in de oude binnenstad', de: 'Start in der Altstadt', en: 'Starts in the old town', ar: 'تبدأ في المدينة القديمة' },
    opening: { quote: 0, after: 1 },
    playLines: [0, 1, 2],
  },
};

/** How a city is shown on the cities pages: its photographs. Heidelberg's stories use invented places, so its photographs show the setting only. */
export interface CityPresentation {
  /** The photograph beside the city on the cities overview. */
  photo: PhotoId;
  /** The large photograph on the city's own page. */
  hero: PhotoId;
  /** Photographs of places, in reading order (for Arnhem: the places of the route, in route order). */
  places: PhotoId[];
  /** True when the places are the chapters' real places, so a caption may name the chapter. */
  realPlaces: boolean;
}

const presentationByCity: Record<string, CityPresentation> = {
  arnhem: {
    photo: 'arnhem-eusebius-duivelshuis',
    hero: 'arnhem-eusebius-duivelshuis',
    places: ['arnhem-korenmarkt', 'arnhem-duivelshuis-2024', 'arnhem-sabelspoort', 'arnhem-eusebius', 'arnhem-sonsbeek', 'arnhem-rijnkade-avond'],
    realPlaces: true,
  },
  heidelberg: {
    photo: 'heidelberg-bridge-night-2',
    hero: 'heidelberg-bridge-night',
    places: ['heidelberg-bridgegate-night'],
    realPlaces: false,
  },
};

export function getCityPresentation(slug: string): CityPresentation {
  const p = presentationByCity[slug];
  if (!p) throw new Error(`No presentation for city: ${slug}`);
  return p;
}

/** The slugs that have a page layout, in the order the home page shows them. */
export const presentedSlugs = Object.keys(presentationBySlug);

export function getPresentation(slug: string): StoryPresentation {
  const p = presentationBySlug[slug];
  if (!p) throw new Error(`No presentation for story: ${slug}`);
  return p;
}

/** The schematic route of a story, in a 400 x 132 box: the line, the numbered checkpoints and where the team starts. */
export interface RouteShape {
  line: string;
  start: [number, number];
  /** Where the label "Start" sits. */
  startLabel: [number, number];
  checkpoints: [number, number][];
  /** Extra branches (the endings), as separate lines. */
  branches?: { line: string; end: [number, number] }[];
}

export const routeShapes: Record<string, RouteShape> = {
  'het-duivelshuis': {
    line: '22,70 58,70 92,36 180,36 216,72 256,72 296,112 344,112',
    start: [22, 70],
    startLabel: [22, 96],
    checkpoints: [[58, 70], [92, 36], [136, 36], [180, 36], [216, 72], [256, 72], [296, 112], [344, 112]],
  },
  'lost-manuscript': {
    line: '22,108 78,108 118,68 118,24 198,24 278,24 318,64 318,108 238,108',
    start: [22, 108],
    startLabel: [22, 86],
    checkpoints: [[78, 108], [118, 68], [118, 24], [198, 24], [278, 24], [318, 64], [318, 108], [238, 108]],
  },
  'neckar-ring': {
    line: '22,66 58,66 92,32 126,32 160,66 194,66 228,100 262,100 296,66 334,28',
    start: [22, 66],
    startLabel: [22, 92],
    checkpoints: [[58, 66], [92, 32], [126, 32], [160, 66], [194, 66], [228, 100], [262, 100], [296, 66]],
    branches: [
      { line: '296,66 334,66', end: [336, 66] },
      { line: '296,66 334,104', end: [336, 104] },
      { line: '', end: [336, 28] },
    ],
  },
};
