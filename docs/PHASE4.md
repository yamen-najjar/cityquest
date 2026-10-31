# Phase 4 — Real map, GPS & QR checkpoints

Tracking document for Phase 4. Same way of working as Phase 2: one feature branch (`phase-4-map`), small
reviewable commits, this document kept in sync, each milestone tested (unit + typecheck + build, live
where it applies) and reviewed by a Sonnet agent before the next. **Design shown first** for the map UI.

**Branch:** `phase-4-map` · **Status:** M1 complete (MapLibre map) · **Started:** 2026-10-31

**Scope (confirmed):** map + GPS first (QR later); demo gets approximate Heidelberg coordinates (still
`simulated`, manual always available). Design mock approved before building.

## Goal (from the roadmap)

Replace the stylised demo map with a real map (MapLibre), and let a player confirm they reached a
checkpoint by **GPS** (and, in scope-permitting, **QR**) instead of only tapping "I'm here" — while the
game keeps working offline, with manual confirmation always available.

## What exists today
- Game flow per chapter: `travel` → `puzzle` → `solved`. In `travel`, the chapter shows the checkpoint
  and an **Arrive** button that just advances to the puzzle (manual only).
- Checkpoints are `simulated: true` with a stylised `mapPosition` (not a street map) and **no real
  coordinates**; `verification: ['manual']`. The content model already has the slots for Phase 4:
  `coordinates?: {lat,lng}` and `verification: 'manual' | 'gps' | 'qr'`.
- `next.config.mjs` blocks `geolocation` and `camera` (opened in Phase 4).
- Env var `NEXT_PUBLIC_MAP_STYLE_URL` is already reserved for the map style.

## Key technical decisions (proposed)

| # | Decision | Why |
|---|---|---|
| D1 | **MapLibre GL JS** for the real map, loaded lazily (only on the game screen). Style from `NEXT_PUBLIC_MAP_STYLE_URL`; a **keyless raster fallback** (OpenStreetMap) when it's unset. | The roadmap + env var already target MapLibre. The fallback keeps dev, CI and fresh clones working with no key (mirrors Phase 2 D8 "boots unconfigured"); a hosted key (e.g. MapTiler) is a config change at launch. |
| D2 | **GPS verification is client-side and on-device only.** The browser Geolocation API compares the player's position to the checkpoint coordinates within a radius (~40 m). Location is **never sent to the server or stored**. | Privacy by design (GDPR) — we promised no location data leaves the device. The check is purely local, so it also works offline. |
| D3 | **Manual confirmation stays on every checkpoint** as the fallback (weak GPS, indoors, accessibility). GPS/QR only activate for checkpoints that have real coordinates and `gps`/`qr` in `verification`. | Matches the existing model ("'manual' is the fallback every checkpoint keeps"); a bad fix must never block a player. |
| D4 | **Simulated checkpoints keep the stylised map + manual arrival.** | A simulated checkpoint has no real place to walk to; showing it on a street map would be misleading. |
| D5 | **QR verification** (if in scope) scans a code with the camera that must match the checkpoint's expected value; the camera is requested only when the player taps "Scan". Manual stays as fallback. | Camera is sensitive; ask only on demand. |
| D6 | Open `geolocation` (and `camera` for QR) to `self` in the Permissions-Policy; request the permission only when the player acts. | Least privilege; no silent prompts. |

## Open decisions (need your pick) — see the questions asked alongside this doc
1. **Scope:** Map + GPS now (QR as a later milestone), or Map + GPS + QR together?
2. **Demo content:** add approximate Heidelberg coordinates to the demo adventures (still flagged
   `simulated`, manual always available) so the real map + GPS are usable now — or keep the demo
   stylised and activate GPS only for future real on-location adventures?

## Milestones (proposed; adjusts to the scope answer)

### M1 — MapLibre map (complete)
- [x] Design mock shown and approved first
- [x] `maplibre-gl@4.7.1` (pinned); lazy `RealMap` component (its own chunk), style from
      `NEXT_PUBLIC_MAP_STYLE_URL` with a keyless OSM raster fallback
- [x] Renders numbered checkpoint pins (solved/current/upcoming), a dashed route line, fits bounds,
      nav + attribution controls; a `userPosition` prop is ready for the M2 GPS marker
- [x] Added approximate Heidelberg coordinates + `gps` verification to all 16 demo checkpoints (still
      `simulated`); `ChapterView` shows `RealMap` when the checkpoint has coordinates, else the previous
      `Map3D`/`DemoMap`
- [x] Verified live (real Heidelberg tiles + pins render in the game); typecheck + 89 tests; build clean
      (`maplibre-gl` stays in a lazy chunk, play page ~188 kB First Load)
- [x] Reviewer-agent pass (Sonnet) — no HIGH; fixes applied (below)

**M1 review (Sonnet) — no HIGH. Fixed:** if WebGL is missing or MapLibre throws on construction, RealMap
now falls back to the stylised `DemoMap` instead of crashing the game screen; pins are added immediately
(not only on the map's `load`), so they show even if a remote style/tiles fail, plus a `map.on('error')`
handler; a11y — dropped `role="img"` from the map container (it was hiding the zoom controls), the name
moved to the `<figure role="group">`; OSM attribution now links to the copyright page and the raster
source caps at `maxzoom: 19`; pin colours use the theme tokens where they exist. Added a unit test:
every `gps` checkpoint has valid, unique Heidelberg coordinates. 91 unit tests; verified live (8 markers,
attribution link, no console errors). **Deferred to M4 copy pass:** the map note / `simulatedHelp` /
safety-banner copy that still reads as if there were no real map; localising MapLibre's built-in control
strings; moving off OSM's volunteer tile servers. **Deferred to M2:** re-fit on `userPosition`, and
reading latest props from refs in the `load` handler (only matters once GPS moves the camera).

### M2 — GPS "I'm here" (complete)
- [x] `CheckpointArrival` component: for a checkpoint with coordinates + `gps`, an "I'm here" check reads
      the device location (`getCurrentPosition`), measures the great-circle distance, and shows
      locating / arrived (≤40 m) / too-far (with the distance) / location-off / error. Manual
      confirmation is always present. On-device only — the position is never sent or stored (D2)
- [x] The player's position flows to `RealMap` as the blue "you are here" dot
- [x] Permissions-Policy opened to `geolocation=(self)`; camera stays blocked (QR is later)
- [x] Simulated checkpoints show a note that GPS won't match — confirm manually
- [x] Verified live (far: 423 km Amsterdam→Heidelberg; arrived within radius → continue + dot;
      advances to the puzzle); typecheck + 91 tests
- [ ] Reviewer-agent pass (Sonnet)

### M3 — QR (if in scope)
- [ ] Camera scan matching the checkpoint code; permission on demand; manual fallback

### M4 — Content + privacy + copy (complete)
- [x] Demo coordinates added (M1); Permissions-Policy opened to `geolocation=(self)` (M2)
- [x] Privacy copy updated in all 4 locales: GPS location is used on-device only to measure distance,
      never stored or sent; the map loads from OpenStreetMap, which receives the player's IP for tiles
- [x] Copy pass: `mapNote` and `simulatedHelp` no longer claim "stylised/no real map" now that a real
      map is shown (they now say "approximate demo positions"); the demo "not directions" safety banner
      is kept (still accurate — approximate positions)
- [x] MapLibre control strings (zoom, cooperative-gesture hint, attribution toggle) localised to de/nl/ar;
      checkpoint markers carry a localised `aria-label` (`"3. Marktplatz"`) instead of "Map marker"
- [ ] Reviewer-agent pass (Sonnet) on M2 + M4

**QR verification is deferred** (the chosen scope was "map + GPS first"). When picked up it becomes a new
milestone: camera permission on demand, scan matching the checkpoint code, manual fallback.

## Env vars (Phase 4)
- `NEXT_PUBLIC_MAP_STYLE_URL` — MapLibre style URL (e.g. a MapTiler style with a domain-restricted key).
  Unset → keyless OSM raster fallback. Already listed in `.env.example`.

## Log
- 2026-10-31 — Branch `phase-4-map` created off main (Phase 2 merged). Plan drafted; scope questions put
  to the user; map design mock to follow before any building.
