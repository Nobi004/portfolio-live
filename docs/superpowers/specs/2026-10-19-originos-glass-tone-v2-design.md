# OriginOS Glass Tone v2 — Design Spec (amendment)

Date: 2026-10-19
Status: approved (design approved in chat; user said "approve")
Path: bounded revision of `2026-10-19-aurora-glass-background-design.md`

## Problem

The shipped light theme (cool blue-grey canvas + cool-white glass) doesn't match the
warm Origin OS look; and the glass tone in neither mode matches the reference
Origin OS notification-center cards (near-colorless veil, heavy blur, light hairline
edge, flat — no dark border, no drop shadow). The dark *backdrop* is approved and stays.

## Decisions (user-approved)

1. **Light backdrop:** warm Origin OS recreation, **CSS-only** (no image assets):
   cream base + flowing champagne/gold/amber/bronze elliptical mesh.
2. **Glass tone: both modes** follow the Origin OS notification reference:
   near-colorless translucent veil, heavy blur (32px), light hairline border,
   flat (no drop shadow), subtle top specular.
3. **Accents:** blue stays in both modes (authentic Origin OS system accent).
4. **Dark backdrop:** unchanged from shipped version.

## Design

### 1. Light canvas + mesh (`:root` tokens, `body::before` light rule)

- `--background`: `#eef2f7` → warm cream `#f3ebdc`.
- Light `body::before`: replace the 4 cool blobs with 6 large **elliptical** warm
  gradients (tuning starting points, screenshots decide final mixes):
  - champagne highlight `#fffdf7` ~60% @ top-left sweep
  - cream flow `#f9edd4` ~55% @ top-center
  - soft gold `#e9c98c` ~50% @ right
  - amber `#d2a24c` ~40% @ lower-left
  - muted amber `#e0b978` ~35% @ bottom-center
  - bronze shadow `#8a5a2b` ~28% @ bottom-right corner (kept modest — corner only)
- Light `--border`/`--rule` warm-shift: `rgba(26,29,33,0.1)` → `rgba(74,55,30,0.12)`.
- Light `--shadow-soft`: bluish → warm `rgba(74,50,20,0.10)` tint.

### 2. Light surface tone (warm, still opaque-path safe)

- `--surface`: `rgba(255,255,255,0.72)` → `rgba(252,249,243,0.72)`.
- `--surface-raised`: `rgba(255,255,255,0.9)` → `rgba(255,253,249,0.9)`.
- `--surface-glass` → the new near-colorless veil (next section).

### 3. Glass tone (BOTH modes — notification-center reference)

Tokens:
- `:root --surface-glass`: `rgba(255,255,255,0.6)` → **`rgba(250,250,251,0.5)`**.
- `.dark --surface-glass`: `rgba(22,25,33,0.55)` → **`rgba(30,30,34,0.5)`**.
- New `:root --glass-edge: rgba(255,255,255,0.35)`; `.dark --glass-edge: rgba(255,255,255,0.14)`.
- `--glass-highlight`: light reduced `0.45` → `0.30`; dark stays `0.08`.
- `--glass-sheen` token **removed** (the inset ring is replaced by `--glass-edge`).

Applied in every `@supports (backdrop-filter)` glass block (`.glass`,
`.footer-identity`, `.site-footer a`, `.explorer-button`, `.ask-panel`):
- `backdrop-filter: blur(32px) saturate(1.7)` (was 24px).
- `border-color: var(--glass-edge)` — light hairline instead of dark `--border`.
- Box shadow → `inset 0 1px 0 var(--glass-highlight)` only (sheen ring dropped);
  `.ask-panel` also drops `var(--shadow-soft)` (reference cards are flat).

Non-glass raised surfaces (`.explorer-panel`, `.diagram-scroll`, etc.) keep
`--surface-raised` — they are sheets, not glass.

### 4. Hero CTAs + nav buttons (visual + motion — approved in chat)

- **Hero CTAs** (`.button`): 8px → pill radius (999px); richer transition
  (border/background 150ms + `transform`/`box-shadow` 200ms
  `cubic-bezier(0.2, 0.8, 0.2, 1)`); hover = lift `translateY(-2px)` (under
  `prefers-reduced-motion: no-preference` only) + primary gets accent-tinted soft
  shadow (30% accent), secondary gets an 8%-accent veil tint (pure glass veil would be
  invisible on the glass hero card); press keeps `scale(0.97)`; `:focus-visible` =
  2px accent outline, 2px offset.
- **Nav links** (Home/Projects/Research/Writing/About/Contact): hover color shift stays
  + a 2px accent underline that **grows from the left** (`::after`, `scaleX 0→1`,
  200ms ease-out); the current page's static `text-decoration` underline is replaced by
  the same bar held at `scaleX(1)`; focus-visible underline + ring.
- **Reduced motion:** under `reduce`, `.button:hover/:active` get `transform: none`
  (color/border feedback only); nav underline state changes are instant via the
  existing global `0.01ms` rule — no animation runs.

### 5. What does NOT change

- Dark backdrop mesh. Blue accents both modes. Copy, layout, structure, deps, motion
  budget (static site; only micro-interactions above).
- Segment tabs, ask launcher behavior (their shared transition gets the spring easing,
  their states unchanged).
- No animation (static) — no new reduced-motion work.

## Verification / acceptance

1. `npm run test; npm run typecheck; npm run lint; npm run build` green.
2. Contrast ledger `tokens.test.ts`: re-measure **light canvas, light glass, dark glass**
   effective hexes (glass alpha changed in both modes); update affected PAIRS hexes;
   suite green (≥4.5:1). Rules: dark ink on cream ≫; dark glass pairs re-check.
3. Screenshots: home + about + footer, both themes × {1280, 756, 375}: light reads
   warm/OriginOS; glass in BOTH modes visibly transmits backdrop (color bleed through
   cards), light hairline edges, flat cards; content still dominant/balanced.
   Plus: hero CTA hover shot (lift+shadow), nav underline states, keyboard focus ring
   on first CTA; reduced-motion mode = no lift/scale.
4. Guards: clean rebuild (kill node → delete `.next` → build → HTML-CSS hash match)
   AND port-3000 stale-listener check before any screenshot run.
5. Dark backdrop must look identical to shipped (only its glass treatment changes).

## Files touched

- `src/app/globals.css` — `:root`/`.dark` token blocks, light `body::before`,
  five `@supports` glass blocks.
- `src/lib/__tests__/tokens.test.ts` — PAIRS hex updates per measurement.
