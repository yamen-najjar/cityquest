// The content model. It mirrors the tables Phase 2 adds in Supabase (cities, adventures, chapters,
// checkpoints, puzzles, items), so the static files in this folder can be swapped for queries
// without touching the pages or the game engine.
import type { Locale } from '@/i18n/config';

export type Localized<T = string> = Record<Locale, T>;

/**
 * Content is written in German, English and Arabic. Further languages (Dutch) are added from translation
 * tables keyed by the English text (content/translations), so a story file stays readable and a new
 * language never means editing every sentence. `Authored<T>` is T as written: Localized without them.
 */
export type AuthoredLocale = 'de' | 'en' | 'ar';
export type Authored<T> = T extends string | number | boolean | null | undefined
  ? T
  : T extends readonly (infer U)[]
    ? Authored<U>[]
    : T extends { de: infer X; en: unknown; ar: unknown; nl: unknown }
      ? Record<AuthoredLocale, X>
      : { [K in keyof T]: Authored<T[K]> };

export type PublishStatus = 'draft' | 'published';

export interface City {
  slug: string;
  name: Localized;
  region: Localized;
  country: 'DE' | 'NL';
  status: 'available' | 'coming-soon';
  pilot: boolean;
  intro: Localized;
  /** Approximate centre, for the Phase 4 map. */
  center: { lat: number; lng: number };
}

export type Theme = 'mystery' | 'treasure' | 'escape' | 'detective';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GroupType = 'friends' | 'family' | 'couples' | 'corporate';

export type PuzzleType =
  | 'multiple-choice'
  | 'text'
  | 'number-code'
  | 'image'
  | 'logic'
  | 'cipher'
  | 'qr'
  | 'location'
  | 'item-collection'
  | 'item-use'
  | 'decision'
  /** Question a character, then answer from what they said. */
  | 'interrogate'
  /** Put torn strips back in order. */
  | 'order'
  /** Decode a shifted alphabet with a turning cipher wheel. */
  | 'cipher-wheel'
  /** Sweep a light over a wall or page to find hidden writing. */
  | 'reveal'
  /** Read a signal of long and short flashes (and beeps). */
  | 'morse'
  /** Name the culprit and show the proof from the inventory. */
  | 'deduction';

export interface Choice {
  id: string;
  label: Localized;
}

/** One question the player can ask in an interrogation, and the answer it gets. */
export interface Question {
  id: string;
  q: Localized;
  a: Localized;
}

export interface Puzzle {
  type: PuzzleType;
  prompt: Localized;
  /** Puzzle material shown to the player: the cipher, a list of statements, a mirrored word. */
  material?: Localized<string[]>;
  /** For multiple-choice and logic puzzles. */
  choices?: Choice[];
  /** item-use: the answer is picked from the player's inventory. */
  fromInventory?: boolean;
  /** A built-in illustration ('symbol-equations'), or 'mirror' to show the material mirrored. */
  visual?: 'symbol-equations' | 'mirror';
  /** interrogate: who is questioned (a person id) and what can be asked. */
  interview?: { person: string; questions: Question[] };
  /** order: the strips, listed in the scrambled order they are first shown; the answer is ids in the right order. */
  pieces?: { id: string; text: Localized }[];
  /** morse: the signal in dots and dashes, letters separated by spaces. */
  morse?: string;
  /** reveal: the hidden writing is shown mirrored (seen through the back of the paper). */
  revealMirrored?: boolean;
  /** A 3D object to inspect for the clue. With 3D on it replaces the written material, which stays for screen readers. */
  model?: ModelSpec;
  /** Number codes: shown as a 3D padlock with this many dials when 3D is on. */
  lock?: { digits: number };
  input?: 'text' | 'numeric';
  /** Shown one at a time, in order: a nudge, a clearer clue, then the answer itself. */
  hints: Localized[];
  /** Junior mode: the puzzle explained for young detectives, in one friendly line. */
  junior?: Localized;
}

/**
 * Story branching. A chapter can end with a decision; the pick is saved as "chapterId:optionId", and any
 * later content can name that pair in `when` to appear only for teams who chose it. Content without
 * `when` is shown to everyone, so a story that never branches is unchanged.
 */
export interface StoryChoice {
  prompt: Localized;
  options: { id: string; label: Localized; outcome: Localized }[];
}

/** A piece of text shown only after a given story choice ("chapterId:optionId"). */
export interface WhenChosen {
  when: string;
  text: Localized;
  /** Reveal paragraphs only: shown after this paragraph (0-based); at the end when left out. */
  after?: number;
}

/** Someone the player meets; listed in the journal from the chapter they first appear in. */
export interface Person {
  id: string;
  name: Localized;
  role: Localized;
  /** What the player knows about them; grows with the story (an entry per chapter id), optionally only after a story choice. */
  notes: { after: string; text: Localized; when?: string }[];
  appears: string;
  /** How their lines sound when read aloud. */
  voice: Voice;
}

/**
 * How a checkpoint is confirmed. 'manual' is the fallback every checkpoint keeps, so a weak GPS fix never
 * blocks a player; 'gps' and 'qr' arrive in Phase 4.
 */
export type Verification = 'manual' | 'gps' | 'qr';

export interface Checkpoint {
  id: string;
  name: Localized;
  /** true until the location has been walked and validated. Simulated checkpoints show no real address. */
  simulated: boolean;
  /** Position on the stylised demo map, 0-100 on each axis. */
  mapPosition: { x: number; y: number };
  coordinates?: { lat: number; lng: number };
  /** The value encoded in the QR code placed at this checkpoint (Phase 4); matched when `verification` includes 'qr'. */
  code?: string;
  verification: Verification[];
}

/** Artwork drawn on paper-like 3D models. */
export type PaperArt = 'suns' | 'lanterns' | 'lines' | 'quill' | 'rubbing' | 'stamps' | 'codex-cover';

/** How an item or artifact looks in 3D. Models are built in code from this; nothing is downloaded. */
export type ModelSpec =
  | { kind: 'ring'; hallmarks?: string[] }
  | { kind: 'key' }
  | { kind: 'paper'; art: PaperArt; torn?: boolean }
  | { kind: 'map' }
  | { kind: 'leather' }
  | { kind: 'book' };

export interface InventoryItem {
  id: string;
  name: Localized;
  description: Localized;
  icon: 'letter' | 'key' | 'map' | 'page' | 'ring';
  model: ModelSpec;
}

// ---------------------------------------------------------------------------------------------------
// Cutscenes: short animated 3D scenes, written as data. A scene names a set, places actors, moves the
// camera through shots and runs timed actions. The player in components/three/cutscene interprets it.

export type Vec3 = [number, number, number];

export type SceneSet = 'room' | 'shop' | 'square' | 'workshop' | 'riverbank' | 'archive' | 'alley' | 'lanes' | 'bridge';

export type ActorKind =
  | 'old-woman'
  | 'woman'
  | 'man'
  | 'girl'
  | 'ghost'
  | 'phone'
  | 'box'
  | 'ring'
  | 'key'
  | 'lantern'
  | 'chest'
  | 'cabinet'
  | 'mirror'
  | 'book'
  | 'map'
  | 'page'
  | 'door'
  | 'writing';

export interface SceneActor {
  id: string;
  kind: ActorKind;
  at: Vec3;
  /** Rotation around the vertical axis, in radians; 0 faces the camera's usual side (+z). */
  turn?: number;
  /** Starts invisible; an 'appear' action fades it in. */
  hidden?: boolean;
  /** Size multiplier, 1 by default. */
  scale?: number;
}

/** A camera keyframe: where the camera is at time t, and what it looks at. */
export interface SceneShot {
  t: number;
  camera: Vec3;
  look: Vec3;
}

interface Timed {
  /** Start, in seconds. */
  t: number;
  /** Duration, in seconds. */
  d: number;
  id: string;
}

export type SceneAction =
  | (Timed & { do: 'move' | 'walk'; to: Vec3 })
  | (Timed & { do: 'turn'; to: number })
  | (Timed & { do: 'rise'; by: number })
  | (Timed & { do: 'open' | 'close' | 'appear' | 'vanish' | 'glow' | 'reach' | 'shatter' | 'shake' });

/** How a line is voiced when read aloud: picks pitch and speed. */
export type Voice = 'old' | 'woman' | 'man' | 'girl' | 'ghost' | 'narrator';

/** A subtitle, and optionally a spoken line, at time t for d seconds. */
export interface SceneLine {
  t: number;
  d: number;
  voice: Voice;
  text: Localized;
}

export interface Scene {
  set: SceneSet;
  duration: number;
  actors: SceneActor[];
  shots: SceneShot[];
  actions: SceneAction[];
  lines?: SceneLine[];
  /** Adds a walking bob to the camera, for scenes seen through the player's eyes while moving. */
  handheld?: boolean;
}

export interface Chapter {
  id: string;
  title: Localized;
  story: Localized<string[]>;
  /** Played when the chapter opens and when its puzzle is solved. */
  scenes?: { intro?: Scene; success?: Scene };
  /** Facts written into the case journal when the chapter is solved. */
  clues?: Localized[];
  checkpoint: Checkpoint;
  puzzle: Puzzle;
  success: Localized;
  /** Item added to the inventory when the chapter is solved. */
  reward?: string;
  /** A decision the team makes after solving the chapter (see StoryChoice). */
  choice?: StoryChoice;
  /** Heard on the way to this chapter's checkpoint: the story goes on while the team walks. */
  walk?: { voice: Voice; text: Localized }[];
}

/**
 * An open question on the evidence board. It appears once chapter `after` is solved; the player answers it
 * by naming one person and pinning two pieces of evidence they have collected. The accepted combinations
 * live server-side, like every other answer (answers.server.ts, key `board:<id>`).
 *
 * Evidence ids on the board: `item:<itemId>` for an item, `clue:<chapterId>-<n>` for the n-th clue of a
 * chapter, `said:<chapterId>-<questionId>` for an answer heard in an interrogation.
 */
export interface BoardQuestion {
  id: string;
  after: string;
  question: Localized;
  /** What the team has worked out, shown once the question is answered. */
  deduction: Localized;
}

// ---------------------------------------------------------------------------------------------------
// The investigation kit: the phone, documents, leads, the "imagined view" and secrets. All of it is data,
// unlocked by the same triggers, so every adventure uses the same engine.

/**
 * When something unlocks: 'start' (the game began), a chapter id (that chapter is solved), 'board:<id>'
 * (that deduction is made), 'lead:<id>' (that lead is solved) or 'choice:<chapterId>:<optionId>'.
 */
export type Trigger = string;

/** A document the team can read: a receipt, a ticket, a call log, a note or a newspaper cutting. */
export interface CaseDocument {
  id: string;
  style: 'receipt' | 'ticket' | 'calllog' | 'note' | 'newspaper';
  title: Localized;
  /** Label and value rows. Values (times, amounts, names) are the same in every language. */
  rows: { label: Localized; value: string; /** Looking closer at this row finds a secret. */ secret?: string }[];
  /** A note under the rows (the small print, a handwritten remark). */
  note?: Localized;
}

/** A page of an in-world website, opened in the phone's browser. Every site is fictional. */
export interface WebPage {
  id: string;
  site: string;
  address: string;
  title: Localized;
  body: Localized<string[]>;
}

/**
 * A message on the in-game phone. 'text' is a chat message, 'call' a voice message played with the
 * character's acted voice (read aloud until real recordings replace it), 'web' a link to a WebPage.
 * Replies let the team answer; the answer they pick changes what comes back.
 */
export interface PhoneMessage {
  id: string;
  /** A person id, or 'unknown' for a withheld number. */
  from: string;
  when: Trigger;
  kind: 'text' | 'call' | 'web';
  text: Localized;
  /** call: what is said, in order. */
  lines?: { voice: Voice; text: Localized }[];
  document?: string;
  page?: string;
  /** Replies; `trust` (+1 warm, -1 cold) changes how the sender sees the team from then on. */
  replies?: { id: string; label: Localized; answer: Localized; trust?: number }[];
  /** Arrives only if the team's trust with this person is at least (or at most) the given value. */
  trust?: { person: string; atLeast?: number; atMost?: number };
  /** Arrives only during a season of the year (local date), on top of `when`. */
  season?: Season;
}

/** Seasonal windows: Halloween (25 October – 2 November) and winter (1 December – 6 January). */
export type Season = 'halloween' | 'winter';

/** One frame of the imagined view: a façade drawn as data (or a photo of a public place, later). */
export interface Facade {
  /** A photo replaces the drawing when given (a public place, photographed by the team). */
  src?: string;
  floors: number;
  bays: number;
  door: 'arch' | 'square';
  roof: 'gable' | 'flat' | 'tower';
  /** Extra details on top, in percent of the width and height. */
  marks: { x: number; y: number; kind: 'window' | 'symbol' | 'lamp' | 'sign' | 'statue'; text?: string }[];
  tone: 'stone' | 'brick' | 'plaster';
}

/**
 * A lead: a side investigation that unlocks after chapter `after`. It is checked on the server like every
 * puzzle (answers.server.ts, key `lead:<id>`), never needed to finish, and counted in the detective report.
 *   confront  – a person's claim, and the documents that might contradict it: pick the one that does.
 *   timeline  – events to put in the order they happened, from the times in the documents.
 *   echo      – the place as it is and as the author imagines it: find what differs.
 *   listen    – a voice recording: catch the word spoken under the rest.
 */
export interface Lead {
  id: string;
  after: string;
  kind: 'confront' | 'timeline' | 'echo' | 'listen';
  title: Localized;
  brief: Localized;
  /** confront: who claims what. */
  person?: string;
  claim?: Localized;
  /** confront: the documents to choose from (ids); timeline: the documents to read the times in. */
  documents?: string[];
  /** timeline: the events, listed in the scrambled order they are first shown. */
  events?: { id: string; text: Localized }[];
  /** echo: the place now, and as the author imagines it. */
  echo?: { now: Facade; imagined: Facade; secret?: { x: number; y: number; id: string } };
  /** listen: the recording; the line marked `quiet` is spoken softly under the rest. */
  recording?: { voice: Voice; text: Localized; quiet?: boolean }[];
  input?: 'text' | 'numeric';
  hints: Localized[];
  /** What the team learns when it is solved. */
  outcome: Localized;
}

/**
 * The case report, filed before the truth is revealed: questions with options (who, how, why…). The game
 * confirms nothing until at least `REPORT_CONFIRM` answers are right together; then it says which ones.
 * The right answers live server-side (answers.server.ts, key "report", as "slot=option;slot=option").
 */
export interface CaseReport {
  slots: { id: string; question: Localized; options: { id: string; label: Localized }[] }[];
}

/** An optional secret: found by looking closely (a document row, a spot in the imagined view). */
export interface Secret {
  id: string;
  title: Localized;
  text: Localized;
}

export interface Ending {
  /** The object the story was about, shown in 3D at the finale. */
  artifact?: ModelSpec;
  reveal: Localized<string[]>;
  /** Extra reveal paragraphs, each only after a story choice. */
  revealIf?: WhenChosen[];
  decision: {
    prompt: Localized;
    choices: (Choice & { epilogue: Localized; epilogueIf?: WhenChosen[] })[];
  };
  /** A letter that arrives in the dashboard a week after the case is solved. */
  letter?: { from: Localized; text: Localized<string[]> };
}

/**
 * A pursuer that turns hints into story: each hint brings it closer, and the game shows how close.
 * levels go from far to near; the number of hints used picks the level.
 */
export interface Pursuit {
  name: Localized;
  hintLabel: Localized;
  closer: Localized;
  levels: Localized[];
  /**
   * What happens when the pursuer reaches the team (classic and expert mode; relaxed mode only shows the
   * danger). The first time he takes the newest item, which a short puzzle wins back (answer key
   * "recover"); the second time the case is lost and `lost` replaces the ending.
   */
  caught?: {
    text: Localized;
    recover: { prompt: Localized; material?: Localized<string[]>; input?: 'text' | 'numeric'; hints: Localized[]; success: Localized };
    lost: { title: Localized; text: Localized };
  };
}

export interface Adventure {
  slug: string;
  city: string;
  status: PublishStatus;
  isDemo: boolean;
  /** Mood of the cover artwork. */
  art?: 'dusk' | 'night';
  pursuit?: Pursuit;
  title: Localized;
  tagline: Localized;
  description: Localized;
  theme: Theme;
  groupTypes: GroupType[];
  difficulty: Difficulty;
  durationMinutes: { min: number; max: number };
  distanceKm: number;
  teamSize: { min: number; max: number };
  minAge: number;
  languages: Locale[];
  /** Proposed consumer price per team, VAT included, in cents. */
  priceCents: number;
  tier: 'standard' | 'premium';
  meetingPoint: Localized;
  accessibility: Localized;
  overview: Localized<string[]>;
  instructions: Localized<string[]>;
  faq: { q: Localized; a: Localized }[];
  items: InventoryItem[];
  /** Items made by combining two others: `from` (sorted ids, joined by '+') gives `to`. */
  combinations?: { from: string; to: string }[];
  people: Person[];
  chapters: Chapter[];
  /** Optional deductions for the evidence board in the case journal. */
  board?: BoardQuestion[];
  /** The investigation kit (see above). */
  phone?: PhoneMessage[];
  documents?: CaseDocument[];
  pages?: WebPage[];
  leads?: Lead[];
  secrets?: Secret[];
  /** The case report the team files before the reveal. */
  report?: CaseReport;
  /**
   * The meta-mystery: one lantern sign per story, won by finishing the case with every secret found.
   * `order` places its fragment in the sentence the signs make together (content/meta.ts).
   */
  token?: { order: number; fragment: Localized };
  /** The printable case dossier's in-world brief, read before playing. No spoilers. */
  dossier?: Localized<string[]>;
  ending: Ending;
}

/** Answers live server-side only (content/answers.server.ts), keyed by adventure and chapter. */
export type AnswerKey = Record<string, { accepted: string[] }>;
