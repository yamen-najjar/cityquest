# CityQuest

**Every City Has a Secret. Discover It.**

Location-based mystery adventures, played on a phone. This repository is **Phase 1: the functional
prototype**. It has a complete website in German, English, Dutch and Arabic (right to left) and one playable
five-chapter demo adventures, *The Lost Manuscript* and *The Neckar Ring* (a cursed ring and a pursuer
who moves through reflections, with a chase meter driven by hints). It runs with no paid service and no
account.

> Prototype status: every checkpoint in the demo is **simulated**. No walking route has been
> researched or validated, and no puzzle depends on a real fact about Heidelberg. The story, the Codex
> Lumen, the Archive of the Seven Lanterns and all characters are fiction. Prices are **proposals**, and
> nothing can be bought yet.

## What works today

| Area | Status |
|---|---|
| Home page: hero, search, featured city and adventures, how it works, categories, reviews (honest empty state), voucher teaser, FAQ, newsletter form, footer | Working |
| Cities list (search, "available now" filter), Heidelberg city page | Working |
| Adventure catalogue: search across all languages, filters for city, theme, duration, difficulty and group (server-side, work without JavaScript) | Working |
| Adventure details: story, gameplay, facts, accessibility, meeting point, proposed price with the 19 % VAT share, instructions, FAQ, Play / Continue / Play again | Working |
| Game: team name and size (1–5), 5 chapters, simulated checkpoints with manual confirmation, stylised map, inventory, two hints a puzzle, optional timer, achievement toasts, finale with a decision and two epilogues, results, printable certificate, restart | Working |
| Puzzle types in the demos: cipher, logic (multiple choice), image / number code, item use from the inventory, text answer, mirror writing, story decision | Working |
| **Eight chapters per story** with characters, a twist and an accusation. *The Lost Manuscript*: a suspect professor, invisible writing on blotting paper, a Morse lantern signal, a break-in to solve. *The Neckar Ring*: a night-watchman interrogation, a torn guild ledger, a ciphered letter that reveals who handed you the curse, three endings | Working, tested |
| **New puzzle types**: interrogation (`interrogate`), torn strips to order (`order`), cipher wheel (`cipher-wheel`), light that reveals hidden or mirrored writing (`reveal`), Morse signal with light and sound (`morse`), accusation with proof (`deduction`). All have keyboard and screen-reader paths | Working, tested |
| **Case journal**: clues from every solved chapter, the people met with what they said, items (turn in 3D, put two together: an optional discovery in *The Lost Manuscript*), and the team's own notes | Working, tested |
| **Difficulty** (relaxed / classic / expert), three hints per puzzle (nudge, clue, solution), **stars** per chapter and a **rank** | Working, tested |
| **Sound**: synthesised ambience per place, effects, Morse beeps, a mute switch. **Read aloud** and **voiced subtitles** in cutscenes use the device's own speech (Web Speech API), so voice quality and the Arabic voice depend on the phone | Working (voices untested on real phones) |
| **Performance**: Meshopt-compressed models, instanced windows, the next scene preloaded during the puzzle, automatic low quality on weak devices or slow first frames | Working |
| Optional pursuer per adventure (`pursuit`): hints become "use the ring's power", a meter shows how close the pursuer is | Working, tested |
| **Cutscenes**: a short animated 3D scene opens each chapter, and another plays when a key puzzle is solved (the old woman sliding the box across the counter, the box opening and the ring rising to you, the chase through the lanes, the mirror shattering, the Grey Collector rising beside the bridge). Scenes are data (`chapter.scenes`, in `content/adventures/scenes.ts`): a set, actors, camera shots and timed actions (move, walk, turn, rise, open, appear, vanish, glow, reach, shatter, shake), played by `components/three/cutscene`. Skip and Watch again. With reduced motion the last frame shows without animation. On the 3D map a small figure walks from the last checkpoint to the next | Working, tested |
| **Realistic cutscene look**: CC0 assets from [Poly Haven](https://polyhaven.com) (PBR stone, brick, plaster and wood surfaces, a linen weave for clothes, night and interior HDR lighting, and models: treasure chest, Gothic cabinet, castle door, street lamps, lantern, clocks with turning hands, bookshelves, table). Film rendering: soft shadows, bloom around lamps and windows, vignette and grain. About 16 MB in `public/assets/ph`, loaded per scene and cached; a "Loading 3D…" frame shows meanwhile. Rebuild with `node scripts/fetch-assets.mjs` and `python scripts/shrink-textures.py` (Pillow). Credits are in `public/assets/ph/CREDITS.md` | Working, tested |
| **3D (three.js)**, on by default, with a "3D" switch in the game bar: a turnable 3D map of the checkpoints, a padlock with turning dials for number codes (`puzzle.lock`), objects to inspect for a clue (`puzzle.model`: the ring's inner hallmarks), every inventory item and reward as a 3D model (`item.model`), and the story's artifact at the finale (`ending.artifact`). Models are built in code from primitives and canvas textures, so nothing is downloaded. three.js loads in its own chunk only when a 3D element first appears. Without WebGL, with 3D switched off or if a GPU context fails, the 2D versions are shown. Dials are real spin buttons with up/down buttons and arrow keys, and there is a typed-code fallback. Rendering happens only on change, and stops off-screen. Reduced motion stops the idle spin and the animations | Working, tested (Chrome, headless WebGL) |
| Answer checking on the server (`POST /api/game/[slug]/check`). The answer key never reaches the browser | Working, tested |
| Protecting story content: in Phase 1 the whole story ships with the page, and success texts and later chapters mention earlier answers. Someone reading the page data could find them | Phase 2 serves each chapter only after the previous one is solved |
| Progress saved after every step (localStorage), resumable after reload, a closed tab or a language switch | Working, tested |
| "My adventures": progress, XP and achievements on this device | Working |
| German, English, Dutch, Arabic with RTL; language switch keeps the page, filters and game progress. Stories are written in de/en/ar; further languages come from translation tables in content/translations keyed by the English text (puzzle material that depends on the language is rewritten there, not translated), and a test fails on any missing entry | Working, tested |
| SEO: localised metadata, hreflang alternates, `sitemap.xml`, `robots.txt`, Open Graph image (PNG), JSON-LD (`TouristTrip`, no fake offers or ratings) | Working |
| Accessibility: skip link, keyboard focus ring, focus moves to each new game step, live regions for feedback, screen-reader text for the symbol puzzle, reduced-motion support, 44 px touch targets | Working |
| Legal pages: Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung, Kontakt | **Placeholders only.** The operator must supply and legally review them |
| PWA | Web app manifest only. No service worker or offline mode yet |

Not built yet, and the UI never pretends otherwise: accounts, purchases, the newsletter list (the form
says plainly that nothing was saved), gift vouchers, real GPS / QR checkpoints, teams across devices,
admin dashboard. See [Roadmap](#roadmap).

## Run it locally

Requirements: **Node.js 20.9 or newer** (tested with 22.11). No environment variables are needed for Phase 1.

```bash
npm install
npm run dev          # http://localhost:3000 (redirects to /de, /en or /ar)
```

Production build:

```bash
npm run build
npm start            # http://localhost:3000
```

## Tests

```bash
npm test             # unit tests (Vitest): engine, answer checking, i18n completeness, catalogue, pricing
npm run typecheck    # TypeScript, strict
npm run build
npm run test:e2e     # browser tests (Playwright) on desktop and a phone viewport
```

The browser tests use the **Chrome already installed** on the machine (`channel: 'chrome'`), so nothing
is downloaded. They start `next start` on port 3100 themselves, so run `npm run build` first. They play
the whole adventure: wrong and right answers, hints, a reload, a new visit with "Continue", switching to
Arabic and back mid-game, using an inventory item, the finale, results, the dashboard and a restart. They
also check every page for horizontal scrolling.

## Project structure

```
src/
  app/
    [locale]/layout.tsx            <html lang dir>, fonts, metadata
    [locale]/(site)/...            pages with header and footer: home, cities, adventures, dashboard, legal, 404
    [locale]/play/[slug]/page.tsx  full-screen game (no site chrome)
    api/game/[slug]/check/route.ts server-side answer check
    sitemap.ts, robots.ts
  components/                      header, footer, cards, artwork (SVG), forms
  components/game/                 GameClient (state, flow), map, symbol puzzle, item icons
  components/three/                3D: viewer (render-on-demand, drag, dispose), models, canvas textures,
                                   Map3D, Lock3D, Artifact3D; support.ts decides 3D vs 2D without loading three.js
  content/
    types.ts                       content model, mirrors the future database tables
    cities.ts, adventures/         public content, written in de/en/ar
    translations/                  more languages (nl) by English text; localize() adds them
    answers.server.ts              accepted answers ('server-only', never bundled for the browser)
  i18n/                            locales, dictionaries (English is the reference shape; the compiler
                                   rejects a missing German or Arabic key), fmt()
  lib/engine/                      pure game engine: progress reducer, normalisation, achievements,
                                   storage interface, server check
  lib/                             catalogue filters, formatting, site URL helpers
  middleware.ts                    sends paths without a language to /de, /en or /ar
tests/unit/                        Vitest
tests/e2e/                         Playwright
```

### How the pieces are built to grow

- **Content model** (`content/types.ts`): cities, adventures, chapters, checkpoints, puzzles and items
  are typed data, not code. Phase 2 loads the same shapes from Supabase, and the admin dashboard
  writes them.
- **Game engine** (`lib/engine/progress.ts`): a pure reducer (`arrive`, `wrong`, `hint`, `solve`,
  `next`, `decide`, `tick`). It runs unchanged against a server-saved progress row.
- **Progress store** (`lib/engine/storage.ts`): a `ProgressStore` interface with a localStorage
  implementation. Phase 2 adds a Supabase one.
- **Answer checking** (`lib/engine/check.server.ts`): already server-side. Phase 2 adds the
  entitlement check (has this player bought the adventure?) and chapter-order enforcement there.
- **Checkpoints** declare their verification methods (`manual`, `gps`, `qr`). `manual` always stays
  available, so a bad GPS fix never blocks a player.
- **Answer normalisation** forgives case, accents, umlauts, Arabic letter variants, the Arabic article,
  harakat and Eastern Arabic digits, and accepts every language's answer in every language.

### Adding an adventure (Phase 1, by hand)

1. Add a file in `src/content/adventures/` that exports an `Adventure`, and list it in `adventures/index.ts`.
2. Add its accepted answers, keyed by chapter id, to `src/content/answers.server.ts`.
3. Run `npm test`. It fails if a translation is missing, a chapter has no answer key or a reward item
   does not exist.

## Deployment

Any Node host that runs Next.js works. With **Vercel**: import the repository, keep the defaults and set
`NEXT_PUBLIC_SITE_URL` to the public address (used for canonical links, hreflang, the sitemap and Open
Graph). Check that your plan permits commercial use before launch.

Self-hosted: `npm ci && npm run build && npm start` behind a reverse proxy with HTTPS. Set `PORT` if needed.

## Dependency notes

- Next.js **15.5.28**, React **19.2.9**: patched releases.
- `package.json` overrides the PostCSS that Next.js bundles to 8.5.30, which clears the PostCSS advisories.
  `npm audit` reports 0 vulnerabilities at the time of writing.

## Roadmap

**Phase 2 — Real backend.** Supabase (PostgreSQL, Auth with email magic links), profiles, progress saved
to the account, purchased adventures, admin dashboard (cities, adventures, chapters, checkpoints,
puzzles, answers, hints, translations, images, draft / published, preview), server-enforced roles with
row-level security, account deletion and data export (GDPR), newsletter with double opt-in.

**Phase 3 — Payments.** Stripe Checkout, fulfilment only from a verified webhook, team-ticket
entitlements, discount codes, order history and receipts, refunds and cancellations in the admin.
Consumer prices including VAT, with the Widerrufsbelehrung in place.

**Phase 4 — Real location gameplay.** Route research and on-foot validation in Heidelberg, MapLibre
with a licensed tile provider, optional GPS verification with tolerance, QR checkpoints, manual fallback,
safety and accessibility details per checkpoint, no background tracking, minimal location retention.

**Phase 5 — Growth.** Teams on several devices, team dashboards, gift vouchers, hotel and partner
referrals (links, QR, codes, conversion and commission tracking, with no automatic payouts), corporate
packages, more cities and adventures, analytics (visits, checkout starts, purchases, completions).

## Before launch (owner's checklist)

- Provide and legally review the Impressum, privacy policy, AGB and withdrawal information.
- Confirm pricing, VAT handling and consumer-rights procedures with an accountant or lawyer.
- Walk and validate every outdoor checkpoint, including safety, accessibility and public right of way.
- Only publish reviews and ratings from real players.
