import type { Adventure, Authored } from '../types';

// "The Neckar Ring" - an original story: a cursed ring that will not come off, a pursuer who can only
// move through reflections, and a shopkeeper who knew more than she said. Every name, place and legend
// in it is fiction. All checkpoints are simulated and no puzzle depends on a fact about Heidelberg.

const instructions = {
  de: [
    'Spielt gemeinsam auf einem Gerät. Eine Person liest vor, alle rätseln mit.',
    'Alles, was ihr erfahrt, landet in der Ermittlungsakte: Spuren, Personen, Aussagen und eure eigenen Notizen.',
    'An jedem Kontrollpunkt bestätigt ihr eure Ankunft. In der Demo sind alle Kontrollpunkte simuliert.',
    'Der Fortschritt wird auf diesem Gerät gespeichert. Ihr könnt jederzeit pausieren.',
    'Achtet draußen auf den Verkehr und betretet keine privaten oder gesperrten Bereiche.',
  ],
  en: [
    'Play together on one device. One person reads aloud, everyone solves.',
    'Everything you learn goes into the case journal: clues, people, statements and your own notes.',
    'At each checkpoint you confirm your arrival. In the demo every checkpoint is simulated.',
    'Progress is saved on this device. Pause at any time.',
    'Outdoors, mind the traffic and never enter private or closed-off areas.',
  ],
  ar: [
    'العبوا معاً على جهاز واحد. شخص يقرأ بصوت عالٍ، والجميع يحلّ.',
    'كل ما تعرفونه يُحفظ في ملف القضية: الأدلة والأشخاص والأقوال وملاحظاتكم الخاصة.',
    'عند كل نقطة تفتيش تؤكدون وصولكم. في النسخة التجريبية كل نقاط التفتيش افتراضية.',
    'يُحفظ التقدّم على هذا الجهاز، ويمكنكم التوقف في أي وقت.',
    'في الخارج انتبهوا لحركة السير، ولا تدخلوا أي مكان خاص أو مغلق.',
  ],
};

export const neckarRing: Authored<Adventure> = {
  slug: 'neckar-ring',
  city: 'heidelberg',
  status: 'published',
  isDemo: true,
  art: 'night',
  title: { de: 'Der Ring vom Neckar', en: 'The Neckar Ring', ar: 'خاتم النيكار' },
  tagline: {
    de: 'Ein Ring, der nicht mehr abgeht. Ein Verfolger in jedem Spiegelbild. Und eine Händlerin, die mehr weiß, als sie sagt.',
    en: 'A ring that will not come off. A pursuer in every reflection. And a shopkeeper who knows more than she says.',
    ar: 'خاتم لا يخرج من إصبعك. ملاحِق في كل انعكاس. وبائعة تعرف أكثر مما تقول.',
  },
  description: {
    de: 'Ein alter Silberring zeigt dir die verborgenen Zeichen der Stadt, doch jedes Mal, wenn du seine Kraft nutzt, kommt der Graue Sammler näher. Befrage Zeugen, setze ein zerrissenes Zunftbuch zusammen, entschlüssle einen Brief mit dem Chiffrierrad und finde heraus, wer dir den Fluch wirklich angehängt hat. Acht Kapitel, drei Enden.',
    en: 'An old silver ring shows you the city’s hidden signs, but every time you use its power the Grey Collector comes closer. Question witnesses, piece a torn guild ledger back together, decode a letter with a cipher wheel and find out who really handed you the curse. Eight chapters, three endings.',
    ar: 'خاتم فضة قديم يكشف لك علامات المدينة المخبأة، لكن كلما استخدمت قوّته اقترب الجامع الرمادي. استجوب الشهود، ورتّب صفحات سجلّ ممزق، وفكّ رسالة بعجلة الشيفرة، واكتشف من سلّمك اللعنة حقاً. ثمانية فصول وثلاث نهايات.',
  },
  theme: 'escape',
  groupTypes: ['friends', 'couples'],
  difficulty: 'hard',
  durationMinutes: { min: 120, max: 180 },
  distanceKm: 4.5,
  teamSize: { min: 1, max: 5 },
  minAge: 14,
  languages: ['de', 'en', 'ar'],
  priceCents: 3490,
  tier: 'premium',
  meetingPoint: {
    de: 'Altstadt Heidelberg. Der genaue Treffpunkt wird nach der Validierung der Route vor Ort festgelegt.',
    en: 'Heidelberg old town. The exact meeting point will be set once the route has been validated on foot.',
    ar: 'البلدة القديمة في هايدلبرغ. سيُحدَّد مكان اللقاء بدقة بعد التحقق من المسار على أرض الواقع.',
  },
  accessibility: {
    de: 'Die Demo lässt sich überall spielen, auch im Sitzen. Für die Outdoor-Version werden Stufen, Steigungen und Untergründe bei der Begehung erfasst und hier veröffentlicht.',
    en: 'The demo can be played anywhere, seated included. For the outdoor version, steps, slopes and surfaces will be recorded when the route is walked, and published here.',
    ar: 'يمكن لعب النسخة التجريبية من أي مكان، حتى وأنت جالس. أما النسخة الخارجية فسنوثّق الدرج والمنحدرات وطبيعة الأرض عند تجربة المسار، وننشرها هنا.',
  },
  overview: {
    de: [
      'Acht Kapitel mit acht verschiedenen Rätselarten: Zahlenschloss, unsichtbare Schrift im Licht des Rings, ein Verhör, eine Flucht, ein zerrissenes Zunftbuch, die Punzen im Ring, ein Chiffrierrad und eine Anklage mit Beweis.',
      'Hinweise heißen hier „Kraft des Rings nutzen“. Jeder bringt den Grauen Sammler näher.',
      'Die Ermittlungsakte sammelt Spuren, Personen und Aussagen, dazu eure eigenen Notizen.',
      'Drei Schwierigkeitsstufen, Sterne für jedes Kapitel und drei verschiedene Enden.',
    ],
    en: [
      'Eight chapters, eight kinds of puzzle: a number lock, invisible writing in the ring’s light, an interrogation, an escape, a torn guild ledger, the hallmarks inside the ring, a cipher wheel and an accusation with proof.',
      'Hints are called “use the ring’s power”. Each one brings the Grey Collector closer.',
      'The case journal collects clues, people and statements, plus your own notes.',
      'Three difficulty levels, stars for every chapter and three different endings.',
    ],
    ar: [
      'ثمانية فصول وثمانية أنواع من الألغاز: قفل أرقام، وكتابة خفية في ضوء الخاتم، واستجواب، وهروب، وسجلّ نقابة ممزق، والأختام داخل الخاتم، وعجلة شيفرة، واتهام بالدليل.',
      'التلميحات هنا اسمها «استخدام قوة الخاتم»، وكل تلميح يقرّب الجامع الرمادي.',
      'ملف القضية يجمع الأدلة والأشخاص والأقوال، إضافة إلى ملاحظاتكم الخاصة.',
      'ثلاثة مستويات صعوبة، ونجوم لكل فصل، وثلاث نهايات مختلفة.',
    ],
  },
  instructions,
  faq: [
    {
      q: { de: 'Ist die Geschichte gruselig?', en: 'Is the story scary?', ar: 'هل القصة مخيفة؟' },
      a: {
        de: 'Spannend und düster, aber ohne Gewalt oder Schockeffekte. Empfohlen ab 14 Jahren.',
        en: 'Tense and dark, but with no violence or jump scares. Recommended from age 14.',
        ar: 'مشوّقة وقاتمة، لكن بلا عنف ولا مشاهد مفاجئة مرعبة. مناسبة من عمر 14 سنة.',
      },
    },
    {
      q: { de: 'Wie lange dauert es?', en: 'How long does it take?', ar: 'كم يستغرق اللعب؟' },
      a: {
        de: 'Etwa zwei bis drei Stunden mit den Wegen zwischen den Kontrollpunkten. Ihr könnt jederzeit pausieren.',
        en: 'About two to three hours including the walks between checkpoints. You can pause at any time.',
        ar: 'من ساعتين إلى ثلاث ساعات تقريباً مع المشي بين نقاط التفتيش، ويمكنكم التوقف في أي وقت.',
      },
    },
    {
      q: { de: 'Was passiert, wenn der Sammler mich erreicht?', en: 'What happens if the Collector reaches me?', ar: 'ماذا يحدث إذا وصل إليّ الجامع؟' },
      a: {
        de: 'Nichts, was das Spiel beendet. Die Anzeige erzählt die Geschichte mit und kostet Sterne und Erfahrung.',
        en: 'Nothing that ends the game. The meter is part of the story and costs stars and experience.',
        ar: 'لا شيء ينهي اللعبة. المؤشر جزء من القصة ويكلّفك نجوماً ونقاط خبرة.',
      },
    },
    {
      q: { de: 'Was kostet das Abenteuer?', en: 'What does the adventure cost?', ar: 'كم تكلّف المغامرة؟' },
      a: {
        de: 'Die Demo ist kostenlos. Für die Outdoor-Version ist ein Premium-Preis von 34,90 € pro Team (bis 5 Personen, inkl. MwSt.) vorgesehen. Der Kauf ist noch nicht möglich.',
        en: 'The demo is free. The outdoor version is planned as a premium adventure at €34.90 per team (up to 5 people, VAT included). Purchases are not open yet.',
        ar: 'النسخة التجريبية مجانية. السعر المقترح للنسخة الخارجية 34.90 يورو لكل فريق كمغامرة مميزة (حتى 5 أشخاص، شاملاً الضريبة). الشراء غير متاح بعد.',
      },
    },
  ],
  pursuit: {
    name: { de: 'Der Graue Sammler', en: 'The Grey Collector', ar: 'الجامع الرمادي' },
    hintLabel: { de: 'Kraft des Rings nutzen', en: 'Use the ring’s power', ar: 'استخدم قوة الخاتم' },
    closer: { de: 'Der Graue Sammler kommt näher …', en: 'The Grey Collector draws closer…', ar: 'الجامع الرمادي يقترب…' },
    levels: [
      { de: 'weit entfernt', en: 'far away', ar: 'بعيد' },
      { de: 'auf deiner Spur', en: 'on your trail', ar: 'يتتبّع أثرك' },
      { de: 'ganz nah', en: 'close', ar: 'قريب جداً' },
      { de: 'direkt hinter dir', en: 'right behind you', ar: 'خلفك مباشرة' },
    ],
  },
  people: [
    {
      id: 'hedda',
      voice: 'old',
      appears: 'box',
      name: { de: 'Hedda Lorenz', en: 'Hedda Lorenz', ar: 'هيدا لورنتس' },
      role: { de: 'Besitzerin des Antiquitätenladens', en: 'Owner of the antique shop', ar: 'صاحبة محل الأنتيكات' },
      notes: [
        { after: 'box', text: { de: 'Gab dir das Kästchen: „Es hat lange auf dich gewartet.“', en: 'Gave you the box: “It has been waiting for you.”', ar: 'أعطتك الصندوق: «كان ينتظرك منذ زمن».' } },
        { after: 'watchman', text: { de: 'Trug vor vierzig Jahren denselben Ring.', en: 'Wore the same ring forty years ago.', ar: 'كانت تلبس الخاتم نفسه قبل أربعين عاماً.' } },
        { after: 'letter', text: { de: 'Hat dir den Ring absichtlich gegeben, aus Angst.', en: 'Gave you the ring on purpose, out of fear.', ar: 'أعطتك الخاتم عمداً، بدافع الخوف.' } },
      ],
    },
    {
      id: 'kaspar',
      voice: 'man',
      appears: 'watchman',
      name: { de: 'Kaspar Wendt', en: 'Kaspar Wendt', ar: 'كاسبار فِنت' },
      role: { de: 'Nachtwächter am Turmplatz', en: 'Night watchman of the tower square', ar: 'حارس ليلي في ساحة البرج' },
      notes: [
        { after: 'watchman', text: { de: 'Sieht den grauen Mann seit einer Woche, immer nur in Fenstern.', en: 'Has seen the grey man for a week, only ever in windows.', ar: 'يرى الرجل الرمادي منذ أسبوع، دائماً في النوافذ فقط.' } },
      ],
    },
    {
      id: 'mira',
      voice: 'woman',
      appears: 'chase',
      name: { de: 'Mira Falk', en: 'Mira Falk', ar: 'ميرا فالك' },
      role: { de: 'Buchbinderin', en: 'Bookbinder', ar: 'مجلّدة كتب' },
      notes: [
        { after: 'chase', text: { de: 'Hat dich vor dem Sammler in ihre Werkstatt gerettet.', en: 'Pulled you into her workshop, away from the Collector.', ar: 'أدخلتك ورشتها وأنقذتك من الجامع.' } },
        { after: 'ledger', text: { de: 'Ihre Zunft führte das Buch, in dem Valens Handel steht.', en: 'Her guild kept the ledger that records Valen’s bargain.', ar: 'نقابتها تحتفظ بالسجل الذي دُوّنت فيه صفقة فالين.' } },
      ],
    },
    {
      id: 'valen',
      voice: 'man',
      appears: 'goldsmith',
      name: { de: 'Valen', en: 'Valen', ar: 'فالين' },
      role: { de: 'Goldschmied, vor hundert Jahren', en: 'Goldsmith, a hundred years ago', ar: 'صائغ عاش قبل مئة عام' },
      notes: [
        { after: 'goldsmith', text: { de: 'Verkaufte seinen Namen gegen sein Talent. Sein Name steht im Ring.', en: 'Sold his name for his talent. His name is stamped in the ring.', ar: 'باع اسمه مقابل موهبته، واسمه مختوم داخل الخاتم.' } },
      ],
    },
    {
      id: 'collector',
      voice: 'ghost',
      appears: 'box',
      name: { de: 'Der Graue Sammler', en: 'The Grey Collector', ar: 'الجامع الرمادي' },
      role: { de: 'Sammelt Namen. Lebt in Spiegelbildern.', en: 'Collects names. Lives in reflections.', ar: 'يجمع الأسماء ويعيش في الانعكاسات.' },
      notes: [
        { after: 'chase', text: { de: 'Kann nur durch Glas und Wasser folgen.', en: 'Can only follow through glass and water.', ar: 'لا يلحق بك إلا عبر الزجاج والماء.' } },
      ],
    },
  ],
  items: [
    {
      id: 'cursed-ring',
      icon: 'ring',
      model: { kind: 'ring' },
      name: { de: 'Der Ring vom Neckar', en: 'The Neckar ring', ar: 'خاتم النيكار' },
      description: {
        de: 'Silber, eiskalt, er geht nicht mehr ab. In seinem Licht zeigen sich verborgene Zeichen.',
        en: 'Silver, ice-cold, and it will not come off. In its light, hidden signs appear.',
        ar: 'فضة باردة كالثلج، ولا يخرج من إصبعك. في ضوئه تظهر علامات خفية.',
      },
    },
    {
      id: 'chalk-sign',
      icon: 'letter',
      model: { kind: 'paper', art: 'quill' },
      name: { de: 'Kreidezeichen', en: 'Chalk sign', ar: 'علامة طباشير' },
      description: {
        de: 'Abgezeichnet von einer Mauer: eine Feder, gekreuzt mit einer Nadel. Das Zeichen der Buchbinder.',
        en: 'Copied from a wall: a quill crossed with a needle. The sign of the bookbinders.',
        ar: 'منسوخة عن جدار: ريشة كتابة متقاطعة مع إبرة. علامة مجلّدي الكتب.',
      },
    },
    {
      id: 'mira-bookmark',
      icon: 'page',
      model: { kind: 'leather' },
      name: { de: 'Miras Lesezeichen', en: 'Mira’s bookmark', ar: 'فاصل كتاب ميرا' },
      description: {
        de: 'Ein Lederstreifen mit den Punzen der alten Goldschmiede, jede mit einer kleinen Zahl.',
        en: 'A strip of leather showing the hallmarks of the old goldsmiths, each with a small number.',
        ar: 'شريط جلدي عليه أختام الصاغة القدامى، وبجانب كل ختم رقم صغير.',
      },
    },
    {
      id: 'ledger-page',
      icon: 'page',
      model: { kind: 'paper', art: 'lines' },
      name: { de: 'Seite aus dem Zunftbuch', en: 'Page from the guild ledger', ar: 'صفحة من سجلّ النقابة' },
      description: {
        de: '„Im Jahr der großen Flut verkaufte der Goldschmied auf der Brücke, um Mitternacht, seinen wahren Namen an einen grauen Fremden. Der Name: siehe die Punzen.“',
        en: '“In the year of the great flood, the goldsmith sold his true name to a grey stranger, on the bridge, at midnight. The name: see the hallmarks.”',
        ar: '«في سنة الطوفان الكبير باع الصائغ اسمه الحقيقي لغريب رمادي، على الجسر، عند منتصف الليل. الاسم: انظر الأختام».',
      },
    },
    {
      id: 'hallmark-rubbing',
      icon: 'page',
      model: { kind: 'paper', art: 'rubbing' },
      name: { de: 'Abrieb der Punzen', en: 'Hallmark rubbing', ar: 'نسخة الأختام' },
      description: {
        de: 'Mit Bleistift von der Innenseite des Rings abgerieben. Darauf steht ein Name: VALEN.',
        en: 'Rubbed in pencil from the inside of the ring. It spells a name: VALEN.',
        ar: 'منسوخة بقلم الرصاص عن باطن الخاتم، ويظهر عليها اسم: VALEN (فالين).',
      },
    },
    {
      id: 'hedda-letter',
      icon: 'letter',
      model: { kind: 'paper', art: 'lines' },
      name: { de: 'Heddas Brief', en: 'Hedda’s letter', ar: 'رسالة هيدا' },
      description: {
        de: 'Versteckt im Futter des Kästchens, verschlüsselt, unterschrieben mit „H.“: „Verzeih mir. Ich hatte Angst.“',
        en: 'Hidden in the lining of the box, enciphered, signed “H.”: “Forgive me. I was afraid.”',
        ar: 'مخبأة في بطانة الصندوق، مشفّرة، وموقّعة بـ «هـ»: «سامحني، لقد خفت».',
      },
    },
  ],
  chapters: [
    {
      id: 'box',
      title: { de: 'Das verschlossene Kästchen', en: 'The Locked Box', ar: 'الصندوق المقفول' },
      story: {
        de: [
          'In einem winzigen Antiquitätenladen schiebt dir die alte Besitzerin, Hedda Lorenz, ein Holzkästchen über den Tresen. „Das gehört dir. Es hat lange auf dich gewartet.“',
          'Ihre Hände zittern, als sie es loslässt. Das Kästchen hat ein Zahlenschloss mit drei Ziffern. Darunter klebt ein vergilbter Zettel.',
        ],
        en: [
          'In a tiny antique shop the old owner, Hedda Lorenz, slides a wooden box across the counter. “This is yours. It has been waiting for you for a long time.”',
          'Her hands shake as she lets go of it. The box has a three-digit lock. A yellowed note is stuck underneath.',
        ],
        ar: [
          'في محل أنتيكات صغير، تدفع صاحبة المحل العجوز، هيدا لورنتس، صندوقاً خشبياً نحوك على الطاولة: «هذا لك. كان ينتظرك منذ زمن طويل».',
          'ترتجف يداها وهي تتركه. على الصندوق قفل من ثلاثة أرقام، وتحته ورقة صفراء ملصقة.',
        ],
      },
      checkpoint: { id: 'cp-shop', name: { de: 'Der Antiquitätenladen', en: 'The antique shop', ar: 'محل الأنتيكات' }, simulated: true, mapPosition: { x: 12, y: 30 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4093, lng: 8.6937 }, code: 'cq-neckar-ring-1' },
      puzzle: {
        type: 'number-code',
        prompt: {
          de: 'Lies den Zettel. Welcher dreistellige Code öffnet das Kästchen?',
          en: 'Read the note. Which three-digit code opens the box?',
          ar: 'اقرأ الورقة. ما الرمز المكوّن من ثلاثة أرقام الذي يفتح الصندوق؟',
        },
        material: {
          de: ['Die erste Ziffer: so viele Seiten wie ein Dreieck.', 'Die zweite: das Doppelte der ersten.', 'Die dritte: die Summe der ersten beiden.'],
          en: ['The first digit: as many sides as a triangle.', 'The second: double the first.', 'The third: the sum of the first two.'],
          ar: ['الرقم الأول: عدد أضلاع المثلث.', 'الرقم الثاني: ضعف الرقم الأول.', 'الرقم الثالث: مجموع الرقمين الأول والثاني.'],
        },
        input: 'numeric',
        lock: { digits: 3 },
        hints: [
          { de: 'Ein Dreieck hat drei Seiten.', en: 'A triangle has three sides.', ar: 'للمثلث ثلاثة أضلاع.' },
          { de: '3, dann 6, dann 3 + 6.', en: '3, then 6, then 3 + 6.', ar: '3، ثم 6، ثم 3 + 6.' },
          { de: 'Der Code ist 369.', en: 'The code is 369.', ar: 'الرمز هو 369.' },
        ],
      },
      success: {
        de: 'Im Kästchen liegt ein Silberring mit fremder Gravur. Du streifst ihn über. Er zieht sich zusammen und lässt sich nicht mehr abnehmen. Eine kalte Stimme flüstert: „Du hast ihn gefunden … und ich werde dich finden.“ Als du aufsiehst, hat Hedda dir den Rücken zugedreht.',
        en: 'Inside lies a silver ring with a strange engraving. You slip it on. It tightens and will not come off. A cold voice whispers: “You found it… and I will find you.” When you look up, Hedda has turned her back on you.',
        ar: 'في داخله خاتم فضة عليه نقش غريب. تلبسه، فيضيق على إصبعك ولا يخرج. ويهمس صوت بارد: «وجدتَه… وأنا سأجدك». وحين ترفع رأسك تجد هيدا قد أدارت لك ظهرها.',
      },
      clues: [
        { de: 'Der Ring geht nicht mehr ab.', en: 'The ring will not come off.', ar: 'الخاتم لا يخرج من الإصبع.' },
        { de: 'Eine Stimme: „Du hast ihn gefunden … und ich werde dich finden.“', en: 'A voice: “You found it… and I will find you.”', ar: 'صوت يقول: «وجدتَه… وأنا سأجدك».' },
        { de: 'Hedda zitterte, als sie dir das Kästchen gab.', en: 'Hedda was trembling when she handed you the box.', ar: 'كانت هيدا ترتجف وهي تعطيك الصندوق.' },
      ],
      reward: 'cursed-ring',
    },
    {
      id: 'whispers',
      title: { de: 'Das Flüstern', en: 'The Whispers', ar: 'الهمسات' },
      story: {
        de: [
          'Draußen wird der Ring warm. Wo sein schwacher Schein auf die Mauern fällt, glimmt Schrift auf, die niemand sonst sieht.',
          'Im Schaufenster gegenüber steht ein großer Mann im grauen Mantel hinter dir. Du drehst dich um. Die Gasse ist leer.',
        ],
        en: [
          'Outside, the ring grows warm. Where its faint glow falls on the walls, writing appears that nobody else can see.',
          'In the shop window opposite, a tall man in a grey coat is standing behind you. You turn round. The lane is empty.',
        ],
        ar: [
          'في الخارج يدفأ الخاتم. وحيث يسقط ضوؤه الخافت على الجدران تظهر كتابة لا يراها أحد غيرك.',
          'في واجهة المحل المقابل ترى رجلاً طويلاً بمعطف رمادي يقف خلفك. تلتفت، فتجد الزقاق فارغاً.',
        ],
      },
      checkpoint: { id: 'cp-wall', name: { de: 'Die beschriebene Mauer', en: 'The written wall', ar: 'الجدار المكتوب' }, simulated: true, mapPosition: { x: 26, y: 16 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4138, lng: 8.6995 }, code: 'cq-neckar-ring-2' },
      puzzle: {
        type: 'reveal',
        revealMirrored: true,
        prompt: {
          de: 'Halte das Licht des Rings an die Mauer. Die Schrift ist spiegelverkehrt. Wen sollst du finden?',
          en: 'Hold the ring’s light to the wall. The writing is mirrored. Who must you find?',
          ar: 'سلّط ضوء الخاتم على الجدار. الكتابة معكوسة كما في المرآة. من الذي يجب أن تجده؟',
        },
        material: { de: ['Finde den, der Bücher bindet.'], en: ['Find the one who binds books.'], ar: ['ابحث عمّن يجلّد الكتب.'] },
        input: 'text',
        hints: [
          {
            de: 'Fahre langsam über die ganze Mauer. Die Schrift steht in der Mitte.',
            en: 'Move slowly over the whole wall. The writing is in the middle.',
            ar: 'مرّر الضوء ببطء على الجدار كله. الكتابة في الوسط.',
          },
          {
            de: 'Spiegelschrift liest man von rechts nach links, oder vor einem Spiegel. Gesucht ist ein Beruf.',
            en: 'Mirror writing reads right to left, or in a mirror. You are looking for a trade.',
            ar: 'الكتابة المعكوسة تُقرأ بالاتجاه المعاكس أو أمام مرآة. المطلوب مهنة.',
          },
          { de: 'Ein Buchbinder.', en: 'A bookbinder.', ar: 'مجلّد كتب.' },
        ],
      },
      success: {
        de: 'Ein Buchbinder. Unter der Schrift ist ein Kreidezeichen: eine Feder, gekreuzt mit einer Nadel. Du zeichnest es ab, und hinter dir knackt Glas.',
        en: 'A bookbinder. Under the writing there is a chalk sign: a quill crossed with a needle. You copy it, and somewhere behind you glass cracks.',
        ar: 'مجلّد كتب. تحت الكتابة علامة طباشير: ريشة متقاطعة مع إبرة. تنسخها، وفي مكان ما خلفك يتشقّق زجاج.',
      },
      clues: [
        { de: 'Im Licht des Rings erscheint verborgene Schrift.', en: 'Hidden writing appears in the ring’s light.', ar: 'تظهر كتابة خفية في ضوء الخاتم.' },
        { de: 'Der graue Mann erscheint in Schaufenstern, nie auf der Straße.', en: 'The grey man appears in shop windows, never in the street.', ar: 'الرجل الرمادي يظهر في الواجهات الزجاجية، لا في الشارع أبداً.' },
      ],
      reward: 'chalk-sign',
    },
    {
      id: 'watchman',
      title: { de: 'Der Nachtwächter', en: 'The Night Watchman', ar: 'الحارس الليلي' },
      story: {
        de: [
          'Am Turmplatz hebt ein alter Nachtwächter seine Laterne und starrt auf deine Hand.',
          '„Noch einer mit dem Silberring“, murmelt er. „Ich dachte, den sehe ich nie wieder.“',
        ],
        en: [
          'On the tower square an old night watchman raises his lantern and stares at your hand.',
          '“Another one with the silver ring,” he mutters. “I thought I would never see it again.”',
        ],
        ar: [
          'في ساحة البرج يرفع حارس ليلي عجوز فانوسه ويحدّق في يدك.',
          '«واحد آخر بالخاتم الفضي»، يتمتم. «ظننت أنني لن أراه مرة أخرى».',
        ],
      },
      checkpoint: { id: 'cp-square', name: { de: 'Der Turmplatz', en: 'The tower square', ar: 'ساحة البرج' }, simulated: true, mapPosition: { x: 40, y: 30 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4129, lng: 8.6945 }, code: 'cq-neckar-ring-3' },
      puzzle: {
        type: 'interrogate',
        interview: {
          person: 'kaspar',
          questions: [
            {
              id: 'grey',
              q: { de: 'Haben Sie einen Mann im grauen Mantel gesehen?', en: 'Have you seen a man in a grey coat?', ar: 'هل رأيت رجلاً بمعطف رمادي؟' },
              a: {
                de: 'Jede Nacht seit einer Woche. Nie auf dem Platz, nur in den Fenstern ringsum. Drehe ich mich um, ist da nichts.',
                en: 'Every night for a week. Never on the square, only in the windows around it. When I turn round, there is nothing.',
                ar: 'كل ليلة منذ أسبوع. ليس في الساحة أبداً، بل في النوافذ حولها فقط. وحين ألتفت لا أجد شيئاً.',
              },
            },
            {
              id: 'ring',
              q: { de: 'Kennen Sie diesen Ring?', en: 'Do you know this ring?', ar: 'هل تعرف هذا الخاتم؟' },
              a: {
                de: 'Ich habe ihn einmal gesehen, vor vierzig Jahren, an der Hand einer jungen Frau. Sie rannte um Mitternacht über diesen Platz und rief, etwas sei hinter ihr her.',
                en: 'I saw it once, forty years ago, on the hand of a young woman. She ran across this square at midnight, crying that something was following her.',
                ar: 'رأيته مرة واحدة، قبل أربعين عاماً، في يد شابة. ركضت عبر هذه الساحة عند منتصف الليل وهي تصرخ أن شيئاً يلاحقها.',
              },
            },
            {
              id: 'who',
              q: { de: 'Wer war die junge Frau?', en: 'Who was the young woman?', ar: 'من كانت تلك الشابة؟' },
              a: {
                de: 'Ein Jahr später eröffnete sie einen Antiquitätenladen in der Altstadt. Alle kennen sie. Fragen Sie nach Hedda.',
                en: 'A year later she opened an antique shop in the old town. Everyone knows her. Ask for Hedda.',
                ar: 'بعد سنة افتتحت محل أنتيكات في البلدة القديمة. الجميع يعرفها. اسأل عن هيدا.',
              },
            },
            {
              id: 'how',
              q: { de: 'Wie ist sie ihn losgeworden?', en: 'How did she get rid of it?', ar: 'كيف تخلّصت منه؟' },
              a: {
                de: 'Eines Tages war der Ring fort, und sie war wieder ruhig. Man sagt, man wird ihn nur los, wenn ein anderer ihn freiwillig nimmt.',
                en: 'One day the ring was gone and she was calm again. They say you can only lose it if someone else takes it of their own free will.',
                ar: 'ذات يوم اختفى الخاتم وعادت إليها السكينة. يقولون إنك لا تتخلّص منه إلا إذا أخذه شخص آخر بإرادته.',
              },
            },
          ],
        },
        prompt: {
          de: 'Wer trug den Ring vor dir?',
          en: 'Who wore the ring before you?',
          ar: 'من كان يلبس الخاتم قبلك؟',
        },
        choices: [
          { id: 'hedda', label: { de: 'Hedda Lorenz', en: 'Hedda Lorenz', ar: 'هيدا لورنتس' } },
          { id: 'kaspar', label: { de: 'Kaspar, der Nachtwächter', en: 'Kaspar, the night watchman', ar: 'كاسبار، الحارس الليلي' } },
          { id: 'valen', label: { de: 'Ein Goldschmied', en: 'A goldsmith', ar: 'صائغ' } },
        ],
        hints: [
          { de: 'Stell alle Fragen. Die Antwort setzt sich aus zwei Aussagen zusammen.', en: 'Ask every question. The answer comes from two statements together.', ar: 'اطرح كل الأسئلة. الجواب يأتي من قولين معاً.' },
          { de: 'Die junge Frau eröffnete später einen Antiquitätenladen.', en: 'The young woman later opened an antique shop.', ar: 'الشابة افتتحت لاحقاً محل أنتيكات.' },
          { de: 'Hedda Lorenz.', en: 'Hedda Lorenz.', ar: 'هيدا لورنتس.' },
        ],
      },
      success: {
        de: 'Hedda. Die Frau, die dir das Kästchen gab, hat den Ring selbst getragen. Und wenn man ihn nur loswird, wenn ein anderer ihn freiwillig nimmt … dann hast du ihr gerade den Fluch abgenommen.',
        en: 'Hedda. The woman who gave you the box wore the ring herself. And if you can only lose it when someone else takes it freely… then you have just taken the curse off her hands.',
        ar: 'هيدا. المرأة التي أعطتك الصندوق كانت تلبس الخاتم بنفسها. وإذا كان لا أحد يتخلّص منه إلا إذا أخذه غيره بإرادته… فقد أخذت عنها اللعنة للتو.',
      },
      clues: [
        { de: 'Vor vierzig Jahren trug Hedda Lorenz den Ring.', en: 'Forty years ago, Hedda Lorenz wore the ring.', ar: 'قبل أربعين عاماً كانت هيدا لورنتس تلبس الخاتم.' },
        { de: 'Man wird den Ring nur los, wenn ein anderer ihn freiwillig nimmt. Du hast das Kästchen freiwillig genommen.', en: 'You can only lose the ring if someone takes it freely. You took the box freely.', ar: 'لا يتخلّص أحد من الخاتم إلا إذا أخذه غيره بإرادته. وأنت أخذت الصندوق بإرادتك.' },
      ],
    },
    {
      id: 'chase',
      title: { de: 'Die Verfolgung', en: 'The Chase', ar: 'المطاردة' },
      story: {
        de: [
          'Der Sammler ist nah. In jeder Scheibe siehst du seinen grauen Mantel, jedes Mal ein Stück näher.',
          'Vor dir teilen sich drei Gassen. Du erinnerst dich an den Nachtwächter: nie auf dem Platz, nur in den Fenstern.',
        ],
        en: [
          'The Collector is close. In every pane of glass you see his grey coat, a little nearer each time.',
          'Ahead of you, three lanes split. You remember the watchman: never on the square, only in the windows.',
        ],
        ar: [
          'الجامع قريب. في كل لوح زجاج ترى معطفه الرمادي، وفي كل مرة أقرب قليلاً.',
          'أمامك تتفرّع ثلاثة أزقة. وتتذكر كلام الحارس: ليس في الساحة أبداً، بل في النوافذ فقط.',
        ],
      },
      checkpoint: { id: 'cp-lanes', name: { de: 'Die drei Gassen', en: 'The three lanes', ar: 'الأزقة الثلاثة' }, simulated: true, mapPosition: { x: 52, y: 44 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4118, lng: 8.7045 }, code: 'cq-neckar-ring-4' },
      puzzle: {
        type: 'logic',
        prompt: { de: 'Durch welche Gasse kann er dir nicht folgen?', en: 'Which lane can he not follow you through?', ar: 'عبر أي زقاق لا يستطيع أن يلحق بك؟' },
        material: {
          de: ['Laternengasse: auf beiden Seiten Schaufenster.', 'Steingasse: führt hinunter ans Flussufer.', 'Schmale Gasse: nur ein einziges Fenster, und das ist zugemauert.'],
          en: ['Lantern Lane: shop windows on both sides.', 'Stone Lane: runs down to the riverbank.', 'Narrow Lane: only a single window, and it is bricked up.'],
          ar: ['زقاق الفوانيس: واجهات محلات زجاجية على الجانبين.', 'زقاق الحجر: ينحدر حتى ضفة النهر.', 'الزقاق الضيّق: فيه نافذة واحدة فقط، وهي مسدودة بالطوب.'],
        },
        choices: [
          { id: 'lantern', label: { de: 'Laternengasse', en: 'Lantern Lane', ar: 'زقاق الفوانيس' } },
          { id: 'stone', label: { de: 'Steingasse', en: 'Stone Lane', ar: 'زقاق الحجر' } },
          { id: 'narrow', label: { de: 'Schmale Gasse', en: 'Narrow Lane', ar: 'الزقاق الضيّق' } },
        ],
        hints: [
          { de: 'Er braucht eine Oberfläche, in der man sich spiegelt: Glas oder Wasser.', en: 'He needs a surface you can see your reflection in: glass or water.', ar: 'يحتاج إلى سطح ترى فيه انعكاسك: زجاج أو ماء.' },
          { de: 'Ein zugemauertes Fenster hat kein Glas mehr.', en: 'A bricked-up window has no glass left.', ar: 'النافذة المسدودة بالطوب لم يعد فيها زجاج.' },
          { de: 'Die schmale Gasse.', en: 'Narrow Lane.', ar: 'الزقاق الضيّق.' },
        ],
      },
      success: {
        de: 'Du rennst in die schmale Gasse. Hinter dir verstummen die Schritte. Am Ende hängt dein Kreidezeichen über einer Werkstatttür. Eine junge Frau öffnet: „Ich bin Mira. Komm rein, schnell.“',
        en: 'You run into the narrow lane. Behind you the footsteps fall silent. At the end, your chalk sign hangs over a workshop door. A young woman opens it: “I’m Mira. Come in, quickly.”',
        ar: 'تركض إلى الزقاق الضيّق، فتصمت الخطوات خلفك. في آخره علامة الطباشير نفسها فوق باب ورشة. تفتح شابة الباب: «أنا ميرا. ادخل، بسرعة».',
      },
      clues: [
        { de: 'Der Sammler kann nur durch Glas und Wasser folgen.', en: 'The Collector can only follow through glass and water.', ar: 'الجامع لا يلحق بك إلا عبر الزجاج والماء.' },
        { de: 'Mira Falk, eine Buchbinderin, hat dich aufgenommen.', en: 'Mira Falk, a bookbinder, took you in.', ar: 'ميرا فالك، مجلّدة الكتب، استقبلتك.' },
      ],
      reward: 'mira-bookmark',
    },
    {
      id: 'ledger',
      title: { de: 'Das Zunftbuch', en: 'The Guild Ledger', ar: 'سجلّ النقابة' },
      story: {
        de: [
          'Miras Werkstatt riecht nach Leim und altem Papier. Sie holt eine Mappe aus einem Schrank. „Meine Zunft hat jeden Handwerker dieser Stadt aufgeschrieben. Aber diese Seite hat jemand zerrissen.“',
          'Vier Streifen Papier, die Ränder ausgefranst. Zusammen erzählen sie, woher dein Ring kommt.',
        ],
        en: [
          'Mira’s workshop smells of glue and old paper. She takes a folder from a cupboard. “My guild wrote down every craftsman in this city. But someone tore this page apart.”',
          'Four strips of paper, their edges frayed. Together they tell where your ring comes from.',
        ],
        ar: [
          'تفوح من ورشة ميرا رائحة الغراء والورق القديم. تُخرج ملفاً من خزانة: «نقابتي دوّنت كل حرفيّ في هذه المدينة. لكن أحدهم مزّق هذه الصفحة».',
          'أربعة أشرطة من الورق بأطراف مهترئة. مجتمعةً تروي من أين جاء خاتمك.',
        ],
      },
      checkpoint: { id: 'cp-workshop', name: { de: 'Miras Werkstatt', en: 'Mira’s workshop', ar: 'ورشة ميرا' }, simulated: true, mapPosition: { x: 62, y: 22 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4118, lng: 8.7103 }, code: 'cq-neckar-ring-5' },
      puzzle: {
        type: 'order',
        prompt: {
          de: 'Lege die Streifen in die richtige Reihenfolge, damit der Eintrag Sinn ergibt.',
          en: 'Put the strips in the right order so the entry makes sense.',
          ar: 'رتّب الأشرطة بالترتيب الصحيح حتى يصبح للنص معنى.',
        },
        pieces: [
          { id: 'c', text: { de: 'seinen wahren Namen an einen grauen Fremden,', en: 'his true name to a grey stranger,', ar: 'اسمه الحقيقي لغريب رمادي،' } },
          { id: 'a', text: { de: 'auf der Brücke, um Mitternacht, verkaufte er', en: 'on the bridge, at midnight, he sold', ar: 'وعلى الجسر، عند منتصف الليل، باع' } },
          { id: 'd', text: { de: 'und seither singt das Silber in seinen Händen. Der Name: siehe die Punzen.', en: 'and ever since, silver has sung in his hands. The name: see the hallmarks.', ar: 'ومنذ ذلك الحين صارت الفضة تغنّي بين يديه. الاسم: انظر الأختام.' } },
          { id: 'b', text: { de: 'Im Jahr der großen Flut ging der Goldschmied hinaus,', en: 'In the year of the great flood the goldsmith went out,', ar: 'في سنة الطوفان الكبير خرج الصائغ،' } },
        ],
        hints: [
          { de: 'Ein Eintrag beginnt mit dem Jahr.', en: 'An entry starts with the year.', ar: 'كل قيد يبدأ بالسنة.' },
          { de: 'Nach dem Jahr kommt der Ort, dann was er verkaufte, dann was er bekam.', en: 'After the year comes the place, then what he sold, then what he got.', ar: 'بعد السنة يأتي المكان، ثم ما باعه، ثم ما ناله.' },
          { de: 'Flut – Brücke – Name – Silber.', en: 'Flood – bridge – name – silver.', ar: 'الطوفان – الجسر – الاسم – الفضة.' },
        ],
      },
      success: {
        de: '„Er hat seinen Namen auf der Brücke verkauft“, flüstert Mira. „Und der Name steht in deinem Ring. Zeig ihn mir.“',
        en: '“He sold his name on the bridge,” Mira whispers. “And the name is in your ring. Show me.”',
        ar: '«باع اسمه على الجسر»، تهمس ميرا. «والاسم داخل خاتمك. أرني إياه».',
      },
      clues: [
        { de: 'Der Goldschmied verkaufte seinen Namen auf der Brücke, um Mitternacht.', en: 'The goldsmith sold his name on the bridge, at midnight.', ar: 'باع الصائغ اسمه على الجسر عند منتصف الليل.' },
        { de: 'Sein Name ist als Punzen in den Ring gestempelt.', en: 'His name is stamped inside the ring as hallmarks.', ar: 'اسمه مختوم داخل الخاتم على شكل أختام.' },
      ],
      reward: 'ledger-page',
    },
    {
      id: 'goldsmith',
      title: { de: 'Der Name des Goldschmieds', en: 'The Goldsmith’s Name', ar: 'اسم الصائغ' },
      story: {
        de: [
          'Mira dreht deine Hand ins Lampenlicht. „Der Fluch bricht nur, wenn sein wahrer Name dort ausgesprochen wird, wo er ihn verkauft hat. Also auf der Brücke.“',
          'Im Spiegel an der Wand bewegt sich etwas Graues. Mira hängt schnell ein Tuch darüber.',
        ],
        en: [
          'Mira turns your hand into the lamplight. “The curse only breaks if his true name is spoken where he sold it. On the bridge, then.”',
          'In the mirror on the wall something grey moves. Mira quickly throws a cloth over it.',
        ],
        ar: [
          'تدير ميرا يدك نحو ضوء المصباح: «اللعنة لا تنكسر إلا إذا قيل اسمه الحقيقي حيث باعه. أي على الجسر».',
          'في المرآة على الجدار يتحرك شيء رمادي، فترمي ميرا عليها قطعة قماش بسرعة.',
        ],
      },
      checkpoint: { id: 'cp-bench', name: { de: 'Die Werkbank', en: 'The workbench', ar: 'طاولة العمل' }, simulated: true, mapPosition: { x: 70, y: 32 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4128, lng: 8.7107 }, code: 'cq-neckar-ring-6' },
      puzzle: {
        type: 'cipher',
        prompt: {
          de: 'Innen im Ring stehen fünf Punzen, jede mit Buchstabe und Zahl. Lies die Buchstaben in der Reihenfolge der Zahlen. Wie hieß der Goldschmied?',
          en: 'Inside the ring are five hallmarks, each with a letter and a number. Read the letters in number order. What was the goldsmith’s name?',
          ar: 'داخل الخاتم خمسة أختام، على كل منها حرف ورقم. اقرأ الحروف بترتيب الأرقام. ما اسم الصائغ؟',
        },
        material: { de: ['N5 · L3 · V1 · E4 · A2'], en: ['N5 · L3 · V1 · E4 · A2'], ar: ['N5 · L3 · V1 · E4 · A2'] },
        model: { kind: 'ring', hallmarks: ['N5', 'L3', 'V1', 'E4', 'A2'] },
        input: 'text',
        hints: [
          { de: 'Drehe den Ring und schau hinein. Beginne mit der Punze, die die 1 trägt.', en: 'Turn the ring and look inside. Start with the hallmark that carries the 1.', ar: 'أدر الخاتم وانظر في داخله. ابدأ بالختم الذي يحمل الرقم 1.' },
          { de: 'V, dann A, dann L …', en: 'V, then A, then L…', ar: 'V ثم A ثم L…' },
          { de: 'VALEN.', en: 'VALEN.', ar: 'VALEN (فالين).' },
        ],
      },
      success: {
        de: 'Valen. Als Mira den Namen leise wiederholt, zerspringt der Spiegel unter dem Tuch. „Er weiß jetzt, dass wir ihn kennen.“',
        en: 'Valen. As Mira repeats the name quietly, the mirror under the cloth shatters. “He knows we have it now.”',
        ar: 'فالين. وحين تردّد ميرا الاسم بصوت خافت، تتحطّم المرآة تحت القماش: «صار يعرف أننا نعرفه».',
      },
      clues: [{ de: 'Der Goldschmied hieß Valen.', en: 'The goldsmith’s name was Valen.', ar: 'اسم الصائغ فالين.' }],
      reward: 'hallmark-rubbing',
    },
    {
      id: 'letter',
      title: { de: 'Heddas Brief', en: 'Hedda’s Letter', ar: 'رسالة هيدا' },
      story: {
        de: [
          'Mira untersucht das Kästchen. Im Samtfutter knistert Papier: ein gefalteter Brief, unterschrieben mit „H.“, in einer Schrift aus lauter falschen Buchstaben.',
          '„Ein Verschiebe-Alphabet“, sagt Mira und legt ein Chiffrierrad aus Messing auf den Tisch. „Die Lehrlinge der Goldschmiede benutzten solche Räder. Der Schlüssel war immer am Ring selbst abzuzählen.“',
        ],
        en: [
          'Mira examines the box. Paper crackles in the velvet lining: a folded letter signed “H.”, in writing made of all the wrong letters.',
          '“A shifted alphabet,” says Mira, setting a brass cipher wheel on the table. “Goldsmiths’ apprentices used wheels like this. The key could always be counted on the ring itself.”',
        ],
        ar: [
          'تفحص ميرا الصندوق، فتسمع خشخشة ورق في البطانة المخملية: رسالة مطوية موقّعة بـ «هـ»، مكتوبة بحروف كلها في غير مكانها.',
          '«أبجدية مزاحة»، تقول ميرا وتضع على الطاولة عجلة شيفرة نحاسية. «كان صبيان الصاغة يستعملون مثل هذه العجلات، والمفتاح يُعدّ دائماً على الخاتم نفسه».',
        ],
      },
      checkpoint: { id: 'cp-table', name: { de: 'Miras Tisch', en: 'Mira’s table', ar: 'طاولة ميرا' }, simulated: true, mapPosition: { x: 66, y: 12 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4155, lng: 8.706 }, code: 'cq-neckar-ring-7' },
      puzzle: {
        type: 'cipher-wheel',
        prompt: {
          de: 'Finde die richtige Einstellung des Rads und lies den Brief. Worum bittet dich Hedda?',
          en: 'Find the right setting for the wheel and read the letter. What does Hedda ask of you?',
          ar: 'جد الضبط الصحيح للعجلة واقرأ الرسالة. ماذا تطلب منك هيدا؟',
        },
        material: { de: ['AJWEJNM RNW. NHM MFYYJ FSLXY.'], en: ['KTWLNAJ RJ. N BFX FKWFNI.'], ar: ['ظحازبج يهش سند'] },
        input: 'text',
        hints: [
          { de: 'Der Schlüssel ist eine Zahl, die du im Ring zählen kannst.', en: 'The key is a number you can count on the ring.', ar: 'المفتاح رقم يمكنك عدّه على الخاتم.' },
          { de: 'Im Ring stehen fünf Punzen. Stell das Rad auf 5.', en: 'There are five hallmarks in the ring. Set the wheel to 5.', ar: 'في الخاتم خمسة أختام. اضبط العجلة على 5.' },
          { de: 'Sie bittet dich, ihr zu verzeihen.', en: 'She asks you to forgive her.', ar: 'تطلب منك أن تسامحها.' },
        ],
      },
      success: {
        de: '„Verzeih mir. Ich hatte Angst.“ Mira legt den Brief langsam hin. „Sie hat dir den Ring absichtlich gegeben. Damit er sie nicht mehr holt.“ Draußen schlägt die Glocke. Es ist fast Mitternacht.',
        en: '“Forgive me. I was afraid.” Mira slowly puts the letter down. “She gave you the ring on purpose. So that he would stop coming for her.” Outside, the bell strikes. It is almost midnight.',
        ar: '«سامحني، لقد خفت». تضع ميرا الرسالة ببطء: «أعطتك الخاتم عمداً، كي يكفّ عن ملاحقتها». في الخارج يدقّ الجرس. اقترب منتصف الليل.',
      },
      clues: [
        { de: 'Hedda hat dir den Ring absichtlich gegeben, aus Angst.', en: 'Hedda gave you the ring on purpose, out of fear.', ar: 'أعطتك هيدا الخاتم عمداً، بدافع الخوف.' },
        { de: 'Der Brief war im Futter des Kästchens versteckt.', en: 'The letter was hidden in the lining of the box.', ar: 'كانت الرسالة مخبأة في بطانة الصندوق.' },
      ],
      reward: 'hedda-letter',
    },
    {
      id: 'bridge',
      title: { de: 'Mitternacht auf der Brücke', en: 'Midnight on the Bridge', ar: 'منتصف الليل على الجسر' },
      story: {
        de: [
          'Unter dir glitzert der Fluss. Im Wasser erscheint der Graue Sammler, groß wie ein Turm. Der Ring brennt an deinem Finger.',
          '„Ein Name für einen Namen“, sagt seine Stimme aus dem Wasser. „Sag mir, wem ich ihn zurückgeben soll, und beweise es. Oder bleib für immer mein.“',
        ],
        en: [
          'Below you the river glitters. In the water the Grey Collector appears, tall as a tower. The ring burns on your finger.',
          '“A name for a name,” says his voice from the water. “Tell me whose name I am to give back, and prove it. Or stay mine for ever.”',
        ],
        ar: [
          'تحتك يلمع النهر، وفي الماء يظهر الجامع الرمادي طويلاً كبرج، والخاتم يحرق إصبعك.',
          '«اسم مقابل اسم»، يقول صوته من الماء. «قل لي اسم من يجب أن أعيده، وأثبت ذلك. أو ابقَ لي إلى الأبد».',
        ],
      },
      checkpoint: { id: 'cp-bridge', name: { de: 'Die Brücke', en: 'The bridge', ar: 'الجسر' }, simulated: true, mapPosition: { x: 84, y: 62 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.414, lng: 8.711 }, code: 'cq-neckar-ring-8' },
      puzzle: {
        type: 'deduction',
        prompt: {
          de: 'Wessen Name bricht den Fluch? Wähle die Person und lege den Beweis vor.',
          en: 'Whose name breaks the curse? Choose the person and lay down the proof.',
          ar: 'اسم من يكسر اللعنة؟ اختر الشخص وقدّم الدليل.',
        },
        choices: [
          { id: 'valen', label: { de: 'Valen', en: 'Valen', ar: 'فالين' } },
          { id: 'hedda', label: { de: 'Hedda Lorenz', en: 'Hedda Lorenz', ar: 'هيدا لورنتس' } },
          { id: 'mira', label: { de: 'Mira Falk', en: 'Mira Falk', ar: 'ميرا فالك' } },
          { id: 'kaspar', label: { de: 'Kaspar Wendt', en: 'Kaspar Wendt', ar: 'كاسبار فِنت' } },
        ],
        hints: [
          { de: 'Wer hat hier, auf dieser Brücke, seinen Namen verkauft?', en: 'Who sold their name here, on this bridge?', ar: 'من باع اسمه هنا، على هذا الجسر؟' },
          { de: 'Der Beweis ist der Name, wie er im Ring steht.', en: 'The proof is the name as it stands in the ring.', ar: 'الدليل هو الاسم كما هو مختوم في الخاتم.' },
          { de: 'Valen, mit dem Abrieb der Punzen (oder der Seite aus dem Zunftbuch).', en: 'Valen, with the hallmark rubbing (or the page from the guild ledger).', ar: 'فالين، مع نسخة الأختام (أو صفحة سجلّ النقابة).' },
        ],
      },
      success: {
        de: 'Du drehst dem Wasser den Rücken zu, hältst den Abrieb hoch und sprichst: „Valen.“ Der Ring wird warm, und zum ersten Mal lässt er sich bewegen.',
        en: 'You turn your back on the water, hold up the proof and speak: “Valen.” The ring grows warm, and for the first time it moves on your finger.',
        ar: 'تدير ظهرك للماء، وترفع الدليل، وتنطق: «فالين». يدفأ الخاتم، ولأول مرة يتحرك على إصبعك.',
      },
      clues: [{ de: 'Valens Name wurde auf der Brücke zurückgegeben.', en: 'Valen’s name was given back on the bridge.', ar: 'أُعيد اسم فالين على الجسر.' }],
    },
  ],
  ending: {
    artifact: { kind: 'ring', hallmarks: ['N5', 'L3', 'V1', 'E4', 'A2'] },
    reveal: {
      de: [
        'Eine zweite, sanfte Stimme flüstert: „Hundert Jahre habe ich darauf gewartet, dass jemand mich beim Namen ruft.“',
        'Auf der Brücke steht plötzlich Hedda, im Mantel, die Laterne in der Hand. „Ich bin dir gefolgt“, sagt sie leise. „Ich konnte dich nicht allein lassen mit dem, was ich dir angetan habe.“',
        'Der Ring gleitet von deinem Finger und liegt in deiner Hand. Die Entscheidung liegt bei dir.',
      ],
      en: [
        'A second, gentle voice whispers: “For a hundred years I have waited for someone to call me by my name.”',
        'Suddenly Hedda is on the bridge, in her coat, a lantern in her hand. “I followed you,” she says quietly. “I could not leave you alone with what I did to you.”',
        'The ring slides off your finger and lies in your hand. The choice is yours.',
      ],
      ar: [
        'ويهمس صوت ثانٍ رقيق: «مئة عام وأنا أنتظر أن يناديني أحد باسمي».',
        'وفجأة تظهر هيدا على الجسر بمعطفها وفانوسها: «تبعتك»، تقول بصوت خافت. «لم أستطع أن أتركك وحدك مع ما فعلته بك».',
        'ينزلق الخاتم عن إصبعك ويستقر في كفّك. والقرار لك.',
      ],
    },
    decision: {
      prompt: { de: 'Was tust du mit dem Ring?', en: 'What do you do with the ring?', ar: 'ماذا تفعل بالخاتم؟' },
      choices: [
        {
          id: 'free',
          label: { de: 'Den Ring zerbrechen und Valen befreien', en: 'Break the ring and set Valen free', ar: 'اكسر الخاتم وحرّر فالين' },
          epilogue: {
            de: 'Das Silber zerspringt. Im Fluss löst sich der graue Schatten auf wie Nebel in der Sonne. Hedda weint, dann lacht sie. Am nächsten Morgen hängt über ihrem Laden ein neues Schild: „Geschichten, kostenlos“.',
            en: 'The silver shatters. In the river the grey shadow dissolves like mist in the sun. Hedda cries, then laughs. The next morning a new sign hangs over her shop: “Stories, free of charge”.',
            ar: 'تتكسّر الفضة، ويذوب الظل الرمادي في النهر كضباب تحت الشمس. تبكي هيدا ثم تضحك. وفي الصباح التالي تُعلّق فوق محلها لافتة جديدة: «حكايات بالمجان».',
          },
        },
        {
          id: 'return',
          label: { de: 'Hedda den Ring zurückgeben', en: 'Give the ring back to Hedda', ar: 'أعد الخاتم إلى هيدا' },
          epilogue: {
            de: 'Hedda nimmt den Ring, freiwillig. „Er war immer meiner“, sagt sie. Im Wasser wendet sich der Schatten ihr zu, und sie lächelt ihn an, ohne Angst. Was danach geschah, erzählt sie niemandem.',
            en: 'Hedda takes the ring, of her own free will. “It was always mine,” she says. In the water the shadow turns towards her, and she smiles at it, unafraid. What happened next she tells no one.',
            ar: 'تأخذ هيدا الخاتم بإرادتها: «كان لي دائماً». في الماء يلتفت الظل نحوها، فتبتسم له بلا خوف. وما حدث بعد ذلك لم تروِه لأحد.',
          },
        },
        {
          id: 'keep',
          label: { de: 'Den Ring behalten', en: 'Keep the ring', ar: 'احتفظ بالخاتم' },
          epilogue: {
            de: 'Du steckst den Ring wieder an. Er passt perfekt. Im dunklen Wasser lächelt dein Spiegelbild, eine Sekunde nach dir. Am nächsten Morgen stellt Hedda ein neues Kästchen ins Regal.',
            en: 'You put the ring back on. It fits perfectly. In the dark water your reflection smiles, one second after you do. The next morning Hedda puts a new box on her shelf.',
            ar: 'تعيد الخاتم إلى إصبعك، فيناسبه تماماً. وفي الماء المظلم يبتسم انعكاسك… بعدك بثانية. وفي الصباح التالي تضع هيدا صندوقاً جديداً على رفّها.',
          },
        },
      ],
    },
  },
};
