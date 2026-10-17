# OriginOS Bento Restructure + Site-Wide Glass Theme — Design

Date: 2026-10-17
Status: approved (user-approved directions: hand-tuned merged bento; full glass shell with editorial interior)
Follows: `docs/superpowers/specs/2026-10-13-originos-glass-design.md` (tokens, kit, motion, constraints all inherit)

## Problem

1. Homepage bento uses a uniform 4-column grid with no per-card spans or size zones. Cards stretch to their row's tallest neighbor: Writing/About/Contact render as mostly-empty tall boxes; "How I work" is squeezed into a narrow column with mid-word wrapping.
2. Every subpage is a bare `article.prose-stock` on the transparent background. The glass system (tokens, `.glass`, ambient blobs, widgets) only wraps the homepage.

## Goals

- Hand-tuned bento: deliberate spans, merged compact cards for tiny content, no empty-stretch cards, no cramped text columns.
- Site-wide OriginOS look: glass page shells with hero-style headers on all pages; index entries as glass list cards; long-form MDX stays comfortable inside one wide glass panel.
- Zero new dependencies; zero copy changes (structure/surfaces only); both themes; contrast ≥4.5:1 via existing tokens guard test; motion behind `prefers-reduced-motion`.

## Non-goals

- No new content, no copy edits, no metadata/gating/sitemap/KB changes.
- No new widget types, no assistant changes, no bento-ification of MDX detail pages.
- No token palette changes; no dependency additions.

## Section 1 — Homepage bento (≥1280px, 4-col grid)

Row plan (content preserved verbatim; structure/surfaces only):

| Row | Cards |
|---|---|
| 1 | Hero — full width (unchanged) |
| 2 | Clock (1 col, spans 2 rows — continues beside row 4) · Verified highlights (1 col) · Featured work (2 cols × 2 rows) |
| 3 | How I work (2 cols) · Research (2 cols) |
| 4 | Profile strip (3 cols, merged card) · clock's second row fills the 4th column |

Mechanics:
- Explicit `grid-row`/`grid-column` spans per card class (`widget-span`, `widget-wide`, `widget-tall`, `widget-profile` or equivalent).
- `grid-auto-rows: minmax(min-content, auto)` — cards size to content, never to a neighbor.
- Profile strip: one GlassCard containing About · Contact · Writing as three compact mini-columns (internal CSS grid); stacks to single column on mobile.
- Teaser clamps: flagship `summary` and highlight blurb paragraphs clamp to ~3 lines via line-clamp (linked detail pages hold the full text — nothing deleted, presentation only).
- Tablet (768–1279px): 2-col rules; mobile (<768px): single-column stack in sensible reading order (hero, clock, highlights, featured, principles, research, profile strip).

## Section 2 — Site-wide glass shell

- `PageHero`: compact kicker + h1 band, same visual language as home hero (mono kicker, large title); used at the top of every subpage.
- `PageShell`: wide glass article container wrapping page content (`.prose-stock` typography unchanged inside).
- Index pages (projects / research / writing): `entry-list` becomes a responsive grid of glass list cards (2-col desktop, 1-col mobile).
- Detail pages (projects / research / writing `[slug]`): single wide glass panel around existing content; explorers/tabs/citation UI unchanged.
- About / contact: PageShell + PageHero only.
- Header, footer, assistant, ambient blobs: unchanged (already themed).

## Constraints (binding, inherited from originos-glass)

- Zero new dependencies; verified-only content untouched; contrast pairs via `src/lib/__tests__/tokens.test.ts`; motion rules unchanged; `@supports` glass fallback retained.
- Verification: `npm run test; npm run typecheck; npm run lint; npm run build` green; visual pass PC 1280/1920, tablet 768, mobile 375 on home + one index + one detail, both themes; Lighthouse mobile + desktop on `/` and `/projects/aura`; keyboard focus + reduced-motion spot checks.

## Rollout

Branch `feat/bento-theme-v2` off current `main`; SDD execution; merge and deploy only after user green light.
