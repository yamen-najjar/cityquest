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
  languages: ['de', 'en', 'ar'],
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
      'Drei Schwierigkeitsstufen und Sterne für jedes Kapitel.',
      'Am Ende entscheidest du, was mit dem Codex geschieht.',
    ],
    en: [
      'Eight chapters, eight kinds of puzzle: a number cipher, a logic puzzle, a symbol lock, invisible writing on blotting paper, an item from your inventory, a Morse signal, mirrored letters and an accusation with proof.',
      'The case journal collects clues, suspects and your notes. Attentive players discover an extra piece of evidence there.',
      'Three difficulty levels and stars for every chapter.',
      'At the end you decide what happens to the codex.',
    ],
    ar: [
      'ثمانية فصول وثمانية أنواع من الألغاز: شيفرة أرقام، ولغز منطقي، وقفل رموز، وكتابة خفية على ورق نشّاف، وغرض من حقيبتك، وإشارة مورس، وحروف معكوسة، واتهام بالدليل.',
      'ملف القضية يجمع الأدلة والمشتبه بهم وملاحظاتك. ومن ينتبه يكتشف فيه دليلاً إضافياً.',
      'ثلاثة مستويات صعوبة ونجوم لكل فصل.',
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
        ],
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
  ending: {
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
