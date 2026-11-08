import type { Adventure, Authored } from '../types';

// "The Lost Manuscript" - the Heidelberg detective demo. The story, the Codex Lumen, the Archive of the
// Seven Lanterns and every character are fiction. The checkpoints are simulated: no route has been
// walked or validated yet, so none of them names a real address and no puzzle depends on a fact about
// the city.

export const lostManuscript: Authored<Adventure> = {
  slug: 'lost-manuscript',
  city: 'heidelberg',
  status: 'published',
  isDemo: true,
  title: { de: 'Das verschwundene Manuskript', en: 'The Lost Manuscript', ar: 'سر المخطوطة المفقودة' },
  tagline: {
    de: 'Eine anonyme Nachricht. Ein verschwundener Codex. Ein Einbruch, den jemand vertuschen will.',
    en: 'An anonymous message. A vanished codex. A break-in someone wants to cover up.',
    ar: 'رسالة مجهولة. مخطوطة اختفت. وسرقة يحاول أحدهم إخفاءها.',
  },
  description: {
    de: 'Der Codex Lumen ist aus dem Archiv der Sieben Laternen verschwunden. Entschlüssle Nachrichten, befrage Zeugen, durchsuche das Arbeitszimmer eines Professors, lies ein Lichtsignal über den Fluss und überführe am Ende den Einbrecher mit dem richtigen Beweis. Acht Kapitel, für Familien und Freunde.',
    en: 'The Codex Lumen has vanished from the Archive of the Seven Lanterns. Decode messages, question witnesses, search a professor’s study, read a light signal across the river, and finally unmask the burglar with the right proof. Eight chapters, for families and friends.',
    ar: 'اختفت مخطوطة "كودكس لومن" من أرشيف الفوانيس السبعة. فكّ الرسائل، واستجوب الشهود، وفتّش مكتب أستاذ جامعي، واقرأ إشارة ضوئية عبر النهر، ثم اكشف اللص بالدليل الصحيح. ثمانية فصول للعائلات والأصدقاء.',
  },
  theme: 'mystery',
  groupTypes: ['friends', 'family', 'couples'],
  difficulty: 'medium',
  durationMinutes: { min: 120, max: 165 },
  distanceKm: 4,
  teamSize: { min: 1, max: 5 },
  minAge: 10,
  languages: ['de', 'en', 'nl', 'ar'],
  priceCents: 2490,
  tier: 'standard',
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
      'Acht Kapitel, acht Rätselarten: Zahlenchiffre, Logikrätsel, Symbolschloss, unsichtbare Schrift auf Löschpapier, ein Fund aus dem Inventar, ein Morsesignal, Spiegelschrift und eine Anklage mit Beweis.',
      'Die Ermittlungsakte sammelt Spuren, Verdächtige und eure Notizen. Wer aufmerksam ist, entdeckt dort ein zusätzliches Beweisstück.',
      'Vier Schwierigkeitsstufen und Sterne für jedes Kapitel.',
      'Am Ende entscheidest du, was mit dem Codex geschieht.',
    ],
    en: [
      'Eight chapters, eight kinds of puzzle: a number cipher, a logic puzzle, a symbol lock, invisible writing on blotting paper, an item from your inventory, a Morse signal, mirrored letters and an accusation with proof.',
      'The case journal collects clues, suspects and your notes. Attentive players discover an extra piece of evidence there.',
      'Four difficulty levels and stars for every chapter.',
      'At the end you decide what happens to the codex.',
    ],
    ar: [
      'ثمانية فصول وثمانية أنواع من الألغاز: شيفرة أرقام، ولغز منطقي، وقفل رموز، وكتابة خفية على ورق نشّاف، وغرض من حقيبتك، وإشارة مورس، وحروف معكوسة، واتهام بالدليل.',
      'ملف القضية يجمع الأدلة والمشتبه بهم وملاحظاتك. ومن ينتبه يكتشف فيه دليلاً إضافياً.',
      'أربعة مستويات صعوبة ونجوم لكل فصل.',
      'في النهاية تقرر مصير المخطوطة.',
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
      q: { de: 'Muss ich dafür in Heidelberg sein?', en: 'Do I need to be in Heidelberg?', ar: 'هل يجب أن أكون في هايدلبرغ؟' },
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
        de: 'Ab etwa 10 Jahren, mit Erwachsenen auch jünger. Keine Gewalt, kein Grusel.',
        en: 'From about 10, younger with adults. No violence, nothing scary.',
        ar: 'من عمر 10 سنوات تقريباً، وأصغر برفقة الكبار. لا عنف ولا رعب.',
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
  people: [
    {
      id: 'vii',
      voice: 'narrator',
      appears: 'message',
      name: { de: 'VII', en: 'VII', ar: 'VII' },
      role: { de: 'Anonymer Absender', en: 'Anonymous sender', ar: 'مرسل مجهول' },
      notes: [
        { after: 'message', text: { de: 'Weiß vom Verschwinden des Codex und will, dass du suchst.', en: 'Knows the codex is gone and wants you to look for it.', ar: 'يعرف أن المخطوطة اختفت ويريدك أن تبحث عنها.' } },
        { after: 'witnesses', text: { de: 'Hat Clara gebeten, den Archivschlüssel zu verstecken.', en: 'Asked Clara to hide the archive key.', ar: 'طلب من كلارا إخفاء مفتاح الأرشيف.' } },
        { after: 'mirror', text: { de: 'VII ist Elise Brandt.', en: 'VII is Elise Brandt.', ar: 'VII هي إليزه برانت.' } },
      ],
    },
    {
      id: 'anna',
      voice: 'woman',
      appears: 'witnesses',
      name: { de: 'Anna', en: 'Anna', ar: 'آنا' },
      role: { de: 'Nachtwache im Archiv', en: 'Night guard at the archive', ar: 'حارسة ليلية في الأرشيف' },
      notes: [{ after: 'witnesses', text: { de: 'Behauptete, Ben habe den Schlüssel genommen. Das war falsch.', en: 'Claimed Ben took the key. That was false.', ar: 'ادّعت أن بن أخذ المفتاح، وكان ذلك خطأً.' } }],
    },
    {
      id: 'ben',
      voice: 'man',
      appears: 'witnesses',
      name: { de: 'Ben', en: 'Ben', ar: 'بن' },
      role: { de: 'Nachtwache im Archiv', en: 'Night guard at the archive', ar: 'حارس ليلي في الأرشيف' },
      notes: [{ after: 'witnesses', text: { de: 'Sagte als Einziger die Wahrheit.', en: 'The only one who told the truth.', ar: 'الوحيد الذي قال الحقيقة.' } }],
    },
    {
      id: 'clara',
      voice: 'girl',
      appears: 'witnesses',
      name: { de: 'Clara', en: 'Clara', ar: 'كلارا' },
      role: { de: 'Nachtwache im Archiv', en: 'Night guard at the archive', ar: 'حارسة ليلية في الأرشيف' },
      notes: [{ after: 'witnesses', text: { de: 'Hat den Schlüssel genommen, auf Bitten von VII.', en: 'Took the key, because VII asked her to.', ar: 'أخذت المفتاح لأن VII طلب منها ذلك.' } }],
    },
    {
      id: 'kehl',
      voice: 'man',
      appears: 'study',
      name: { de: 'Prof. Albrecht Kehl', en: 'Prof. Albrecht Kehl', ar: 'البروفيسور ألبرشت كيل' },
      role: { de: 'Sammler seltener Handschriften', en: 'Collector of rare manuscripts', ar: 'جامع مخطوطات نادرة' },
      notes: [
        { after: 'study', text: { de: 'Wollte den Codex seit Jahren kaufen. Wusste von der Truhe am Fluss.', en: 'Has tried to buy the codex for years. Knew about the chest by the river.', ar: 'يحاول شراء المخطوطة منذ سنوات، وكان يعرف بأمر الصندوق عند النهر.' } },
        { after: 'study', when: 'study:read', text: { de: 'Sein Tagebuch: Er sehnt sich danach, den Codex ein einziges Mal zu sehen.', en: 'His diary: he longs to see the codex just once.', ar: 'دفتر يومياته: يتوق إلى رؤية المخطوطة ولو مرة واحدة.' } },
        { after: 'study', when: 'study:leave', text: { de: 'Du hast sein Tagebuch ungelesen gelassen.', en: 'You left his diary unread.', ar: 'تركت دفتر يومياته دون أن تقرأه.' } },
      ],
    },
    {
      id: 'elise',
      voice: 'old',
      appears: 'mirror',
      name: { de: 'Elise Brandt', en: 'Elise Brandt', ar: 'إليزه برانت' },
      role: { de: 'Archivarin im Ruhestand', en: 'Retired archivist', ar: 'أمينة أرشيف متقاعدة' },
      notes: [{ after: 'mirror', text: { de: 'Hat den Codex selbst versteckt, um ihn zu schützen.', en: 'Hid the codex herself, to protect it.', ar: 'خبّأت المخطوطة بنفسها لتحميها.' } }],
    },
  ],
  items: [
    {
      id: 'torn-letter',
      icon: 'letter',
      model: { kind: 'paper', art: 'suns', torn: true },
      name: { de: 'Zerrissener Brief', en: 'Torn letter', ar: 'رسالة ممزقة' },
      description: {
        de: 'Die rechte Hälfte eines Briefes. Am Rand: drei Sonnen, ein Mond und ein Stern. Die linke Hälfte fehlt.',
        en: 'The right half of a letter. In the margin: three suns, a moon and a star. The left half is missing.',
        ar: 'النصف الأيمن من رسالة. على الهامش: ثلاث شموس وقمر ونجمة. النصف الأيسر مفقود.',
      },
    },
    {
      id: 'brass-key',
      icon: 'key',
      model: { kind: 'key' },
      name: { de: 'Messingschlüssel', en: 'Brass key', ar: 'مفتاح نحاسي' },
      description: {
        de: 'Eingraviert: „Wo die Sonnen zählen, öffnet der Mond.“',
        en: 'Engraved: “Where the suns count, the moon opens.”',
        ar: 'محفور عليه: «حيث تُحصى الشموس، يفتح القمر».',
      },
    },
    {
      id: 'lantern-map',
      icon: 'map',
      model: { kind: 'map' },
      name: { de: 'Laternenkarte', en: 'Lantern map', ar: 'خريطة الفوانيس' },
      description: {
        de: 'Eine Skizze mit sieben Laternen. Eine davon am Fluss ist mit einem Kreuz markiert.',
        en: 'A sketch of seven lanterns. One of them, by the river, is marked with a cross.',
        ar: 'رسم لسبعة فوانيس، أحدها قرب النهر عليه علامة صليب.',
      },
    },
    {
      id: 'second-half',
      icon: 'letter',
      model: { kind: 'paper', art: 'lines', torn: true },
      name: { de: 'Linke Briefhälfte', en: 'Left half of a letter', ar: 'النصف الأيسر من رسالة' },
      description: {
        de: 'Gefunden unter Kehls Löschpapier. Der Riss passt zu etwas, das du schon einmal in der Hand hattest.',
        en: 'Found under Kehl’s blotting paper. The tear matches something you have held before.',
        ar: 'وُجد تحت ورق النشّاف عند كيل. حافّة التمزق تطابق شيئاً أمسكته من قبل.',
      },
    },
    {
      id: 'whole-letter',
      icon: 'letter',
      model: { kind: 'paper', art: 'suns' },
      name: { de: 'Der ganze Brief', en: 'The whole letter', ar: 'الرسالة كاملة' },
      description: {
        de: 'Zusammengefügt: „Folge den Zahlen. Wenn sonst jemand fragt, ist der Codex nicht sicher. – VII.“ Auf der Rückseite, in anderer Schrift: „Truhe am Fluss. – A. K.“',
        en: 'Put together: “Follow the numbers. If anyone else comes asking, the codex is not safe. — VII.” On the back, in another hand: “Chest by the river. — A. K.”',
        ar: 'بعد جمع النصفين: «اتبع الأرقام. إذا سأل أحد غيرك فالمخطوطة ليست بأمان. — VII». وعلى ظهرها بخط آخر: «الصندوق عند النهر. — أ. ك.»',
      },
    },
    {
      id: 'codex-page',
      icon: 'page',
      model: { kind: 'paper', art: 'lines' },
      name: { de: 'Seite aus dem Codex', en: 'Page from the codex', ar: 'صفحة من المخطوطة' },
      description: {
        de: 'Eine lose Seite. Nur ein einziges Wort, Buchstabe für Buchstabe rückwärts geschrieben.',
        en: 'A loose page. A single word on it, written letter by letter in reverse.',
        ar: 'صفحة منفصلة عليها كلمة واحدة فقط، حروفها مكتوبة بترتيب معكوس.',
      },
    },
  ],
  combinations: [{ from: 'second-half+torn-letter', to: 'whole-letter' }],
  chapters: [
    {
      id: 'message',
      title: { de: 'Die anonyme Nachricht', en: 'The Anonymous Message', ar: 'الرسالة المجهولة' },
      story: {
        de: [
          'Es ist 21:07, als dein Telefon aufleuchtet. Kein Absender.',
          '„Der Codex Lumen ist aus dem Archiv der Sieben Laternen verschwunden. Er hütet ein Geheimnis dieser Stadt. Folge den Zahlen. – VII“',
          'Darunter steht nur eine Reihe von Zahlen.',
        ],
        en: [
          'It is 21:07 when your phone lights up. No sender.',
          '“The Codex Lumen has vanished from the Archive of the Seven Lanterns. It keeps a secret of this city. Follow the numbers. — VII”',
          'Below it, nothing but a row of numbers.',
        ],
        ar: [
          'الساعة 21:07 حين يضيء هاتفك. لا يوجد اسم مرسل.',
          '«اختفت مخطوطة كودكس لومن من أرشيف الفوانيس السبعة. إنها تخفي سرّاً من أسرار هذه المدينة. اتبع الأرقام. — VII»',
          'وتحتها لا شيء سوى سطر من الأرقام.',
        ],
      },
      checkpoint: { id: 'cp-square', name: { de: 'Treffpunkt in der Altstadt', en: 'Old-town meeting point', ar: 'نقطة اللقاء في البلدة القديمة' }, simulated: true, mapPosition: { x: 14, y: 40 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4093, lng: 8.6937 }, code: 'cq-lost-manuscript-1' },
      puzzle: {
        type: 'cipher',
        prompt: {
          de: 'Jede Zahl steht für die Position eines Buchstabens im Alphabet (A = 1). Welches Wort versteckt sich darin?',
          en: 'Each number is a letter’s position in the alphabet (A = 1). Which word is hidden in it?',
          ar: 'كل رقم يدل على ترتيب حرف في الأبجدية العربية (أ = 1، ب = 2، ت = 3 …). ما الكلمة المخفية؟',
        },
        material: { de: ['20 · 21 · 18 · 13'], en: ['20 · 15 · 23 · 5 · 18'], ar: ['2 · 10 · 5'] },
        input: 'text',
        junior: { de: 'Zahlen sind Buchstaben! 1 ist A, 2 ist B, 3 ist C. Zählt an den Fingern ab, welcher Buchstabe zu jeder Zahl gehört.', en: 'Numbers are letters! 1 is A, 2 is B, 3 is C. Count on your fingers to turn each number into a letter.', ar: 'الأرقام حروف! 1 هو A، و2 هو B، و3 هو C. عُدّوا على أصابعكم لتحوّلوا كل رقم إلى حرف.' },
        hints: [
          { de: 'Zähle das Alphabet ab: A = 1, B = 2, C = 3 … Z = 26.', en: 'Count through the alphabet: A = 1, B = 2, C = 3 … Z = 26.', ar: 'عُدّ الحروف بالترتيب: أ ب ت ث ج ح خ د ذ ر …' },
          { de: 'Der erste Buchstabe ist T (20). Gesucht ist ein hohes Bauwerk.', en: 'The first letter is T (20). You are looking for a tall building.', ar: 'الحرف الأول هو ب (2)، والعاشر هو ر. المطلوب بناء عالٍ.' },
          { de: 'TURM.', en: 'TOWER.', ar: 'برج.' },
        ],
      },
      success: {
        de: 'Ein Turm. Irgendwo in der Altstadt wartet ein Wächter auf dich. In der Nachricht steckt außerdem ein halber Brief.',
        en: 'A tower. Somewhere in the old town a watchman is waiting for you. Tucked into the message: half of a letter.',
        ar: 'برج. في مكان ما من البلدة القديمة ينتظرك حارس. ومع الرسالة نصف رسالة ورقية ممزقة.',
      },
      clues: [
        { de: 'VII hat die Nachricht um 21:07 geschickt.', en: 'VII sent the message at 21:07.', ar: 'أرسل VII الرسالة الساعة 21:07.' },
        { de: 'Dem Brief fehlt die linke Hälfte.', en: 'The letter is missing its left half.', ar: 'الرسالة ينقصها نصفها الأيسر.' },
      ],
      reward: 'torn-letter',
    },
    {
      id: 'witnesses',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Der Turm ragt über die Dächer. In seinem Schatten warten drei Gestalten, und keine sieht die anderen an.', en: 'The tower rises above the roofs. Three figures wait in its shadow, and none of them looks at the others.', ar: 'يرتفع البرج فوق الأسطح. في ظله تنتظر ثلاث شخصيات، ولا تنظر أيٌّ منها إلى الأخرى.' } },
      ],
      title: { de: 'Drei Zeugen', en: 'Three Witnesses', ar: 'ثلاثة شهود' },
      story: {
        de: [
          'Am Fuß des Turms warten drei Personen. Sie hatten in der Nacht Dienst, in der der Codex verschwand.',
          'Eine von ihnen hat den Archivschlüssel genommen. VII schreibt: „Genau eine von ihnen sagt die Wahrheit.“',
        ],
        en: [
          'Three people are waiting at the foot of the tower. They were on duty the night the codex vanished.',
          'One of them took the archive key. VII writes: “Exactly one of them is telling the truth.”',
        ],
        ar: [
          'عند أسفل البرج ينتظرك ثلاثة أشخاص كانوا في نوبة الحراسة ليلة اختفاء المخطوطة.',
          'أحدهم أخذ مفتاح الأرشيف. يكتب VII: «واحد منهم فقط يقول الحقيقة».',
        ],
      },
      checkpoint: { id: 'cp-tower', name: { de: 'Am Turm', en: 'At the tower', ar: 'عند البرج' }, simulated: true, mapPosition: { x: 30, y: 22 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4098, lng: 8.698 }, code: 'cq-lost-manuscript-2' },
      puzzle: {
        type: 'logic',
        prompt: { de: 'Genau eine Aussage ist wahr. Wer hat den Schlüssel genommen?', en: 'Exactly one statement is true. Who took the key?', ar: 'عبارة واحدة فقط صحيحة. من أخذ المفتاح؟' },
        material: {
          de: ['Anna: „Ben hat den Schlüssel genommen.“', 'Ben: „Anna lügt.“', 'Clara: „Ich habe den Schlüssel nicht genommen.“'],
          en: ['Anna: “Ben took the key.”', 'Ben: “Anna is lying.”', 'Clara: “I did not take the key.”'],
          ar: ['آنا: «بن أخذ المفتاح».', 'بن: «آنا تكذب».', 'كلارا: «أنا لم آخذ المفتاح».'],
        },
        choices: [
          { id: 'anna', label: { de: 'Anna', en: 'Anna', ar: 'آنا' } },
          { id: 'ben', label: { de: 'Ben', en: 'Ben', ar: 'بن' } },
          { id: 'clara', label: { de: 'Clara', en: 'Clara', ar: 'كلارا' } },
        ],
        junior: { de: 'Nur einer der drei sagt die Wahrheit. Tut so, als wäre jeder einmal der Ehrliche, und schaut, welche Geschichte passt.', en: 'Only one of the three is telling the truth. Pretend each one is the honest one, and see which story works.', ar: 'واحد فقط من الثلاثة يقول الحقيقة. تخيّلوا أن كل واحد منهم هو الصادق، وانظروا أي قصة تنجح.' },
        hints: [
          { de: 'Anna und Ben widersprechen sich: Genau einer von beiden sagt die Wahrheit.', en: 'Anna and Ben contradict each other: exactly one of the two is telling the truth.', ar: 'آنا وبن يناقض أحدهما الآخر، إذن واحد منهما فقط صادق.' },
          { de: 'Dann bleibt für Clara keine wahre Aussage übrig. Was bedeutet ihre Aussage, wenn sie gelogen ist?', en: 'That leaves no true statement for Clara. What does her statement mean if it is a lie?', ar: 'إذن عبارة كلارا لا بد أن تكون كاذبة. ماذا يعني ذلك؟' },
          { de: 'Clara.', en: 'Clara.', ar: 'كلارا.' },
        ],
      },
      success: {
        de: 'Clara senkt den Blick und reicht dir einen Messingschlüssel. „VII hat mich gebeten, ihn zu verstecken“, flüstert sie. „Jemand anderes war in jener Nacht auch hinter ihm her.“',
        en: 'Clara looks down and hands you a brass key. “VII asked me to hide it,” she whispers. “Someone else was after it that night too.”',
        ar: 'تخفض كلارا نظرها وتعطيك مفتاحاً نحاسياً، وتهمس: «VII طلب مني أن أخبّئه. وكان شخص آخر يسعى إليه تلك الليلة أيضاً».',
      },
      clues: [
        { de: 'Clara versteckte den Schlüssel auf Bitten von VII.', en: 'Clara hid the key because VII asked her to.', ar: 'خبّأت كلارا المفتاح لأن VII طلب منها ذلك.' },
        { de: 'In der Nacht war noch jemand hinter dem Schlüssel her.', en: 'Someone else was after the key that night.', ar: 'كان شخص آخر يسعى إلى المفتاح تلك الليلة.' },
      ],
      reward: 'brass-key',
    },
    {
      id: 'clockmaker',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Der Messingschlüssel liegt schwer in deiner Tasche. Irgendwo vor dir ticken hundert Uhren, keine im selben Takt.', en: 'The brass key is heavy in your pocket. Somewhere ahead, a hundred clocks are ticking, none of them in time.', ar: 'المفتاح النحاسي ثقيل في جيبك. في مكان ما أمامك تدقّ مئة ساعة، ولا تتفق اثنتان منها.' } },
      ],
      title: { de: 'Das Schloss des Uhrmachers', en: 'The Clockmaker’s Lock', ar: 'قفل صانع الساعات' },
      story: {
        de: [
          'Der Schlüssel öffnet eine schmale Tür zu einer alten Werkstatt. Überall ticken Uhren.',
          'Ein Schrank ist mit einem vierstelligen Zahlenschloss gesichert. Statt Ziffern zeigt es Symbole, dieselben wie auf deinem zerrissenen Brief.',
        ],
        en: [
          'The key opens a narrow door to an old workshop. Clocks are ticking everywhere.',
          'A cabinet is secured with a four-digit lock. Instead of digits it shows symbols, the same ones as on your torn letter.',
        ],
        ar: [
          'يفتح المفتاح باباً ضيقاً يؤدي إلى ورشة قديمة، والساعات تدق في كل مكان.',
          'خزانة مقفلة بقفل من أربعة أرقام، لكنه يعرض رموزاً بدل الأرقام، هي نفسها المرسومة على رسالتك الممزقة.',
        ],
      },
      checkpoint: { id: 'cp-workshop', name: { de: 'Die Werkstatt', en: 'The workshop', ar: 'الورشة' }, simulated: true, mapPosition: { x: 46, y: 38 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4107, lng: 8.7064 }, code: 'cq-lost-manuscript-3' },
      puzzle: {
        type: 'image',
        visual: 'symbol-equations',
        prompt: {
          de: 'Finde den Wert jedes Symbols und gib den Code ein, den das Schloss zeigt.',
          en: 'Work out the value of each symbol and enter the code the lock shows.',
          ar: 'اكتشف قيمة كل رمز، ثم أدخل الرمز الذي يعرضه القفل.',
        },
        input: 'numeric',
        lock: { digits: 4 },
        junior: { de: 'Jedes Bild steht für eine Zahl. Fangt mit der leichtesten Zeile an und rechnet damit die anderen aus.', en: 'Each picture stands for a number. Start with the easiest line, then use it to work out the others.', ar: 'كل صورة تعني رقماً. ابدؤوا بالسطر الأسهل، ثم استعملوه لتعرفوا الباقي.' },
        hints: [
          { de: 'Beginne mit der ersten Zeile: Zwei Sonnen ergeben 6.', en: 'Start with the first line: two suns make 6.', ar: 'ابدأ بالسطر الأول: شمسان تساويان 6.' },
          { de: 'Sonne = 3, also Mond = 7 und Stern = 4. Jetzt nur noch in der Reihenfolge des Schlosses lesen.', en: 'Sun = 3, so moon = 7 and star = 4. Now read them in the lock’s order.', ar: 'الشمس = 3، إذن القمر = 7 والنجمة = 4. الآن اقرأها بترتيب القفل.' },
          { de: 'Der Code ist 7347.', en: 'The code is 7347.', ar: 'الرمز هو 7347.' },
        ],
      },
      success: {
        de: 'Klick. Im Schrank liegt eine gefaltete Karte mit sieben Laternen. Eine am Fluss ist angekreuzt. Daneben ein Zettel: „K. weiß Bescheid.“',
        en: 'Click. Inside the cabinet lies a folded map of seven lanterns. One by the river is marked with a cross. Next to it, a note: “K. knows.”',
        ar: 'طَق. داخل الخزانة خريطة مطوية لسبعة فوانيس، وأحدها قرب النهر عليه علامة. وبجانبها ورقة: «ك. يعرف».',
      },
      clues: [
        { de: 'Die Karte zeigt eine markierte Laterne am Fluss.', en: 'The map shows a marked lantern by the river.', ar: 'الخريطة تُظهر فانوساً محدداً قرب النهر.' },
        { de: 'Ein Zettel im Schrank: „K. weiß Bescheid.“', en: 'A note in the cabinet: “K. knows.”', ar: 'ورقة في الخزانة: «ك. يعرف».' },
      ],
      reward: 'lantern-map',
    },
    {
      id: 'study',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: '„K. weiß es.“ Zwei Buchstaben, und ein Name nimmt Gestalt an. Die Straße des Professors ist still – zu still für diese Stunde.', en: '“K. knows.” Two letters, and a name begins to form. The professor’s street is quiet — too quiet for this hour.', ar: '«ك. يعرف». حرفان، ويبدأ اسم بالتشكّل. شارع البروفيسور هادئ — أهدأ مما ينبغي في هذه الساعة.' } },
      ],
      title: { de: 'Das Arbeitszimmer des Professors', en: 'The Professor’s Study', ar: 'مكتب الأستاذ' },
      story: {
        de: [
          '„K.“ führt zu Professor Albrecht Kehl, einem Sammler, der seit Jahren versucht, den Codex zu kaufen. Seine Haushälterin lässt dich herein: Der Professor sei „gerade fort, sehr eilig“.',
          'Auf dem Schreibtisch liegt ein Löschpapier. Wer mit Tinte schreibt und ablöscht, hinterlässt darauf Spuren, spiegelverkehrt und fast unsichtbar.',
        ],
        en: [
          '“K.” leads to Professor Albrecht Kehl, a collector who has tried to buy the codex for years. His housekeeper lets you in: the professor has “just left, in a great hurry”.',
          'On the desk lies a sheet of blotting paper. Whoever writes in ink and blots it leaves traces on it, mirrored and almost invisible.',
        ],
        ar: [
          '«ك.» تقود إلى البروفيسور ألبرشت كيل، جامع المخطوطات الذي يحاول شراء المخطوطة منذ سنوات. تُدخلك مدبّرة منزله وتقول إن الأستاذ «خرج للتو، على عجل».',
          'على المكتب ورقة نشّاف. ومن يكتب بالحبر ويجفّفه يترك عليها أثراً معكوساً لا يكاد يُرى.',
        ],
      },
      checkpoint: { id: 'cp-study', name: { de: 'Kehls Arbeitszimmer', en: 'Kehl’s study', ar: 'مكتب كيل' }, simulated: true, mapPosition: { x: 58, y: 20 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.412, lng: 8.7105 }, code: 'cq-lost-manuscript-4' },
      puzzle: {
        type: 'reveal',
        revealMirrored: true,
        prompt: {
          de: 'Halte die Schreibtischlampe schräg über das Löschpapier. Wohin wollte Kehl heute Nacht?',
          en: 'Hold the desk lamp at an angle over the blotting paper. Where was Kehl going tonight?',
          ar: 'سلّط مصباح المكتب بشكل مائل على ورقة النشّاف. إلى أين كان كيل ذاهباً الليلة؟',
        },
        material: { de: ['Truhe am Fluss', 'heute Nacht'], en: ['Chest by the river', 'tonight'], ar: ['الصندوق عند النهر', 'الليلة'] },
        input: 'text',
        junior: { de: 'Fahrt mit dem Finger wie mit einer Lampe über das Papier. Die Schrift ist verkehrt herum, wie im Spiegel.', en: 'Slide your finger over the paper like a lamp. The writing is back to front, like in a mirror.', ar: 'مرّروا إصبعكم فوق الورقة كأنه مصباح. الكتابة معكوسة، كما في المرآة.' },
        hints: [
          { de: 'Fahre über die Mitte des Papiers. Die Schrift ist spiegelverkehrt.', en: 'Move over the middle of the paper. The writing is mirrored.', ar: 'مرّر الضوء على وسط الورقة. الكتابة معكوسة.' },
          { de: 'Es ist ein Ort, den du schon auf der Karte gesehen hast.', en: 'It is a place you have already seen on the map.', ar: 'إنه مكان رأيته من قبل على الخريطة.' },
          { de: 'Zur Truhe am Fluss.', en: 'To the chest by the river.', ar: 'إلى الصندوق عند النهر.' },
        ],
      },
      success: {
        de: 'Die Truhe am Fluss. Unter dem Löschpapier steckt noch etwas: die linke Hälfte eines Briefes. Der Riss kommt dir bekannt vor. An der Wand hängen Zeitungsausschnitte über den Codex, alle mit Kehls Notizen.',
        en: 'The chest by the river. Something else is tucked under the blotting paper: the left half of a letter. The tear looks familiar. On the wall hang newspaper cuttings about the codex, all annotated by Kehl.',
        ar: 'الصندوق عند النهر. وتحت ورقة النشّاف شيء آخر: النصف الأيسر من رسالة، وحافّة تمزّقها مألوفة لك. وعلى الجدار قصاصات صحف عن المخطوطة، عليها كلها ملاحظات بخط كيل.',
      },
      clues: [
        { de: 'Kehl wollte heute Nacht zur Truhe am Fluss.', en: 'Kehl was going to the chest by the river tonight.', ar: 'كان كيل ذاهباً الليلة إلى الصندوق عند النهر.' },
        { de: 'Kehl sammelt seit Jahren alles über den Codex.', en: 'Kehl has collected everything about the codex for years.', ar: 'يجمع كيل منذ سنوات كل ما يتعلق بالمخطوطة.' },
        { de: 'Bei Kehl lag die fehlende Hälfte deines Briefes.', en: 'The missing half of your letter was at Kehl’s.', ar: 'النصف المفقود من رسالتك كان عند كيل.' },
      ],
      reward: 'second-half',
      // A story decision (see StoryChoice): it changes the journal, the final scene and every ending.
      choice: {
        prompt: { de: 'Auf Kehls Schreibtisch liegt sein Tagebuch, aufgeschlagen. Liest du darin?', en: 'On Kehl’s desk lies his diary, open. Do you read it?', ar: 'على مكتب كيل يرقد دفتر يومياته مفتوحاً. هل تقرؤه؟' },
        options: [
          {
            id: 'read',
            label: { de: 'Darin lesen: Heute Nacht zählt jede Spur', en: 'Read it: tonight every clue counts', ar: 'اقرأه: الليلة كل دليل مهم' },
            outcome: { de: 'Eine Zeile bleibt hängen: „Wenn ich ihn nur ein einziges Mal mit eigenen Augen sehen könnte.“ Du schließt das Tagebuch, etwas weniger sicher, was für ein Mensch er ist.', en: 'One line stays with you: “If only I could see it once with my own eyes.” You close the diary, a little less sure what kind of man he is.', ar: 'يبقى سطر واحد في ذهنك: «لو أستطيع أن أراها مرة واحدة بعينيّ». تغلق الدفتر وقد صرت أقل يقيناً بحقيقته.' },
          },
          {
            id: 'leave',
            label: { de: 'Es geschlossen lassen: Es gehört dir nicht', en: 'Leave it closed: it is not yours to read', ar: 'اتركه مغلقاً: ليس من حقك أن تقرأه' },
            outcome: { de: 'Du schließt es, ohne hineinzusehen. Was immer er geschrieben hat, du wirst es von ihm selbst hören.', en: 'You close it without a glance. Whatever he wrote, you will hear it from him.', ar: 'تغلقه دون أن تنظر فيه. أياً كان ما كتبه، ستسمعه منه هو.' },
          },
        ],
      },
    },
    {
      id: 'chest',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Du eilst zum Fluss. Die Laterne auf der Karte leuchtet in deinem Kopf: ein Kreuz, eine Chance, der Erste zu sein.', en: 'You hurry towards the river. The lantern on the map glows in your mind: one cross, one chance to be first.', ar: 'تسرع نحو النهر. يتوهّج فانوس الخريطة في ذهنك: صليب واحد، وفرصة واحدة لتكون الأول.' } },
      ],
      title: { de: 'Die Truhe am Fluss', en: 'The Riverside Chest', ar: 'الصندوق عند النهر' },
      story: {
        de: [
          'Du bist schneller als Kehl, aber nur knapp: Frische Fußspuren führen zur Truhe und wieder weg, das Vorhängeschloss ist zerkratzt. Jemand hat es versucht und ist gescheitert.',
          'Die Truhe hat kein Schlüsselloch, nur eine Inschrift im Deckel: „Weder Metall noch zerrissenes Papier. Nur das Licht, das den Weg zeigt, öffnet mich.“',
        ],
        en: [
          'You are faster than Kehl, but only just: fresh footprints lead to the chest and away again, and the padlock is scratched. Someone tried and failed.',
          'The chest has no keyhole, only an inscription on the lid: “Neither metal nor torn paper. Only the light that shows the way will open me.”',
        ],
        ar: [
          'سبقت كيل، لكن بفارق بسيط: آثار أقدام حديثة تقود إلى الصندوق ثم تبتعد، والقفل مخدوش. أحدهم حاول وفشل.',
          'لا ثقب مفتاح في الصندوق، بل نقش على غطائه: «لا معدن ولا ورق ممزق. وحده النور الذي يدلّ على الطريق يفتحني».',
        ],
      },
      checkpoint: { id: 'cp-river', name: { de: 'Am Flussufer', en: 'On the riverbank', ar: 'على ضفة النهر' }, simulated: true, mapPosition: { x: 68, y: 64 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4112, lng: 8.712 }, code: 'cq-lost-manuscript-5' },
      puzzle: {
        type: 'item-use',
        fromInventory: true,
        prompt: { de: 'Welchen Gegenstand aus deinem Inventar legst du auf die Truhe?', en: 'Which item from your inventory do you place on the chest?', ar: 'أي غرض من حقيبتك تضعه على الصندوق؟' },
        junior: { de: 'Schaut in eure Tasche. Welches Ding ist dafür gemacht, ein Schloss zu öffnen?', en: 'Look in your bag. Which thing is made for opening a lock?', ar: 'انظروا في حقيبتكم. أي شيء صُنع لفتح قفل؟' },
        hints: [
          { de: 'Der Schlüssel ist aus Metall, die Briefhälften sind zerrissen.', en: 'The key is metal, the letter halves are torn.', ar: 'المفتاح من معدن، ونصفا الرسالة ممزقان.' },
          { de: 'Was hat dir den Weg zu dieser Laterne gezeigt?', en: 'What showed you the way to this lantern?', ar: 'ما الذي دلّك على طريق هذا الفانوس؟' },
          { de: 'Die Laternenkarte.', en: 'The lantern map.', ar: 'خريطة الفوانيس.' },
        ],
      },
      success: {
        de: 'Die Karte schmiegt sich in eine Vertiefung im Deckel, und die Truhe springt auf. Darin: eine einzelne Seite aus dem Codex. Kehl hätte sie nie öffnen können.',
        en: 'The map settles into a hollow in the lid and the chest springs open. Inside: a single page from the codex. Kehl could never have opened it.',
        ar: 'تستقر الخريطة في تجويف على الغطاء فينفتح الصندوق. في داخله صفحة واحدة من المخطوطة. ما كان كيل ليفتحه أبداً.',
      },
      clues: [
        { de: 'Frische Fußspuren und ein zerkratztes Schloss: Jemand war vor dir an der Truhe.', en: 'Fresh footprints and a scratched padlock: someone reached the chest before you.', ar: 'آثار أقدام حديثة وقفل مخدوش: أحدهم وصل إلى الصندوق قبلك.' },
      ],
      reward: 'codex-page',
    },
    {
      id: 'signal',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Die Seite aus der Truhe knistert in deiner Hand. Drüben über dem Wasser sind die Fenster des Archivs dunkel. Alle bis auf eines.', en: 'The page from the chest crackles in your hand. Across the water, the archive’s windows are dark. All but one.', ar: 'تخشخش الصفحة من الصندوق في يدك. على الضفة الأخرى نوافذ الأرشيف مظلمة. كلها إلا واحدة.' } },
      ],
      title: { de: 'Das Lichtsignal', en: 'The Lantern Signal', ar: 'الإشارة الضوئية' },
      story: {
        de: [
          'Als du dich aufrichtest, blinkt am anderen Ufer eine Laterne in einem Fenster. Kurz, lang, kurz … kein Zufall.',
          'Jemand sendet dir Ziffern. Das Fenster gehört zum Archiv der Sieben Laternen.',
        ],
        en: [
          'As you straighten up, a lantern starts blinking in a window on the far bank. Short, long, short… not by chance.',
          'Someone is sending you digits. The window belongs to the Archive of the Seven Lanterns.',
        ],
        ar: [
          'حين تعتدل واقفاً، يبدأ فانوس بالوميض في نافذة على الضفة الأخرى. قصير، طويل، قصير… ليس صدفة.',
          'أحدهم يرسل إليك أرقاماً. والنافذة تابعة لأرشيف الفوانيس السبعة.',
        ],
      },
      checkpoint: { id: 'cp-bank', name: { de: 'Gegenüber dem Archiv', en: 'Across from the archive', ar: 'مقابل الأرشيف' }, simulated: true, mapPosition: { x: 80, y: 50 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4128, lng: 8.7107 }, code: 'cq-lost-manuscript-6' },
      puzzle: {
        type: 'morse',
        morse: '.---- ---.. ....- --...',
        prompt: {
          de: 'Lies die vier Ziffern aus dem Signal. Sie öffnen die Tür des Archivs.',
          en: 'Read the four digits in the signal. They open the archive door.',
          ar: 'اقرأ الأرقام الأربعة من الإشارة. إنها تفتح باب الأرشيف.',
        },
        input: 'numeric',
        lock: { digits: 4 },
        junior: { de: 'Das Licht blinkt kurz und lang. Malt einen Punkt für kurz und einen Strich für lang – und zählt dann.', en: 'The light blinks short and long. Draw a dot for short and a dash for long, then count them.', ar: 'يومض الضوء قصيراً وطويلاً. ارسموا نقطة للقصير وشرطة للطويل، ثم عُدّوها.' },
        hints: [
          { de: 'Jede Gruppe von fünf Blinkern ist eine Ziffer. Achte auf kurz und lang.', en: 'Each group of five flashes is one digit. Watch for short and long.', ar: 'كل مجموعة من خمس ومضات رقم واحد. انتبه للقصير والطويل.' },
          { de: 'Die erste Ziffer ist 1: einmal kurz, viermal lang.', en: 'The first digit is 1: one short, four long.', ar: 'الرقم الأول 1: ومضة قصيرة ثم أربع طويلة.' },
          { de: 'Der Code ist 1847.', en: 'The code is 1847.', ar: 'الرمز هو 1847.' },
        ],
      },
      success: {
        de: '1847. Die Laterne im Fenster erlischt, als hätte jemand gesehen, dass du verstanden hast.',
        en: '1847. The lantern in the window goes out, as if someone saw that you understood.',
        ar: '1847. ينطفئ الفانوس في النافذة، كأن أحداً رأى أنك فهمت.',
      },
      clues: [{ de: 'Das Signal kam aus dem Archiv: Code 1847.', en: 'The signal came from the archive: code 1847.', ar: 'جاءت الإشارة من الأرشيف: الرمز 1847.' }],
    },
    {
      id: 'mirror',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'old', text: { de: 'Komm die Stufen herauf. Ich warte schon länger, als du denkst.', en: 'Come up the steps. I have been waiting longer than you think.', ar: 'اصعد الدرج. أنا أنتظر منذ وقت أطول مما تظن.' } },
      ],
      title: { de: 'Die Spiegelseite', en: 'The Mirror Page', ar: 'الصفحة المعكوسة' },
      story: {
        de: [
          'Mit 1847 öffnet sich die Tür des Archivs. Auf den Stufen wartet eine ältere Frau mit einer Laterne. Auf ihrem Mantel: VII.',
          '„Lies die Seite“, sagt sie. „Dann verstehst du, warum ich den Codex verschwinden ließ.“',
        ],
        en: [
          'With 1847 the archive door opens. On the steps an older woman is waiting with a lantern. On her coat: VII.',
          '“Read the page,” she says. “Then you will understand why I made the codex disappear.”',
        ],
        ar: [
          'بالرمز 1847 ينفتح باب الأرشيف. على الدرجات تنتظرك امرأة مسنّة تحمل فانوساً، وعلى معطفها: VII.',
          '«اقرأ الصفحة»، تقول. «عندها ستفهم لماذا جعلتُ المخطوطة تختفي».',
        ],
      },
      checkpoint: { id: 'cp-archive', name: { de: 'Die Archivstufen', en: 'The archive steps', ar: 'درجات الأرشيف' }, simulated: true, mapPosition: { x: 88, y: 28 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.411, lng: 8.716 }, code: 'cq-lost-manuscript-7' },
      puzzle: {
        type: 'text',
        prompt: { de: 'Die Buchstaben stehen in umgekehrter Reihenfolge. Welches Wort steht auf der Seite?', en: 'The letters are in reverse order. Which word is on the page?', ar: 'الحروف مكتوبة بترتيب معكوس. ما الكلمة المكتوبة على الصفحة؟' },
        material: { de: ['N E T H C I H C S E G'], en: ['S E I R O T S'], ar: ['ت ا ي ا ك ح'] },
        input: 'text',
        junior: { de: 'Das Wort steht rückwärts da. Fangt am Ende an und lest bis zum Anfang.', en: 'The word is written backwards. Start at the end and read to the beginning.', ar: 'الكلمة مكتوبة بالمقلوب. ابدؤوا من آخرها واقرؤوا حتى أولها.' },
        hints: [
          { de: 'Lies die Buchstaben von rechts nach links.', en: 'Read the letters from right to left.', ar: 'اقرأ الحروف من اليسار إلى اليمين.' },
          { de: 'Das Wort beginnt mit G und hat 11 Buchstaben.', en: 'The word starts with S and has 7 letters.', ar: 'الكلمة تبدأ بحرف ح ولها ستة حروف.' },
          { de: 'GESCHICHTEN.', en: 'STORIES.', ar: 'حكايات.' },
        ],
      },
      success: {
        de: 'Geschichten. Die Frau lächelt und schlägt ihren Mantel auf. Darunter: der Codex Lumen. „Ich heiße Elise. Und bevor du gehst: Jemand ist in der Nacht, in der ich ihn versteckt habe, ins Archiv eingebrochen.“',
        en: 'Stories. The woman smiles and opens her coat. Underneath: the Codex Lumen. “My name is Elise. And before you go: someone broke into the archive the night I hid it.”',
        ar: 'حكايات. تبتسم المرأة وتفتح معطفها، وتحته: مخطوطة كودكس لومن. «اسمي إليزه. وقبل أن تذهب: اقتحم أحدهم الأرشيف في الليلة التي خبّأتها فيها».',
      },
      clues: [
        { de: 'VII ist Elise Brandt. Sie hat den Codex selbst versteckt.', en: 'VII is Elise Brandt. She hid the codex herself.', ar: 'VII هي إليزه برانت، وقد خبّأت المخطوطة بنفسها.' },
        { de: 'In der Nacht des Verschwindens wurde ins Archiv eingebrochen.', en: 'The archive was broken into the night the codex vanished.', ar: 'اقتُحم الأرشيف ليلة اختفاء المخطوطة.' },
      ],
    },
    {
      id: 'verdict',
      // Heard on the way to the checkpoint (see Chapter.walk).
      walk: [
        { voice: 'narrator', text: { de: 'Elise geht mit ihrer Laterne voraus. Hinter dir hängt die Hintertür des Archivs an einer einzigen Angel.', en: 'Elise walks ahead with her lantern. Behind you, the archive’s back door hangs from a single hinge.', ar: 'تمشي إليزه أمامك بفانوسها. وخلفك يتدلّى باب الأرشيف الخلفي من مفصّلة واحدة.' } },
      ],
      title: { de: 'Der Einbruch', en: 'The Break-in', ar: 'الاقتحام' },
      story: {
        de: [
          'Elise führt dich zur Hintertür. Das Schloss ist aufgebrochen. „Wer immer es war, wusste genau, wonach er suchte. Und er wusste von meiner Nachricht an dich.“',
          'Sie sieht dich an. „Du hast alles gesehen, was ich nicht sehen konnte. Wer war es?“',
        ],
        en: [
          'Elise leads you to the back door. The lock has been forced. “Whoever it was knew exactly what they were looking for. And they knew about my message to you.”',
          'She looks at you. “You have seen everything I could not. Who was it?”',
        ],
        ar: [
          'تقودك إليزه إلى الباب الخلفي. القفل مكسور. «أيّاً كان الفاعل، فقد كان يعرف بالضبط عمّا يبحث. وكان يعرف برسالتي إليك».',
          'تنظر إليك: «لقد رأيت كل ما لم أستطع رؤيته. من كان؟»',
        ],
      },
      checkpoint: { id: 'cp-backdoor', name: { de: 'Die Hintertür des Archivs', en: 'The archive’s back door', ar: 'الباب الخلفي للأرشيف' }, simulated: true, mapPosition: { x: 92, y: 14 }, verification: ['gps', 'qr', 'manual'], coordinates: { lat: 49.4106, lng: 8.7156 }, code: 'cq-lost-manuscript-8' },
      puzzle: {
        type: 'deduction',
        prompt: {
          de: 'Wer ist ins Archiv eingebrochen? Wähle die Person und lege den Beweis vor.',
          en: 'Who broke into the archive? Choose the person and lay down the proof.',
          ar: 'من اقتحم الأرشيف؟ اختر الشخص وقدّم الدليل.',
        },
        choices: [
          { id: 'kehl', label: { de: 'Prof. Albrecht Kehl', en: 'Prof. Albrecht Kehl', ar: 'البروفيسور ألبرشت كيل' } },
          { id: 'clara', label: { de: 'Clara', en: 'Clara', ar: 'كلارا' } },
          { id: 'ben', label: { de: 'Ben', en: 'Ben', ar: 'بن' } },
          { id: 'elise', label: { de: 'Elise Brandt', en: 'Elise Brandt', ar: 'إليزه برانت' } },
          { id: 'anna', label: { de: 'Anna', en: 'Anna', ar: 'آنا' } },
        ],
        junior: { de: 'Denkt wie Detektive: Wer wusste ein Geheimnis, das er gar nicht wissen durfte?', en: 'Think like detectives: who knew a secret they should never have known?', ar: 'فكّروا كالمحققين: من عرف سرّاً ما كان يجب أن يعرفه؟' },
        hints: [
          { de: 'Wer wusste von VIIs Nachricht, ohne sie bekommen zu haben?', en: 'Who knew about VII’s message without having been sent it?', ar: 'من كان يعرف برسالة VII دون أن تُرسل إليه؟' },
          { de: 'Der Beweis lag in seinem Arbeitszimmer. In der Akte kannst du Beweisstücke auch zusammenfügen.', en: 'The proof was in his study. In the journal you can also put items together.', ar: 'الدليل كان في مكتبه. ويمكنك في الملف أيضاً جمع الأغراض معاً.' },
          { de: 'Professor Kehl, mit der linken Briefhälfte (oder dem ganzen Brief).', en: 'Professor Kehl, with the left half of the letter (or the whole letter).', ar: 'البروفيسور كيل، مع النصف الأيسر من الرسالة (أو الرسالة كاملة).' },
        ],
      },
      success: {
        de: 'Kehl. Er hat VIIs Brief abgefangen, die eine Hälfte behalten und war in derselben Nacht im Archiv. Als er dich vor der Tür stehen sieht, bleibt er stehen und senkt den Kopf.',
        en: 'Kehl. He intercepted VII’s letter, kept one half, and was in the archive that same night. When he sees you at the door, he stops and lowers his head.',
        ar: 'كيل. اعترض رسالة VII واحتفظ بنصفها، ودخل الأرشيف في الليلة نفسها. وحين يراك عند الباب يتوقف ويطأطئ رأسه.',
      },
      clues: [{ de: 'Kehl hat den Brief abgefangen und ist eingebrochen.', en: 'Kehl intercepted the letter and broke in.', ar: 'كيل اعترض الرسالة واقتحم الأرشيف.' }],
    },
  ],
  // Optional deductions on the evidence board. Each is answered with one person and two pieces of
  // evidence the team already holds; the accepted combinations are in answers.server.ts.
  board: [
    {
      id: 'liar',
      after: 'witnesses',
      question: {
        de: 'Zwei Zeugen widersprechen sich wegen des Schlüssels. Wer hat gelogen?',
        en: 'Two witnesses contradict each other about the key. Who lied?',
        ar: 'شاهدان يتناقضان بشأن المفتاح. مَن كذب؟',
      },
      deduction: {
        de: 'Anna hat gelogen. Clara hatte den Schlüssel die ganze Zeit – sie hat ihn für VII versteckt –, also stimmte Annas Geschichte über Ben nicht.',
        en: 'Anna lied. Clara had the key all along — she hid it for VII — so Anna’s story about Ben was false.',
        ar: 'آنا كذبت. كان المفتاح مع كلارا طوال الوقت — خبّأته من أجل VII — فقصة آنا عن بن غير صحيحة.',
      },
    },
    {
      id: 'who-is-k',
      after: 'study',
      question: {
        de: 'Wer ist das „K.“ auf dem Zettel im Schrank des Uhrmachers?',
        en: 'Who is the “K.” on the note in the clockmaker’s cabinet?',
        ar: 'مَن هو «ك.» في الورقة داخل خزانة صانع الساعات؟',
      },
      deduction: {
        de: 'K. ist Professor Albrecht Kehl: der Sammler, der seit Jahren alles über den Codex zusammenträgt.',
        en: 'K. is Professor Albrecht Kehl: the collector who has gathered everything about the codex for years.',
        ar: 'ك. هو البروفيسور ألبرشت كيل: الجامع الذي يجمع كل ما يخص المخطوطة منذ سنوات.',
      },
    },
    {
      id: 'footprints',
      after: 'chest',
      question: {
        de: 'Wessen Fußspuren waren vor dir an der Truhe?',
        en: 'Whose footprints were at the chest before you?',
        ar: 'آثار أقدام مَن كانت عند الصندوق قبلك؟',
      },
      deduction: {
        de: 'Kehls. Er wollte heute Nacht zur Truhe am Fluss – und hat sie nicht aufbekommen.',
        en: 'Kehl’s. He set off for the chest by the river tonight — and could not open it.',
        ar: 'آثار كيل. انطلق الليلة إلى الصندوق عند النهر — ولم يستطع فتحه.',
      },
    },
    {
      id: 'signal',
      after: 'mirror',
      question: {
        de: 'Wer hat dir das Laternensignal aus dem Archiv geschickt?',
        en: 'Who sent you the lantern signal from the archive?',
        ar: 'مَن أرسل إليك إشارة الفانوس من الأرشيف؟',
      },
      deduction: {
        de: 'Elise Brandt – VII selbst. Sie wartete im Archiv und wollte, dass du den Weg hinein findest.',
        en: 'Elise Brandt — VII herself. She was waiting in the archive and wanted you to find the way in.',
        ar: 'إليزه برانت — VII نفسها. كانت تنتظر في الأرشيف وأرادت أن تجد طريقك إلى الداخل.',
      },
    },
  ],
  // The investigation kit: phone, documents, a fictional news site, leads and secrets (see types.ts).
  documents: [
    {
      id: 'duty-log',
      style: 'calllog',
      title: { de: 'Dienstbuch des Archivs – die Nacht des Diebstahls', en: 'Archive duty log — the night of the theft', ar: 'سجل مناوبات الأرشيف — ليلة السرقة' },
      rows: [
        { label: { de: 'Anna – Tor', en: 'Anna — gate', ar: 'آنا — البوابة' }, value: '20:00–22:40' },
        { label: { de: 'Ben – Lesesaal', en: 'Ben — reading room', ar: 'بن — قاعة المطالعة' }, value: '20:00–06:00' },
        { label: { de: 'Clara – Schlüsselschrank', en: 'Clara — key cabinet', ar: 'كلارا — خزانة المفاتيح' }, value: '20:00–06:00' },
        { label: { de: 'Archivschlüssel ausgetragen', en: 'Archive key signed out', ar: 'تسجيل خروج مفتاح الأرشيف' }, value: '21:55 · C.', secret: 'lantern-mark' },
      ],
    },
    {
      id: 'gate-note',
      style: 'note',
      title: { de: 'Zettel an der Torwache', en: 'Note pinned to the gate hut', ar: 'ورقة معلّقة على كوخ البوابة' },
      rows: [
        { label: { de: 'Tor kontrolliert, alles ruhig, niemand auf Posten', en: 'Gate checked, all quiet, nobody on duty', ar: 'تم تفقّد البوابة، كل شيء هادئ، لا أحد في المناوبة' }, value: '23:30 · B.' },
      ],
    },
    {
      id: 'taxi',
      style: 'receipt',
      title: { de: 'Neckar-Taxi – Quittung', en: 'Neckar Taxi — receipt', ar: 'تاكسي نيكار — إيصال' },
      rows: [
        { label: { de: 'Abholung', en: 'Pickup', ar: 'الانطلاق' }, value: '23:10' },
        { label: { de: 'Von', en: 'From', ar: 'من' }, value: 'Hauptstraße' },
        { label: { de: 'Nach', en: 'To', ar: 'إلى' }, value: 'Neckarufer' },
        { label: { de: 'Fahrgast', en: 'Passenger', ar: 'الراكب' }, value: 'A. K.' },
        { label: { de: 'Fahrpreis', en: 'Fare', ar: 'الأجرة' }, value: '€ 14,80' },
      ],
    },
  ],
  pages: [
    {
      id: 'abendblatt',
      site: 'Heidelberger Abendblatt',
      address: 'abendblatt.example/kultur/codex-lumen',
      title: { de: 'Sammler bietet erneut für den Codex Lumen', en: 'Collector makes another offer for the Codex Lumen', ar: 'جامعُ مخطوطات يقدّم عرضاً جديداً لشراء كوديكس لومن' },
      body: { de: ['Zum dritten Mal in zwei Jahren hat Professor Albrecht Kehl angeboten, den Codex Lumen vom Archiv der Sieben Laternen zu kaufen. Das Archiv hat erneut abgelehnt.', '„Ich will ihn nicht besitzen“, sagte Kehl dieser Zeitung. „Ich will ihn einmal mit eigenen Augen sehen, bevor ich sterbe.“', 'Die frühere Hüterin des Archivs, Elise Brandt, wollte sich nicht äußern.'], en: ['For the third time in two years, Professor Albrecht Kehl has offered to buy the Codex Lumen from the Archive of the Seven Lanterns. The archive has once again said no.', '“I do not want to own it,” Kehl told this paper. “I want to see it once with my own eyes before I die.”', 'The archive’s former keeper, Elise Brandt, declined to comment.'], ar: ['للمرة الثالثة خلال عامين، عرض البروفيسور ألبرشت كيل شراء كوديكس لومن من أرشيف الفوانيس السبعة. ورفض الأرشيف مرة أخرى.', '«لا أريد أن أملكها»، قال كيل لهذه الصحيفة. «أريد أن أراها مرة واحدة بعينيّ قبل أن أموت».', 'ورفضت الحارسة السابقة للأرشيف، إليزه برانت، التعليق.'] },
    },
  ],
  phone: [
    {
      id: 'vii-start',
      from: 'vii',
      when: 'start',
      kind: 'text',
      text: { de: 'Antworte nicht auf diese Nummer. Folge einfach den Zahlen.', en: 'Don’t reply to this number. Just follow the numbers.', ar: 'لا تردّ على هذا الرقم. اتبع الأرقام فقط.' },
    },
    {
      id: 'vii-tower',
      from: 'vii',
      when: 'message',
      kind: 'call',
      text: { de: 'Hör es dir an, wenn du allein bist.', en: 'Listen when you are alone.', ar: 'استمع إليها حين تكون وحدك.' },
      lines: [
        { voice: 'old', text: { de: 'Du hast den Turm gefunden. Gut. Drei Leute hatten in jener Nacht Dienst – und einer von ihnen sagt nicht die Wahrheit.', en: 'You found the tower. Good. Three people were on duty that night — and one of them is not telling the truth.', ar: 'وجدتَ البرج. جيد. كان ثلاثة أشخاص في المناوبة تلك الليلة — وأحدهم لا يقول الحقيقة.' } },
      ],
    },
    {
      id: 'clara-log',
      from: 'clara',
      when: 'witnesses',
      kind: 'text',
      text: { de: 'Danke, dass du den anderen nicht gesagt hast, dass ich es war. Hier ist das Dienstbuch von jener Nacht.', en: 'Thank you for not telling the others it was me. Here is the duty log from that night.', ar: 'شكراً لأنك لم تخبر الآخرين أنني من فعلها. هذا سجل المناوبات من تلك الليلة.' },
      document: 'duty-log',
      replies: [
        { id: 'why', label: { de: 'Warum hast du den Schlüssel versteckt?', en: 'Why did you hide the key?', ar: 'لماذا خبّأتِ المفتاح؟' }, answer: { de: 'Weil VII mich darum gebeten hat – und weil ich ihr mehr vertraut habe als dem Mann, der an dem Abend am Tor Fragen gestellt hat.', en: 'Because VII asked me — and because I trusted her more than the man asking questions at the gate that evening.', ar: 'لأن VII طلب مني ذلك — ولأنني وثقت به أكثر من الرجل الذي كان يطرح الأسئلة عند البوابة تلك الليلة.' } },
        { id: 'safe', label: { de: 'Dein Geheimnis ist sicher.', en: 'Your secret is safe.', ar: 'سرّك في أمان.' }, answer: { de: 'Dann hier eines von mir: In jener Nacht hat noch jemand nach dem Schlüssel gefragt. Ein Mann in einem langen Mantel.', en: 'Then here is one of mine: someone else came asking for the key that night. A man in a long coat.', ar: 'إذن إليك أحد أسراري: جاء شخص آخر يسأل عن المفتاح تلك الليلة. رجل بمعطف طويل.' }, trust: 1 },
      ],
    },
    {
      id: 'ben-note',
      from: 'ben',
      when: 'clockmaker',
      kind: 'text',
      text: { de: 'Den Zettel hier habe ich bei meinem Rundgang an der Torwache gefunden. Ich dachte, er sei unwichtig – bis jetzt.', en: 'I found this note on the gate hut during my round. I didn’t think it mattered — until now.', ar: 'وجدت هذه الورقة على كوخ البوابة خلال جولتي. ظننت أنها بلا أهمية — حتى الآن.' },
      document: 'gate-note',
    },
    {
      id: 'clara-article',
      from: 'clara',
      when: 'clockmaker',
      kind: 'web',
      text: { de: '„K. weiß es“ – K. wie Kehl? Lies diesen Artikel.', en: '“K. knows” — K. as in Kehl? Read this article.', ar: '«ك. يعرف» — ك. كما في كيل؟ اقرأ هذا المقال.' },
      page: 'abendblatt',
    },
    {
      id: 'threat',
      from: 'unknown',
      when: 'study',
      kind: 'text',
      text: { de: 'Hör auf, nach dem Codex zu suchen. Manche Bücher bleiben besser im Regal.', en: 'Stop looking for the codex. Some books are better left on the shelf.', ar: 'توقّف عن البحث عن المخطوطة. بعض الكتب من الأفضل أن تبقى على الرف.' },
      replies: [
        { id: 'who', label: { de: 'Wer ist da?', en: 'Who is this?', ar: 'مَن أنت؟' }, answer: { de: 'Jemand, der weiß, wo du gerade stehst.', en: 'Someone who knows where you are standing right now.', ar: 'شخص يعرف أين تقف الآن بالضبط.' } },
        { id: 'brave', label: { de: 'Ich habe keine Angst vor dir.', en: 'I’m not afraid of you.', ar: 'أنا لا أخاف منك.' }, answer: { de: 'Das werden wir sehen.', en: 'We will see.', ar: 'سنرى.' } },
      ],
    },
    {
      id: 'vii-taxi',
      from: 'vii',
      when: 'chest',
      kind: 'text',
      text: { de: 'Jemand war schneller als du, aber nicht viel. Ein Taxifahrer hat diese Quittung auf dem Rücksitz gefunden.', en: 'Someone was faster than you, but not by much. A taxi driver found this receipt on the back seat.', ar: 'كان أحدهم أسرع منك، لكن ليس بكثير. وجد سائق تاكسي هذا الإيصال على المقعد الخلفي.' },
      document: 'taxi',
    },
    {
      id: 'vii-signal',
      from: 'vii',
      when: 'signal',
      kind: 'text',
      text: { de: 'Komm zum Archiv. Benutze den Code.', en: 'Come to the archive. Use the code.', ar: 'تعالَ إلى الأرشيف. استخدم الرمز.' },
      replies: [
        { id: 'team', label: { de: 'Wir kommen zusammen.', en: 'We are coming together.', ar: 'سنأتي معاً.' }, answer: { de: 'Gut. Geschichten brauchen mehr als einen Leser.', en: 'Good. Stories need more than one reader.', ar: 'جيد. الحكايات تحتاج إلى أكثر من قارئ.' }, trust: 1 },
        { id: 'alone', label: { de: 'Ich komme allein.', en: 'I will come alone.', ar: 'سآتي وحدي.' }, answer: { de: 'Mutig. Oder leichtsinnig. Wir werden sehen, was von beidem.', en: 'Brave. Or foolish. We will see which.', ar: 'شجاع. أو متهوّر. سنرى أيّهما.' } },
      ],
    },
    {
      id: 'elise-call',
      from: 'elise',
      when: 'mirror',
      kind: 'call',
      text: { de: 'Die Laterne war ich.', en: 'The lantern was me.', ar: 'الفانوس كان أنا.' },
      lines: [
        { voice: 'old', text: { de: 'Das Signal kam von mir. Ich musste wissen, ob du das Licht lesen kannst – und ob du aufgibst.', en: 'That signal was me. I had to know you could read the light — and whether you would give up.', ar: 'تلك الإشارة كانت مني. كان عليّ أن أعرف إن كنت تستطيع قراءة الضوء — وإن كنت ستستسلم.' } },
      ],
    },
    {
      id: 'kehl-sorry',
      from: 'kehl',
      when: 'verdict',
      kind: 'text',
      text: { de: 'Das mit der Tür tut mir leid. Ich würde ihn trotzdem gern eines Tages lesen – wenn ihr mich lasst.', en: 'I am sorry about the door. I would still like to read it one day — if you let me.', ar: 'أنا آسف بشأن الباب. ما زلت أودّ أن أقرأها يوماً ما — إن سمحتم لي.' },
      replies: [
        { id: 'one-day', label: { de: 'Eines Tages vielleicht.', en: 'One day, perhaps.', ar: 'يوماً ما، ربما.' }, answer: { de: 'Danke. Das ist mehr, als ich verdiene.', en: 'Thank you. That is more than I deserve.', ar: 'شكراً. هذا أكثر مما أستحق.' }, trust: 1 },
        { id: 'no', label: { de: 'Nicht nach all dem.', en: 'Not after this.', ar: 'ليس بعد كل هذا.' }, answer: { de: 'Ich verstehe.', en: 'I understand.', ar: 'أفهم.' }, trust: -1 },
      ],
    },
    {
      id: 'clara-bonus',
      from: 'clara',
      when: 'clockmaker',
      kind: 'text',
      text: { de: 'Weil du mein Geheimnis bewahrt hast: Der Mann im langen Mantel fragte nach „dem Schrank des Professors“. Ich habe es damals nicht verstanden. Vielleicht verstehst du es.', en: 'Because you kept my secret: the man in the long coat asked for “the professor’s cabinet”. I did not understand then. Maybe you do.', ar: 'لأنك حفظت سرّي: الرجل ذو المعطف الطويل سأل عن «خزانة البروفيسور». لم أفهم حينها. ربما تفهم أنت.' },
      trust: { person: 'clara', atLeast: 1 },
    },
    {
      id: 'vii-halloween',
      from: 'vii',
      when: 'start',
      kind: 'text',
      text: { de: 'In Nächten wie dieser brennen die Laternen des Archivs von selbst. So sagten es jedenfalls die alten Hüter.', en: 'On nights like this the archive’s lanterns light themselves. Or so the old keepers said.', ar: 'في ليالٍ كهذه تشتعل فوانيس الأرشيف من تلقاء نفسها. أو هكذا كان يقول الحرّاس القدامى.' },
      season: 'halloween',
    },
    {
      id: 'vii-winter',
      from: 'vii',
      when: 'start',
      kind: 'text',
      text: { de: 'Heute Nacht liegt Schnee auf dem Turm. Geh vorsichtig – und halte die Zahlen warm.', en: 'Snow on the tower tonight. Walk carefully — and keep the numbers warm.', ar: 'الثلج على البرج الليلة. امشِ بحذر — وأبقِ الأرقام دافئة.' },
      season: 'winter',
    },
  ],
  leads: [
    {
      id: 'anna-alibi',
      after: 'witnesses',
      kind: 'confront',
      title: { de: 'Annas Alibi', en: 'Anna’s alibi', ar: 'حجة آنا' },
      brief: { de: 'Anna besteht darauf, das Tor nie verlassen zu haben. Prüfe ihre Geschichte am Dienstbuch.', en: 'Anna insists she never left the gate. Check her story against the duty log.', ar: 'تصرّ آنا على أنها لم تغادر البوابة. افحص روايتها بسجل المناوبات.' },
      person: 'anna',
      claim: { de: 'Ich war die ganze Nacht am Tor. Ich habe meinen Posten nie verlassen.', en: 'I was at the gate all night. I never left my post.', ar: 'كنت عند البوابة طوال الليل. لم أترك موقعي أبداً.' },
      documents: ['duty-log'],
      hints: [
        { de: 'Sieh dir die Uhrzeiten neben jedem Namen an.', en: 'Look at the times next to each name.', ar: 'انظر إلى الأوقات بجانب كل اسم.' },
        { de: 'Eine Schicht ist viel kürzer als die anderen.', en: 'One shift is much shorter than the others.', ar: 'إحدى المناوبات أقصر بكثير من الأخرى.' },
        { de: 'Annas eigene Zeile: Sie verließ das Tor um 22:40.', en: 'Anna’s own line: she left the gate at 22:40.', ar: 'سطر آنا نفسه: غادرت البوابة الساعة 22:40.' },
      ],
      outcome: { de: 'Mit dem Dienstbuch konfrontiert, sieht Anna weg: „Ich bin um 22:40 gegangen. Niemand sollte wissen, dass ich nicht da war, als der Schlüssel verschwand.“', en: 'Confronted with the log, Anna looks away: “I left at 22:40. I didn’t want anyone to know I wasn’t there when the key went missing.”', ar: 'حين تواجهها بالسجل، تشيح آنا بنظرها: «غادرت الساعة 22:40. لم أرد أن يعرف أحد أنني لم أكن هناك حين اختفى المفتاح».' },
    },
    {
      id: 'night',
      after: 'chest',
      kind: 'timeline',
      title: { de: 'Jene Nacht, der Reihe nach', en: 'That night, in order', ar: 'تلك الليلة، بالترتيب' },
      brief: { de: 'Drei Dokumente, drei Uhrzeiten. Rekonstruiere die Nacht, bevor der Codex verschwand.', en: 'Three documents, three sets of times. Rebuild the night before the codex vanished.', ar: 'ثلاثة مستندات، وثلاث مجموعات من الأوقات. أعِد بناء الليلة التي سبقت اختفاء المخطوطة.' },
      documents: ['duty-log', 'gate-note', 'taxi'],
      events: [
        { id: 't', text: { de: 'A. K. nimmt ein Taxi zum Fluss.', en: 'A. K. takes a taxi to the river.', ar: 'يستقلّ أ. ك. تاكسي إلى النهر.' } },
        { id: 'g', text: { de: 'Ben findet das Tor verlassen.', en: 'Ben finds the gate deserted.', ar: 'يجد بن البوابة خالية.' } },
        { id: 'k', text: { de: 'Der Archivschlüssel verlässt den Schrank.', en: 'The archive key leaves the cabinet.', ar: 'يخرج مفتاح الأرشيف من الخزانة.' } },
        { id: 'a', text: { de: 'Anna verlässt das Tor.', en: 'Anna leaves the gate.', ar: 'تغادر آنا البوابة.' } },
      ],
      hints: [
        { de: 'Die Uhrzeiten stehen im Dienstbuch, auf Bens Zettel und auf der Taxiquittung.', en: 'The times are in the duty log, on Ben’s note and on the taxi receipt.', ar: 'الأوقات موجودة في سجل المناوبات وورقة بن وإيصال التاكسي.' },
        { de: 'Zuerst ging der Schlüssel, um 21:55.', en: 'The key went first, at 21:55.', ar: 'المفتاح أولاً، الساعة 21:55.' },
        { de: 'Schlüssel 21:55, Anna 22:40, Taxi 23:10, Ben 23:30.', en: 'Key 21:55, Anna 22:40, taxi 23:10, Ben 23:30.', ar: 'المفتاح 21:55، آنا 22:40، التاكسي 23:10، بن 23:30.' },
      ],
      outcome: { de: '21:55 der Schlüssel, 22:40 geht Anna, 23:10 Kehls Taxi, 23:30 ein leeres Tor. Kehl wusste genau, wann das Archiv unbewacht war.', en: '21:55 the key, 22:40 Anna leaves, 23:10 Kehl’s taxi, 23:30 an empty gate. Kehl knew exactly when the archive was unguarded.', ar: '21:55 المفتاح، 22:40 تغادر آنا، 23:10 تاكسي كيل، 23:30 بوابة فارغة. كان كيل يعرف بالضبط متى بقي الأرشيف بلا حراسة.' },
    },
    {
      id: 'house',
      after: 'clockmaker',
      kind: 'echo',
      title: { de: 'Das Haus des Uhrmachers', en: 'The clockmaker’s house', ar: 'بيت صانع الساعات' },
      brief: { de: 'Vergleiche das Haus heute mit der Ansicht aus der Fantasie des Autors. Dort ist etwas eingemeißelt, das heute fehlt. Was ist es?', en: 'Compare the house today with the view from the author’s imagination. Something is carved there that is missing today. What is it?', ar: 'قارن البيت اليوم بالمشهد من خيال الكاتب. هناك شيء محفور غير موجود اليوم. ما هو؟' },
      echo: {
        now: { floors: 3, bays: 3, door: 'arch', roof: 'gable', tone: 'plaster', marks: [{ x: 50, y: 52, kind: 'lamp' }] },
        imagined: { floors: 3, bays: 3, door: 'arch', roof: 'gable', tone: 'plaster', marks: [{ x: 50, y: 52, kind: 'lamp' }, { x: 50, y: 18, kind: 'symbol', text: 'VII' }, { x: 84, y: 34, kind: 'window' }] },
        secret: { x: 84, y: 34, id: 'initials' },
      },
      hints: [
        { de: 'Schieb den Regler ganz durch und vergleiche den oberen Teil des Hauses.', en: 'Slide all the way across and compare the top of the house.', ar: 'اسحب حتى النهاية وقارن الجزء العلوي من البيت.' },
        { de: 'Sieh in den Giebel, unter dem Dach.', en: 'Look at the gable, under the roof.', ar: 'انظر إلى الجملون، تحت السقف.' },
        { de: 'VII.', en: 'VII.', ar: 'VII.' },
      ],
      outcome: { de: 'VII – in den Giebel des erdachten Hauses gemeißelt. Das Haus des Uhrmachers war schon lange VIIs Treffpunkt.', en: 'VII — carved into the gable of the imagined house. The clockmaker’s house was VII’s meeting place long before tonight.', ar: 'VII — محفورة في جملون البيت المتخيَّل. كان بيت صانع الساعات مكان لقاء VII قبل الليلة بزمن طويل.' },
    },
    {
      id: 'voicemail',
      after: 'study',
      kind: 'listen',
      title: { de: 'Der Anrufbeantworter der Haushälterin', en: 'The housekeeper’s answering machine', ar: 'جهاز الرد الآلي لمدبرة المنزل' },
      brief: { de: 'Margarete spielt dir Kehls letzte Nachricht vor. Zwischen seinen Sätzen murmelt er etwas vor sich hin. Wann will er an der Truhe sein?', en: 'Margarete plays you Kehl’s last message. Between his sentences he mutters something to himself. When does he mean to be at the chest?', ar: 'تُسمعك مارغريته آخر رسالة من كيل. بين جمله يتمتم بشيء لنفسه. متى ينوي أن يكون عند الصندوق؟' },
      recording: [
        { voice: 'man', text: { de: 'Margarete, ich bin’s. Ich komme heute Nacht nicht nach Hause – warte nicht auf mich.', en: 'Margarete, it is me. I won’t be home tonight — don’t wait up.', ar: 'مارغريته، هذا أنا. لن أعود إلى البيت الليلة — لا تنتظريني.' } },
        { voice: 'man', quiet: true, text: { de: 'Mitternacht. Die Truhe. Bevor sie dort ist.', en: 'Midnight. The chest. Before she gets there.', ar: 'منتصف الليل. الصندوق. قبل أن تصل هي.' } },
        { voice: 'man', text: { de: 'Wenn jemand fragt: Ich bin bei einem Vortrag.', en: 'If anyone asks, I am at a lecture.', ar: 'إن سأل أحد، فأنا في محاضرة.' } },
      ],
      hints: [
        { de: 'Spiel es noch einmal laut ab und hör zwischen den Sätzen hin.', en: 'Play it again with the volume up and listen between the sentences.', ar: 'شغّله مجدداً بصوت أعلى واستمع إلى ما بين الجمل.' },
        { de: 'Es ist eine Uhrzeit, ganz leise gesagt.', en: 'It is a time of night, said very quietly.', ar: 'إنه وقت من الليل، يقال بصوت خافت جداً.' },
        { de: 'Mitternacht.', en: 'Midnight.', ar: 'منتصف الليل.' },
      ],
      outcome: { de: 'Mitternacht. Kehl wollte um Mitternacht an der Truhe sein – wer sie zuerst geöffnet hat, musste also früher kommen.', en: 'Midnight. Kehl meant to be at the chest at midnight — so whoever opened it first had to come earlier.', ar: 'منتصف الليل. كان كيل ينوي أن يكون عند الصندوق عند منتصف الليل — إذن مَن فتحه أولاً جاء قبله.' },
    },
  ],
  secrets: [
    { id: 'lantern-mark', title: { de: 'Das Zeichen von VII', en: 'VII’s mark', ar: 'علامة VII' }, text: { de: 'Neben Claras Kürzel hat jemand eine winzige Laterne gezeichnet: das Zeichen von VII. Clara hat den Schlüssel für VII ausgetragen, genau wie sie gesagt hat.', en: 'Next to Clara’s initial someone drew a tiny lantern: VII’s sign. Clara signed the key out for VII, just as she told you.', ar: 'بجانب الحرف الأول من اسم كلارا رسم أحدهم فانوساً صغيراً: علامة VII. أخرجت كلارا المفتاح من أجل VII، كما قالت لك تماماً.' } },
    { id: 'initials', title: { de: 'Initialen im Fensterrahmen', en: 'Initials in the window frame', ar: 'أحرف في إطار النافذة' }, text: { de: 'In den Rahmen geritzt: E. B. 1974. Elise Brandt kannte dieses Haus lange vor heute Nacht.', en: 'Scratched into the frame: E. B. 1974. Elise Brandt knew this house long before tonight.', ar: 'محفور في الإطار: E. B. 1974. كانت إليزه برانت تعرف هذا البيت قبل الليلة بزمن طويل.' } },
  ],
  // The case report filed before the reveal (see CaseReport); the right answers are in answers.server.ts.
  report: {
    slots: [
      {
        id: 'who',
        question: { de: 'Wer ist ins Archiv eingebrochen?', en: 'Who broke into the archive?', ar: 'مَن اقتحم الأرشيف؟' },
        options: [
          { id: 'kehl', label: { de: 'Professor Kehl', en: 'Professor Kehl', ar: 'البروفيسور كيل' } },
          { id: 'anna', label: { de: 'Anna', en: 'Anna', ar: 'آنا' } },
          { id: 'ben', label: { de: 'Ben', en: 'Ben', ar: 'بن' } },
          { id: 'clara', label: { de: 'Clara', en: 'Clara', ar: 'كلارا' } },
        ],
      },
      {
        id: 'how',
        question: { de: 'Wie kam der Täter hinein?', en: 'How did the thief get in?', ar: 'كيف دخل اللص؟' },
        options: [
          { id: 'key', label: { de: 'Mit dem Schlüssel aus dem Schrank', en: 'With the key from the cabinet', ar: 'بالمفتاح من الخزانة' } },
          { id: 'door', label: { de: 'Er brach die Hintertür auf', en: 'He forced the back door', ar: 'كسر الباب الخلفي' } },
          { id: 'window', label: { de: 'Durch das Fenster des Lesesaals', en: 'Through the reading-room window', ar: 'عبر نافذة قاعة المطالعة' } },
          { id: 'let-in', label: { de: 'Anna ließ ihn herein', en: 'Anna let him in', ar: 'أدخلته آنا' } },
        ],
      },
      {
        id: 'why',
        question: { de: 'Warum?', en: 'Why?', ar: 'لماذا؟' },
        options: [
          { id: 'sell', label: { de: 'Um den Codex zu verkaufen', en: 'To sell the codex', ar: 'ليبيع المخطوطة' } },
          { id: 'lock', label: { de: 'Um ihn wegzuschließen, „zu seinem Schutz“', en: 'To lock it away, “to protect it”', ar: 'ليحبسها بعيداً، «ليحميها»' } },
          { id: 'destroy', label: { de: 'Um ihn zu vernichten', en: 'To destroy it', ar: 'ليُتلفها' } },
          { id: 'help', label: { de: 'Um VII zu helfen', en: 'To help VII', ar: 'ليساعد VII' } },
        ],
      },
      {
        id: 'when',
        question: { de: 'Wann ungefähr?', en: 'Roughly when?', ar: 'متى تقريباً؟' },
        options: [
          { id: 'before', label: { de: 'Bevor der Schlüssel ausgetragen wurde', en: 'Before the key was signed out', ar: 'قبل تسجيل خروج المفتاح' } },
          { id: 'between', label: { de: 'Nachdem Anna ging, bevor sein Taxi fuhr', en: 'After Anna left, before his taxi', ar: 'بعد مغادرة آنا، وقبل التاكسي' } },
          { id: 'midnight', label: { de: 'Nach Mitternacht', en: 'After midnight', ar: 'بعد منتصف الليل' } },
          { id: 'morning', label: { de: 'Beim Schichtwechsel am Morgen', en: 'At the morning shift change', ar: 'عند تبديل المناوبة صباحاً' } },
        ],
      },
      {
        id: 'helper',
        question: { de: 'Wessen Abwesenheit hat es möglich gemacht?', en: 'Whose absence made it possible?', ar: 'غياب مَن جعل ذلك ممكناً؟' },
        options: [
          { id: 'anna', label: { de: 'Anna, die das Tor verließ', en: 'Anna, who left the gate', ar: 'آنا، التي غادرت البوابة' } },
          { id: 'ben', label: { de: 'Ben', en: 'Ben', ar: 'بن' } },
          { id: 'clara', label: { de: 'Clara', en: 'Clara', ar: 'كلارا' } },
          { id: 'elise', label: { de: 'Elise', en: 'Elise', ar: 'إليزه' } },
        ],
      },
    ],
  },
  // The meta-mystery's lantern sign (content/meta.ts) and the printable dossier's brief.
  token: { order: 1, fragment: { de: 'Was bewahrt wird', en: 'What is kept', ar: 'ما يُحفَظ' } },
  dossier: {
      de: ['Heidelberg, ein Herbstabend. Aus dem Universitätsarchiv ist ein Codex verschwunden, der seit Jahrhunderten niemandem gezeigt wurde.', 'Jemand, der sich nur VII nennt, hat euch ausgewählt, ihn zu finden. Folgt den Zahlen, traut nicht jedem Zeugen – und behaltet die Uhr im Blick.'],
      en: ['Heidelberg, an autumn evening. A codex that no one has been shown for centuries has vanished from the university archive.', 'Someone who signs only as VII has chosen you to find it. Follow the numbers, do not trust every witness — and keep an eye on the clock.'],
      ar: ['هايدلبرغ، مساء خريفي. اختفت من أرشيف الجامعة مخطوطة لم يُطلَع عليها أحد منذ قرون.', 'شخص يوقّع باسم VII فقط اختاركم للعثور عليها. اتبعوا الأرقام، ولا تثقوا بكل شاهد — وراقبوا الساعة.'],
    },
  // Second truths for replays (see Variant): another culprit, the same clues and a few new ones.
  variants: [
    {
      id: 'anna',
      title: { de: 'Die Nachtwache', en: 'The Night Guard', ar: 'حارسة الليل' },
      culprit: 'anna',
      chapters: {
        verdict: {
          story: {
            de: ['Elise führt dich zur Hintertür. Das Schloss ist aufgebrochen. Davor wartet Kehl, bleich. „Ich wollte ihn kaufen, nicht stehlen“, sagt er. „Jemand sollte ihn mir am Fluss bringen. Niemand kam.“ Elise sieht dich an. „Wer hat diese Tür aufgebrochen?“'],
            en: ['Elise leads you to the back door. The lock has been forced. Kehl is waiting in front of it, pale. “I came to buy it, not to steal it,” he says. “Someone was meant to bring it to me at the river. Nobody came.” Elise looks at you. “Who forced this door?”'],
            ar: ['تقودك إليزه إلى الباب الخلفي. القفل مكسور. أمامه ينتظر كيل شاحباً. «جئت لأشتريها، لا لأسرقها»، يقول. «كان على أحدهم أن يحضرها لي عند النهر. لم يأتِ أحد». تنظر إليزه إليك. «من كسر هذا الباب؟»'],
          },
          hints: [
            { de: 'Wer hat gleich am Anfang über den Schlüssel gelogen – und wer verließ in jener Nacht das Tor?', en: 'Who lied about the key right at the start — and who left the gate that night?', ar: 'من كذب بشأن المفتاح منذ البداية — ومن غادر البوابة تلك الليلة؟' },
            { de: 'Der Beweis ist der Schlüssel, über den sie gelogen hat. Sieh in deinen Gegenständen nach.', en: 'The proof is the key she lied about. Look among your items.', ar: 'الدليل هو المفتاح الذي كذبت بشأنه. ابحث بين أغراضك.' },
            { de: 'Anna, mit dem Messingschlüssel.', en: 'Anna, with the brass key.', ar: 'آنا، مع المفتاح النحاسي.' },
          ],
          junior: { de: 'Wer hat gleich am Anfang gelogen? Wer einmal lügt, versteckt vielleicht noch mehr.', en: 'Who told a lie at the very beginning? Someone who lies once may be hiding more.', ar: 'من كذب في البداية تماماً؟ من يكذب مرة قد يخفي أكثر.' },
          success: { de: 'Anna. Sie log über den Schlüssel, um alle auf Ben zu hetzen, verließ das Tor genau in der Stunde, in der das Schloss brach, und wollte den Codex am Fluss an Kehl verkaufen. Als sie den Messingschlüssel in deiner Hand sieht, hört sie auf, sich zu verstellen.', en: 'Anna. She lied about the key to set everyone on Ben, left the gate in the very hour the lock was forced, and meant to sell the codex to Kehl by the river. When she sees the brass key in your hand, she stops pretending.', ar: 'آنا. كذبت بشأن المفتاح لتوجّه الجميع نحو بن، وغادرت البوابة في الساعة نفسها التي كُسر فيها القفل، وكانت تنوي بيع المخطوطة لكيل عند النهر. حين ترى المفتاح النحاسي في يدك، تكفّ عن التظاهر.' },
        },
      },
      phone: [
        { id: 'ben-anna', from: 'ben', when: 'study', kind: 'text', text: { de: 'Etwas lässt mich nicht los: Letzte Woche fragte mich Anna, was ein altes Buch wie der Codex wohl wert wäre. Ich dachte, sie macht Witze.', en: 'Something keeps bothering me: last week Anna asked me what an old book like the codex might be worth. I thought she was joking.', ar: 'شيء ما يقلقني: الأسبوع الماضي سألتني آنا كم قد تساوي كتاب قديم مثل المخطوطة. ظننتها تمزح.' } },
        { id: 'clara-river', from: 'clara', when: 'chest', kind: 'text', text: { de: 'Ich habe Anna heute Abend unten am Fluss gesehen, ganz in der Nähe der Laterne. Sie sagte, sie warte „auf einen Käufer“ – und lachte dann zu laut.', en: 'I saw Anna down by the river this evening, close to the lantern. She said she was waiting “for a buyer” — and then laughed too loudly.', ar: 'رأيت آنا هذا المساء قرب النهر، قريباً من الفانوس. قالت إنها تنتظر «مشترياً» — ثم ضحكت بصوت عالٍ أكثر من اللازم.' } },
      ],
      phoneText: {
        'kehl-sorry': { de: 'Es tut mir leid, dass ich ihn überhaupt kaufen wollte. Ich würde ihn trotzdem gern eines Tages lesen – wenn du mich lässt.', en: 'I am sorry I ever wanted to buy it. I would still like to read it one day — if you let me.', ar: 'آسف لأنني أردت شراءها أصلاً. ما زلت أودّ أن أقرأها يوماً — إن سمحت لي.' },
      },
      notes: {
        anna: [{ after: 'verdict', text: { de: 'Brach die Hintertür auf, um den Codex an Kehl zu verkaufen.', en: 'Forced the back door to sell the codex to Kehl.', ar: 'كسرت الباب الخلفي لتبيع المخطوطة لكيل.' } }],
        kehl: [{ after: 'verdict', text: { de: 'Wartete am Fluss, um den Codex zu kaufen – nicht, um ihn zu stehlen.', en: 'Waited by the river to buy the codex — not to steal it.', ar: 'انتظر عند النهر ليشتري المخطوطة — لا ليسرقها.' } }],
      },
      ending: {
        reveal: {
          de: ['„Der Codex Lumen ist keine Schatzkarte“, sagt Elise. „Seine Seiten sind leer bis auf die erste: Wer ihn findet, soll die Geschichten dieser Stadt sammeln, bevor sie vergessen werden.“', '„Albrecht wollte ihn für seine Vitrine kaufen. Und Anna war bereit, ihn ihm zu verkaufen.“', 'Anna starrt auf den Boden. „Ein Jahreslohn“, murmelt sie. „Für ein Buch, das niemand liest.“ Elise schüttelt den Kopf. „Dann lies es, bevor du es verkaufst.“'],
          en: ['“The Codex Lumen is no treasure map,” says Elise. “Its pages are blank except the first: whoever finds it is to gather the stories of this city before they are forgotten.”', '“Albrecht wanted to buy it for his glass case. And Anna was ready to sell it to him.”', 'Anna stares at the ground. “A year’s wages,” she mutters. “For a book nobody reads.” Elise shakes her head. “Then read it before you sell it.”'],
          ar: ['«مخطوطة لومن ليست خريطة كنز»، تقول إليزه. «صفحاتها فارغة إلا الأولى: من يجدها عليه أن يجمع حكايات هذه المدينة قبل أن تُنسى».', '«أراد ألبرشت أن يشتريها لخزانته الزجاجية. وكانت آنا مستعدة لأن تبيعها له».', 'تحدّق آنا في الأرض. «أجر سنة كاملة»، تتمتم. «مقابل كتاب لا يقرؤه أحد». تهزّ إليزه رأسها. «إذن اقرئيه قبل أن تبيعيه».'],
        },
      },
    },
  ],
  ending: {
    // Arrives in the dashboard a week after the case is solved.
    letter: {
      from: { de: 'VII', en: 'VII', ar: 'VII' },
      text: {
        de: ['Eine Woche ist vergangen, und das Archiv ist still geworden.', 'Ich habe euch nie gesagt, warum ich gerade euch gewählt habe. Weil ihr Fremde in dieser Stadt wart – und Fremde sehen, was wir längst übersehen.', 'Was immer ihr mit dem Codex entschieden habt: Er wurde wieder gelesen. Mehr wollte ich nie.'],
        en: ['A week has passed, and the archive has grown quiet again.', 'I never told you why I chose you. Because you were strangers in this city — and strangers see what the rest of us stopped seeing long ago.', 'Whatever you decided about the codex: it was read again. That is all I ever wanted.'],
        ar: ['مرّ أسبوع، وعاد الأرشيف إلى هدوئه.', 'لم أخبركم قطّ لماذا اخترتكم. لأنكم كنتم غرباء في هذه المدينة — والغرباء يرون ما توقّفنا نحن عن رؤيته منذ زمن.', 'أياً كان ما قررتموه بشأن المخطوطة: لقد قُرئت من جديد. هذا كل ما أردته يوماً.'],
      },
    },
    artifact: { kind: 'book' },
    revealIf: [
      { when: 'study:read', text: { de: 'Du erinnerst dich an die Zeile in seinem Tagebuch. „Du wolltest ihn wirklich nur sehen“, sagst du leise. Kehl nickt, und einen Moment lang wirkt er weniger wie ein Dieb als wie ein Leser.', en: 'You remember the line in his diary. “You really did only want to see it,” you say quietly. Kehl nods, and for a moment he looks less like a thief than a reader.', ar: 'تتذكّر السطر في دفتر يومياته. «كنت تريد أن تراها فحسب»، تقول بهدوء. يومئ كيل، ويبدو للحظة قارئاً أكثر منه لصاً.' } },
      { when: 'study:leave', text: { de: 'Sein Tagebuch hast du nie gelesen. Worauf Kehl gehofft hat, erfährst du nur, wenn er es dir erzählt – und er erzählt dir nichts.', en: 'You never read his diary. Whatever Kehl was hoping for, you will only know if he tells you — and he tells you nothing.', ar: 'لم تقرأ دفتر يومياته قط. وما كان كيل يأمله لن تعرفه إلا إذا أخبرك به — وهو لا يخبرك بشيء.' } },
    ],
    reveal: {
      de: [
        '„Der Codex Lumen ist kein Schatzplan“, sagt Elise. „Seine Seiten sind leer, bis auf die erste: Wer ihn findet, soll die Geschichten dieser Stadt sammeln, bevor sie vergessen werden.“',
        '„Albrecht wollte ihn in einer Vitrine einschließen. Ich habe ihn versteckt, damit ihn jemand sucht, der ihn liest. Jemand wie du.“',
        'Kehl sieht zu Boden. „Ich wollte ihn nur schützen“, murmelt er. Elise schüttelt den Kopf. „Bücher schützt man, indem man sie öffnet.“',
      ],
      en: [
        '“The Codex Lumen is no treasure map,” says Elise. “Its pages are blank except the first: whoever finds it is to gather the stories of this city before they are forgotten.”',
        '“Albrecht wanted to lock it in a glass case. I hid it so that someone would come looking who would read it. Someone like you.”',
        'Kehl looks at the ground. “I only wanted to protect it,” he mutters. Elise shakes her head. “You protect a book by opening it.”',
      ],
      ar: [
        '«مخطوطة كودكس لومن ليست خريطة كنز»، تقول إليزه. «صفحاتها فارغة إلا الأولى، وفيها: من يجدها عليه أن يجمع حكايات هذه المدينة قبل أن تُنسى».',
        '«أراد ألبرشت أن يحبسها في خزانة زجاجية. أما أنا فخبّأتها كي يبحث عنها من سيقرؤها. شخص مثلك».',
        'ينظر كيل إلى الأرض: «أردت فقط أن أحميها». تهزّ إليزه رأسها: «الكتاب يُحمى حين يُفتح».',
      ],
    },
    decision: {
      prompt: { de: 'Elise hält dir den Codex hin. Was tust du?', en: 'Elise holds the codex out to you. What do you do?', ar: 'تمدّ إليزه المخطوطة نحوك. ماذا ستفعل؟' },
      choices: [
        {
          id: 'return',
          label: { de: 'Den Codex ins Archiv zurückbringen', en: 'Return the codex to the archive', ar: 'إعادة المخطوطة إلى الأرشيف' },
          epilogue: {
            de: 'Ihr stellt den Codex gemeinsam zurück ins Regal. Elise löscht ihre Laterne. „Er wird warten, bis der Nächste neugierig genug ist.“',
            en: 'Together you put the codex back on its shelf. Elise puts out her lantern. “It will wait until the next one is curious enough.”',
            ar: 'تعيدان المخطوطة معاً إلى رفّها، وتطفئ إليزه فانوسها: «ستنتظر حتى يأتي شخص آخر فضوليّ بما يكفي».',
          },
          epilogueIf: [
            { when: 'study:read', text: { de: 'Beim Hinausgehen fragt Kehl Elise, ob er den Codex ab und zu besuchen darf. Sie sagt Ja.', en: 'On the way out, Kehl asks Elise if he may visit the codex now and then. She says yes.', ar: 'وفي طريق الخروج يسأل كيل إليزه إن كان يستطيع زيارة المخطوطة بين حين وآخر. فتقول نعم.' } },
            { when: 'study:leave', text: { de: 'Kehl geht wortlos. In der nächsten Woche kommt ein Buch im Archiv an, ohne Absender: ein Geschenk für die Regale.', en: 'Kehl leaves without a word. The next week a book arrives at the archive, unsigned: a gift for the shelves.', ar: 'يغادر كيل دون كلمة. وفي الأسبوع التالي يصل إلى الأرشيف كتاب بلا اسم مرسل: هدية للرفوف.' } },
          ],
        },
        {
          id: 'write',
          label: { de: 'Die erste eigene Geschichte hineinschreiben', en: 'Write the first story of your own', ar: 'كتابة أول حكاية خاصة بك' },
          epilogue: {
            de: 'Du schlägst die zweite Seite auf und schreibst, wie dich eine anonyme Nachricht durch die Stadt geführt hat. Elise liest mit und nickt. Sogar Kehl schaut über deine Schulter.',
            en: 'You open the second page and write how an anonymous message led you through the city. Elise reads along and nods. Even Kehl looks over your shoulder.',
            ar: 'تفتح الصفحة الثانية وتكتب كيف قادتك رسالة مجهولة عبر المدينة. إليزه تقرأ معك وتومئ برأسها، وحتى كيل ينظر من فوق كتفك.',
          },
          epilogueIf: [
            { when: 'study:read', text: { de: 'Deine Geschichte endet mit der Zeile aus seinem Tagebuch. Kehl liest sie zweimal und sagt nichts.', en: 'Your story ends with the line from his diary. Kehl reads it twice and says nothing.', ar: 'تنتهي حكايتك بالسطر من دفتر يومياته. يقرؤه كيل مرتين ولا يقول شيئاً.' } },
            { when: 'study:leave', text: { de: 'Auf der Seite ist noch Platz. Elise reicht Kehl den Stift: „Du bist dran.“', en: 'There is space left on the page. Elise hands Kehl the pen: “Your turn.”', ar: 'ما زال في الصفحة متّسع. تناول إليزه القلم لكيل: «دورك».' } },
          ],
        },
      ],
    },
  },
};
