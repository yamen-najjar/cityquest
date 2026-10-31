import type { Adventure, Authored } from '../types';

// "Het Duivelshuis-geheim" / "The Devil's House Secret" - the Arnhem detective adventure. The story, the
// archivist Lena Verhoef, the collector Daan Koster and Maarten van Rossum's hidden pledge are fiction.
// The checkpoints are simulated: no route has been walked or validated yet, so none of them names a real
// address and no puzzle depends on a fact about the city. The landmarks (Korenmarkt, the Devil's House,
// the Sabelspoort, the Eusebius church, Sonsbeek park, the Rhine quay, Museum Arnhem) are real places,
// used only as settings.
//
// One exception: chapter 4 ("Strangers in Stone") is built on the real figures on the Eusebius church.
// The puzzle still works anywhere, because Lena's sketch describes the figures (her numerals are fiction),
// and the "True story" clue only states what the church itself publishes
// (https://eusebius.nl/over-de-eusebius/beelden-op-de-kerk/, checked 2026-10-31): Henk Vreeling's 1962
// cartoon figures about 70 m up the tower, the dwarf with the face of a minister who opposed them, and
// Arno Coenen's 2022 sculptures, among them a tardigrade and a coronavirus particle. Don't add claims
// beyond that source without checking them.
//
// The eight checkpoints are simulated (approximate positions in Arnhem), so distanceKm and the walking
// time are indicative until the route is validated on foot.

export const hetDuivelshuis: Authored<Adventure> = {
  slug: 'het-duivelshuis',
  city: 'arnhem',
  status: 'published',
  isDemo: true,
  art: 'night',
  title: { de: 'Das Geheimnis des Teufelshauses', en: 'The Devil’s House Secret', ar: 'سرّ بيت الشيطان' },
  tagline: {
    de: 'Eine verschwundene Archivarin. Ein verschlüsseltes Hauptbuch. Steinerne Teufel, die seit 500 Jahren schweigen.',
    en: 'A vanished archivist. A coded ledger. Stone devils that have kept silent for 500 years.',
    ar: 'أمينة أرشيف اختفت. دفتر مشفّر. وشياطين حجرية صمتت خمسة قرون.',
  },
  description: {
    de: 'Stadtarchivarin Lena Verhoef ist verschwunden, kurz nachdem sie bei einer Restaurierung im Arnheimer Teufelshaus ein verschlüsseltes Hauptbuch gefunden hat. Ihre letzte Nachricht an dich: eine Reihe von Zahlen. Entschlüssle sie, befrage Zeugen, lies die Glocken der Eusebiuskirche und ein Signal über den Rhein — und sei schneller als „der Sammler“. Acht Kapitel, für Familien und Freunde.',
    en: 'City archivist Lena Verhoef has vanished, just after a restoration at Arnhem’s Devil’s House turned up a coded ledger. Her last message to you: a row of numbers. Decode it, question witnesses, read the Eusebius church bells and a signal across the Rhine — and stay ahead of “the Collector”. Eight chapters, for families and friends.',
    ar: 'اختفت أمينة الأرشيف لينا فرهوف بعد أن كشفت ترميماً في «بيت الشيطان» بأرنم عن دفتر مشفّر. رسالتها الأخيرة إليك: سطر من الأرقام. فكّ شيفرته، واستجوب الشهود، واقرأ أجراس كنيسة أوزيبيوس وإشارة عبر نهر الراين — وكن أسرع من «الجامع». ثمانية فصول للعائلات والأصدقاء.',
  },
  theme: 'detective',
  groupTypes: ['friends', 'family', 'couples'],
  difficulty: 'medium',
  durationMinutes: { min: 135, max: 180 },
  distanceKm: 5,
  teamSize: { min: 1, max: 5 },
  minAge: 10,
  languages: ['nl', 'en', 'de', 'ar'],
  priceCents: 2490,
  tier: 'standard',
  meetingPoint: {
    de: 'Arnheimer Innenstadt, am Korenmarkt. Der genaue Treffpunkt wird nach der Validierung der Route vor Ort festgelegt.',
    en: 'Arnhem city centre, at the Korenmarkt. The exact meeting point will be set once the route has been validated on foot.',
    ar: 'وسط مدينة أرنم، عند ساحة كورنمارخت. سيُحدَّد مكان اللقاء بدقة بعد التحقق من المسار على أرض الواقع.',
  },
  accessibility: {
    de: 'Die Demo lässt sich überall spielen, auch im Sitzen. Für die Outdoor-Version werden Stufen, Steigungen und Untergründe bei der Begehung erfasst und hier veröffentlicht.',
    en: 'The demo can be played anywhere, seated included. For the outdoor version, steps, slopes and surfaces will be recorded when the route is walked, and published here.',
    ar: 'يمكن لعب النسخة التجريبية من أي مكان، حتى وأنت جالس. أما النسخة الخارجية فسنوثّق الدرج والمنحدرات وطبيعة الأرض عند تجربة المسار، وننشرها هنا.',
  },
  overview: {
    de: [
      'Acht Kapitel, acht Rätselarten: eine Zahlenchiffre, ein Logikrätsel am Teufelshaus, ein Zeuge zum Befragen, die Fremden aus Stein an der Eusebiuskirche, unsichtbare Schrift im Sonsbeek-Park, ein Signal über den Rhein, ein Fund aus dem Inventar und eine Anklage mit Beweis.',
      'Die Ermittlungsakte sammelt Spuren, Verdächtige und eure Notizen. Wer aufmerksam ist, entdeckt dort ein zusätzliches Beweisstück.',
      'Drei Schwierigkeitsstufen und Sterne für jedes Kapitel.',
      'Am Ende entscheidest du, was mit dem Hauptbuch geschieht.',
    ],
    en: [
      'Eight chapters, eight kinds of puzzle: a number cipher, a logic riddle at the Devil’s House, a witness to question, the strangers in stone on the Eusebius church, invisible writing in Sonsbeek park, a signal across the Rhine, an item from your inventory and an accusation with proof.',
      'The case journal collects clues, suspects and your notes. Attentive players discover an extra piece of evidence there.',
      'Three difficulty levels and stars for every chapter.',
      'At the end you decide what becomes of the ledger.',
    ],
    ar: [
      'ثمانية فصول وثمانية أنواع من الألغاز: شيفرة أرقام، ولغز منطقي عند بيت الشيطان، وشاهد تستجوبه، والغرباء الحجريون على كنيسة أوزيبيوس، وكتابة خفية في حديقة سونسبيك، وإشارة عبر نهر الراين، وغرض من حقيبتك، واتهام بالدليل.',
      'ملف القضية يجمع الأدلة والمشتبه بهم وملاحظاتك. ومن ينتبه يكتشف فيه دليلاً إضافياً.',
      'ثلاثة مستويات صعوبة ونجوم لكل فصل.',
      'في النهاية تقرر مصير الدفتر.',
    ],
  },
  instructions: {
    de: [
      'Spielt gemeinsam auf einem Gerät. Eine Person liest vor, alle rätseln mit.',
      'Alles, was ihr erfahrt, landet in der Ermittlungsakte. Dort könnt ihr auch Gegenstände zusammenfügen.',
      'An jedem Kontrollpunkt bestätigt ihr eure Ankunft. In der Demo sind alle Kontrollpunkte simuliert.',
      'Der Fortschritt wird auf diesem Gerät gespeichert. Ihr könnt jederzeit pausieren.',
      'Achtet draußen auf den Verkehr und betretet keine privaten oder gesperrten Bereiche.',
    ],
    en: [
      'Play together on one device. One person reads aloud, everyone solves.',
      'Everything you learn goes into the case journal. You can also put items together there.',
      'At each checkpoint you confirm your arrival. In the demo every checkpoint is simulated.',
      'Progress is saved on this device. Pause at any time.',
      'Outdoors, mind the traffic and never enter private or closed-off areas.',
    ],
    ar: [
      'العبوا معاً على جهاز واحد. شخص يقرأ بصوت عالٍ، والجميع يحلّ.',
      'كل ما تعرفونه يُحفظ في ملف القضية، ويمكنكم فيه أيضاً جمع الأغراض معاً.',
      'عند كل نقطة تفتيش تؤكدون وصولكم. في النسخة التجريبية كل نقاط التفتيش افتراضية.',
      'يُحفظ التقدّم على هذا الجهاز، ويمكنكم التوقف في أي وقت.',
      'في الخارج انتبهوا لحركة السير، ولا تدخلوا أي مكان خاص أو مغلق.',
    ],
  },
  faq: [
    {
      q: { de: 'Muss ich dafür in Arnheim sein?', en: 'Do I need to be in Arnhem?', ar: 'هل يجب أن أكون في أرنم؟' },
      a: {
        de: 'Nein. Diese Demo ist mit simulierten Kontrollpunkten überall spielbar. Die Outdoor-Version folgt, sobald die Route vor Ort getestet ist.',
        en: 'No. This demo uses simulated checkpoints and can be played anywhere. The outdoor version follows once the route has been tested on site.',
        ar: 'لا. تستخدم هذه النسخة التجريبية نقاط تفتيش افتراضية ويمكن لعبها من أي مكان. ستصدر النسخة الخارجية بعد تجربة المسار في المدينة.',
      },
    },
    {
      q: { de: 'Was passiert, wenn ich nicht weiterkomme?', en: 'What if I get stuck?', ar: 'ماذا لو علقت في لغز؟' },
      a: {
        de: 'Jedes Rätsel hat drei Hinweise; der dritte zeigt die Lösung. Im Modus „Entspannt“ sind sie kostenlos.',
        en: 'Every puzzle has three hints; the third shows the solution. In “Relaxed” mode they are free.',
        ar: 'لكل لغز ثلاثة تلميحات، والثالث يكشف الحل. وفي المستوى «المريح» هي مجانية.',
      },
    },
    {
      q: { de: 'Für welches Alter?', en: 'What age is it for?', ar: 'لأي عمر؟' },
      a: {
        de: 'Ab etwa 10 Jahren, mit Erwachsenen auch jünger. Keine Gewalt, kein Grusel — die „Teufel“ sind steinerne Figuren an einer Hausfassade.',
        en: 'From about 10, younger with adults. No violence, nothing scary — the “devils” are stone figures on a house façade.',
        ar: 'من عمر 10 سنوات تقريباً، وأصغر برفقة الكبار. لا عنف ولا رعب — و«الشياطين» مجرد تماثيل حجرية على واجهة بيت.',
      },
    },
    {
      q: { de: 'Was kostet das Abenteuer?', en: 'What does the adventure cost?', ar: 'كم تكلّف المغامرة؟' },
      a: {
        de: 'Die Demo ist kostenlos. Für die Outdoor-Version ist ein Preis von 24,90 € pro Team (bis 5 Personen, inkl. MwSt.) vorgesehen. Der Kauf ist noch nicht möglich.',
        en: 'The demo is free. The outdoor version is planned at €24.90 per team (up to 5 people, VAT included). Purchases are not open yet.',
        ar: 'النسخة التجريبية مجانية. السعر المقترح للنسخة الخارجية 24.90 يورو لكل فريق (حتى 5 أشخاص، شاملاً الضريبة). الشراء غير متاح بعد.',
      },
    },
  ],
  pursuit: {
    name: { de: 'Der Sammler', en: 'The Collector', ar: 'الجامع' },
    hintLabel: { de: 'Hinweis nehmen', en: 'Take a hint', ar: 'خذ تلميحاً' },
    closer: { de: 'Jeder Hinweis bringt den Sammler näher.', en: 'Every hint brings the Collector closer.', ar: 'كل تلميح يقرّب الجامع أكثر.' },
    levels: [
      { de: 'Der Sammler ist noch auf der anderen Seite der Stadt.', en: 'The Collector is still on the other side of the city.', ar: 'الجامع لا يزال في الجهة الأخرى من المدينة.' },
      { de: 'Der Sammler hat deine Spur aufgenommen.', en: 'The Collector has picked up your trail.', ar: 'التقط الجامع أثرك.' },
      { de: 'Du hörst seine Schritte schon in derselben Gasse.', en: 'You can hear his footsteps in the same lane now.', ar: 'تسمع وقع خطواته في الزقاق نفسه الآن.' },
      { de: 'Der Sammler ist dir dicht auf den Fersen.', en: 'The Collector is right at your heels.', ar: 'الجامع يلاحقك عن قرب.' },
    ],
  },
  people: [
    {
      id: 'lena',
      voice: 'woman',
      appears: 'message',
      name: { de: 'Lena Verhoef', en: 'Lena Verhoef', ar: 'لينا فرهوف' },
      role: { de: 'Stadtarchivarin', en: 'City archivist', ar: 'أمينة أرشيف المدينة' },
      notes: [
        { after: 'message', text: { de: 'Ist verschwunden und schickt dir anonym Zahlen. Sie weiß etwas über das Teufelshaus.', en: 'Has vanished and is anonymously sending you numbers. She knows something about the Devil’s House.', ar: 'اختفت وتُرسل إليك أرقاماً دون اسم. تعرف شيئاً عن بيت الشيطان.' } },
      ],
    },
    {
      id: 'koster',
      voice: 'man',
      appears: 'archief',
      name: { de: 'Daan Koster', en: 'Daan Koster', ar: 'دان كوستر' },
      role: { de: 'Antiquitätenhändler, „der Sammler“', en: 'Antiques dealer, “the Collector”', ar: 'تاجر تحف، «الجامع»' },
      notes: [
        { after: 'archief', text: { de: 'War schon am Teufelshaus und hat den Stein beschädigt. Sucht dasselbe wie du.', en: 'Has already been at the Devil’s House and damaged the stone. He is after the same thing you are.', ar: 'كان عند بيت الشيطان وأتلف الحجر. يسعى إلى ما تسعى إليه.' } },
        { after: 'aanklacht', text: { de: 'Hat die Archivtür aufgebrochen und wollte das Hauptbuch Seite für Seite verkaufen.', en: 'Forced the archive door and meant to sell the ledger page by page.', ar: 'كسر باب الأرشيف وكان ينوي بيع الدفتر صفحةً صفحة.' } },
      ],
    },
    {
      id: 'bram',
      voice: 'man',
      appears: 'sabelspoort',
      name: { de: 'Bram', en: 'Bram', ar: 'برام' },
      role: { de: 'Straßenmusiker an der Sabelspoort', en: 'Street musician at the Sabelspoort', ar: 'عازف شوارع عند بوابة سابلسبورت' },
      notes: [
        { after: 'sabelspoort', text: { de: 'Sah Lena mit einer Ledermappe zur Eusebiuskirche eilen, gefolgt von einem Mann im Samtmantel.', en: 'Saw Lena hurry to the Eusebius church with a leather folder, followed by a man in a velvet coat.', ar: 'رأى لينا تُسرع إلى كنيسة أوزيبيوس ومعها حافظة جلدية، يتبعها رجل بمعطف مخملي.' } },
      ],
    },
    {
      id: 'devries',
      voice: 'woman',
      appears: 'archief',
      name: { de: 'Saar de Vries', en: 'Saar de Vries', ar: 'سار دي فريس' },
      role: { de: 'Kuratorin im Museum Arnheim', en: 'Curator at Museum Arnhem', ar: 'أمينة متحف أرنم' },
      notes: [
        { after: 'archief', text: { de: 'Ließ dich ins Archiv. Fand die mittlere Schublade bereits aufgebrochen vor.', en: 'Let you into the archive. Found the middle drawer already forced open.', ar: 'أدخلتك إلى الأرشيف، ووجدت الدرج الأوسط مكسوراً من قبل.' } },
      ],
    },
  ],
  items: [
    {
      id: 'ledger-half',
      icon: 'page',
      model: { kind: 'paper', art: 'stamps', torn: true },
      name: { de: 'Hälfte einer Hauptbuchseite', en: 'Half a ledger page', ar: 'نصف صفحة من الدفتر' },
      description: {
        de: 'Die rechte Hälfte einer Seite aus Lenas Hauptbuch. Am Rand ein kleiner Teufelskopf als Stempel. Die linke Hälfte fehlt.',
        en: 'The right half of a page from Lena’s ledger. In the margin, a small devil’s head stamped in ink. The left half is missing.',
        ar: 'النصف الأيمن من صفحة في دفتر لينا. على الهامش ختم صغير لرأس شيطان. النصف الأيسر مفقود.',
      },
    },
    {
      id: 'iron-key',
      icon: 'key',
      model: { kind: 'key' },
      name: { de: 'Alter Eisenschlüssel', en: 'Old iron key', ar: 'مفتاح حديدي قديم' },
      description: {
        de: 'Hinter dem mittleren Teufel aus dem Stein gelöst. Eingeritzt: „De middelste bewaart.“ — „Der mittlere bewahrt.“',
        en: 'Worked loose from the stone behind the middle devil. Scratched into it: “De middelste bewaart.” — “The middle one keeps it.”',
        ar: 'انتُزع من الحجر خلف الشيطان الأوسط. محفور عليه: «De middelste bewaart» — «الأوسط يحفظه».',
      },
    },
    {
      id: 'ledger-left',
      icon: 'page',
      model: { kind: 'paper', art: 'lines', torn: true },
      name: { de: 'Linke Hälfte der Hauptbuchseite', en: 'Left half of the ledger page', ar: 'النصف الأيسر من صفحة الدفتر' },
      description: {
        de: 'In der Glockenstube der Eusebiuskirche versteckt. Der Riss passt zu der Hälfte, die du schon hast.',
        en: 'Hidden in the bell chamber of the Eusebius church. The tear matches the half you already hold.',
        ar: 'مخبّأ في غرفة الأجراس بكنيسة أوزيبيوس. حافّة التمزق تطابق النصف الذي بحوزتك.',
      },
    },
    {
      id: 'whole-ledger',
      icon: 'page',
      model: { kind: 'paper', art: 'stamps' },
      name: { de: 'Die ganze Hauptbuchseite', en: 'The whole ledger page', ar: 'صفحة الدفتر كاملة' },
      description: {
        de: 'Zusammengefügt: eine Liste von Namen unter dem Teufelsstempel — und am Rand die Kaufnotiz „D. Koster“.',
        en: 'Put together: a list of names beneath the devil’s stamp — and in the margin a purchase note, “D. Koster”.',
        ar: 'بعد جمع النصفين: قائمة أسماء تحت ختم الشيطان — وعلى الهامش ملاحظة شراء: «د. كوستر».',
      },
    },
  ],
  combinations: [{ from: 'ledger-half+ledger-left', to: 'whole-ledger' }],
  chapters: [
    {
      id: 'message',
      title: { de: 'Die anonyme Nachricht', en: 'The Anonymous Message', ar: 'الرسالة المجهولة' },
      story: {
        de: [
          'Es ist kurz nach acht am Korenmarkt, als dein Telefon aufleuchtet. Kein Absender.',
          '„Ich habe im Teufelshaus etwas gefunden, das jemand seit 500 Jahren verbirgt. Jetzt bin ich diejenige, die verschwinden muss. Vertrau keinem Sammler. Folge den Zahlen.“',
          'Darunter steht nur eine Reihe von Zahlen — und ein winziger Teufelskopf als Stempel.',
        ],
        en: [
          'It is just after eight at the Korenmarkt when your phone lights up. No sender.',
          '“I found something in the Devil’s House that someone has been hiding for 500 years. Now I am the one who has to disappear. Trust no collector. Follow the numbers.”',
          'Below it, nothing but a row of numbers — and a tiny devil’s head stamped beside them.',
        ],
        ar: [
          'بعد الثامنة بقليل عند ساحة كورنمارخت، يضيء هاتفك. لا اسم مرسل.',
          '«وجدتُ في بيت الشيطان شيئاً يخفيه أحدهم منذ خمسمئة عام. والآن أنا من عليها أن تختفي. لا تثق بأيّ جامع. اتبع الأرقام».',
          'وتحتها لا شيء سوى سطر من الأرقام — وختمٌ صغير لرأس شيطان بجانبها.',
        ],
      },
      checkpoint: {
        id: 'cp-korenmarkt',
        name: { de: 'Am Korenmarkt', en: 'At the Korenmarkt', ar: 'عند كورنمارخت' },
        simulated: true,
        mapPosition: { x: 16, y: 58 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9811, lng: 5.9085 },
        code: 'cq-het-duivelshuis-1',
      },
      puzzle: {
        type: 'cipher',
        prompt: {
          de: 'Jede Zahl steht für die Position eines Buchstabens im Alphabet (A = 1). Welches Wort versteckt sich darin?',
          en: 'Each number is a letter’s position in the alphabet (A = 1). Which word is hidden in it?',
          ar: 'كل رقم يدل على ترتيب حرف في الأبجدية العربية (أ = 1، ب = 2، ت = 3 …). ما الكلمة المخفية؟',
        },
        material: { de: ['20 · 5 · 21 · 6 · 5 · 12'], en: ['4 · 5 · 22 · 9 · 12 · 19'], ar: ['13 · 28 · 1 · 16 · 28 · 25'] },
        input: 'text',
        hints: [
          { de: 'Zähle das Alphabet ab: A = 1, B = 2, C = 3 … Z = 26.', en: 'Count through the alphabet: A = 1, B = 2, C = 3 … Z = 26.', ar: 'عُدّ الحروف بالترتيب: أ ب ت ث ج ح خ د ذ ر …' },
          { de: 'Der erste Buchstabe ist T (20). Es sind die steinernen Figuren, nach denen das Haus benannt ist.', en: 'The first letter is D (4). It is the stone figures the house is named after.', ar: 'الحرف الأول هو ش (13). إنها التماثيل الحجرية التي سُمّي البيت باسمها.' },
          { de: 'TEUFEL.', en: 'DEVILS.', ar: 'شياطين.' },
        ],
      },
      success: {
        de: 'Teufel. Natürlich — das Teufelshaus, nur ein paar Gassen weiter. In der Nachricht steckt außerdem die halbe Seite eines Hauptbuchs, mit demselben Teufelsstempel.',
        en: 'Devils. Of course — the Devil’s House, only a few lanes away. Tucked into the message as well: half a page from a ledger, stamped with the same devil’s head.',
        ar: 'شياطين. بالطبع — بيت الشيطان، على بُعد أزقّة قليلة. ومع الرسالة أيضاً نصف صفحة من دفتر، عليها ختم رأس الشيطان نفسه.',
      },
      clues: [
        { de: 'Lena hat im Teufelshaus etwas gefunden, das seit 500 Jahren verborgen ist.', en: 'Lena found something in the Devil’s House that has been hidden for 500 years.', ar: 'وجدت لينا في بيت الشيطان شيئاً مخفيّاً منذ خمسمئة عام.' },
        { de: 'Sie warnt: „Vertrau keinem Sammler.“', en: 'She warns: “Trust no collector.”', ar: 'تحذّر: «لا تثق بأيّ جامع».' },
      ],
      reward: 'ledger-half',
    },
    {
      id: 'duivels',
      title: { de: 'Die drei Teufel', en: 'The Three Devils', ar: 'الشياطين الثلاثة' },
      story: {
        de: [
          'Das Teufelshaus steht schmal und trotzig zwischen seinen Nachbarn. Über dem Eingang hocken drei steinerne Teufel: links, in der Mitte, rechts.',
          'Frische Kratzspuren zeigen, dass jemand kurz vor dir am Stein gearbeitet hat — und aufgegeben hat. Unter jedem Teufel ist ein Satz eingemeißelt. Lena hat an den Rand ihrer Seite geschrieben: „Genau einer der drei sagt die Wahrheit. Hinter einem von ihnen liegt der Schlüssel.“',
        ],
        en: [
          'The Devil’s House stands narrow and defiant between its neighbours. Above the door crouch three stone devils: left, middle, right.',
          'Fresh scratch marks show that someone worked at the stone just before you — and gave up. Beneath each devil a sentence is carved. Lena wrote in the margin of her page: “Exactly one of the three tells the truth. Behind one of them lies the key.”',
        ],
        ar: [
          'يقف بيت الشيطان ضيّقاً عنيداً بين جيرانه. وفوق الباب يجثم ثلاثة شياطين من حجر: يسار، وسط، يمين.',
          'آثار خدش حديثة تدل على أن أحدهم عمل في الحجر قبلك بقليل — ثم استسلم. وتحت كل شيطان جملة منحوتة. كتبت لينا على هامش صفحتها: «واحد فقط من الثلاثة يقول الحقيقة. وخلف أحدهم يكمن المفتاح».',
        ],
      },
      checkpoint: {
        id: 'cp-duivelshuis',
        name: { de: 'Am Teufelshaus', en: 'At the Devil’s House', ar: 'عند بيت الشيطان' },
        simulated: true,
        mapPosition: { x: 30, y: 44 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9797, lng: 5.9118 },
        code: 'cq-het-duivelshuis-2',
      },
      puzzle: {
        type: 'logic',
        prompt: { de: 'Genau eine Aussage ist wahr. Hinter welchem Teufel liegt der Schlüssel?', en: 'Exactly one statement is true. Behind which devil is the key?', ar: 'عبارة واحدة فقط صحيحة. خلف أيّ شيطان يكمن المفتاح؟' },
        material: {
          de: [
            'Linker Teufel: „Der Schlüssel liegt hinter dem rechten Teufel.“',
            'Mittlerer Teufel: „Hinter mir liegt er nicht.“',
            'Rechter Teufel: „Der linke Teufel lügt.“',
          ],
          en: [
            'Left devil: “The key lies behind the right devil.”',
            'Middle devil: “It does not lie behind me.”',
            'Right devil: “The left devil is lying.”',
          ],
          ar: [
            'الشيطان الأيسر: «المفتاح خلف الشيطان الأيمن».',
            'الشيطان الأوسط: «ليس خلفي».',
            'الشيطان الأيمن: «الشيطان الأيسر يكذب».',
          ],
        },
        choices: [
          { id: 'left', label: { de: 'Linker Teufel', en: 'Left devil', ar: 'الشيطان الأيسر' } },
          { id: 'middle', label: { de: 'Mittlerer Teufel', en: 'Middle devil', ar: 'الشيطان الأوسط' } },
          { id: 'right', label: { de: 'Rechter Teufel', en: 'Right devil', ar: 'الشيطان الأيمن' } },
        ],
        hints: [
          { de: 'Der linke und der rechte Teufel widersprechen sich: Genau einer von beiden sagt die Wahrheit.', en: 'The left and right devils contradict each other: exactly one of the two tells the truth.', ar: 'الشيطان الأيسر والأيمن يناقض أحدهما الآخر: واحد منهما فقط صادق.' },
          { de: 'Dann muss die Aussage des mittleren Teufels falsch sein. Was bedeutet das für sein Versteck?', en: 'Then the middle devil’s statement must be false. What does that mean for his hiding place?', ar: 'إذن عبارة الشيطان الأوسط لا بد أن تكون كاذبة. فماذا يعني ذلك عن مخبئه؟' },
          { de: 'Der mittlere Teufel.', en: 'The middle devil.', ar: 'الشيطان الأوسط.' },
        ],
      },
      success: {
        de: 'Du drückst gegen den mittleren Teufel, und ein Stein gibt nach. Dahinter: ein alter Eisenschlüssel, eingeritzt mit „De middelste bewaart“. Hinter dir knirscht Kies — jemand war dir dicht auf den Fersen und zieht sich zurück.',
        en: 'You push against the middle devil and a stone gives way. Behind it: an old iron key, scratched with “De middelste bewaart”. Gravel crunches behind you — someone was close on your heels and is backing away.',
        ar: 'تضغط على الشيطان الأوسط فيتزحزح حجر. خلفه: مفتاح حديدي قديم محفور عليه «De middelste bewaart». يُسمع صرير حصى خلفك — أحدهم كان قريباً منك ويتراجع الآن.',
      },
      clues: [
        { de: 'Hinter dem mittleren Teufel lag ein alter Schlüssel.', en: 'An old key lay behind the middle devil.', ar: 'خلف الشيطان الأوسط كان مفتاح قديم.' },
        { de: 'Jemand — „der Sammler“ — war kurz vor dir am Stein.', en: 'Someone — “the Collector” — was at the stone just before you.', ar: 'أحدهم — «الجامع» — كان عند الحجر قبلك بقليل.' },
      ],
      reward: 'iron-key',
    },
    {
      id: 'sabelspoort',
      title: { de: 'Der Zeuge an der Sabelspoort', en: 'The Witness at the Sabelspoort', ar: 'الشاهد عند بوابة سابلسبورت' },
      story: {
        de: [
          'An der Sabelspoort, dem alten Stadttor, spielt ein Straßenmusiker. Er hat heute Abend alles gesehen, was durch das Tor kam.',
          'Frag ihn aus. Irgendwo hier ist Lena an diesem Abend entlanggekommen — und jemand hinter ihr her.',
        ],
        en: [
          'At the Sabelspoort, the old city gate, a street musician is playing. This evening he has seen everything that passed through the gate.',
          'Question him. Lena came this way tonight — and someone was right behind her.',
        ],
        ar: [
          'عند بوابة سابلسبورت، البوابة القديمة للمدينة، يعزف موسيقي الشارع. هذا المساء رأى كل من مرّ عبر البوابة.',
          'استجوبه. مرّت لينا من هنا الليلة — وكان أحدهم خلفها مباشرة.',
        ],
      },
      checkpoint: {
        id: 'cp-sabelspoort',
        name: { de: 'An der Sabelspoort', en: 'At the Sabelspoort', ar: 'عند بوابة سابلسبورت' },
        simulated: true,
        mapPosition: { x: 40, y: 62 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9789, lng: 5.9129 },
        code: 'cq-het-duivelshuis-3',
      },
      puzzle: {
        type: 'interrogate',
        prompt: { de: 'Wohin ging Lena? Befrage Bram und wähle dann.', en: 'Where did Lena go? Question Bram, then choose.', ar: 'إلى أين ذهبت لينا؟ استجوب برام ثم اختر.' },
        interview: {
          person: 'bram',
          questions: [
            {
              id: 'folder',
              q: { de: 'Hast du eine Frau mit einer Mappe gesehen?', en: 'Did you see a woman with a folder?', ar: 'هل رأيت امرأة تحمل حافظة؟' },
              a: { de: 'Ja — eine Ledermappe, fest an sich gedrückt. Sie eilte die Stufen hinauf.', en: 'Yes — a leather folder, held tight. She hurried up the steps.', ar: 'نعم — حافظة جلدية تضمّها بقوة. صعدت الدرج مسرعةً.' },
            },
            {
              id: 'followed',
              q: { de: 'Wurde sie verfolgt?', en: 'Was she being followed?', ar: 'هل كان أحد يتبعها؟' },
              a: { de: 'Ein Mann im Samtmantel hielt Abstand. Er roch nach alten Büchern.', en: 'A man in a velvet coat kept his distance. He smelled of old books.', ar: 'رجل بمعطف مخملي يبقى على مسافة. كانت تفوح منه رائحة الكتب القديمة.' },
            },
            {
              id: 'where',
              q: { de: 'Wo ging sie hinein?', en: 'Where did she go in?', ar: 'من أين دخلت؟' },
              a: { de: 'In die große Kirche — die Eusebius. Sie hatte einen Schlüssel dabei.', en: 'Into the great church — the Eusebius. She had a key with her.', ar: 'إلى الكنيسة الكبيرة — أوزيبيوس. وكان معها مفتاح.' },
            },
          ],
        },
        choices: [
          { id: 'eusebius', label: { de: 'Die Eusebiuskirche', en: 'The Eusebius church', ar: 'كنيسة أوزيبيوس' } },
          { id: 'market', label: { de: 'Zurück zum Korenmarkt', en: 'Back to the Korenmarkt', ar: 'العودة إلى كورنمارخت' } },
          { id: 'quay', label: { de: 'Hinunter zum Rhein', en: 'Down to the Rhine', ar: 'النزول إلى نهر الراين' } },
        ],
        hints: [
          { de: 'Stell alle drei Fragen; Bram weiß mehr, als er zuerst sagt.', en: 'Ask all three questions; Bram knows more than he first says.', ar: 'اطرح الأسئلة الثلاثة؛ برام يعرف أكثر مما يقول أولاً.' },
          { de: 'Sie trug einen Schlüssel und stieg Stufen in eine große Kirche hinauf.', en: 'She carried a key and climbed steps into a great church.', ar: 'كانت تحمل مفتاحاً وصعدت درجاً إلى كنيسة كبيرة.' },
          { de: 'Die Eusebiuskirche.', en: 'The Eusebius church.', ar: 'كنيسة أوزيبيوس.' },
        ],
      },
      success: {
        de: 'Die Eusebiuskirche. Bram nickt: „Der Mann im Mantel ging ihr nach. Beeil dich.“ Hoch oben im Turm hängt das Glockenspiel.',
        en: 'The Eusebius church. Bram nods: “The man in the coat went after her. Hurry.” High in the tower hangs the carillon.',
        ar: 'كنيسة أوزيبيوس. يومئ برام: «الرجل ذو المعطف تبعها. أسرع». وفي أعلى البرج يتدلّى ناقوس الأجراس.',
      },
      clues: [
        { de: 'Lena ging mit einem Schlüssel in die Eusebiuskirche.', en: 'Lena went into the Eusebius church with a key.', ar: 'دخلت لينا كنيسة أوزيبيوس ومعها مفتاح.' },
        { de: 'Der Mann im Samtmantel — „der Sammler“ — folgte ihr.', en: 'The man in the velvet coat — “the Collector” — followed her.', ar: 'الرجل ذو المعطف المخملي — «الجامع» — تبعها.' },
      ],
    },
    {
      id: 'carillon',
      title: { de: 'Fremde aus Stein', en: 'Strangers in Stone', ar: 'غرباء من حجر' },
      story: {
        de: [
          'Die Turmtür ist nur angelehnt — Lena hat ihren Schlüssel im Schloss stecken lassen. Oben in der Glockenstube hängt das Glockenspiel still. An der Wand sichert ein kleines Zahlenschloss eine Klappe.',
          'Daneben steckt Lenas Skizze: Figuren von den Mauern der Kirche, jede mit einer römischen Ziffer. Darunter: „Diesmal nicht die Glocken. Nur die Fremden zählen.“',
        ],
        en: [
          'The tower door is ajar — Lena left her key in the lock. Up in the bell chamber the carillon hangs silent. On the wall, a small number lock secures a hatch.',
          'Pinned beside it is Lena’s sketch: figures from the church walls, each marked with a Roman numeral. Underneath: “Not the bells this time. Only the strangers count.”',
        ],
        ar: [
          'باب البرج موارب — تركت لينا مفتاحها في القفل. وفي الأعلى، في غرفة الأجراس، تتدلّى الأجراس صامتة. وعلى الجدار قفل أرقام صغير يحمي كوّة.',
          'وبجانبه رسمٌ ثبّتته لينا: تماثيل من جدران الكنيسة، بجانب كلٍّ منها رقم روماني. وتحته: «ليست الأجراس هذه المرة. الغرباء وحدهم يُحسبون».',
        ],
      },
      checkpoint: {
        id: 'cp-carillon',
        name: { de: 'In der Glockenstube', en: 'In the bell chamber', ar: 'في غرفة الأجراس' },
        simulated: true,
        mapPosition: { x: 34, y: 50 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9803, lng: 5.911 },
        code: 'cq-het-duivelshuis-4',
      },
      puzzle: {
        type: 'number-code',
        prompt: {
          de: 'Welche Figuren hätte kein Steinmetz des Mittelalters meißeln können? Lies ihre Ziffern der Reihe nach als Zahlen und gib den Code ein.',
          en: 'Which figures could no medieval mason have carved? Read their numerals in order, as digits, and enter the code.',
          ar: 'أيّ التماثيل لم يكن بوسع نحّات من العصور الوسطى أن ينحتها؟ اقرأ أرقامها بالترتيب كأعداد، وأدخل الرمز.',
        },
        material: {
          de: [
            'Lenas Skizze, von oben nach unten:',
            'Ein steinerner Löwe — III',
            'Einer der sieben Zwerge aus Schneewittchen, wie im Disney-Film — IX',
            'Ein Apostel mit einem Buch — VI',
            'Tom Poes, die weiße Katze aus dem niederländischen Comic — IV',
            'Ein gehörnter Wasserspeier — I',
            'Ein Bärtierchen, ein mikroskopisch kleines Tier, stark vergrößert — VII',
            'Ein Coronavirus-Teilchen, stark vergrößert — II',
          ],
          en: [
            'Lena’s sketch, top to bottom:',
            'A stone lion — III',
            'One of Snow White’s seven dwarfs, as in the Disney film — IX',
            'An apostle holding a book — VI',
            'Tom Poes, the white cat from the Dutch comic strip — IV',
            'A horned gargoyle — I',
            'A water bear, a microscopic animal, greatly enlarged — VII',
            'A coronavirus particle, greatly enlarged — II',
          ],
          ar: [
            'رسم لينا، من الأعلى إلى الأسفل:',
            'أسد من حجر — III',
            'أحد أقزام بياض الثلج السبعة، كما في فيلم ديزني — IX',
            'رسول يحمل كتاباً — VI',
            'توم بوس، القطّ الأبيض من القصص المصوّرة الهولندية — IV',
            'تمثال مزراب بقرنين — I',
            'دبّ الماء، حيوان مجهري، مكبَّر جداً — VII',
            'جسيم من فيروس كورونا، مكبَّر جداً — II',
          ],
        },
        input: 'numeric',
        lock: { digits: 4 },
        hints: [
          {
            de: 'Löwen, Apostel und gehörnte Fratzen kannten schon die Baumeister des Mittelalters. Was davon konnte damals niemand kennen?',
            en: 'Lions, apostles and horned faces were known to medieval builders. Which figures show things nobody could have known back then?',
            ar: 'الأسود والرسل والوجوه ذات القرون عرفها بنّاؤو العصور الوسطى. أيّ التماثيل تُظهر أشياء لم يكن أحد يعرفها آنذاك؟',
          },
          {
            de: 'Zeichentrick- und Comicfiguren stammen aus dem 20. Jahrhundert, und ein Bärtierchen oder ein Virus sieht man nur unter dem Mikroskop. Römische Ziffern: I = 1, V = 5, X = 10.',
            en: 'Cartoon and comic characters belong to the 20th century, and a water bear or a virus can only be seen under a microscope. Roman numerals: I = 1, V = 5, X = 10.',
            ar: 'شخصيات الرسوم المتحركة والقصص المصوّرة من القرن العشرين، ودبّ الماء والفيروس لا يُريان إلا بالمجهر. الأرقام الرومانية: I = 1، V = 5، X = 10.',
          },
          {
            de: 'Zwerg IX, Tom Poes IV, Bärtierchen VII, Virus II: Der Code ist 9472.',
            en: 'Dwarf IX, Tom Poes IV, water bear VII, virus II: the code is 9472.',
            ar: 'القزم IX، توم بوس IV، دبّ الماء VII، الفيروس II: الرمز هو 9472.',
          },
        ],
      },
      success: {
        de: 'Klick. Hinter der Klappe steckt die fehlende linke Hälfte von Lenas Hauptbuchseite. Der Riss passt genau zu deiner Hälfte.',
        en: 'Click. Behind the hatch lies the missing left half of Lena’s ledger page. The tear fits your half exactly.',
        ar: 'طَق. خلف الكوّة النصف الأيسر المفقود من صفحة دفتر لينا. حافّة التمزق تطابق نصفك تماماً.',
      },
      clues: [
        { de: 'Die linke Hälfte der Hauptbuchseite lag in der Glockenstube.', en: 'The left half of the ledger page was in the bell chamber.', ar: 'كان النصف الأيسر من صفحة الدفتر في غرفة الأجراس.' },
        { de: 'Füge in der Akte beide Hälften zusammen.', en: 'Put both halves together in the journal.', ar: 'اجمع النصفين معاً في الملف.' },
        {
          de: 'Wahre Geschichte: Diese Figuren gibt es wirklich. 1962 setzte der Bildhauer Henk Vreeling Comicfiguren wie Donald Duck, Micky Maus und Tom Poes in etwa 70 Meter Höhe an den Turm — und gab einem der Zwerge das Gesicht eines Pfarrers, der gegen die Idee war. 2022 kamen Steinfiguren des Künstlers Arno Coenen hinzu, darunter ein Bärtierchen und ein Coronavirus-Teilchen. Vom Boden aus braucht man ein Fernglas; die Glasbalkone des Turms kommen näher heran.',
          en: 'True story: these figures really exist. In 1962 sculptor Henk Vreeling put cartoon characters such as Donald Duck, Mickey Mouse and Tom Poes about 70 metres up the tower — and gave one of the dwarfs the face of a minister who opposed the idea. In 2022 stone figures by artist Arno Coenen were added, including a water bear and a coronavirus particle. From the street you need binoculars; the tower’s glass balconies get closer.',
          ar: 'قصة حقيقية: هذه التماثيل موجودة فعلاً. في عام 1962 وضع النحّات هنك فريلينغ شخصيات كرتونية مثل دونالد داك وميكي ماوس وتوم بوس على ارتفاع نحو 70 متراً في البرج — وأعطى أحد الأقزام وجه قسٍّ كان يعارض الفكرة. وفي عام 2022 أُضيفت تماثيل حجرية للفنان آرنو كونين، منها دبّ الماء وجسيم من فيروس كورونا. من الشارع تحتاج إلى منظار، أما شرفات البرج الزجاجية فتقرّبك منها.',
        },
      ],
      reward: 'ledger-left',
    },
    {
      id: 'sonsbeek',
      title: { de: 'Der Wasserfall im Sonsbeek-Park', en: 'The Waterfall in Sonsbeek Park', ar: 'شلّال حديقة سونسبيك' },
      story: {
        de: [
          'Im Sonsbeek-Park, neben dem Wasserfall unter der Weißen Villa, hat Lena auf einen glatten Stein geschrieben — mit einer Tinte, die nur im Streiflicht erscheint.',
          'Halte deine Taschenlampe flach über den Stein. Die Schrift steht spiegelverkehrt, als läse man sie von hinten.',
        ],
        en: [
          'In Sonsbeek park, beside the waterfall below the White Villa, Lena has written on a smooth stone — in an ink that only shows in raking light.',
          'Hold your torch flat across the stone. The writing is mirrored, as if read from behind.',
        ],
        ar: [
          'في حديقة سونسبيك، بجانب الشلّال تحت الفيلا البيضاء، كتبت لينا على حجر أملس — بحبر لا يظهر إلا في الضوء المائل.',
          'سلّط ضوءك بشكل مائل على الحجر. الكتابة معكوسة، كأنها تُقرأ من الخلف.',
        ],
      },
      checkpoint: {
        id: 'cp-sonsbeek',
        name: { de: 'Am Wasserfall', en: 'At the waterfall', ar: 'عند الشلّال' },
        simulated: true,
        mapPosition: { x: 70, y: 18 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9897, lng: 5.902 },
        code: 'cq-het-duivelshuis-5',
      },
      puzzle: {
        type: 'reveal',
        revealMirrored: true,
        prompt: { de: 'Streiche mit dem Licht über den Stein. Wohin will der Sammler als Nächstes?', en: 'Sweep the light across the stone. Where is the Collector heading next?', ar: 'مرّر الضوء على الحجر. إلى أين يتجه الجامع تالياً؟' },
        material: { de: ['Zum Rhein', 'vor Mitternacht'], en: ['To the Rhine', 'before midnight'], ar: ['إلى نهر الراين', 'قبل منتصف الليل'] },
        input: 'text',
        hints: [
          { de: 'Fahre über die Mitte des Steins. Die Schrift ist spiegelverkehrt.', en: 'Move over the middle of the stone. The writing is mirrored.', ar: 'مرّر الضوء على وسط الحجر. الكتابة معكوسة.' },
          { de: 'Es ist der Fluss, der im Süden an der Stadt entlangfließt.', en: 'It is the river that runs along the south of the city.', ar: 'إنه النهر الذي يجري جنوب المدينة.' },
          { de: 'Zum Rhein.', en: 'To the Rhine.', ar: 'إلى نهر الراين.' },
        ],
      },
      success: {
        de: 'Zum Rhein, vor Mitternacht. Der Sammler will das Hauptbuch heute Nacht aus der Stadt bringen — über das Wasser. Du musst vor ihm am Kai sein.',
        en: 'To the Rhine, before midnight. The Collector means to take the ledger out of the city tonight — across the water. You must reach the quay before him.',
        ar: 'إلى نهر الراين، قبل منتصف الليل. ينوي الجامع إخراج الدفتر من المدينة الليلة — عبر الماء. عليك أن تسبقه إلى الرصيف.',
      },
      clues: [
        { de: 'Der Sammler will heute Nacht zum Rhein, vor Mitternacht.', en: 'The Collector is heading to the Rhine tonight, before midnight.', ar: 'يتجه الجامع إلى نهر الراين الليلة، قبل منتصف الليل.' },
      ],
    },
    {
      id: 'rijnkade',
      title: { de: 'Das Signal über den Rhein', en: 'The Signal Across the Rhine', ar: 'الإشارة عبر نهر الراين' },
      story: {
        de: [
          'An der Rijnkade ist es still. Oben am Museumshang, in einem erleuchteten Fenster, blinkt eine Lampe: kurz, lang, lang … kein Zufall.',
          'Jemand sendet dir Ziffern. Sie öffnen die Seitentür des Museums, in dem das Archiv liegt.',
        ],
        en: [
          'The Rhine quay is quiet. Up on the museum slope above you, a lamp is blinking in a lit window: short, long, long… not by chance.',
          'Someone is sending you digits. They open the side door of the museum where the archive is.',
        ],
        ar: [
          'الرصيف على نهر الراين هادئ. وفي الأعلى على منحدر المتحف، يومض مصباح في نافذة مضيئة: قصير، طويل، طويل… ليس صدفة.',
          'أحدهم يرسل إليك أرقاماً. إنها تفتح الباب الجانبي للمتحف حيث يوجد الأرشيف.',
        ],
      },
      checkpoint: {
        id: 'cp-rijnkade',
        name: { de: 'An der Rijnkade', en: 'On the Rhine quay', ar: 'على رصيف نهر الراين' },
        simulated: true,
        mapPosition: { x: 52, y: 80 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9772, lng: 5.914 },
        code: 'cq-het-duivelshuis-6',
      },
      puzzle: {
        type: 'morse',
        morse: '.---- ..... ....- .....',
        prompt: { de: 'Lies die vier Ziffern aus dem Signal. Sie öffnen die Seitentür des Museums.', en: 'Read the four digits in the signal. They open the museum’s side door.', ar: 'اقرأ الأرقام الأربعة من الإشارة. إنها تفتح الباب الجانبي للمتحف.' },
        input: 'numeric',
        lock: { digits: 4 },
        hints: [
          { de: 'Jede Gruppe von fünf Blinkern ist eine Ziffer. Achte auf kurz und lang.', en: 'Each group of five flashes is one digit. Watch for short and long.', ar: 'كل مجموعة من خمس ومضات رقم واحد. انتبه للقصير والطويل.' },
          { de: 'Die erste Ziffer ist 1: einmal kurz, viermal lang. Es ist das Baujahr des Teufelshauses.', en: 'The first digit is 1: one short, four long. It is the year the Devil’s House was built.', ar: 'الرقم الأول 1: ومضة قصيرة ثم أربع طويلة. إنه عام بناء بيت الشيطان.' },
          { de: 'Der Code ist 1545.', en: 'The code is 1545.', ar: 'الرمز هو 1545.' },
        ],
      },
      success: {
        de: '1545 — das Jahr, in dem Maarten van Rossum sein Haus baute. Die Seitentür des Museums springt auf. Lena muss dir von drinnen signalisiert haben.',
        en: '1545 — the year Maarten van Rossum built his house. The museum’s side door clicks open. Lena must have signalled you from inside.',
        ar: '1545 — العام الذي بنى فيه مارتن فان روسوم بيته. ينفتح الباب الجانبي للمتحف. لا بد أن لينا أشارت إليك من الداخل.',
      },
      clues: [{ de: 'Das Signal kam aus dem Museum: Code 1545.', en: 'The signal came from the museum: code 1545.', ar: 'جاءت الإشارة من المتحف: الرمز 1545.' }],
    },
    {
      id: 'archief',
      title: { de: 'Die mittlere Schublade', en: 'The Middle Drawer', ar: 'الدرج الأوسط' },
      story: {
        de: [
          'Im Museum Arnheim empfängt dich die Kuratorin Saar de Vries, blass. „Jemand ist schon hier gewesen“, sagt sie. „Die mittlere Schublade im Archivschrank ist aufgebrochen — aber nicht geöffnet.“',
          'Die Schublade ist aus Eisen, mit einem abgenutzten Schlüsselloch. Darüber, eingeritzt, dieselben Worte wie auf deinem Schlüssel: „De middelste bewaart.“',
        ],
        en: [
          'At Museum Arnhem the curator Saar de Vries meets you, pale. “Someone has already been here,” she says. “The middle drawer of the archive cabinet was forced — but not opened.”',
          'The drawer is iron, with a worn keyhole. Above it, scratched in, the same words as on your key: “De middelste bewaart.”',
        ],
        ar: [
          'في متحف أرنم تستقبلك أمينة المتحف سار دي فريس، شاحبةً. «أحدهم كان هنا من قبل»، تقول. «الدرج الأوسط في خزانة الأرشيف كُسر — لكنه لم يُفتح».',
          'الدرج من حديد، وثقب مفتاحه بالٍ. وفوقه، محفورة، الكلمات نفسها التي على مفتاحك: «De middelste bewaart».',
        ],
      },
      checkpoint: {
        id: 'cp-archief',
        name: { de: 'Im Museumsarchiv', en: 'In the museum archive', ar: 'في أرشيف المتحف' },
        simulated: true,
        mapPosition: { x: 84, y: 34 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.9851, lng: 5.8942 },
        code: 'cq-het-duivelshuis-7',
      },
      puzzle: {
        type: 'item-use',
        fromInventory: true,
        prompt: { de: 'Welchen Gegenstand aus deinem Inventar steckst du in die mittlere Schublade?', en: 'Which item from your inventory do you put into the middle drawer?', ar: 'أي غرض من حقيبتك تضعه في الدرج الأوسط؟' },
        hints: [
          { de: 'Die Schublade ist aus Eisen, mit einem Schlüsselloch.', en: 'The drawer is iron, with a keyhole.', ar: 'الدرج من حديد، وفيه ثقب مفتاح.' },
          { de: 'Hinter dem mittleren Teufel hast du genau dafür etwas gefunden.', en: 'Behind the middle devil you found something for exactly this.', ar: 'خلف الشيطان الأوسط وجدت شيئاً لهذا بالضبط.' },
          { de: 'Der alte Eisenschlüssel.', en: 'The old iron key.', ar: 'المفتاح الحديدي القديم.' },
        ],
      },
      success: {
        de: 'Der Schlüssel dreht sich, und die Schublade gleitet auf. Darin liegt das gebundene Hauptbuch — doch eine Seite fehlt: genau die, die du wieder zusammengefügt hast. An der Kante klemmt ein Handschuh aus Samt. Der Sammler war hier und musste ihn zurücklassen.',
        en: 'The key turns and the drawer slides open. Inside lies the bound ledger — but one leaf is missing: the very page you pieced back together. A velvet glove is caught on the edge. The Collector was here and had to leave it behind.',
        ar: 'يدور المفتاح وينزلق الدرج مفتوحاً. في داخله الدفتر المجلّد — لكن تنقصه ورقة واحدة: الورقة نفسها التي أعدت جمعها. وعلى الحافة عَلِق قفّاز مخملي. كان الجامع هنا واضطُرّ إلى تركه.',
      },
      clues: [
        { de: 'Das Hauptbuch lag unberührt in der mittleren Schublade.', en: 'The ledger lay untouched in the middle drawer.', ar: 'كان الدفتر سليماً في الدرج الأوسط.' },
        { de: 'Ein Samthandschuh verrät: Der Sammler war hier.', en: 'A velvet glove gives it away: the Collector was here.', ar: 'قفّاز مخملي يفضح الأمر: الجامع كان هنا.' },
      ],
    },
    {
      id: 'aanklacht',
      title: { de: 'Die Anklage', en: 'The Accusation', ar: 'الاتهام' },
      story: {
        de: [
          'Im Innenhof hinter dem Teufelshaus steht er: ein Mann im Samtmantel, dem ein Handschuh fehlt. Lena tritt aus dem Schatten, die Ledermappe in der Hand.',
          '„Du hast alles gesehen“, sagt sie zu dir. „Sag es ihm ins Gesicht. Wer hat das Archiv aufgebrochen — und womit beweist du es?“',
        ],
        en: [
          'On the courtyard behind the Devil’s House he stands: a man in a velvet coat, missing one glove. Lena steps out of the shadow, the leather folder in her hand.',
          '“You have seen everything,” she tells you. “Say it to his face. Who forced the archive — and what is your proof?”',
        ],
        ar: [
          'في الفناء خلف بيت الشيطان يقف: رجل بمعطف مخملي، ينقصه قفّاز. تخرج لينا من الظل، والحافظة الجلدية في يدها.',
          '«لقد رأيت كل شيء»، تقول لك. «قُلها في وجهه. من كسر الأرشيف — وما دليلك؟»',
        ],
      },
      checkpoint: {
        id: 'cp-binnenplaats',
        name: { de: 'Der Innenhof', en: 'The courtyard', ar: 'الفناء' },
        simulated: true,
        mapPosition: { x: 30, y: 46 },
        verification: ['gps', 'qr', 'manual'],
        coordinates: { lat: 51.98, lng: 5.9116 },
        code: 'cq-het-duivelshuis-8',
      },
      puzzle: {
        type: 'deduction',
        prompt: { de: 'Wer hat das Archiv aufgebrochen und dich verfolgt? Nenne die Person und lege den Beweis vor.', en: 'Who forced the archive and chased you? Name them and lay down the proof.', ar: 'من كسر الأرشيف ولاحقك؟ اذكر الشخص وقدّم الدليل.' },
        choices: [
          { id: 'koster', label: { de: 'Daan Koster', en: 'Daan Koster', ar: 'دان كوستر' } },
          { id: 'devries', label: { de: 'Saar de Vries', en: 'Saar de Vries', ar: 'سار دي فريس' } },
          { id: 'bram', label: { de: 'Bram', en: 'Bram', ar: 'برام' } },
          { id: 'lena', label: { de: 'Lena Verhoef', en: 'Lena Verhoef', ar: 'لينا فرهوف' } },
        ],
        hints: [
          { de: 'Wer war vor dir am Stein und roch nach alten Büchern?', en: 'Who was at the stone before you and smelled of old books?', ar: 'من كان عند الحجر قبلك وفاحت منه رائحة الكتب القديمة؟' },
          { de: 'Der Beweis ist die Hauptbuchseite — füge in der Akte beide Hälften zusammen.', en: 'The proof is the ledger page — join its two halves in the journal.', ar: 'الدليل صفحة الدفتر — اجمع نصفيها في الملف.' },
          { de: 'Daan Koster, mit der ganzen Hauptbuchseite.', en: 'Daan Koster, with the whole ledger page.', ar: 'دان كوستر، مع صفحة الدفتر كاملة.' },
        ],
      },
      success: {
        de: 'Koster. Sein fehlender Handschuh liegt im Archiv, sein Name steht am Rand des Hauptbuchs. Er wollte es verkaufen. Als du die ganze Seite hochhältst, sinken ihm die Schultern.',
        en: 'Koster. His missing glove is in the archive, his name is in the margin of the ledger. He meant to sell it. When you hold up the whole page, his shoulders drop.',
        ar: 'كوستر. قفّازه المفقود في الأرشيف، واسمه على هامش الدفتر. أراد بيعه. وحين ترفع الصفحة كاملة، تهبط كتفاه.',
      },
      clues: [{ de: 'Koster hat das Archiv aufgebrochen; sein Name steht im Hauptbuch.', en: 'Koster forced the archive; his name is in the ledger.', ar: 'كوستر كسر الأرشيف؛ واسمه في الدفتر.' }],
    },
  ],
  ending: {
    artifact: { kind: 'book' },
    reveal: {
      de: [
        '„Das Hauptbuch ist kein Schatzverzeichnis“, wird Lena dir später erklären. „Es ist ein Versprechen. Maarten van Rossum ließ die Teufel an sein Haus setzen, damit die Leute wegsehen — und dahinter ein Hauptbuch verstecken: wer in dieser Stadt kein Dach hatte, fand hier eines.“',
        '„Die Teufel bewachen keine Goldstücke. Sie bewachen die Namen all derer, die Arnheim aufgenommen hat.“',
        'Der Sammler wollte das Hauptbuch verkaufen, Seite für Seite. Du hast es vorher gefunden.',
      ],
      en: [
        '“The ledger is no treasure list,” Lena will explain to you later. “It is a promise. Maarten van Rossum had the devils set on his house so that people would look away — and hid a ledger behind them: whoever had no roof in this city found one here.”',
        '“The devils guard no gold. They guard the names of everyone Arnhem once took in.”',
        'The Collector wanted to sell the ledger, page by page. You found it first.',
      ],
      ar: [
        '«الدفتر ليس قائمة كنوز»، ستشرح لك لينا لاحقاً. «إنه وعد. أمر مارتن فان روسوم بوضع الشياطين على بيته كي يصرف الناس أنظارهم — وأخفى خلفها دفتراً: كل من لم يكن له سقف في هذه المدينة وجد سقفاً هنا».',
        '«الشياطين لا تحرس ذهباً. تحرس أسماء كل من آوتهم أرنم يوماً».',
        'أراد الجامع أن يبيع الدفتر، صفحةً صفحة. لكنك وجدته أولاً.',
      ],
    },
    decision: {
      prompt: { de: 'Das Hauptbuch liegt wieder vollständig vor dir. Was tust du damit?', en: 'The ledger lies before you again, whole. What do you do with it?', ar: 'الدفتر أمامك كاملاً من جديد. ماذا ستفعل به؟' },
      choices: [
        {
          id: 'archive',
          label: { de: 'Dem Stadtarchiv übergeben', en: 'Hand it to the city archive', ar: 'تسليمه إلى أرشيف المدينة' },
          epilogue: {
            de: 'Lena legt das Hauptbuch in die Vitrine des Stadtarchivs, für alle sichtbar. „Ein Versprechen, das niemand mehr verstecken muss“, sagt sie. Der mittlere Teufel am Haus scheint fast zu lächeln.',
            en: 'Lena places the ledger in the city archive’s display case, in plain sight. “A promise no one has to hide any more,” she says. The middle devil on the house almost seems to smile.',
            ar: 'تضع لينا الدفتر في خزانة العرض بأرشيف المدينة، أمام الجميع. «وعدٌ لم يعد على أحد أن يخفيه»، تقول. ويكاد الشيطان الأوسط على البيت أن يبتسم.',
          },
        },
        {
          id: 'read',
          label: { de: 'Die erste Seite laut am Korenmarkt vorlesen', en: 'Read the first page aloud at the Korenmarkt', ar: 'قراءة الصفحة الأولى بصوت عالٍ عند كورنمارخت' },
          epilogue: {
            de: 'Am Korenmarkt liest du die ersten Namen laut vor. Vorübergehende bleiben stehen. Eine ältere Frau nickt: Ihren Urgroßvater hat die Stadt damals aufgenommen. Die Geschichte gehört wieder allen.',
            en: 'At the Korenmarkt you read out the first names aloud. Passers-by stop to listen. An older woman nods: the city once took in her great-grandfather. The story belongs to everyone again.',
            ar: 'عند كورنمارخت تقرأ الأسماء الأولى بصوت عالٍ. يتوقف المارّة للإصغاء. تومئ امرأة مسنّة برأسها: آوت المدينة جدّ جدّها يوماً. وتعود الحكاية مُلكاً للجميع.',
          },
        },
      ],
    },
  },
};
