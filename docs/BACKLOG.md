# Backlog

Planned work, in rough order. Phase work has its own docs (`PHASE2.md`, `PHASE4.md`).

## Now
- **CI + more e2e tests** — GitHub Actions (typecheck + unit + build on every PR) and more Playwright
  coverage for the admin, map/GPS and auth flows.
- **New adventure / content** — a new adventure (or city). Concept shown first before authoring.

## Saved for later (chosen 2026-10-31)
- **Accessibility (WCAG) + CSP** — a11y audit + fixes (keyboard, screen reader, contrast, RTL) and a real
  Content-Security-Policy (will need `worker-src blob:`, `connect-src`/`img-src` for the map tile host).
- **PWA + mobile polish** — installable + offline (service worker, install prompt); Lighthouse / Core
  Web Vitals.

## Last
- **Phase 3 — Stripe purchases** — deliberately kept until the end, since the product shape may still
  change. Build cloud-ready (boots unconfigured, like the rest); needs Stripe test keys to verify live.

## Deferred within phases (documented in their phase docs)
- Per-IP rate limiting + stale-pending newsletter purge (Phase 2).
- Full content CMS for the admin (Phase 2 M3 chose the operational console).
- Keyed map tile provider + real on-location coordinates/QR codes for paid adventures (Phase 4, at hosting).
