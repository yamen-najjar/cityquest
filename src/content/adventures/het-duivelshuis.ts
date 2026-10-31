import type { Adventure, Authored } from '../types';

// "Het Duivelshuis-geheim" / "The Devil's House Secret" - the Arnhem detective adventure. The story, the
// archivist Lena Verhoef, the collector Daan Koster and Maarten van Rossum's hidden pledge are fiction.
// The checkpoints are simulated: no route has been walked or validated yet, so none of them names a real
// address and no puzzle depends on a fact about the city. The landmarks (Korenmarkt, the Devil's House,
// the Sabelspoort, the Eusebius church, Sonsbeek park, the Rhine quay, Museum Arnhem) are real places,
// used only as settings.
//
// STATUS: draft. It becomes 'published' once the full eight chapters are reviewed. While it is a draft it
// stays out of every public page and out of the strict content tests.

export const hetDuivelshuis: Authored<Adventure> = {
  slug: 'het-duivelshuis',
  city: 'arnhem',
  status: 'draft',
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
  durationMinutes: { min: 120, max: 165 },
  distanceKm: 4,
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
      'Acht Kapitel, acht Rätselarten: eine Zahlenchiffre, ein Logikrätsel am Teufelshaus, ein Zeuge zum Befragen, das Glockenspiel der Eusebiuskirche, unsichtbare Schrift im Sonsbeek-Park, ein Signal über den Rhein, ein Fund aus dem Inventar und eine Anklage mit Beweis.',
      'Die Ermittlungsakte sammelt Spuren, Verdächtige und eure Notizen. Wer aufmerksam ist, entdeckt dort ein zusätzliches Beweisstück.',
      'Drei Schwierigkeitsstufen und Sterne für jedes Kapitel.',
      'Am Ende entscheidest du, was mit dem Hauptbuch geschieht.',
    ],
    en: [
      'Eight chapters, eight kinds of puzzle: a number cipher, a logic riddle at the Devil’s House, a witness to question, the Eusebius church carillon, invisible writing in Sonsbeek park, a signal across the Rhine, an item from your inventory and an accusation with proof.',
      'The case journal collects clues, suspects and your notes. Attentive players discover an extra piece of evidence there.',
      'Three difficulty levels and stars for every chapter.',
      'At the end you decide what becomes of the ledger.',
    ],
    ar: [
      'ثمانية فصول وثمانية أنواع من الألغاز: شيفرة أرقام، ولغز منطقي عند بيت الشيطان، وشاهد تستجوبه، وأجراس كنيسة أوزيبيوس، وكتابة خفية في حديقة سونسبيك، وإشارة عبر نهر الراين، وغرض من حقيبتك، واتهام بالدليل.',
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
      appears: 'duivels',
      name: { de: 'Daan Koster', en: 'Daan Koster', ar: 'دان كوستر' },
      role: { de: 'Antiquitätenhändler, „der Sammler“', en: 'Antiques dealer, “the Collector”', ar: 'تاجر تحف، «الجامع»' },
      notes: [
        { after: 'duivels', text: { de: 'War schon am Teufelshaus und hat den Stein beschädigt. Sucht dasselbe wie du.', en: 'Has already been at the Devil’s House and damaged the stone. He is after the same thing you are.', ar: 'كان عند بيت الشيطان وأتلف الحجر. يسعى إلى ما تسعى إليه.' } },
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
  ],
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
  ],
  ending: {
    artifact: { kind: 'book' },
    reveal: {
      de: [
        '„Das Hauptbuch ist kein Schatzverzeichnis“, wird Lena dir später erklären. „Es ist ein Versprechen. Maarten van Rossum ließ die Teufel an sein Haus setzen, damit die Leute wegsehen — und dahinter ein Register verstecken: wer in dieser Stadt kein Dach hatte, fand hier eines.“',
        '„Die Teufel bewachen keine Goldstücke. Sie bewachen die Namen all derer, die Arnheim aufgenommen hat.“',
        'Der Sammler wollte das Register verkaufen, Seite für Seite. Du hast es vorher gefunden.',
      ],
      en: [
        '“The ledger is no treasure list,” Lena will explain to you later. “It is a promise. Maarten van Rossum had the devils set on his house so that people would look away — and hid a register behind them: whoever had no roof in this city found one here.”',
        '“The devils guard no gold. They guard the names of everyone Arnhem once took in.”',
        'The Collector wanted to sell the register, page by page. You found it first.',
      ],
      ar: [
        '«الدفتر ليس قائمة كنوز»، ستشرح لك لينا لاحقاً. «إنه وعد. أمر مارتن فان روسوم بوضع الشياطين على بيته كي يصرف الناس أنظارهم — وأخفى خلفها سجلّاً: كل من لم يكن له سقف في هذه المدينة وجد سقفاً هنا».',
        '«الشياطين لا تحرس ذهباً. تحرس أسماء كل من آوتهم أرنم يوماً».',
        'أراد الجامع أن يبيع السجلّ، صفحةً صفحة. لكنك وجدته أولاً.',
      ],
    },
    decision: {
      prompt: { de: 'Das Register liegt wieder vollständig vor dir. Was tust du damit?', en: 'The register lies before you again, whole. What do you do with it?', ar: 'السجلّ أمامك كاملاً من جديد. ماذا ستفعل به؟' },
      choices: [
        {
          id: 'archive',
          label: { de: 'Dem Stadtarchiv übergeben', en: 'Hand it to the city archive', ar: 'تسليمه إلى أرشيف المدينة' },
          epilogue: {
            de: 'Lena legt das Register in die Vitrine des Stadtarchivs, für alle sichtbar. „Ein Versprechen, das niemand mehr verstecken muss“, sagt sie. Der mittlere Teufel am Haus scheint fast zu lächeln.',
            en: 'Lena places the register in the city archive’s display case, in plain sight. “A promise no one has to hide any more,” she says. The middle devil on the house almost seems to smile.',
            ar: 'تضع لينا السجلّ في خزانة العرض بأرشيف المدينة، أمام الجميع. «وعدٌ لم يعد على أحد أن يخفيه»، تقول. ويكاد الشيطان الأوسط على البيت أن يبتسم.',
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
