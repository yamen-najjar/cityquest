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
}

/** Someone the player meets; listed in the journal from the chapter they first appear in. */
export interface Person {
  id: string;
  name: Localized;
  role: Localized;
  /** What the player knows about them; grows with the story (an entry per chapter id). */
  notes: { after: string; text: Localized }[];
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
}

export interface Ending {
  /** The object the story was about, shown in 3D at the finale. */
  artifact?: ModelSpec;
  reveal: Localized<string[]>;
  decision: {
    prompt: Localized;
    choices: (Choice & { epilogue: Localized })[];
  };
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
  ending: Ending;
}

/** Answers live server-side only (content/answers.server.ts), keyed by adventure and chapter. */
export type AnswerKey = Record<string, { accepted: string[] }>;
