// The photographs of the site: real places, taken from Wikimedia Commons under open licences. Each entry
// carries what the credit line needs (author, licence, the Commons file page) and what a reader needs
// (alt text and a caption in every language). The files sit in public/photos, at most 2000 px on the long
// edge. tests/unit/photos.test.ts checks that every entry has its file, with the stated size.
import type { Localized } from './types';

export type PhotoId =
  | 'arnhem-duivelshuis-detail'
  | 'arnhem-duivelshuis-2024'
  | 'arnhem-eusebius'
  | 'arnhem-eusebius-duivelshuis'
  | 'heidelberg-bridge-night'
  | 'heidelberg-bridge-night-2'
  | 'heidelberg-bridge-night-3'
  | 'heidelberg-bridgegate-night';

export interface Photo {
  id: PhotoId;
  src: string;
  width: number;
  height: number;
  author: string;
  licence: string;
  /** The file's title on Wikimedia Commons, without the "File:" prefix. */
  commonsTitle: string;
  alt: Localized;
  /** A bold lead-in and the rest of the sentence, shown under the photo. */
  title: Localized;
  text: Localized;
  /** Short place name, for the dateline. */
  place: Localized;
}

const photos: Photo[] = [
  {
    id: 'arnhem-duivelshuis-detail',
    src: '/photos/arnhem-duivelshuis-detail.jpg',
    width: 1500,
    height: 2000,
    author: 'Marcelmulder68',
    licence: 'CC BY-SA 3.0 nl',
    commonsTitle: 'Duivelshuis detail.JPG',
    alt: {
      nl: 'Stenen gevelfiguur met hoorns en een strenge blik op de hoek van het Duivelshuis in Arnhem, tegen rode baksteen.',
      de: 'Steinerne Fassadenfigur mit Hörnern und strengem Blick an der Ecke des Teufelshauses in Arnheim, vor rotem Backstein.',
      en: 'A stone façade figure with horns and a stern look on the corner of the Devil’s House in Arnhem, against red brick.',
      ar: 'تمثال حجري على واجهة بيت الشيطان في أرنم: شخصية ذات قرنين ونظرة صارمة عند زاوية البيت، أمام الطوب الأحمر.',
    },
    title: {
      nl: 'Een van de stenen duivels',
      de: 'Eine der steinernen Teufelsfiguren',
      en: 'One of the stone devils',
      ar: 'أحد الشياطين الحجرية',
    },
    text: {
      nl: 'aan het Duivelshuis, Arnhem.',
      de: 'am Teufelshaus in Arnheim.',
      en: 'on the Devil’s House, Arnhem.',
      ar: 'على بيت الشيطان في أرنم.',
    },
    place: { nl: 'Duivelshuis, Arnhem', de: 'Teufelshaus, Arnheim', en: 'Devil’s House, Arnhem', ar: 'بيت الشيطان، أرنم' },
  },
  {
    id: 'arnhem-eusebius-duivelshuis',
    src: '/photos/arnhem-eusebius-duivelshuis.jpg',
    width: 2000,
    height: 1586,
    author: 'Apdency',
    licence: 'CC0',
    commonsTitle: 'Eusebiuskerk, Duivelshuis, stadhuis.jpg',
    alt: {
      nl: 'De Eusebiuskerk, met daarvoor het Duivelshuis met zijn torentjes en het stadhuis, op een zonnige dag in het centrum van Arnhem.',
      de: 'Die Eusebiuskirche, davor das Teufelshaus mit seinen Türmchen und das Rathaus, an einem sonnigen Tag im Zentrum von Arnheim.',
      en: 'The Eusebius church, with the Devil’s House and its small towers and the town hall in front of it, on a sunny day in central Arnhem.',
      ar: 'كنيسة أوزيبيوس، وأمامها بيت الشيطان بأبراجه الصغيرة ومبنى البلدية، في يوم مشمس وسط مدينة أرنم.',
    },
    title: {
      nl: 'Eusebiuskerk, Duivelshuis en stadhuis',
      de: 'Eusebiuskirche, Teufelshaus und Rathaus',
      en: 'Eusebius church, Devil’s House and town hall',
      ar: 'كنيسة أوزيبيوس وبيت الشيطان والبلدية',
    },
    text: {
      nl: 'staan vlak bij elkaar, in het hart van de route.',
      de: 'stehen dicht beieinander, im Herzen der Route.',
      en: 'stand close together, in the heart of the route.',
      ar: 'قريبة من بعضها، في قلب المسار.',
    },
    place: { nl: 'Eusebiuskerk, Arnhem', de: 'Eusebiuskirche, Arnheim', en: 'Eusebius church, Arnhem', ar: 'كنيسة أوزيبيوس، أرنم' },
  },
  {
    id: 'arnhem-duivelshuis-2024',
    src: '/photos/arnhem-duivelshuis-2024.jpg',
    width: 2000,
    height: 1334,
    author: 'Michielverbeek',
    licence: 'CC BY 4.0',
    commonsTitle: 'Arnhem, het Duivelshuis RM8346 en een deel van het gemeentehuis IMG 3901 2024-07-15 14.50.jpg',
    alt: {
      nl: 'De gevel van het Duivelshuis in Arnhem: een renaissancehuis met trapgevel, torentje en arcade, rechts een deel van het moderne gemeentehuis.',
      de: 'Die Fassade des Teufelshauses in Arnheim: ein Renaissancehaus mit Treppengiebel, Türmchen und Arkade, rechts ein Teil des modernen Rathauses.',
      en: 'The façade of the Devil’s House in Arnhem: a Renaissance house with a stepped gable, a small tower and an arcade, with part of the modern town hall on the right.',
      ar: 'واجهة بيت الشيطان في أرنم: بيت من عصر النهضة بجملون مدرّج وبرج صغير ورواق، وعلى اليمين جزء من مبنى البلدية الحديث.',
    },
    title: { nl: 'Het Duivelshuis', de: 'Das Teufelshaus', en: 'The Devil’s House', ar: 'بيت الشيطان' },
    text: {
      nl: 'met rechts een deel van het gemeentehuis.',
      de: 'mit einem Teil des Rathauses rechts.',
      en: 'with part of the town hall on the right.',
      ar: 'وعلى اليمين جزء من مبنى البلدية.',
    },
    place: { nl: 'Duivelshuis, Arnhem', de: 'Teufelshaus, Arnheim', en: 'Devil’s House, Arnhem', ar: 'بيت الشيطان، أرنم' },
  },
  {
    id: 'arnhem-eusebius',
    src: '/photos/arnhem-eusebius.jpg',
    width: 2000,
    height: 1289,
    author: 'Michielverbeek',
    licence: 'CC BY 4.0',
    commonsTitle: 'Arnhem, de Eusebiuskerk RM8336 IMG 3889 2024-07-15 14.41.jpg',
    alt: {
      nl: 'De hoge toren van de Eusebiuskerk in Arnhem boven een plein met lantaarnpalen en bomen.',
      de: 'Der hohe Turm der Eusebiuskirche in Arnheim über einem Platz mit Laternen und Bäumen.',
      en: 'The tall tower of the Eusebius church in Arnhem above a square with lamp posts and trees.',
      ar: 'البرج العالي لكنيسة أوزيبيوس في أرنم فوق ساحة فيها أعمدة إنارة وأشجار.',
    },
    title: { nl: 'De Eusebiuskerk', de: 'Die Eusebiuskirche', en: 'The Eusebius church', ar: 'كنيسة أوزيبيوس' },
    text: {
      nl: 'is de plek waar je de klokken leest.',
      de: 'ist der Ort, an dem du die Glocken liest.',
      en: 'is where you read the bells.',
      ar: 'هي المكان الذي تقرأ فيه الأجراس.',
    },
    place: { nl: 'Eusebiuskerk, Arnhem', de: 'Eusebiuskirche, Arnheim', en: 'Eusebius church, Arnhem', ar: 'كنيسة أوزيبيوس، أرنم' },
  },
  {
    id: 'heidelberg-bridge-night-2',
    src: '/photos/heidelberg-bridge-night-2.jpg',
    width: 2000,
    height: 1336,
    author: 'Mr.Nutt',
    licence: 'CC BY-SA 4.0',
    commonsTitle: 'Alte Brücke Nacht.jpg',
    alt: {
      nl: 'Heidelberg bij schemer van bovenaf: de brugpoort met twee torens, de Alte Brücke over de donkere Neckar en verlichte huizen op de overkant.',
      de: 'Heidelberg in der Dämmerung von oben: das Brückentor mit zwei Türmen, die Alte Brücke über dem dunklen Neckar und beleuchtete Häuser am anderen Ufer.',
      en: 'Heidelberg at dusk from above: the bridge gate with two towers, the Alte Brücke over the dark Neckar and lit houses on the far bank.',
      ar: 'هايدلبرغ عند الغسق من الأعلى: بوابة الجسر ببرجيها، والجسر القديم فوق نهر نيكار المظلم، وبيوت مضاءة على الضفة الأخرى.',
    },
    title: {
      nl: 'De brugpoort en de Alte Brücke',
      de: 'Das Brückentor und die Alte Brücke',
      en: 'The bridge gate and the Alte Brücke',
      ar: 'بوابة الجسر والجسر القديم',
    },
    text: { nl: 'van bovenaf gezien.', de: 'von oben gesehen.', en: 'seen from above.', ar: 'من الأعلى.' },
    place: { nl: 'Alte Brücke, Heidelberg', de: 'Alte Brücke, Heidelberg', en: 'Alte Brücke, Heidelberg', ar: 'الجسر القديم، هايدلبرغ' },
  },
  {
    id: 'heidelberg-bridge-night-3',
    src: '/photos/heidelberg-bridge-night-3.jpg',
    width: 2000,
    height: 1327,
    author: 'Couchkuschler',
    licence: 'CC BY-SA 3.0',
    commonsTitle: 'Karl-Theodor-Brücke (Alte Brücke) Heidelberg bei Nacht.jpg',
    alt: {
      nl: 'Een verlichte pijler van de Alte Brücke met een stenen beeld erop, ’s nachts boven het zwarte water van de Neckar; achteraan de brugpoort en de oude stad.',
      de: 'Ein beleuchteter Pfeiler der Alten Brücke mit einer Steinfigur, nachts über dem schwarzen Wasser des Neckars; im Hintergrund das Brückentor und die Altstadt.',
      en: 'A lit pier of the Alte Brücke with a stone statue on it, at night above the black water of the Neckar; the bridge gate and the old town behind it.',
      ar: 'دعامة مضاءة في الجسر القديم عليها تمثال حجري، ليلاً فوق مياه نيكار السوداء؛ وخلفها بوابة الجسر والمدينة القديمة.',
    },
    title: {
      nl: 'Pijler en beeld op de Alte Brücke',
      de: 'Pfeiler und Figur auf der Alten Brücke',
      en: 'A pier and statue on the Alte Brücke',
      ar: 'دعامة وتمثال على الجسر القديم',
    },
    text: {
      nl: 'met de brugpoort erachter.',
      de: 'mit dem Brückentor dahinter.',
      en: 'with the bridge gate behind them.',
      ar: 'وخلفهما بوابة الجسر.',
    },
    place: { nl: 'Alte Brücke, Heidelberg', de: 'Alte Brücke, Heidelberg', en: 'Alte Brücke, Heidelberg', ar: 'الجسر القديم، هايدلبرغ' },
  },
  {
    id: 'heidelberg-bridge-night',
    src: '/photos/heidelberg-bridge-night.jpg',
    width: 2000,
    height: 1335,
    author: 'Adrian Eißler',
    licence: 'CC BY-SA 4.0',
    commonsTitle: 'Heidelberg Alte Bruecke Nacht.jpg',
    alt: {
      nl: 'De Alte Brücke in Heidelberg bij avond: verlichte stenen bogen boven de Neckar en de twee witte torens van de brugpoort.',
      de: 'Die Alte Brücke in Heidelberg am Abend: beleuchtete Steinbögen über dem Neckar und die zwei weißen Türme des Brückentors.',
      en: 'The Alte Brücke in Heidelberg in the evening: lit stone arches over the Neckar and the two white towers of the bridge gate.',
      ar: 'الجسر القديم في هايدلبرغ مساءً: أقواس حجرية مضاءة فوق نهر نيكار وبرجا بوابة الجسر الأبيضان.',
    },
    title: { nl: 'De Alte Brücke en de Neckar', de: 'Die Alte Brücke und der Neckar', en: 'The Alte Brücke and the Neckar', ar: 'الجسر القديم ونهر نيكار' },
    text: { nl: 'bij avond.', de: 'am Abend.', en: 'in the evening.', ar: 'في المساء.' },
    place: { nl: 'Alte Brücke, Heidelberg', de: 'Alte Brücke, Heidelberg', en: 'Alte Brücke, Heidelberg', ar: 'الجسر القديم، هايدلبرغ' },
  },
  {
    id: 'heidelberg-bridgegate-night',
    src: '/photos/heidelberg-bridgegate-night.jpg',
    width: 1333,
    height: 2000,
    author: 'Christian Maurer',
    licence: 'CC BY-SA 3.0',
    commonsTitle: 'Heidelberg-Karl-Theodor-Brücke-Brückentor-nacht.jpg',
    alt: {
      nl: 'De brugpoort van Heidelberg bij nacht: twee verlichte torens met koepeldaken, gezien vanaf de Alte Brücke; rechts een standbeeld op een sokkel.',
      de: 'Das Brückentor von Heidelberg bei Nacht: zwei beleuchtete Türme mit Kuppeldächern, von der Alten Brücke aus gesehen; rechts eine Statue auf einem Sockel.',
      en: 'The bridge gate of Heidelberg at night: two lit towers with domed roofs, seen from the Alte Brücke; a statue on a plinth on the right.',
      ar: 'بوابة الجسر في هايدلبرغ ليلاً: برجان مضاءان بسقفين مقبّبين، من الجسر القديم؛ وعلى اليمين تمثال على قاعدة.',
    },
    title: { nl: 'De brugpoort', de: 'Das Brückentor', en: 'The bridge gate', ar: 'بوابة الجسر' },
    text: {
      nl: 'gezien vanaf de Alte Brücke.',
      de: 'von der Alten Brücke aus gesehen.',
      en: 'seen from the Alte Brücke.',
      ar: 'من الجسر القديم.',
    },
    place: { nl: 'Alte Brücke, Heidelberg', de: 'Alte Brücke, Heidelberg', en: 'Alte Brücke, Heidelberg', ar: 'الجسر القديم، هايدلبرغ' },
  },
];

export const photoList: readonly Photo[] = photos;

export function getPhoto(id: PhotoId): Photo {
  const photo = photos.find((p) => p.id === id);
  if (!photo) throw new Error(`Unknown photo: ${id}`);
  return photo;
}

/** The Commons page of the file, where author and licence are stated. */
export function commonsUrl(photo: Photo): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.commonsTitle.replace(/ /g, '_')).replace(/%2C/g, ',')}`;
}

