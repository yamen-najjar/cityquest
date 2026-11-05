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
    // When he reaches the team (classic and expert mode): a stolen item to win back, then the case is lost.
    caught: {
      text: { de: 'Im Dunkeln packt dich eine Hand in einem Samthandschuh am Arm. Als du dich losreißt, fehlt etwas. „Wer’s findet, dem gehört’s“, ruft Koster, schon im Laufen – und verliert einen Zettel.', en: 'A hand in a velvet glove grabs your arm in the dark. When you pull free, something is missing. “Finders, keepers,” Koster calls, already running — and drops a slip of paper.', ar: 'في العتمة تمسك يدٌ بقفاز مخملي ذراعك. وحين تفلت، تجد أن شيئاً قد اختفى. «من وجد شيئاً فهو له»، يصيح كوستر وهو يركض — وتسقط منه قصاصة ورق.' },
      recover: {
        prompt: { de: 'Es ist ein Pfandschein. Die Nummer steht in römischen Ziffern. Nenne dem Pfandhaus die Nummer, und sie geben zurück, was er versetzt hat.', en: 'It is a pawnshop ticket. The number is written in Roman numerals. Give the pawnshop the number, and they will hand back what he pawned.', ar: 'إنها قسيمة رهن. الرقم مكتوب بالأرقام الرومانية. أعطِ محل الرهونات الرقم، فيعيدون إليك ما رهنه.' },
        material: { de: ['Pfandhaus „De Gouden Sleutel“', 'Schein Nr. XLII'], en: ['Pawnshop “De Gouden Sleutel”', 'Ticket no. XLII'], ar: ['محل رهونات «دي خاودن سلويتل»', 'قسيمة رقم XLII'] },
        input: 'numeric',
        hints: [
          { de: 'Römische Ziffern: X = 10, L = 50, I = 1.', en: 'Roman numerals: X = 10, L = 50, I = 1.', ar: 'الأرقام الرومانية: X = 10، L = 50، I = 1.' },
          { de: 'XL ist 50 minus 10.', en: 'XL is 50 minus 10.', ar: 'XL تعني 50 ناقص 10.' },
          { de: '42.', en: '42.', ar: '42.' },
        ],
        success: { de: 'Der Pfandleiher kneift die Augen zusammen, zuckt mit den Schultern und schiebt es dir über den Tresen zurück. Koster wird sich nicht freuen.', en: 'The pawnbroker squints at the ticket, shrugs and slides it back across the counter. Koster will not be pleased.', ar: 'يُمعن صاحب المحل النظر في القسيمة، يهزّ كتفيه ويعيد إليك ما أخذه عبر الطاولة. لن يكون كوستر مسروراً.' },
      },
      lost: {
        title: { de: 'Der Sammler gewinnt', en: 'The Collector wins', ar: 'الجامع ينتصر' },
        text: { de: 'Koster ist vor Mitternacht verschwunden, das Hauptbuch im Mantel. Eine Woche später tauchen die ersten Seiten auf einer Auktion im Ausland auf, ein Name nach dem anderen. Das Versprechen des Teufelshauses ist gebrochen.', en: 'Koster is gone before midnight, the ledger in his coat. A week later the first pages turn up at an auction abroad, one name at a time. The promise of the Devil’s House is broken.', ar: 'يختفي كوستر قبل منتصف الليل والدفتر في معطفه. وبعد أسبوع تظهر الصفحات الأولى في مزاد خارج البلاد، اسماً بعد اسم. لقد انكسر وعد بيت الشيطان.' },
      },
    },
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
        { after: 'archief', when: 'archief:police', text: { de: 'Saar hat die Polizei gerufen.', en: 'Saar has called the police.', ar: 'اتصلت سار بالشرطة.' } },
        { after: 'archief', when: 'archief:wait', text: { de: 'Du willst ihn stellen, bevor die Polizei kommt.', en: 'You chose to face him before the police.', ar: 'اخترت أن تواجهه قبل الشرطة.' } },
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
        junior: { de: 'Zahlen sind Buchstaben! 1 ist A, 2 ist B, 3 ist C. Zählt an den Fingern ab, welcher Buchstabe zu jeder Zahl gehört.', en: 'Numbers are letters! 1 is A, 2 is B, 3 is C. Count on your fingers to turn each number into a letter.', ar: 'الأرقام حروف! 1 هو A، و2 هو B، و3 هو C. عُدّوا على أصابعكم لتحوّلوا كل رقم إلى حرف.' },
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
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Vom Korenmarkt aus werden die Gassen enger. Vor dir bewachen drei steinerne Teufel die Straße, wie seit fünfhundert Jahren.', en: 'From the Korenmarkt the lanes grow narrow. Ahead, three stone devils watch the street, as they have for five hundred years.', ar: 'من ساحة كورنمارخت تضيق الأزقة. أمامك ثلاثة شياطين حجرية تراقب الشارع، كما تفعل منذ خمسمئة عام.' } },
      ],
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
        junior: { de: 'Nur ein Teufel sagt die Wahrheit. Tut so, als wäre jeder einmal der Ehrliche, und schaut, was passt.', en: 'Only one devil tells the truth. Pretend each one is the honest one, and see what works.', ar: 'شيطان واحد فقط يقول الحقيقة. تخيّلوا أن كل واحد منهم هو الصادق، وانظروا ما الذي ينجح.' },
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
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Das alte Stadttor wächst aus der Dunkelheit. Musik weht durch den Bogen: Jemand spielt für niemanden.', en: 'The old city gate rises out of the dark. Music drifts through the arch: someone is playing for nobody.', ar: 'تنهض بوابة المدينة القديمة من العتمة. وتنساب موسيقى عبر القوس: أحدهم يعزف لا لأحد.' } },
      ],
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
        junior: { de: 'Stellt Bram alle Fragen. Er weiß mehr, als er zuerst sagt.', en: 'Ask Bram all the questions. He knows more than he says at first.', ar: 'اسألوا برام كل الأسئلة. هو يعرف أكثر مما يقول في البداية.' },
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
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'man', text: { de: 'Die große Kirche – die Eusebius. Geh, bevor der Mann im Mantel vor dir dort ist.', en: 'The great church — the Eusebius. Go, before the man in the coat gets there first.', ar: 'الكنيسة الكبيرة — أوزيبيوس. اذهب، قبل أن يسبقك الرجل ذو المعطف.' } },
      ],
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
        junior: { de: 'Manche Figuren stammen von heute, nicht aus alter Zeit. Welche konnten die alten Baumeister gar nicht kennen?', en: 'Some figures are from today, not from long ago. Which ones could the old builders never have known?', ar: 'بعض الأشكال من زمننا، لا من الماضي البعيد. أيّها لم يكن البنّاؤون القدماء ليعرفوه أبداً؟' },
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
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Die beiden Hälften des Hauptbuchs passen in deinen Händen zusammen. Der Weg steigt in den Park, wo im Dunkeln Wasser fällt.', en: 'The ledger’s two halves fit together in your hands. The path climbs into the park, where water falls in the dark.', ar: 'يلتئم نصفا الدفتر بين يديك. يصعد الدرب إلى الحديقة، حيث يتساقط الماء في العتمة.' } },
      ],
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
        junior: { de: 'Bewegt das Licht über den Stein. Die Wörter stehen verkehrt herum, wie im Spiegel.', en: 'Move the light over the stone. The words are back to front, like in a mirror.', ar: 'حرّكوا الضوء على الحجر. الكلمات معكوسة، كما في المرآة.' },
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
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Jetzt hinunter zum Fluss. Der Rhein ist breit und schwarz, und am Hang darüber brennt ein einziges Fenster.', en: 'Down to the river now. The Rhine is wide and black, and on the slope above it a single window is lit.', ar: 'نزولاً إلى النهر الآن. الراين عريض وأسود، وعلى المنحدر فوقه نافذة واحدة مضاءة.' } },
      ],
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
        junior: { de: 'Das Licht blinkt kurz und lang. Malt einen Punkt für kurz und einen Strich für lang – und zählt dann.', en: 'The light blinks short and long. Draw a dot for short and a dash for long, then count them.', ar: 'يومض الضوء قصيراً وطويلاً. ارسموا نقطة للقصير وشرطة للطويل، ثم عُدّوها.' },
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
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'woman', text: { de: 'Komm zur Seitentür. Leise – ich glaube, wir sind nicht allein im Gebäude.', en: 'Come to the side door. Quietly — I don’t think we are alone in the building.', ar: 'تعالَ إلى الباب الجانبي. بهدوء — لا أظن أننا وحدنا في المبنى.' } },
      ],
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
        junior: { de: 'Die Schublade hat ein Schlüsselloch. Welches eurer Dinge passt hinein?', en: 'The drawer has a keyhole. Which of your things fits?', ar: 'في الدرج ثقب مفتاح. أي شيء من أغراضكم يناسبه؟' },
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
      // A story decision (see StoryChoice): it changes the journal, the final scene and every ending.
      choice: {
        prompt: { de: 'Saar will sofort die Polizei rufen. Lena hat dir geraten, niemandem zu trauen. Was tust du?', en: 'Saar wants to call the police right now. Lena told you to trust no one. What do you do?', ar: 'تريد سار أن تتصل بالشرطة فوراً. ولينا نصحتك ألا تثق بأحد. ماذا تفعل؟' },
        options: [
          {
            id: 'police',
            label: { de: 'Sie die Polizei rufen lassen', en: 'Let her call the police', ar: 'دعها تتصل بالشرطة' },
            outcome: { de: 'Saar ruft mit zitternden Händen an. Hilfe ist unterwegs – und vielleicht auch eine Warnung an den Sammler.', en: 'Saar makes the call with shaking hands. Help is on its way — and so, perhaps, is word of it to the Collector.', ar: 'تتصل سار بيدين مرتجفتين. المساعدة في الطريق — وربما خبرها أيضاً إلى الجامع.' },
          },
          {
            id: 'wait',
            label: { de: 'Sie bitten zu warten: Du stellst ihn zuerst selbst', en: 'Ask her to wait: you will face him first', ar: 'اطلب منها أن تنتظر: ستواجهه أنت أولاً' },
            outcome: { de: '„Gib mir zehn Minuten“, sagst du. Saar zögert, dann nickt sie und steckt das Telefon weg.', en: '“Give me ten minutes,” you say. Saar hesitates, then nods and puts the phone away.', ar: '«أمهليني عشر دقائق»، تقول. تتردد سار، ثم تومئ وتضع الهاتف جانباً.' },
          },
        ],
      },
    },
    {
      id: 'aanklacht',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'woman', text: { de: 'Hinter dem Teufelshaus gibt es einen Hof. Dort endet es – so oder so.', en: 'Behind the Devil’s House there is a courtyard. That is where it ends — one way or another.', ar: 'خلف بيت الشيطان فناء. هناك ينتهي الأمر — بطريقة أو بأخرى.' } },
      ],
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
        junior: { de: 'Wer war euch immer einen Schritt hinterher? Nehmt die Spuren, die ihr gesammelt habt.', en: 'Who was always one step behind you? Use the clues you collected.', ar: 'من كان دائماً خلفكم بخطوة؟ استعملوا الأدلة التي جمعتموها.' },
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
  // Optional deductions on the evidence board (see BoardQuestion); answers in answers.server.ts.
  board: [
    {
      id: 'tower',
      after: 'carillon',
      question: { de: 'Wer hat die Turmtür offen gelassen?', en: 'Who left the tower door open?', ar: 'مَن ترك باب البرج مفتوحاً؟' },
      deduction: { de: 'Lena. Sie ging mit einem Schlüssel in die Kirche, und die halbe Seite in der Glockenstube gehört zu ihrem Hauptbuch.', en: 'Lena. She went into the church with a key, and the half page in the bell chamber belongs to her ledger.', ar: 'لينا. دخلت الكنيسة ومعها مفتاح، ونصف الصفحة في غرفة الأجراس من دفترها.' },
    },
    {
      id: 'honest',
      after: 'archief',
      question: { de: 'Saar sagt, die Schublade sei aufgebrochen, aber nicht geöffnet worden. Sagt sie die Wahrheit?', en: 'Saar says the drawer was forced but not opened. Is she telling the truth?', ar: 'تقول سار إن الدرج كُسر ولكنه لم يُفتح. هل تقول الحقيقة؟' },
      deduction: { de: 'Ja. Das Hauptbuch lag unberührt in der mittleren Schublade, und nur dein Schlüssel aus dem Teufelshaus konnte sie öffnen.', en: 'Yes. The ledger lay untouched in the middle drawer, and only your key from the Devil’s House could open it.', ar: 'نعم. كان الدفتر في الدرج الأوسط لم يمسّه أحد، ولم يكن يفتحه إلا مفتاحك من بيت الشيطان.' },
    },
    {
      id: 'velvet',
      after: 'archief',
      question: { de: 'Wer ist dir seit dem Teufelshaus immer einen Schritt hinterher?', en: 'Who has been one step behind you since the Devil’s House?', ar: 'مَن يسير خلفك بخطوة منذ بيت الشيطان؟' },
      deduction: { de: 'Koster. Der Mann im Samtmantel folgte Lena, und sein Samthandschuh blieb an der Schublade hängen.', en: 'Koster. The man in the velvet coat followed Lena, and his velvet glove was caught on the drawer.', ar: 'كوستر. الرجل ذو المعطف المخملي تبع لينا، وعلِق قفازه المخملي بالدرج.' },
    },
  ],
  // The investigation kit: phone, documents, a fictional website, leads and secrets (see types.ts).
  documents: [
    {
      id: 'bram-notes',
      style: 'calllog',
      title: { de: 'Brams Liederliste – wer vorbeikam', en: 'Bram’s set list — who walked by', ar: 'قائمة أغاني برام — مَن مرّ' },
      rows: [
        { label: { de: 'Lied 6 – ein Mann im Samtmantel, hinter ihr her', en: 'Song 6 — a man in a velvet coat, after her', ar: 'الأغنية 6 — رجل بمعطف مخملي يتبعها' }, value: '20:52' },
        { label: { de: 'Lied 4 – eine Frau mit Ledermappe, durchs Tor', en: 'Song 4 — a woman with a leather folder, through the gate', ar: 'الأغنية 4 — امرأة بحافظة جلدية تعبر البوابة' }, value: '20:40' },
        { label: { de: 'Lied 9 – Pause, Hände zu kalt', en: 'Song 9 — a break, hands too cold', ar: 'الأغنية 9 — استراحة، اليدان باردتان' }, value: '21:30' },
      ],
    },
    {
      id: 'tower-book',
      style: 'note',
      title: { de: 'Besucherbuch des Turms', en: 'Tower visitors’ book', ar: 'دفتر زوار البرج' },
      rows: [
        { label: { de: 'L. V. – „für die Glocken“', en: 'L. V. — “for the bells”', ar: 'ل. ف. — «من أجل الأجراس»' }, value: '21:00' },
        { label: { de: 'Turmtür offen gelassen (Notiz des Küsters)', en: 'Tower door left open (sexton’s note)', ar: 'باب البرج تُرك مفتوحاً (ملاحظة القيّم)' }, value: '21:15' },
      ],
    },
    {
      id: 'koster-list',
      style: 'receipt',
      title: { de: 'Antiquitäten Koster – Kommissionsliste', en: 'Antiques Koster — consignment list', ar: 'أنتيكات كوستر — قائمة البضائع بالأمانة' },
      rows: [
        { label: { de: 'Taschenuhr, Silber – verkauft', en: 'Pocket watch, silver — sold', ar: 'ساعة جيب فضية — بيعت' }, value: '28.09' },
        { label: { de: 'Hauptbuch, Teufelshaus, um 1545 – Käufer gefunden', en: 'Ledger, Devil’s House, c. 1545 — buyer found', ar: 'دفتر، بيت الشيطان، نحو 1545 — وُجد مشترٍ' }, value: '02.10' },
        { label: { de: 'Kerzenleuchter, Paar – verkauft', en: 'Candlesticks, a pair — sold', ar: 'شمعدانان — بيعا' }, value: '04.10' },
        { label: { de: 'Reinigung: Samtmantel, dunkelgrün', en: 'Dry cleaning: velvet coat, dark green', ar: 'تنظيف جاف: معطف مخملي أخضر داكن' }, value: '05.10', secret: 'velvet-thread' },
      ],
    },
  ],
  pages: [
    {
      id: 'courant',
      site: 'Arnhemse Avondpost',
      address: 'avondpost.example/stad/duivelshuis',
      title: { de: 'Altes Hauptbuch bei Restaurierung des Teufelshauses gefunden?', en: 'Old ledger found during the restoration of the Devil’s House?', ar: 'دفتر قديم عُثر عليه أثناء ترميم بيت الشيطان؟' },
      body: { de: ['Bauarbeiter erzählen von einem Fund hinter den steinernen Teufeln. Die Stadt bestätigt nichts.', 'Ein bekannter Antiquitätenhändler soll sich schon nach dem Fund erkundigt haben – „rein aus Interesse“, wie er sagt.'], en: ['Builders talk about a find behind the stone devils. The city confirms nothing.', 'A well-known antiques dealer is said to have asked about the find already — “purely out of interest”, as he puts it.'], ar: ['يتحدث عمال البناء عن اكتشاف خلف الشياطين الحجرية. ولا تؤكد البلدية شيئاً.', 'ويُقال إن تاجر أنتيكات معروفاً سأل عن الاكتشاف بالفعل — «بدافع الاهتمام فقط»، كما يقول.'] },
    },
  ],
  phone: [
    {
      id: 'lena-start',
      from: 'unknown',
      when: 'start',
      kind: 'text',
      text: { de: 'Wenn du das liest, konnte ich nicht selbst kommen. Fang am Korenmarkt an.', en: 'If you are reading this, I could not come myself. Start at the Korenmarkt.', ar: 'إن كنت تقرأ هذا، فلم أستطع المجيء بنفسي. ابدأ من ساحة كورنمارخت.' },
    },
    {
      id: 'courant',
      from: 'unknown',
      when: 'duivels',
      kind: 'web',
      text: { de: 'Jemand hat über das Haus gelesen. Ich auch.', en: 'Someone has been reading about the house. So have I.', ar: 'أحدهم قرأ عن البيت. وأنا أيضاً.' },
      page: 'courant',
    },
    {
      id: 'bram-notes',
      from: 'bram',
      when: 'sabelspoort',
      kind: 'text',
      text: { de: 'Ich schreibe meine Lieder auf – und wer vorbeigeht. Alte Gewohnheit.', en: 'I write down my songs — and who walks by. Old habit.', ar: 'أكتب أغنياتي — ومَن يمرّ بي. عادة قديمة.' },
      document: 'bram-notes',
      replies: [
        { id: 'watch', label: { de: 'Kannst du weiter das Tor im Auge behalten?', en: 'Can you keep watching the gate?', ar: 'هل تستطيع أن تواصل مراقبة البوابة؟' }, answer: { de: 'Für dich? Bis Mitternacht. Danach gehört die Dunkelheit dem Sammler.', en: 'For you? Until midnight. After that, the dark belongs to the Collector.', ar: 'من أجلك؟ حتى منتصف الليل. بعدها تصبح العتمة للجامع.' }, trust: 1 },
        { id: 'thanks', label: { de: 'Danke, Bram.', en: 'Thank you, Bram.', ar: 'شكراً يا برام.' }, answer: { de: 'Spiel fair, dann spielt die Stadt fair mit dir.', en: 'Play fair, and the city plays fair with you.', ar: 'العب بنزاهة، فتلعب المدينة معك بنزاهة.' } },
      ],
    },
    {
      id: 'tower-book',
      from: 'unknown',
      when: 'carillon',
      kind: 'text',
      text: { de: 'Ich habe mich ins Turmbuch eingetragen. Wenn du die Seite gesehen hast, weißt du, dass ich dort war.', en: 'I signed the tower book. If you have seen the page, you know I was there.', ar: 'وقّعت في دفتر البرج. إن رأيت الصفحة، فأنت تعرف أنني كنت هناك.' },
      document: 'tower-book',
    },
    {
      id: 'threat',
      from: 'unknown',
      when: 'sonsbeek',
      kind: 'text',
      text: { de: 'Bleib heute Nacht vom Fluss weg. Das ist kein Rat.', en: 'Stay away from the river tonight. That is not advice.', ar: 'ابتعد عن النهر الليلة. هذه ليست نصيحة.' },
      replies: [
        { id: 'no', label: { de: 'Ich komme trotzdem.', en: 'I am coming anyway.', ar: 'سآتي على أي حال.' }, answer: { de: 'Dann bring warme Kleidung mit. Am Wasser wird es kalt.', en: 'Then dress warmly. It gets cold by the water.', ar: 'إذن ارتدِ ملابس دافئة. يبرد الجو عند الماء.' } },
        { id: 'who', label: { de: 'Koster?', en: 'Koster?', ar: 'كوستر؟' }, answer: { de: 'Namen sind etwas für Hauptbücher.', en: 'Names are for ledgers.', ar: 'الأسماء للدفاتر.' } },
      ],
    },
    {
      id: 'saar-call',
      from: 'devries',
      when: 'rijnkade',
      kind: 'call',
      text: { de: 'Saar de Vries vom Museum hat angerufen.', en: 'Saar de Vries from the museum called.', ar: 'اتصلت سار دي فريس من المتحف.' },
      lines: [
        { voice: 'woman', text: { de: 'Hier ist Saar de Vries. Die Seitentür ist offen – aber beeil dich, jemand hat sich schon am Archiv zu schaffen gemacht.', en: 'This is Saar de Vries. The side door is open — but please hurry, someone has already been at the archive.', ar: 'معك سار دي فريس. الباب الجانبي مفتوح — لكن أرجوك أسرع، فأحدهم عبث بالأرشيف بالفعل.' } },
      ],
    },
    {
      id: 'koster-list',
      from: 'devries',
      when: 'archief',
      kind: 'text',
      text: { de: 'Das steckte in der Tasche des Handschuhs: eine Liste aus Kosters Laden.', en: 'This was in the glove’s pocket: a list from Koster’s shop.', ar: 'كانت هذه في جيب القفاز: قائمة من محل كوستر.' },
      document: 'koster-list',
    },
    {
      id: 'lena-thanks',
      from: 'lena',
      when: 'aanklacht',
      kind: 'text',
      text: { de: 'Danke. Jetzt kann ich aus dem Schatten kommen.', en: 'Thank you. Now I can come out of the shadows.', ar: 'شكراً. الآن أستطيع الخروج من الظل.' },
    },
    {
      id: 'bram-bonus',
      from: 'bram',
      when: 'carillon',
      kind: 'text',
      text: { de: 'Ich habe das Tor weiter beobachtet, wie du gebeten hast. Der Mann im Samtmantel kam um 21:40 zurück – ohne seinen linken Handschuh.', en: 'I kept watching the gate, like you asked. The man in the velvet coat came back at 21:40 — without his left glove.', ar: 'واصلت مراقبة البوابة كما طلبت. عاد الرجل ذو المعطف المخملي الساعة 21:40 — من دون قفازه الأيسر.' },
      trust: { person: 'bram', atLeast: 1 },
    },
    {
      id: 'lena-halloween',
      from: 'unknown',
      when: 'start',
      kind: 'text',
      text: { de: 'Heute Nacht scheinen die steinernen Teufel zu grinsen. Lass dich nicht ablenken.', en: 'Tonight the stone devils seem to grin. Don’t let them distract you.', ar: 'الليلة تبدو الشياطين الحجرية كأنها تبتسم. لا تدعها تشتّت انتباهك.' },
      season: 'halloween',
    },
    {
      id: 'bram-winter',
      from: 'bram',
      when: 'sabelspoort',
      kind: 'text',
      text: { de: 'Kalte Finger, warme Lieder. Wenn du wieder am Tor vorbeikommst, bring mir einen Kaffee mit.', en: 'Cold fingers, warm songs. If you pass the gate again, bring me a coffee.', ar: 'أصابع باردة وأغانٍ دافئة. إن مررت بالبوابة مجدداً، أحضر لي قهوة.' },
      season: 'winter',
    },
  ],
  leads: [
    {
      id: 'koster-claim',
      after: 'archief',
      kind: 'confront',
      title: { de: 'Kosters Ausrede', en: 'Koster’s excuse', ar: 'عذر كوستر' },
      brief: { de: 'Koster behauptet, er habe von dem Hauptbuch heute Nacht zum ersten Mal gehört. Seine eigene Liste sagt etwas anderes.', en: 'Koster claims he heard of the ledger for the first time tonight. His own list says otherwise.', ar: 'يدّعي كوستر أنه سمع بالدفتر لأول مرة الليلة. لكن قائمته نفسها تقول غير ذلك.' },
      person: 'koster',
      claim: { de: 'Welches Hauptbuch? Davon höre ich heute Nacht zum ersten Mal.', en: 'What ledger? Tonight is the first I have heard of it.', ar: 'أي دفتر؟ الليلة أول مرة أسمع به.' },
      documents: ['koster-list'],
      hints: [
        { de: 'Lies jede Zeile der Liste.', en: 'Read every line of the list.', ar: 'اقرأ كل سطر في القائمة.' },
        { de: 'Eine Zeile ist älter als heute Nacht und nennt ein Hauptbuch.', en: 'One line is older than tonight and names a ledger.', ar: 'أحد الأسطر أقدم من الليلة ويذكر دفتراً.' },
        { de: '„Hauptbuch, Teufelshaus – Käufer gefunden“, am 02.10.', en: '“Ledger, Devil’s House — buyer found”, on 02.10.', ar: '«دفتر، بيت الشيطان — وُجد مشترٍ»، بتاريخ 02.10.' },
      ],
      outcome: { de: 'Koster starrt auf die Liste. „Ein Käufer im Ausland“, sagt er schließlich. „Er zahlt pro Name.“', en: 'Koster stares at the list. “A buyer abroad,” he says at last. “He pays per name.”', ar: 'يحدّق كوستر في القائمة. «مشترٍ في الخارج»، يقول أخيراً. «يدفع عن كل اسم».' },
    },
    {
      id: 'evening',
      after: 'carillon',
      kind: 'timeline',
      title: { de: 'Jener Abend, der Reihe nach', en: 'That evening, in order', ar: 'تلك الأمسية، بالترتيب' },
      brief: { de: 'Brams Liste und das Turmbuch nennen Uhrzeiten. Bring Lenas Weg in die Reihenfolge.', en: 'Bram’s list and the tower book give times. Put Lena’s way in order.', ar: 'قائمة برام ودفتر البرج يذكران أوقاتاً. رتّب طريق لينا.' },
      documents: ['bram-notes', 'tower-book'],
      events: [
        { id: 't', text: { de: 'Jemand trägt sich als L. V. ins Turmbuch ein.', en: 'Someone signs the tower book as L. V.', ar: 'شخص يوقّع في دفتر البرج باسم ل. ف.' } },
        { id: 'd', text: { de: 'Die Turmtür bleibt offen.', en: 'The tower door is left open.', ar: 'يُترك باب البرج مفتوحاً.' } },
        { id: 'v', text: { de: 'Der Mann im Samtmantel folgt ihr.', en: 'The man in the velvet coat follows her.', ar: 'الرجل ذو المعطف المخملي يتبعها.' } },
        { id: 'f', text: { de: 'Lena geht mit ihrer Mappe durchs Tor.', en: 'Lena passes the gate with her folder.', ar: 'تعبر لينا البوابة ومعها حافظتها.' } },
      ],
      hints: [
        { de: 'Die Uhrzeiten stehen in Brams Liste und im Turmbuch.', en: 'The times are in Bram’s list and the tower book.', ar: 'الأوقات موجودة في قائمة برام ودفتر البرج.' },
        { de: 'Lena kam um 20:40 durchs Tor.', en: 'Lena came through the gate at 20:40.', ar: 'عبرت لينا البوابة الساعة 20:40.' },
        { de: 'Tor 20:40, Samtmantel 20:52, Turmbuch 21:00, offene Tür 21:15.', en: 'Gate 20:40, velvet coat 20:52, tower book 21:00, open door 21:15.', ar: 'البوابة 20:40، المعطف المخملي 20:52، دفتر البرج 21:00، الباب المفتوح 21:15.' },
      ],
      outcome: { de: '20:40 das Tor, 20:52 der Samtmantel, 21:00 das Turmbuch, 21:15 die offene Tür: Lena wusste, dass er ihr folgte – und ließ die Tür für dich offen.', en: '20:40 the gate, 20:52 the velvet coat, 21:00 the tower book, 21:15 the open door: Lena knew he was following her — and left the door open for you.', ar: '20:40 البوابة، 20:52 المعطف المخملي، 21:00 دفتر البرج، 21:15 الباب المفتوح: كانت لينا تعرف أنه يتبعها — وتركت الباب مفتوحاً لك.' },
    },
    {
      id: 'facade',
      after: 'duivels',
      kind: 'echo',
      title: { de: 'Das Teufelshaus, wie der Autor es sich vorstellt', en: 'The Devil’s House, as the author imagines it', ar: 'بيت الشيطان، كما يتخيّله الكاتب' },
      brief: { de: 'Das Haus heute – und wie der Autor es sich zur Zeit seines Bauherrn vorstellt. Im Giebel steht eine Jahreszahl, die heute fehlt. Welche?', en: 'The house today — and as the author imagines it in its builder’s day. A year is carved in the gable that is missing today. Which?', ar: 'البيت اليوم — وكما يتخيّله الكاتب في زمن من بناه. في الجملون سنة محفورة غير موجودة اليوم. ما هي؟' },
      echo: {
        now: { floors: 3, bays: 3, door: 'arch', roof: 'gable', tone: 'brick', marks: [{ x: 33, y: 73, kind: 'statue' }, { x: 50, y: 70, kind: 'statue' }, { x: 67, y: 73, kind: 'statue' }] },
        imagined: { floors: 3, bays: 3, door: 'arch', roof: 'gable', tone: 'brick', marks: [{ x: 33, y: 73, kind: 'statue' }, { x: 50, y: 70, kind: 'statue' }, { x: 67, y: 73, kind: 'statue' }, { x: 50, y: 18, kind: 'symbol', text: '1545' }, { x: 16, y: 36, kind: 'lamp' }] },
        secret: { x: 16, y: 36, id: 'devil-stamp' },
      },
      input: 'numeric',
      hints: [
        { de: 'Schieb den Regler ganz durch und sieh in den Giebel.', en: 'Slide all the way across and look at the gable.', ar: 'اسحب حتى النهاية وانظر إلى الجملون.' },
        { de: 'Es sind vier Ziffern.', en: 'It is four digits.', ar: 'إنها أربعة أرقام.' },
        { de: '1545.', en: '1545.', ar: '1545.' },
      ],
      outcome: { de: '1545 – dieselbe Zahl, die dir später das Signal über den Rhein schickt. Lena hat sie nicht zufällig gewählt.', en: '1545 — the same number the signal across the Rhine will send you later. Lena did not choose it by chance.', ar: '1545 — الرقم نفسه الذي سترسله إليك الإشارة عبر الراين لاحقاً. لم تختره لينا صدفة.' },
    },
    {
      id: 'overheard',
      after: 'rijnkade',
      kind: 'listen',
      title: { de: 'Ein mitgehörtes Telefonat', en: 'An overheard call', ar: 'مكالمة مسموعة خلسة' },
      brief: { de: 'Saar hat Koster am Museumstelefon belauscht. Zwischen zwei Sätzen nennt er leise den Treffpunkt mit seinem Käufer. Wo?', en: 'Saar overheard Koster on the museum phone. Between two sentences he quietly names where he meets his buyer. Where?', ar: 'سمعت سار كوستر خلسة على هاتف المتحف. بين جملتين يذكر بصوت خافت مكان لقائه بالمشتري. أين؟' },
      recording: [
        { voice: 'man', text: { de: 'Ja. Das Hauptbuch. Heute Nacht.', en: 'Yes. The ledger. Tonight.', ar: 'نعم. الدفتر. الليلة.' } },
        { voice: 'man', quiet: true, text: { de: 'Im Hof, hinter dem Haus.', en: 'In the courtyard, behind the house.', ar: 'في الفناء، خلف البيت.' } },
        { voice: 'man', text: { de: 'Bargeld. Keine Fragen.', en: 'Cash. No questions.', ar: 'نقداً. ولا أسئلة.' } },
      ],
      hints: [
        { de: 'Spiel es noch einmal laut ab und hör zwischen den Sätzen hin.', en: 'Play it again with the volume up and listen between the sentences.', ar: 'شغّله مجدداً بصوت أعلى واستمع إلى ما بين الجمل.' },
        { de: 'Ein Ort hinter einem Haus.', en: 'A place behind a house.', ar: 'مكان خلف بيت.' },
        { de: 'Im Hof.', en: 'In the courtyard.', ar: 'في الفناء.' },
      ],
      outcome: { de: 'Der Hof hinter dem Teufelshaus. Dort wartet er – und dort wirst du ihn stellen.', en: 'The courtyard behind the Devil’s House. That is where he will wait — and where you will face him.', ar: 'الفناء خلف بيت الشيطان. هناك سينتظر — وهناك ستواجهه.' },
    },
  ],
  secrets: [
    { id: 'velvet-thread', title: { de: 'Ein grüner Faden', en: 'A green thread', ar: 'خيط أخضر' }, text: { de: 'In der Heftklammer der Liste hängt ein dunkelgrüner Samtfaden – dieselbe Farbe wie der Handschuh im Archiv.', en: 'Caught in the list’s staple: a dark green velvet thread — the same colour as the glove in the archive.', ar: 'عالق في دبّوس القائمة: خيط مخملي أخضر داكن — بلون القفاز في الأرشيف نفسه.' } },
    { id: 'devil-stamp', title: { de: 'Ein Teufelskopf auf dem Fensterbrett', en: 'A devil’s head on the sill', ar: 'رأس شيطان على حافة النافذة' }, text: { de: 'Auf dem Fensterbrett ein winziger Stempel: derselbe Teufelskopf wie auf Lenas Seite. Sie war hier, lange bevor sie dir schrieb.', en: 'On the window sill, a tiny stamp: the same devil’s head as on Lena’s page. She was here long before she wrote to you.', ar: 'على حافة النافذة ختم صغير: رأس الشيطان نفسه الذي على صفحة لينا. كانت هنا قبل أن تكتب إليك بزمن طويل.' } },
  ],
  // The case report filed before the reveal (see CaseReport); the right answers are in answers.server.ts.
  report: {
    slots: [
      {
        id: 'who',
        question: { de: 'Wer hat das Archiv aufgebrochen?', en: 'Who forced the archive?', ar: 'مَن كسر الأرشيف؟' },
        options: [
          { id: 'koster', label: { de: 'Daan Koster', en: 'Daan Koster', ar: 'دان كوستر' } },
          { id: 'bram', label: { de: 'Bram', en: 'Bram', ar: 'برام' } },
          { id: 'devries', label: { de: 'Saar de Vries', en: 'Saar de Vries', ar: 'سار دي فريس' } },
          { id: 'lena', label: { de: 'Lena Verhoef', en: 'Lena Verhoef', ar: 'لينا فرهوف' } },
        ],
      },
      {
        id: 'why',
        question: { de: 'Warum?', en: 'Why?', ar: 'لماذا؟' },
        options: [
          { id: 'protect', label: { de: 'Um die Namen zu schützen', en: 'To protect the names', ar: 'ليحمي الأسماء' } },
          { id: 'sell', label: { de: 'Um das Hauptbuch Seite für Seite im Ausland zu verkaufen', en: 'To sell the ledger page by page abroad', ar: 'ليبيع الدفتر صفحةً صفحة في الخارج' } },
          { id: 'city', label: { de: 'Um es der Stadt zu schenken', en: 'To give it to the city', ar: 'ليهديه إلى المدينة' } },
          { id: 'find-lena', label: { de: 'Um Lena zu finden', en: 'To find Lena', ar: 'ليجد لينا' } },
        ],
      },
      {
        id: 'since',
        question: { de: 'Seit wann folgte er Lena?', en: 'Since when was he following Lena?', ar: 'منذ متى كان يتبع لينا؟' },
        options: [
          { id: 'market', label: { de: 'Seit dem Korenmarkt', en: 'Since the Korenmarkt', ar: 'منذ ساحة كورنمارخت' } },
          { id: 'gate', label: { de: 'Seit der Sabelspoort, kurz nach ihr', en: 'Since the Sabelspoort, just after her', ar: 'منذ بوابة سابلسبورت، بعدها بقليل' } },
          { id: 'tower', label: { de: 'Seit der Glockenstube', en: 'Since the bell chamber', ar: 'منذ غرفة الأجراس' } },
          { id: 'river', label: { de: 'Seit dem Rhein', en: 'Since the Rhine', ar: 'منذ نهر الراين' } },
        ],
      },
      {
        id: 'ledger',
        question: { de: 'Was steht wirklich im Hauptbuch?', en: 'What does the ledger really hold?', ar: 'ماذا يحوي الدفتر حقاً؟' },
        options: [
          { id: 'treasure', label: { de: 'Eine Schatzkarte', en: 'A treasure map', ar: 'خريطة كنز' } },
          { id: 'names', label: { de: 'Die Namen aller, die Arnheim einst aufnahm', en: 'The names of everyone Arnhem once took in', ar: 'أسماء كل من آوتهم أرنم يوماً' } },
          { id: 'debts', label: { de: 'Maarten van Rossums Schulden', en: 'Maarten van Rossum’s debts', ar: 'ديون مارتن فان روسوم' } },
          { id: 'thieves', label: { de: 'Eine Liste von Dieben', en: 'A list of thieves', ar: 'قائمة لصوص' } },
        ],
      },
      {
        id: 'proof',
        question: { de: 'Was hat Koster verraten?', en: 'What gave Koster away?', ar: 'ما الذي فضح كوستر؟' },
        options: [
          { id: 'glove', label: { de: 'Sein Samthandschuh im Archiv', en: 'His velvet glove in the archive', ar: 'قفازه المخملي في الأرشيف' } },
          { id: 'tower-book', label: { de: 'Seine Unterschrift im Turmbuch', en: 'His signature in the tower book', ar: 'توقيعه في دفتر البرج' } },
          { id: 'song', label: { de: 'Ein Lied von Bram', en: 'A song of Bram’s', ar: 'أغنية لبرام' } },
          { id: 'taxi', label: { de: 'Eine Taxiquittung', en: 'A taxi receipt', ar: 'إيصال تاكسي' } },
        ],
      },
    ],
  },
  // The meta-mystery's lantern sign (content/meta.ts) and the printable dossier's brief.
  token: { order: 3, fragment: { de: 'solange jemand liest.', en: 'while someone reads.', ar: 'ما دام أحدٌ يقرأ.' } },
  dossier: {
      de: ['Arnheim, ein Abend am Korenmarkt. Eine Frau, die alte Häuser restauriert, ist verschwunden – und hat zuvor geschrieben, sie habe im Teufelshaus etwas gefunden.', 'Drei steinerne Teufel bewachen dieses Haus seit fünfhundert Jahren. Fragt sie. Fragt die Musiker am Tor. Und traut keinem, der sich Sammler nennt.'],
      en: ['Arnhem, an evening at the Korenmarkt. A woman who restores old houses has disappeared — after writing that she had found something in the Devil’s House.', 'Three stone devils have guarded that house for five hundred years. Ask them. Ask the musicians at the gate. And trust no one who calls himself a collector.'],
      ar: ['أرنم، مساء في ساحة كورنمارخت. اختفت امرأة ترمّم البيوت القديمة — بعد أن كتبت أنها وجدت شيئاً في بيت الشيطان.', 'ثلاثة شياطين حجرية تحرس ذلك البيت منذ خمسمئة عام. اسألوها. اسألوا العازفين عند البوابة. ولا تثقوا بأحد يسمّي نفسه جامعاً.'],
    },
  // Second truths for replays (see Variant): another culprit, the same clues and a few new ones.
  variants: [
    {
      id: 'saar',
      title: { de: 'Der Schlüssel der Kuratorin', en: 'The Curator’s Key', ar: 'مفتاح أمينة المتحف' },
      culprit: 'devries',
      chapters: {
        aanklacht: {
          story: {
            de: ['Im Hof hinter dem Teufelshaus steht Koster, ein Handschuh fehlt ihm, und er lacht dich aus. „Ja, ich bin dir gefolgt. Aber einen Schlüssel zu dieser Schublade hatte ich nie.“ Lena tritt aus dem Schatten. „Er hat recht“, sagt sie leise. „Wer hat das Archiv geöffnet – und was ist dein Beweis?“'],
            en: ['On the courtyard behind the Devil’s House stands Koster, missing one glove, and he laughs at you. “Yes, I followed you. But I never had a key to that drawer.” Lena steps out of the shadow. “He is right,” she says quietly. “Who opened the archive — and what is your proof?”'],
            ar: ['في الفناء خلف بيت الشيطان يقف كوستر، ينقصه قفاز، ويضحك منك. «نعم، تبعتك. لكنني لم أملك قط مفتاحاً لذلك الدرج». تخرج لينا من الظل. «إنه محق»، تقول بهدوء. «من فتح الأرشيف — وما دليلك؟»'],
          },
          prompt: { de: 'Wer hat die Schublade im Archiv geöffnet? Nenne die Person und lege den Beweis vor.', en: 'Who opened the drawer in the archive? Name them and lay down the proof.', ar: 'من فتح الدرج في الأرشيف؟ سمِّ الشخص وقدّم الدليل.' },
          hints: [
            { de: 'Wer sagte, die Schublade sei aufgebrochen – und wer hätte sie ohne Gewalt öffnen können?', en: 'Who said the drawer had been forced — and who could have opened it without force?', ar: 'من قال إن الدرج كُسر — ومن كان يستطيع فتحه بلا كسر؟' },
            { de: 'Der Beweis ist der Schlüssel, der sich ohne einen Kratzer dreht. Sieh in deinen Gegenständen nach.', en: 'The proof is the key that turns without a scratch. Look among your items.', ar: 'الدليل هو المفتاح الذي يدور بلا خدش واحد. ابحث بين أغراضك.' },
            { de: 'Saar de Vries, mit dem alten Eisenschlüssel.', en: 'Saar de Vries, with the old iron key.', ar: 'سار دي فريس، مع المفتاح الحديدي القديم.' },
          ],
          junior: { de: 'Wer hat gesagt, die Schublade sei kaputt? Prüft, ob das wirklich stimmt.', en: 'Who said the drawer was broken? Check whether that was really true.', ar: 'من قال إن الدرج مكسور؟ تحقّقوا إن كان ذلك صحيحاً فعلاً.' },
          success: { de: 'Saar. Der Eisenschlüssel dreht sich ohne einen einzigen Kratzer: Die Schublade wurde nie aufgebrochen, sondern aufgeschlossen – mit dem Zweitschlüssel des Museums. Koster war ihr Käufer, und seinen Handschuh hat sie hingelegt, um sich hinter ihm zu verstecken. Sie sagt kein Wort.', en: 'Saar. The iron key turns without a single scratch: the drawer was never forced, it was unlocked — with the museum’s own spare key. Koster was her buyer, and she left his glove there to hide behind him. She does not say a word.', ar: 'سار. يدور المفتاح الحديدي بلا خدش واحد: الدرج لم يُكسر قط، بل فُتح — بالمفتاح الاحتياطي للمتحف نفسه. كان كوستر مشتريها، وتركت قفازه هناك لتختبئ خلفه. لا تقول كلمة.' },
        },
      },
      phone: [
        { id: 'bram-saar', from: 'bram', when: 'carillon', kind: 'text', text: { de: 'Komisch: Die Dame vom Museum kam um 21:10 am Tor vorbei, lange nach Feierabend, und sehr eilig. Sie sah durch mich hindurch.', en: 'Funny thing: the lady from the museum passed the gate at 21:10, long after closing, in a great hurry. She looked straight through me.', ar: 'أمر غريب: مرّت السيدة من المتحف بالبوابة الساعة 21:10، بعد الإغلاق بكثير، وهي مستعجلة جداً. نظرت من خلالي كأنني غير موجود.' } },
        { id: 'alarm-log', from: 'unknown', when: 'archief', kind: 'text', text: { de: 'Frag die Kuratorin, warum das Alarmprotokoll ihre Karte um 21:40 zeigt – zwanzig Minuten bevor sie dich anrief.', en: 'Ask the curator why the alarm log shows her pass at 21:40 — twenty minutes before she called you.', ar: 'اسأل أمينة المتحف لماذا يُظهر سجل الإنذار بطاقتها الساعة 21:40 — قبل عشرين دقيقة من اتصالها بك.' } },
      ],
      notes: {
        devries: [{ after: 'aanklacht', text: { de: 'Öffnete die Schublade mit dem Zweitschlüssel des Museums und legte Kosters Handschuh hin.', en: 'Opened the drawer with the museum’s spare key and planted Koster’s glove.', ar: 'فتحت الدرج بالمفتاح الاحتياطي للمتحف ودسّت قفاز كوستر.' } }],
      },
      ending: {
        reveal: {
          de: ['„Das Hauptbuch ist keine Schatzliste“, wird Lena dir später erklären. „Es ist ein Versprechen. Maarten van Rossum ließ die Teufel an sein Haus setzen, damit die Leute wegsehen – und versteckte dahinter ein Hauptbuch: Wer in dieser Stadt kein Dach hatte, fand hier eines.“', '„Die Teufel bewachen kein Gold. Sie bewachen die Namen aller, die Arnheim einst aufnahm.“', 'Saar hatte es Koster versprochen, Seite für Seite, und sich hinter seinem Handschuh versteckt. Du hast beide durchschaut.'],
          en: ['“The ledger is no treasure list,” Lena will explain to you later. “It is a promise. Maarten van Rossum had the devils set on his house so that people would look away — and hid a ledger behind them: whoever had no roof in this city found one here.”', '“The devils guard no gold. They guard the names of everyone Arnhem once took in.”', 'Saar had promised it to Koster, page by page, and hid behind his glove. You saw through them both.'],
          ar: ['«الدفتر ليس قائمة كنوز»، ستشرح لك لينا لاحقاً. «إنه وعد. وضع مارتن فان روسوم الشياطين على بيته كي يشيح الناس بأنظارهم — وخبّأ خلفها دفتراً: من لم يكن له سقف في هذه المدينة وجد هنا سقفاً».', '«الشياطين لا تحرس ذهباً. إنها تحرس أسماء كل من آوتهم أرنم يوماً».', 'كانت سار قد وعدت كوستر به، صفحةً صفحة، واختبأت خلف قفازه. لقد كشفتهما معاً.'],
        },
        revealIf: [
          { when: 'archief:police', text: { de: 'Blaulicht fegt über den Hof: Saar hat die Polizei selbst gerufen, um Koster fassen zu lassen. Jetzt bleiben die Beamten vor ihr stehen.', en: 'Blue light sweeps across the courtyard: Saar called the police herself, to have Koster caught. Now the officers stop in front of her.', ar: 'يكنس الضوء الأزرق الفناء: سار نفسها استدعت الشرطة لتوقع بكوستر. والآن يتوقف الشرطيون أمامها هي.' } },
          { when: 'archief:wait', text: { de: 'Keine Sirenen, kein Licht: nur du, Lena, Koster – und Saar, die eine Minute später kommt und stehen bleibt, als sie eure Gesichter sieht.', en: 'No sirens, no lights: only you, Lena, Koster — and Saar, who arrives a minute later and stops when she sees your faces.', ar: 'لا صفارات ولا أضواء: أنت ولينا وكوستر فقط — وسار التي تصل بعد دقيقة وتتجمّد حين ترى وجوهكم.' } },
        ],
      },
    },
  ],
  ending: {
    // Arrives in the dashboard a week after the case is solved.
    letter: {
      from: { de: 'Lena Verhoef', en: 'Lena Verhoef', ar: 'لينا فرهوف' },
      text: {
        de: ['Eine Woche ist vergangen. Ich gehe wieder jeden Morgen am Teufelshaus vorbei, und die Teufel sehen mich an, als wüssten sie Bescheid.', 'Eine alte Frau hat mich auf dem Markt angesprochen. Ihr Urgroßvater stand im Hauptbuch. Sie hat geweint, und ich auch.', 'Danke, dass ihr mir gefolgt seid, als ich verschwunden war.'],
        en: ['A week has passed. I walk past the Devil’s House every morning again, and the devils look at me as if they know.', 'An old woman stopped me at the market. Her great-grandfather was in the ledger. She cried, and so did I.', 'Thank you for following me when I had disappeared.'],
        ar: ['مرّ أسبوع. عدت أمرّ كل صباح ببيت الشيطان، والشياطين تنظر إليّ كأنها تعرف.', 'استوقفتني امرأة عجوز في السوق. كان جدّ أبيها مذكوراً في الدفتر. بكت، وبكيت أنا أيضاً.', 'شكراً لأنكم تبعتموني حين اختفيت.'],
      },
    },
    artifact: { kind: 'book' },
    revealIf: [
      { when: 'archief:police', text: { de: 'Blaues Licht streift über den Hof: Saars Anruf hat die Polizei gebracht. Koster rennt nicht weg. Er streckt die Hände aus, bevor ihn jemand darum bittet.', en: 'Blue light sweeps across the courtyard: Saar’s call has brought the police. Koster does not run. He holds out his wrists before anyone asks.', ar: 'يمسح ضوء أزرق الفناء: اتصال سار جاء بالشرطة. لا يهرب كوستر، بل يمدّ معصميه قبل أن يطلب منه أحد.' } },
      { when: 'archief:wait', text: { de: 'Keine Sirenen, kein Blaulicht: nur du, Lena und ein Mann, dem die Ausreden ausgegangen sind. Saar kommt eine Minute später, außer Atem, und bleibt an deiner Seite.', en: 'No sirens, no lights: only you, Lena and a man who has run out of excuses. Saar arrives a minute later, out of breath, and stays at your side.', ar: 'لا صفارات ولا أضواء: أنت ولينا ورجل نفدت أعذاره. تصل سار بعد دقيقة لاهثة، وتبقى إلى جانبك.' } },
    ],
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
          epilogueIf: [
            { when: 'archief:police', text: { de: 'Kosters Prozess ist kurz. Er bittet nur um eines: das Hauptbuch noch einmal zu sehen, hinter Glas.', en: 'Koster’s trial is short. He asks only one thing: to see the ledger once more, behind glass.', ar: 'محاكمة كوستر قصيرة. لا يطلب سوى شيء واحد: أن يرى الدفتر مرة أخرى، خلف الزجاج.' } },
            { when: 'archief:wait', text: { de: 'Eine Woche später bringt Koster etwas zurück, das er vor Jahren genommen hat: eine Seite aus einem anderen Archiv, mit einem Zettel: „Es tut mir leid.“', en: 'A week later Koster brings back something he took years ago: a page from another archive, with a note: “I am sorry.”', ar: 'بعد أسبوع يعيد كوستر شيئاً أخذه قبل سنوات: صفحة من أرشيف آخر، ومعها ورقة: «أنا آسف».' } },
          ],
        },
        {
          id: 'read',
          label: { de: 'Die erste Seite laut am Korenmarkt vorlesen', en: 'Read the first page aloud at the Korenmarkt', ar: 'قراءة الصفحة الأولى بصوت عالٍ عند كورنمارخت' },
          epilogue: {
            de: 'Am Korenmarkt liest du die ersten Namen laut vor. Vorübergehende bleiben stehen. Eine ältere Frau nickt: Ihren Urgroßvater hat die Stadt damals aufgenommen. Die Geschichte gehört wieder allen.',
            en: 'At the Korenmarkt you read out the first names aloud. Passers-by stop to listen. An older woman nods: the city once took in her great-grandfather. The story belongs to everyone again.',
            ar: 'عند كورنمارخت تقرأ الأسماء الأولى بصوت عالٍ. يتوقف المارّة للإصغاء. تومئ امرأة مسنّة برأسها: آوت المدينة جدّ جدّها يوماً. وتعود الحكاية مُلكاً للجميع.',
          },
          epilogueIf: [
            { when: 'archief:police', text: { de: 'Der Polizist, der Koster abgeführt hat, kommt zurück und hört zu, die Mütze in der Hand.', en: 'The officer who led Koster away comes back to listen, cap in hand.', ar: 'يعود الشرطي الذي اقتاد كوستر ليستمع، وقبعته في يده.' } },
            { when: 'archief:wait', text: { de: 'Ganz hinten in der Menge steht ein Mann im Samtmantel und hört zu. Niemand bittet ihn zu gehen.', en: 'At the back of the crowd stands a man in a velvet coat, listening. No one asks him to leave.', ar: 'في آخر الحشد يقف رجل بمعطف مخملي يستمع. لا أحد يطلب منه أن يرحل.' } },
          ],
        },
      ],
    },
  },
};
