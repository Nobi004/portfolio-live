# OriginOS Glass Tone v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the light theme on a warm Origin OS cream/gold flowing mesh, re-tone glass in BOTH modes to the notification-center reference (near-colorless 50% veil, blur(32px), light hairline, flat), and give hero CTAs + nav buttons pill shapes with spring hover motion and an animated accent underline.

**Architecture:** Pure CSS revision inside `src/app/globals.css`: (1) warm light token block + warm elliptical mesh replacing the light `body::before` rule; (2) glass token rework (`--surface-glass` both modes, new `--glass-edge`, `--glass-highlight` tune, `--glass-sheen` deleted) applied across the five existing `@supports` glass blocks; (3) `.button`/`.site-nav-list a` visual + motion upgrades gated on `prefers-reduced-motion`. Dark backdrop and blue accents untouched. Contrast ledger `tokens.test.ts` hexes re-measured after.

**Tech Stack:** Next.js 16.4, vanilla CSS custom properties, vitest, Playwright via `python`, PowerShell 5.1.

**Spec:** `docs/superpowers/specs/2026-10-19-originos-glass-tone-v2-design.md`

## Global Constraints

- Zero new dependencies; no JS; no DOM/component changes; no copy edits.
- Blue accents unchanged both modes; dark backdrop mesh unchanged; no animation.
- Contrast ≥4.5:1 per `src/lib/__tests__/tokens.test.ts` — update PAIRS hexes to measured
  effective colors when tint shifts; suite green after any update.
- Every task ends with `npm run test; npm run typecheck; npm run lint; npm run build` green (31 tests).
- **Screenshot pre-flight (both guards, in order):**
  1. Port guard: `Get-NetTCPConnection -LocalPort 3000 -State Listen` — if a listener
     exists, `taskkill /PID <pid> /T /F` it (yesterday's stale `next start` served dead
     CSS and caused an unstyled run).
  2. Stale-`.next` guard: kill node processes, delete `.next`, rebuild, confirm the CSS
     filename referenced by served HTML equals a file in `.next/static/chunks/`.
  3. After EVERY `with_server.py` run: re-check port 3000 and kill the leftover child
     (its stop is unreliable — observed after every run this session).
- Screenshots/scripts live in `C:\Users\User\AppData\Local\Temp\opencode\`.
- PowerShell: chain `cmd1; if ($?) { cmd2 }`, never `&&`. Workdir: `D:\End to End projects\portfolio\portfolio`.
- Do NOT push/deploy — user says `push` explicitly. Leave `AGENTS.md`/`PORTFOLIO_PLAN.md`
  dirty; revert `src/lib/assistant/kb-data.ts` noise after builds.

---

### Task 1: Warm light canvas + flowing gold mesh

**Files:**
- Modify: `src/app/globals.css` — `:root` block (lines 5–27 incl. new glass tokens from
  Task 2? No — Task 1 touches only: `--background`, `--surface`, `--surface-raised`,
  `--shadow-soft`, `--border`, `--rule` in `:root`, plus the light `body::before` rule).

**Interfaces:**
- Consumes: unchanged `:root` geometry/radius tokens; `.dark` block untouched this task.
- Produces: warm canvas + mesh that Task 2's translucent glass will transmit.

- [ ] **Step 1: Warm the light canvas tokens**

In the `:root` block replace these lines (keep `--surface-glass`, `--foreground`,
`--accent*`, radii, spacing EXACTLY as-is — Task 2 owns them):

```css
  --background: #f3ebdc;
  --surface: rgba(252, 249, 243, 0.72);
  --surface-raised: rgba(255, 253, 249, 0.9);
  --border: rgba(74, 55, 30, 0.12);
  --shadow-soft: 0 8px 32px rgba(74, 50, 20, 0.1);
  --rule: rgba(74, 55, 30, 0.12);
```

- [ ] **Step 2: Replace the light mesh with warm flowing ellipses**

Replace ONLY the light `body::before` rule (`.dark body::before` stays exactly as-is):

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(70rem 42rem at 15% 6%, color-mix(in srgb, #fffdf7 60%, transparent), transparent 70%),
    radial-gradient(50rem 30rem at 55% 15%, color-mix(in srgb, #f9edd4 55%, transparent), transparent 75%),
    radial-gradient(60rem 55rem at 92% 25%, color-mix(in srgb, #e9c98c 50%, transparent), transparent 70%),
    radial-gradient(75rem 60rem at 5% 85%, color-mix(in srgb, #d2a24c 40%, transparent), transparent 72%),
    radial-gradient(45rem 35rem at 45% 100%, color-mix(in srgb, #e0b978 35%, transparent), transparent 70%),
    radial-gradient(55rem 45rem at 95% 95%, color-mix(in srgb, #8a5a2b 28%, transparent), transparent 70%);
}
```

- [ ] **Step 3: Run the four gates**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: 31 tests PASS (tokens.test still uses old hexes — it must still pass because
no ink/fg pairs were weakened; canvas moved slightly darker/more saturated which
*increases* dark-ink contrast), lint/typecheck/build clean.

- [ ] **Step 4: Screenshot-verify warm mesh (light only)**

Port guard → stale-`.next` guard → run existing `shot-mesh.py` (captures light+dark
1280 home) via `with_server.py` → kill leftover port-3000 child.

```powershell
python "C:\Users\User\.config\opencode\skills\webapp-testing\scripts\with_server.py" --server "npm run start" --port 3000 -- python "C:\Users\User\AppData\Local\Temp\opencode\shot-mesh.py"
```

Expected light: warm cream canvas with champagne/gold/amber flow, clearly warm vs the
old blue-grey baseline (compare `mesh-light-1280.png` history), balanced — text still
dominant, bronze confined to bottom-right corner. Dark: identical to shipped.
If too yellow/brown-washed → lower amber/bronze mixes 4–6 points; if flat → raise
champagne/gold.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: warm Origin OS light canvas and flowing gold mesh"
```

---

### Task 2: Glass tone — both modes (veil, blur 32, light hairline, flat)

**Files:**
- Modify: `src/app/globals.css` — `:root` + `.dark` token blocks, `.glass` + `@supports`
  (near top), `.footer-identity` @supports, `.site-footer a` @supports, `.ask-panel`
  @supports, `.explorer-button` @supports.

**Interfaces:**
- Consumes: Task 1 warm canvas (its color is what the light veil transmits).
- Produces: `--glass-edge` token + `--surface-glass` values that Task 4 measures for
  the contrast ledger. `--glass-sheen` ceases to exist anywhere.

- [ ] **Step 1: Rework glass tokens in `:root`**

Replace/insert in `:root`:

```css
  --surface-glass: rgba(250, 250, 251, 0.5);
  --glass-edge: rgba(255, 255, 255, 0.35);
  --glass-highlight: rgba(255, 255, 255, 0.3);
```

and DELETE the line `--glass-sheen: rgba(255, 255, 255, 0.08);`.

- [ ] **Step 2: Rework glass tokens in `.dark`**

```css
  --surface-glass: rgba(30, 30, 34, 0.5);
  --glass-edge: rgba(255, 255, 255, 0.14);
  --glass-highlight: rgba(255, 255, 255, 0.08);
```

and DELETE `--glass-sheen: rgba(255, 255, 255, 0.04);`. (`--background`, `--surface*`
dark, `--border`, `--shadow-soft` dark unchanged.)

- [ ] **Step 3: `.glass` block**

```css
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
}
@supports (backdrop-filter: blur(1px)) {
  .glass {
    background: var(--surface-glass);
    border-color: var(--glass-edge);
    backdrop-filter: blur(32px) saturate(1.7);
    -webkit-backdrop-filter: blur(32px) saturate(1.7);
  }
}
```

- [ ] **Step 4: `.footer-identity` @supports**

```css
@supports (backdrop-filter: blur(1px)) {
  .footer-identity {
    background: var(--surface-glass);
    border-color: var(--glass-edge);
    backdrop-filter: blur(32px) saturate(1.7);
    -webkit-backdrop-filter: blur(32px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight);
  }
}
```

- [ ] **Step 5: `.site-footer a` @supports**

```css
@supports (backdrop-filter: blur(1px)) {
  .site-footer a {
    background: var(--surface-glass);
    border-color: var(--glass-edge);
    backdrop-filter: blur(32px) saturate(1.7);
    -webkit-backdrop-filter: blur(32px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight);
  }
}
```

(Hover `border-color: var(--accent)` in `.site-footer a:hover` still wins — blue accent
on hover, as approved. Keep `.explorer-button:hover`/pressed rules untouched.)

- [ ] **Step 6: `.ask-panel` @supports — flat like the reference**

```css
@supports (backdrop-filter: blur(1px)) {
  .ask-panel {
    border-color: var(--glass-edge);
    backdrop-filter: blur(32px) saturate(1.7);
    -webkit-backdrop-filter: blur(32px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight);
  }
}
```

(Base `.ask-panel` rule keeps `box-shadow: var(--shadow-soft);` — the `@supports`
block above overrides it when backdrop-filter exists; no-`@supports` browsers keep the
shadow. Do not edit the base rule.)

- [ ] **Step 7: `.explorer-button` @supports**

```css
@supports (backdrop-filter: blur(1px)) {
  .explorer-button {
    background: var(--surface-glass);
    border-color: var(--glass-edge);
    backdrop-filter: blur(32px) saturate(1.7);
    -webkit-backdrop-filter: blur(32px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight);
  }
}
```

- [ ] **Step 8: Verify no `--glass-sheen` remains**

Run: `Select-String -Path src\app\globals.css -Pattern "glass-sheen"`
Expected: no matches.

- [ ] **Step 9: Run the four gates**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: green (ledger hexes are Task 4's job; current pairs must still pass — glass
veil is lighter/warmer, contrast moves in safe direction on cream, re-verified in Task 4).

- [ ] **Step 10: Screenshot matrix (both themes)**

Port guard → stale-`.next` guard → run `shot-glass.py` via `with_server.py` → kill
leftover port-3000 child.

Expected, light: cards visibly transmit the gold mesh (color bleeds through),
light hairline edges, flat cards, blue nav underline retained, footer pills inherit tone.
Expected, dark: backdrop unchanged; glass now veil-style (color bleed, white hairline,
flat). At 1280 scroll: footer pills + identity capsule match. Mobile 375: no layout shift.

- [ ] **Step 11: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: Origin OS glass tone - veil, heavy blur, light hairline, flat"
```

---

### Task 3: Hero CTA + nav button visuals and motion

**Files:**
- Modify: `src/app/globals.css` — `.site-nav-list a` rules (~165–183), `.button` rules
  (~250–274), shared transition block (~811–821).

**Interfaces:**
- Consumes: `--accent`, `--foreground`, `--surface-glass`, `--border` tokens (all set
  by Tasks 1–2); the existing reduced-motion global (line ~553) which already forces
  `transition-duration: 0.01ms` under `reduce`.
- Produces: nothing other tasks depend on; verified visually + by keyboard focus in
  this task and re-screenshotted in Task 4.

- [ ] **Step 1: Nav links — animated accent underline**

Replace `.site-nav-list a` (165–172) with:

```css
.site-nav-list a {
  position: relative;
  color: var(--secondary);
  text-decoration: none;
  padding-block: 0.5rem;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

Replace `.site-nav-list a:hover` + `[aria-current="page"]` rules (174–183) with:

```css
.site-nav-list a:hover {
  color: var(--foreground);
}

.site-nav-list a::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 9px;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 200ms ease-out;
}

.site-nav-list a:hover::after,
.site-nav-list a:focus-visible::after,
.site-nav-list a[aria-current="page"]::after {
  transform: scaleX(1);
}

.site-nav-list a[aria-current="page"] {
  color: var(--foreground);
}
```

(Replaces the static `text-decoration` current-page marker with the same accent bar,
held at full scale.)

- [ ] **Step 2: `.button` — pill shape + richer transition**

Replace `.button` (250–260) with:

```css
.button {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.625rem 1.25rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--foreground);
  text-decoration: none;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 200ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

Replace `.button:hover` / `.button-primary` / `.button-primary:hover` (262–274) with:

```css
.button:hover {
  border-color: var(--accent);
}

.button:not(.button-primary):hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

.button-primary {
  background: var(--foreground);
  color: var(--background);
  border-color: var(--foreground);
}

.button-primary:hover {
  border-color: var(--foreground);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--accent) 30%, transparent);
}
```

(Veil fill on hover realized as an 8%-accent tint — a pure `--surface-glass` veil is
invisible on top of the already-glass hero card.)

- [ ] **Step 3: Shared transition block + focus ring + motion safety**

Replace the shared block (811–815) with:

```css
.button,
.segmented-tab,
.ask-launcher {
  transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 150ms ease, background-color 150ms ease, box-shadow 200ms ease;
}
```

Keep `.button:active` scale rule (817–821) as-is. Immediately after it, add:

```css
.button:focus-visible,
.site-nav-list a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .button:hover {
    transform: translateY(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .button:hover,
  .button:active {
    transform: none;
  }
}
```

- [ ] **Step 4: Run the four gates**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: green.

- [ ] **Step 5: Screenshot + keyboard verification**

Port guard → stale-`.next` guard → capture light+dark 1280 home viewport (nav + hero
visible) and one shot with `Tab` focus on the first CTA (`page.keyboard.press("Tab")`
×N until `.button-primary` focused, then screenshot) — script it in
`shot-buttons.py`. Kill leftover port-3000 child after.

Expected: pill-shaped CTAs, hover state shows lift+shadow (drive with
`locator(".button-primary").hover()` before one shot), nav current-page underline is
the accent bar, focus ring visible, both themes.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: pill hero CTAs, animated nav underline, spring hover motion"
```

---

### Task 4: Contrast ledger re-measure + final verification

**Files:**
- Modify: `src/lib/__tests__/tokens.test.ts` — PAIRS hex updates per measurements
- Verify: full gates + screenshot matrix + draft check

**Interfaces:**
- Consumes: Task 1 canvas/mesh + Task 2 glass (must be committed first).
- Produces: green final report; deployment NOT included (user says `push`).

- [ ] **Step 1: Measure effective colors**

Create `C:\Users\User\AppData\Local\Temp\opencode\measure-v2.py`:

```python
from PIL import Image
from playwright.sync_api import sync_playwright

OUT = "C:/Users/User/AppData/Local/Temp/opencode/"

with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ("light", "dark"):
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.goto("http://localhost:3000/", wait_until="networkidle")
        if theme == "dark":
            pg.evaluate("document.documentElement.classList.add('dark')")
            pg.wait_for_timeout(300)
        card = pg.locator(".bento-grid > .glass").first.bounding_box()
        path = f"{OUT}measure2-{theme}.png"
        pg.screenshot(path=path)
        img = Image.open(path)
        # glass interior (padding zone, top-left of first card)
        g = img.getpixel((int(card["x"] + 10), int(card["y"] + 10)))
        # bare canvas (gutter left of the grid)
        c = img.getpixel((30, 450))
        print(f"{theme} glass: #{g[0]:02x}{g[1]:02x}{g[2]:02x}  canvas: #{c[0]:02x}{c[1]:02x}{c[2]:02x}")
        pg.close()
    b.close()
```

Port guard → stale-`.next` guard → run under `with_server.py` → kill leftover.
Expected: 4 hexes printed (light glass, light canvas, dark glass, dark canvas).

- [ ] **Step 2: Update the ledger pairs**

In `tokens.test.ts` PAIRS, update the background hex of every pair whose effective
surface changed (evaluate against measurements, not guesses):

- Light canvas pairs (`"light fg" #fafafa`, `"light secondary" #fafafa`,
  `"light accent" #fafafa`) → measured **light canvas** hex.
- Light raised pairs (`"light raised-on-canvas" #ffffff`) → measured surface-raised:
  sample `img.getpixel` of a raised element if in doubt; approximation
  `#fffdf9` is acceptable only if measured within a hair.
- Light glass pairs (`"light glass ink" #f4f7fb`, `"light accent" #f4f7fb`,
  `"light violet ink" #f4f7fb`) → measured **light glass** hex.
- Dark glass pairs (`"dark glass ink" #14161c`, `"dark accent" #14161c`) → measured
  **dark glass** hex.
- Dark canvas/raised pairs: unchanged (backdrop untouched; `--surface` dark untouched).

Every updated pair must still be ≥4.5:1 (near-black on cream and light-on-dark both
clear by a wide margin; verify, don't assume).

- [ ] **Step 3: Re-run tests**

Run: `npm run test`
Expected: 31 PASS. If any pair fails → the mesh is too dark/tinted at that point:
reduce offending blob mixes (Task 1 Step 2) and repeat Tasks 1–3.

- [ ] **Step 4: Final visual + leak checks**

- Screenshot set exists for home/about/footer × both themes × {1280, 756, 375}.
- Playwright or curl: `https://`-less localhost `/projects/voice-mind` contains no `DRAFT:`.

- [ ] **Step 5: Commit ledger (only if changed)**

```bash
git add src/lib/__tests__/tokens.test.ts
git commit -m "test: align contrast ledger with warm canvas and veil glass"
```

- [ ] **Step 6: Full gates + report**

Run the four gates one final time; report actual outputs, the 4 measured hexes,
screenshot list, and tuning performed. Stop — deployment awaits the user's `push`.

---

## Self-Review

1. **Spec coverage:** light canvas+mesh (Task 1) ✓; warm light surfaces (Task 1 Step 1) ✓;
   glass veil both modes + `--glass-edge` + `--glass-sheen` removal + blur 32 + flat ask
   panel (Task 2) ✓; hero CTAs pill/lift/shadow/focus + nav animated underline +
   reduced-motion behavior (Task 3) ✓; accents/dark-backdrop untouched (no task edits
   them; Task 1 Step 4 + Task 2 Step 10 + Task 3 Step 5 verify) ✓; ledger re-measure both
   modes (Task 4) ✓; both guards in Global Constraints and each screenshot task ✓;
   static/micro-interaction-only motion (nothing added beyond Task 3) ✓.
2. **Placeholder scan:** every step has literal CSS/hex/command; Task 4 Step 2's
   "sample raised element if in doubt" includes the acceptable fallback hex and the
   measurement method — decision rule, not a placeholder.
3. **Token consistency:** `--glass-edge` / `--glass-highlight` defined in both themes
   before first use (Task 2 Steps 1–2 precede 3–7); `--glass-sheen` deleted in Steps 1–2
   and grepped in Step 8; `blur(32px) saturate(1.7)` identical in all five blocks.
