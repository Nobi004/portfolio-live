# Aurora Glass Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site a balanced static aurora mesh backdrop in both themes and refine every glass card/button surface so `backdrop-filter` visibly refracts color — glass that reads as glass.

**Architecture:** All work is CSS in `src/app/globals.css`: (1) replace the three faint `body::before` radial washes with a 4-blob balanced aurora mesh per theme, (2) add two `--glass-*` specular tokens and apply them plus a stronger `blur(24px) saturate(1.7)` filter to the four existing `@supports` glass blocks and convert `.explorer-button` to the glass treatment. Verification is build gates + Playwright screenshot matrix + a contrast-ledger check against `src/lib/__tests__/tokens.test.ts`.

**Tech Stack:** Next.js 16.4, Tailwind v4, vanilla CSS custom properties, vitest, Playwright (via `python`), PowerShell 5.1 shell.

**Spec:** `docs/superpowers/specs/2026-10-19-aurora-glass-background-design.md`

## Global Constraints

- Zero new dependencies; no JS; no DOM/component changes; no copy edits.
- No token color changes (`--background`, `--foreground`, `--accent*` stay as-is). Only additions: `--glass-highlight`, `--glass-sheen`.
- Motion: static only — no animation introduced; no new `prefers-reduced-motion` work.
- Contrast ≥4.5:1 per `src/lib/__tests__/tokens.test.ts` — suite green after every task; hex constants may be updated only when measured effective glass tint materially shifts (spec §Verification 2).
- Every task ends with `npm run test; npm run typecheck; npm run lint; npm run build` green (31 tests).
- Before any screenshot run: **stale-`.next` guard** — kill node processes matching `next|npm` via `taskkill`, delete `.next`, rebuild, and confirm the CSS hash referenced by `out/index.html` (or served HTML) equals a filename in `.next/static/chunks/`. (Known Windows file-lock failure mode: silent `Remove-Item` failure → prerendered HTML references a chunk that 500s → unstyled page.)
- Shell is Windows PowerShell 5.1: chain `cmd1; if ($?) { cmd2 }`, never `&&`. Working dir: `D:\End to End projects\portfolio\portfolio`.
- Screenshots/scripts live in `C:\Users\User\AppData\Local\Temp\opencode\`.
- Do NOT push or deploy; the user issues `push` explicitly (deployment flow is separate).
- `AGENTS.md` and `PORTFOLIO_PLAN.md` are known-dirty; leave them out of commits. Revert `src/lib/assistant/kb-data.ts` line-ending noise with `git checkout --` if it appears.

---

### Task 1: Aurora mesh backdrop (light + dark)

**Files:**
- Modify: `src/app/globals.css:40-56` (the `body::before` / `.dark body::before` rules)

**Interfaces:**
- Consumes: `:root`/`.dark` token blocks (unchanged), existing `body::before` fixed-layer contract (`position: fixed; inset: 0; z-index: -1; pointer-events: none`).
- Produces: the ambient mesh that Tasks 2/3's glass surfaces refract. No other file changes.

- [ ] **Step 1: Replace the light-theme washes**

In `src/app/globals.css`, replace the entire existing `body::before` rule (lines 40–50) with:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(60rem 60rem at 12% 10%, color-mix(in srgb, #93c5fd 24%, transparent), transparent 70%),
    radial-gradient(55rem 55rem at 88% 16%, color-mix(in srgb, #c4b5fd 20%, transparent), transparent 70%),
    radial-gradient(62rem 62rem at 72% 78%, color-mix(in srgb, #fda4af 18%, transparent), transparent 70%),
    radial-gradient(50rem 50rem at 24% 92%, color-mix(in srgb, #a5f3fc 16%, transparent), transparent 70%);
}
```

- [ ] **Step 2: Replace the dark-theme washes**

Replace the entire `.dark body::before` rule (lines 51–56) with:

```css
.dark body::before {
  background:
    radial-gradient(60rem 60rem at 12% 8%, color-mix(in srgb, #2563eb 22%, transparent), transparent 70%),
    radial-gradient(55rem 55rem at 88% 18%, color-mix(in srgb, #7c3aed 20%, transparent), transparent 70%),
    radial-gradient(62rem 62rem at 50% 100%, color-mix(in srgb, #0f766e 16%, transparent), transparent 70%),
    radial-gradient(48rem 48rem at 76% 62%, color-mix(in srgb, #9f1239 14%, transparent), transparent 70%);
}
```

- [ ] **Step 3: Run the four gates**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: 31 tests PASS, typecheck/lint clean, build succeeds.

- [ ] **Step 4: Screenshot-verify the mesh (both themes)**

Run the stale-`.next` guard (Global Constraints), then:

```powershell
python "C:\Users\User\.config\opencode\skills\webapp-testing\scripts\with_server.py" --server "npm run start" --port 3000 -- python "C:\Users\User\AppData\Local\Temp\opencode\shot-mesh.py"
```

Create `C:\Users\User\AppData\Local\Temp\opencode\shot-mesh.py`:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ("light", "dark"):
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.goto("http://localhost:3000/", wait_until="networkidle")
        if theme == "dark":
            pg.evaluate("document.documentElement.classList.add('dark')")
            pg.wait_for_timeout(300)
        pg.screenshot(path=f"C:/Users/User/AppData/Local/Temp/opencode/mesh-{theme}-1280.png", full_page=False)
        pg.close()
    b.close()
```

Expected: mesh clearly visible in both themes (tint variation on canvas between cards), but cards/text areas still dominant — "balanced", per spec. Compare against `footer-*.png`/`home-1280.png` baselines. If blobs are invisible → raise mix % in 4-point steps; if the canvas looks busy/washed → lower them.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: balanced aurora mesh backdrop in both themes"
```

---

### Task 2: Glass card and button refinement

**Files:**
- Modify: `src/app/globals.css` — token blocks (`:root` line 5–24, `.dark` line 25–38), `.glass` block (58–69), `.footer-identity` @supports (425–431), `.site-footer a` @supports (453–459), `.ask-panel` @supports (624–629), `.explorer-button` (912–924)

**Interfaces:**
- Consumes: Task 1 mesh (the `backdrop-filter` now has color to diffuse); existing `--surface-glass`, `--border`, `--radius-lg` tokens.
- Produces: `--glass-highlight`, `--glass-sheen` custom properties (theme-scoped) used by all glass rules; Task 3 measures their effect.

- [ ] **Step 1: Add the specular tokens**

In the `:root` block (after `--space-section`/`--font-size-*` lines), add:

```css
  --glass-highlight: rgba(255, 255, 255, 0.45);
  --glass-sheen: rgba(255, 255, 255, 0.08);
```

In the `.dark` block (after `--rule`), add:

```css
  --glass-highlight: rgba(255, 255, 255, 0.08);
  --glass-sheen: rgba(255, 255, 255, 0.04);
```

- [ ] **Step 2: Refine `.glass`**

Replace the `.glass` + its `@supports` block (lines 58–69) with:

```css
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-sheen);
}
@supports (backdrop-filter: blur(1px)) {
  .glass {
    background: var(--surface-glass);
    backdrop-filter: blur(24px) saturate(1.7);
    -webkit-backdrop-filter: blur(24px) saturate(1.7);
  }
}
```

- [ ] **Step 3: Apply to `.footer-identity`**

Replace its `@supports` block (425–431) with:

```css
@supports (backdrop-filter: blur(1px)) {
  .footer-identity {
    background: var(--surface-glass);
    backdrop-filter: blur(24px) saturate(1.7);
    -webkit-backdrop-filter: blur(24px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-sheen);
  }
}
```

- [ ] **Step 4: Apply to `.site-footer a`**

Replace its `@supports` block (453–459) with:

```css
@supports (backdrop-filter: blur(1px)) {
  .site-footer a {
    background: var(--surface-glass);
    backdrop-filter: blur(24px) saturate(1.7);
    -webkit-backdrop-filter: blur(24px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-sheen);
  }
}
```

- [ ] **Step 5: Apply to `.ask-panel`**

Replace its `@supports` block (624–629) with:

```css
@supports (backdrop-filter: blur(1px)) {
  .ask-panel {
    backdrop-filter: blur(24px) saturate(1.7);
    -webkit-backdrop-filter: blur(24px) saturate(1.7);
    box-shadow: var(--shadow-soft), inset 0 1px 0 var(--glass-highlight);
  }
}
```

(Keeps `--shadow-soft`; the base rule at 612–623 stays untouched.)

- [ ] **Step 6: Convert `.explorer-button` to glass**

Replace `.explorer-button` (912–924) with:

```css
.explorer-button {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--foreground);
  font: inherit;
  font-size: 0.9375rem;
  cursor: pointer;
}
@supports (backdrop-filter: blur(1px)) {
  .explorer-button {
    background: var(--surface-glass);
    backdrop-filter: blur(24px) saturate(1.7);
    -webkit-backdrop-filter: blur(24px) saturate(1.7);
    box-shadow: inset 0 1px 0 var(--glass-highlight), inset 0 0 0 1px var(--glass-sheen);
  }
}
```

Leave `.explorer-button:hover` (926–928) and `.explorer-button[aria-pressed="true"]` (930–934) exactly as-is — pressed state stays opaque `--foreground`/`--background` (selected tabs must not go translucent).

- [ ] **Step 7: Run the four gates**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: 31 tests PASS, lint/typecheck clean, build succeeds.

- [ ] **Step 8: Screenshot-verify glass surfaces**

Run the stale-`.next` guard, then create and run `C:\Users\User\AppData\Local\Temp\opencode\shot-glass.py`:

```python
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000/"
OUT = "C:/Users/User/AppData/Local/Temp/opencode/"

with sync_playwright() as p:
    b = p.chromium.launch()
    for theme in ("light", "dark"):
        for name, w, h in (("1280", 1280, 900), ("756", 756, 1100), ("375", 375, 900)):
            pg = b.new_page(viewport={"width": w, "height": h})
            pg.goto(URL, wait_until="networkidle")
            if theme == "dark":
                pg.evaluate("document.documentElement.classList.add('dark')")
                pg.wait_for_timeout(300)
            pg.screenshot(path=f"{OUT}glass-{name}-{theme}.png")
            if name == "1280":
                pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                pg.wait_for_timeout(300)
                pg.screenshot(path=f"{OUT}glass-footer-{theme}.png")
            pg.close()
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.goto(URL + "about", wait_until="networkidle")
        if theme == "dark":
            pg.evaluate("document.documentElement.classList.add('dark')")
            pg.wait_for_timeout(300)
        pg.screenshot(path=f"{OUT}glass-about-{theme}.png")
        pg.close()
    b.close()
```

Command:

```powershell
python "C:\Users\User\.config\opencode\skills\webapp-testing\scripts\with_server.py" --server "npm run start" --port 3000 -- python "C:\Users\User\AppData\Local\Temp\opencode\shot-glass.py"
```

Expected: card interiors pick up mesh color through the blur; a visible 1px light edge along the top of cards/pills; explorer pills and footer pills read as glass; pressed/selected controls remain opaque; text still crisp in both themes at all widths.

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: glass refinement - specular edges, stronger blur/saturate, glass explorer buttons"
```

---

### Task 3: Verification pass + contrast ledger

**Files:**
- Modify (conditionally): `src/lib/__tests__/tokens.test.ts` — only if measured effective glass background deviates materially from the hex pairs on lines 26–30
- Verify: full screenshot matrix including mobile footer; run all gates

**Interfaces:**
- Consumes: Task 1 mesh + Task 2 glass surfaces (must be committed before this task).
- Produces: green final report; updated ledger hexes iff tint shifted. Deployment is NOT part of this plan (user issues `push` separately).

- [ ] **Step 1: Full gates**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: all green.

- [ ] **Step 2: Measure effective glass tint**

Create `C:\Users\User\AppData\Local\Temp\opencode\measure-glass.py`:

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
        # sample a text-free padding spot inside the first glass card
        box = pg.locator(".bento-grid > .glass").first.bounding_box()
        x = int(box["x"] + 10)
        y = int(box["y"] + 10)
        pg.screenshot(path=f"{OUT}measure-{theme}.png")
        img = Image.open(f"{OUT}measure-{theme}.png")
        r, g, bl = img.getpixel((x, y))[:3]
        print(f"{theme}: #{r:02x}{g:02x}{bl:02x}")
    b.close()
```

Run: stale-`.next` guard, then `with_server ... measure-glass.py`.
Expected output: printed hexes like `light: #f????f` / `dark: #1????f`.

- [ ] **Step 3: Reconcile the ledger**

Compare measured hexes with `tokens.test.ts` PAIRS:
- light pairs use bg `#f4f7fb`, dark pairs use bg `#14161c`.
- If a measured hex differs by a **material** amount (renders visibly tinted/darker — eyeball it: the rendered card must still look near-white in light / near the spec's dark glass tone), update the corresponding PAIRS bg hexes to the measured values.
- If immaterial, change nothing.

- [ ] **Step 4: Re-run tests**

Run: `npm run test`
Expected: green either way (updated hexes must still clear 4.5:1; if they don't, the mesh is too strong — return to Task 1 Step 1 and reduce mix percentages by 4 points, then redo Steps 2–4 of this task).

- [ ] **Step 5: Final screenshot matrix check (structure + leaks)**

Verify files exist and are non-trivial from Task 2 run, plus one interior detail page shot:

```python
# add to a one-off script: capture http://localhost:3000/projects/aura-framework
# (dark theme too) as glass-detail-{theme}.png
```

Also confirm: view-source/curl of `/projects/voice-mind` contains no `DRAFT:` content (deployment-phase smoke discipline, cheap to check now).

- [ ] **Step 6: Commit if anything changed**

```bash
git add src/lib/__tests__/tokens.test.ts
git commit -m "test: align contrast ledger with measured aurora glass tint"
```

(Only if Step 3 changed the file; otherwise skip the commit.)

- [ ] **Step 7: Report**

Summarize: gates output (actual), measured effective glass hexes (both themes), screenshot list, any tuning performed. Stop — deployment waits for the user's `push`.

---

## Self-Review

1. **Spec coverage:** backdrop mesh (Task 1) ✓; glass tokens + `.glass` (Task 2 Steps 1–2) ✓; pill/button blocks incl. `.explorer-button` conversion (Task 2 Steps 3–6) ✓; filter bump `blur(24px) saturate(1.7)` (Task 2) ✓; contrast ledger + measurement (Task 3) ✓; screenshot matrix both themes × widths + interior + footer (Tasks 1–3) ✓; no animation (nothing animated anywhere) ✓; no token color changes (only `--glass-*` additions) ✓.
2. **Placeholder scan:** every step contains concrete CSS/Python code or a literal command; no TBD/TODO; the one conditional step (Task 3 Step 3) is an explicit decision rule, not a placeholder.
3. **Type consistency:** token names `--glass-highlight` / `--glass-sheen` used identically in Task 2 Steps 1–6 and consumed in Task 3 (implicitly, via rendering); script paths consistent (`C:\Users\User\AppData\Local\Temp\opencode\`, `with_server.py` entry point).
