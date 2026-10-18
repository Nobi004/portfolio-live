# Aurora Glass Background — Design Spec

Date: 2026-10-19
Status: approved approach (Approach A), pending spec review
Path: architectural

## Problem

The site's glass cards, pills, and buttons run `backdrop-filter: blur(20px) saturate(1.4)`
over an essentially flat canvas (`--background` plus three radial washes at 8–12% opacity).
Blur and saturation have nothing to diffuse, so glass surfaces read as translucent gray
cards rather than glass. The user wants the background adjusted — and the glass cards and
buttons adjusted with it — so the UI actually feels like glass.

## Decisions (user-approved)

- **Style:** Aurora mesh — large soft color blobs, organic glassmorphism look.
- **Intensity:** Balanced — colors clearly visible but the page stays calm; text-heavy
  interior pages remain readable.
- **Scope:** Site-wide (every route, both themes), implemented once in global CSS.
- **Motion:** Static — no animation, no new motion to gate.
- **Approach:** A — layered radial-gradient mesh on `body::before` (existing fixed
  pseudo-element) plus a small glass-surface refinement. Pure CSS, zero dependencies,
  zero JS, no DOM changes.

## Design

### 1. Ambient backdrop (`body::before`, global CSS)

Replace the three faint washes with a balanced 4–5 blob mesh per theme. Blobs are large
(40–70rem), use the brand hue families, and are composed with `color-mix(in srgb, <hue> N%, transparent)`
over the flat `--background` base. The pseudo-element keeps `position: fixed; inset: 0;
z-index: -1; pointer-events: none;` so the mesh stays put while content scrolls.

**Light theme** (base `#eef2f7`) — hues drawn from the existing palette
(`--accent` blue, `--accent-violet`, `--accent-coral`), mix levels raised from the current
8% into the balanced range (~16–26%):

| Blob | Hue (srgb) | Mix | Position / size (approx) |
|------|-----------|-----|--------------------------|
| blue wash | `#93c5fd` | ~24% | `12% 10%`, ~60rem |
| violet wash | `#c4b5fd` | ~20% | `88% 16%`, ~55rem |
| coral wash | `#fda4af` | ~18% | `72% 78%`, ~62rem |
| cyan wash | `#a5f3fc` | ~16% | `24% 92%`, ~50rem |

Exact numbers are starting points; tune against screenshots (balanced = visible tint on
canvas, no wash competing with content).

**Dark theme** (base `#0c0e13`) — deeper jewel versions, ~18–24%:

| Blob | Hue (srgb) | Mix | Position / size (approx) |
|------|-----------|-----|--------------------------|
| blue | `#2563eb` | ~22% | `12% 8%`, ~60rem |
| violet | `#7c3aed` | ~20% | `88% 18%`, ~55rem |
| teal | `#0f766e` | ~16% | `50% 100%`, ~62rem |
| rose | `#9f1239` | ~14% | `76% 62%`, ~48rem |

Safeguard: the dark mesh must not lift the canvas enough to affect text contrast —
`--foreground #eef1f6` on the darkest point of the mesh still clears 4.5:1 (verify, see
Verification).

### 2. Glass card refinement (`.glass`)

- `backdrop-filter: blur(20px) saturate(1.4)` → `blur(24px) saturate(1.7)` inside the
  existing `@supports (backdrop-filter)` blocks (both `.glass` and any sibling blocks
  that share the same filter — keep them consistent).
- Add a **specular edge**: 1px inset top highlight so cards catch light like glass,
  expressed as two new theme tokens used only by glass rules:
  - `:root { --glass-highlight: rgba(255, 255, 255, 0.45); --glass-sheen: rgba(255, 255, 255, 0.08); }`
  - `.dark { --glass-highlight: rgba(255, 255, 255, 0.08); --glass-sheen: rgba(255, 255, 255, 0.04); }`
  - Applied as `box-shadow: inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-sheen);`
- Fallback path (no `backdrop-filter`) keeps today's opaque `var(--surface)` behavior —
  the highlight tokens are harmless there and may be applied unconditionally or gated in
  the same `@supports` block; implementation detail, either is acceptable.

### 3. Buttons / pills

The existing glass pill blocks (`.explorer-button`, footer `.site-footer a`, and the
other `@supports` glass blocks around lines 425/455/624) get the same treatment: the
shared filter bump and the same inset specular shadow, so buttons read as glass next to
cards. No geometry changes (44px targets, `999px` radius, hover accent border,
`scale(0.97)` press all stay).

### 4. What does NOT change

- No token color changes (`--background`, `--foreground`, `--accent*` all stay).
- No copy, layout, grid, or component-structure changes.
- No new dependencies, no JS, no DOM additions.
- `body { background: var(--background) }` stays — it is the base under the mesh.
- No animation (user chose static) — therefore no new `prefers-reduced-motion` work.

## Error handling / fallbacks

- Browsers without `backdrop-filter`: today's opaque `--surface` cards over the new
  mesh — visually fine, unchanged logic.
- The mesh is decoration only (`z-index: -1`, `pointer-events: none`); it can never
  interfere with interaction or reading order.

## Verification (acceptance criteria)

1. `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` all green
   (31 tests).
2. Contrast: `src/lib/__tests__/tokens.test.ts` must pass after the run (it is the
   project's contrast ledger). Its glass pairs approximate the *effective* glass
   background (`#f4f7fb` light, `#14161c` dark) — after implementation,
   screenshot-measure the effective tint behind glass in both themes; if the measured
   effective color deviates materially (visibly darker/tinted), update the test's hex to
   the measured value so the ledger tracks reality (test hex change is expected iff the
   tint shifts, and the suite must be green after any such update).
3. Screenshots — both themes × {1280, 756, 375} on home, plus at least one interior page
   (about or a project detail) and the footer: mesh visible and balanced, glass cards and
   pills show color diffraction and a visible top specular edge, text clearly readable.
4. Clean rebuild before screenshots (kill node processes, delete `.next`, rebuild,
   confirm HTML's CSS hash matches `.next/static/chunks/*.css` name) — stale-CSS
   failure mode is known and must not recur.
5. Performance: no layout shift, no new network requests (gradients are inline CSS);
   quick Lighthouse spot-check on home optional but report actual numbers if run.
6. Draft-leak smoke check on `/projects/voice-mind` after deploy (deployment phases).

## Files touched

- `src/app/globals.css` — mesh (`body::before` both themes), `.glass` + pill
  `@supports` blocks, two new `--glass-*` tokens.
- `src/lib/__tests__/tokens.test.ts` — only if measured effective glass background
  deviates (update hex constants).
- `docs/superpowers/specs/2026-10-19-aurora-glass-background-design.md` (this file) +
  implementation plan doc.
