# OriginOS Glass Interactive Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's visual language as a light-first OriginOS-style glass system with a widget home, clickable explorers, and fluid motion — zero new dependencies.

**Architecture:** CSS-token foundation (Tailwind v4 `@theme inline` + custom variant dark) extended with frosted-glass utilities; small focused React components (kit, widgets, explorers) following existing client/server patterns; content and loaders untouched.

**Tech Stack:** Next.js 16 App Router + TypeScript + Tailwind v4 + inline SVG + vitest. No new packages.

**Spec:** `docs/superpowers/specs/2026-10-13-originos-glass-design.md` (spec travels with plan; executors read both).

## Global Constraints

- Zero new dependencies (no animation libraries, no component kits, no test runners beyond installed vitest).
- Both themes fully specified; every new color pair re-measured ≥4.5:1 via the tokens guard test.
- Verified-only content: no new copy claims, no invented metrics/dates/capabilities; DRAFT markers and publication gating untouched.
- Motion: hero orchestration + 150ms action feedback + one-shot entrances only; everything behind `prefers-reduced-motion`; no scroll-jacking, parallax, or autoplay.
- Publication gating, assistant API/behavior, SEO/metadata, sitemap, analytics: untouched except where a task explicitly says otherwise.
- Every task ends with `npm run test`, `typecheck`, `lint`, `build` green; each task commits separately.
- Branch: fresh `feat/originos-glass` off `main`. Never touch `main` directly.

---

## File Structure

- `src/app/globals.css` — all new tokens, glass utilities, ambient background, component styles, motion. (Grows; stays organized in labeled sections.)
- `src/lib/__tests__/tokens.test.ts` — extend PAIRS with new light/dark glass pairs (modify).
- `src/components/providers/theme-provider.tsx` — flip `defaultTheme` to `"light"` (one-line modify).
- `src/components/ui/glass-card.tsx` — new: `GlassCard({ className?, children })` section/article wrapper.
- `src/components/ui/chip.tsx` — new: `Chip({ children })` status pill span.
- `src/components/ui/segmented-tabs.tsx` — new: client tab bar (buttons + ArrowLeft/Right/Home/End).
- `src/components/ui/disclosure.tsx` — new: styled native details/summary wrapper.
- `src/components/widgets/clock-widget.tsx` — new: client-only Dhaka time/date display.
- `src/app/page.tsx` — restructure into bento widget grid (modify, copy unchanged).
- `src/components/explorers/aura-layers.tsx` — new: clickable 5-layer explorer.
- `src/components/explorers/careeros-stepper.tsx` — new: 8-stage stepper with hash sync.
- `src/components/content/case-tabs.tsx` — new: anchor-link tab nav (`tabs: {id,label}[]`).
- `src/content/projects/{aura,careeros}.mdx` — wrap `##` sections in `<section id>` + insert `<CaseTabs>` (structure only, copy unchanged).
- `src/app/template.tsx` — new: route-transition wrapper.
- Assistant styles — restyle existing `.ask-*` classes in `globals.css` (modify only, no component changes).

### Task 1: Theme foundation

**Files:**
- Modify: `src/app/globals.css`, `src/lib/__tests__/tokens.test.ts`, `src/components/providers/theme-provider.tsx`
- Test: `src/lib/__tests__/tokens.test.ts` (extended pairs)

**Interfaces:**
- Consumes: existing 6-token palette + Task-1-style guard pattern.
- Produces: `--surface-glass-*`, `--ink-*`, `--accent-*`, ambient background, `.glass` utility consumed by Tasks 2–6.

- [ ] **Step 1: Extend the guard test first (RED)**

Add to `PAIRS` in `src/lib/__tests__/tokens.test.ts`:

```ts
["light glass ink", "#1a1d21", "#f4f7fb"],
["light accent", "#0b5fff", "#f4f7fb"],
["light violet ink", "#5b21b6", "#f4f7fb"],
["dark glass ink", "#eef1f6", "#14161c"],
["dark accent", "#7dd3fc", "#14161c"],
```

Run: `npx vitest run src/lib/__tests__/tokens.test.ts`
Expected: PASS (guard pattern — values are the assertion; verify each pair below by hand computation before committing).

- [ ] **Step 2: Write the light-first tokens + ambient background**

Replace the `:root` / `.dark` blocks (keep `--background`, `--foreground`, `--surface`, `--secondary`, `--accent`, `--border` names so all existing usages keep working):

```css
:root {
  --background: #eef2f7;
  --foreground: #1a1d21;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-raised: rgba(255, 255, 255, 0.9);
  --surface-glass: rgba(255, 255, 255, 0.6);
  --secondary: #4b5563;
  --accent: #0b5fff;
  --accent-violet: #5b21b6;
  --accent-coral: #e11d48;
  --border: rgba(26, 29, 33, 0.1);
  --shadow-soft: 0 8px 32px rgba(27, 38, 59, 0.1);
  --radius-lg: 24px;
  --radius-md: 16px;
}
.dark {
  --background: #0c0e13;
  --foreground: #eef1f6;
  --surface: rgba(22, 25, 33, 0.72);
  --surface-raised: rgba(28, 32, 42, 0.9);
  --surface-glass: rgba(22, 25, 33, 0.55);
  --secondary: #aab2c0;
  --accent: #7dd3fc;
  --accent-violet: #c4b5fd;
  --accent-coral: #fda4af;
  --border: rgba(238, 241, 246, 0.12);
  --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.35);
}
```

Ambient wash (light) on `body::before`: three `radial-gradient` blobs (pale blue `#dbeafe`, peach `#ffedd5`, mint `#d1fae5`, each ≤8% alpha via color-mix), `position: fixed; inset: 0; z-index: -1; pointer-events: none`. Dark: same technique at 10–14% alpha (`#1e3a5f`, `#4c1d95`, `#134e4a` tints).

Glass utility with fallback:

```css
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
@supports (backdrop-filter: blur(1px)) {
  .glass {
    background: var(--surface-glass);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
  }
}
```

- [ ] **Step 3: Flip default theme**

In `src/components/providers/theme-provider.tsx`, change `defaultTheme="dark"` to `defaultTheme="light"`. Keep `attribute="class"`, `enableSystem={false}` unchanged. (Stored user preferences in localStorage are unaffected.)

- [ ] **Step 4: Run full gate**

Run: `npm run test; if ($?) { npm run typecheck }; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/lib/__tests__/tokens.test.ts src/components/providers/theme-provider.tsx
git commit -m "feat: light-first OriginOS glass theme foundation"
```

### Task 2: Glass component kit

**Files:**
- Create: `src/components/ui/glass-card.tsx`, `src/components/ui/chip.tsx`, `src/components/ui/segmented-tabs.tsx`, `src/components/ui/disclosure.tsx`
- Modify: `src/app/globals.css` (kit styles only)
- Test: typecheck + lint + build + dev DOM (kitchen-sink check via a temp route, deleted before commit)

**Interfaces:**
- Consumes: Task 1 tokens/utilities.
- Produces: `GlassCard`, `Chip`, `SegmentedTabs`, `Disclosure` consumed by Tasks 3–4 and assistant restyle.

- [ ] **Step 1: Write the four components**

```tsx
// src/components/ui/glass-card.tsx
import type { ReactNode } from "react";

export function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={`glass ${className}`.trim()}>{children}</section>;
}
```

```tsx
// src/components/ui/chip.tsx
import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>;
}
```

```tsx
// src/components/ui/segmented-tabs.tsx
"use client";

import { useRef } from "react";

export interface TabDef {
  id: string;
  label: string;
  href: string;
}

export function SegmentedTabs({ tabs }: { tabs: TabDef[] }) {
  const refs = useRef<Array<HTMLAnchorElement | null>>([]);
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) {
      e.preventDefault();
      refs.current[next]?.focus();
      refs.current[next]?.click();
    }
  }
  return (
    <nav aria-label="Sections" className="segmented-tabs">
      {tabs.map((t, i) => (
        <a
          key={t.id}
          href={t.href}
          ref={(el) => {
            refs.current[i] = el;
          }}
          onKeyDown={(e) => onKeyDown(e, i)}
          className="segmented-tab"
        >
          {t.label}
        </a>
      ))}
    </nav>
  );
}
```

```tsx
// src/components/ui/disclosure.tsx
import type { ReactNode } from "react";

export function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="disclosure">
      <summary>{title}</summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
```

Kit CSS (append labeled section in `globals.css`): `.chip` (pill, accent border, 28px min-height), `.segmented-tabs` (pill container, surface-raised, radius 999px, horizontal scroll on narrow), `.segmented-tab` (44px min-height, `:hover` + `:focus-visible` states), `.disclosure summary` (44px, pointer), press physics (`.button, .segmented-tab, .ask-launcher { transition: transform 150ms ease, border-color 150ms ease; }` + `:active { transform: scale(0.97); }`).

- [ ] **Step 2: Kitchen-sink DOM check (temp route, then delete)**

Create `src/app/__kit/page.tsx` rendering each component once. Start dev server, curl `/__kit`, confirm all four class hooks present. Delete the directory. Remove any log files.

- [ ] **Step 3: Run full gate** (same command as Task 1 Step 4). Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui src/app/globals.css
git commit -m "feat: OriginOS glass component kit"
```

### Task 3: Widget home

**Files:**
- Create: `src/components/widgets/clock-widget.tsx`
- Modify: `src/app/page.tsx` (restructure into bento grid; copy unchanged), `src/app/globals.css` (bento grid + widget styles)
- Test: build green + dev DOM (grid, clock time pattern, all tiles link to routes)

**Interfaces:**
- Consumes: `GlassCard`, `Chip` from Task 2; published loaders (already used); `AuraArchitecture` for the featured panel.
- Produces: `.bento-grid`, `.widget-*` classes; `ClockWidget` (self-contained).

- [ ] **Step 1: Write ClockWidget (mount-guarded against hydration mismatch)**

```tsx
"use client";

import { useEffect, useState } from "react";

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Dhaka",
      }).format(now)
    : "--:--";
  const date = now
    ? new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Dhaka",
      }).format(now)
    : "Loading local time";
  return (
    <div className="widget-clock" aria-live="off">
      <p className="widget-time mono">{time}</p>
      <p className="widget-date">{date} · Dhaka (UTC+6)</p>
    </div>
  );
}
```

- [ ] **Step 2: Restructure page.tsx into the bento grid**

Keep every section's copy; change wrappers only: page root becomes `.bento-grid`; hero becomes a wide `GlassCard` widget (keep `hero-signature` inner classes); highlights/research/writing/about/contact become `GlassCard` widgets with existing inner markup; featured becomes flagship `GlassCard` + rows; approach principles keep `.principles-grid` inside a widget. Insert `<ClockWidget />` as its own widget after the hero. Empty states and links unchanged.

- [ ] **Step 3: Add bento CSS**

```css
.bento-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  padding-block: 2rem 3rem;
}
@media (min-width: 768px) {
  .bento-grid { grid-template-columns: 1fr 1fr; }
  .widget-span { grid-column: span 2; }
}
@media (min-width: 1280px) {
  .bento-grid { grid-template-columns: repeat(4, 1fr); }
  .widget-span { grid-column: span 2; }
  .widget-wide { grid-column: span 4; }
}
.widget-clock .widget-time {
  font-size: clamp(2rem, 1.5rem + 3vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

Hero widget gets `widget-wide widget-span` treatment per breakpoint (wide on desktop, full-width otherwise).

- [ ] **Step 4: Verify gate + DOM**

Full gate. Dev DOM on `/`: `.bento-grid` present, time matches `/\d{2}:\d{2}/`, every widget contains a working route link, no horizontal overflow markers. Stop server, delete logs.

- [ ] **Step 5: Commit**

```bash
git add src/components/widgets src/app/page.tsx src/app/globals.css
git commit -m "feat: OriginOS widget home with live clock"
```

### Task 4: Interactive explorers

**Files:**
- Create: `src/components/explorers/aura-layers.tsx`, `src/components/explorers/careeros-stepper.tsx`, `src/components/content/case-tabs.tsx`
- Modify: `src/content/projects/{aura,careeros}.mdx` (wrap `##` sections in `<section id>` + insert `<CaseTabs>`; structure only, copy unchanged), `src/app/globals.css` (explorer + tab-panel styles)
- Test: build green + dev DOM (explorer buttons, stepper progress, tab anchors, no-JS stacked fallback by construction)

**Interfaces:**
- Consumes: `SegmentedTabs`? No — explorers own their state; `Figure`/diagrams reused inside explorer panels where specified.
- Produces: `AuraLayers`, `CareerosStepper`, `CaseTabs({ tabs: {id,label,href}[] })` — all self-contained.

- [ ] **Step 1: Write AuraLayers (static data from published copy only)**

```tsx
"use client";

import { useState } from "react";

const LAYERS = [
  { n: 1, name: "Interaction", detail: "Voice, text, vision, and API surfaces. Planned — not part of the v0.1.0 Runtime Core.", implemented: false },
  { n: 2, name: "Runtime Kernel", detail: "Implemented in v0.1.0: AURARuntime, async EventBus, CapabilityRegistry, StateManager, GovernanceGate, CapabilityExecutor. See the case study below.", implemented: true },
  { n: 3, name: "Cognitive Services", detail: "Reasoning, memory, planning, learning, reflection. Planned.", implemented: false },
  { n: 4, name: "Execution Layer", detail: "Desktop, Android, browser, and terminal agents. Planned.", implemented: false },
  { n: 5, name: "Storage Layer", detail: "Memory store, cache, knowledge graph, vector store. Planned.", implemented: false },
];

export function AuraLayers() {
  const [active, setActive] = useState(1);
  const layer = LAYERS[active];
  return (
    <div className="explorer">
      <div role="group" aria-label="Architecture layers" className="explorer-buttons">
        {LAYERS.map((l, i) => (
          <button
            key={l.n}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className="explorer-button"
          >
            {l.n}. {l.name}
          </button>
        ))}
      </div>
      <div className="explorer-panel" aria-live="polite">
        <p>
          <strong>
            Layer {layer.n}: {layer.name}
          </strong>{" "}
          {layer.implemented ? "(implemented)" : "(planned)"}
        </p>
        <p>{layer.detail}</p>
      </div>
    </div>
  );
}
```

(All strings above are already-published facts from the AURA case study. No new claims.)

- [ ] **Step 2: Write CareerosStepper (stages from published copy only)**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";

const STAGES = [
  "Profile",
  "Strategy",
  "Sources",
  "Normalize",
  "Dedupe",
  "Rank",
  "Digest & Dashboard",
  "Tracker",
];

const DETAILS: Record<string, string> = {
  Profile: "Skills, roles, location, and preferences compile into a search strategy.",
  Strategy: "Synonym expansion and keyword optimization from the profile.",
  Sources: "Remotive, RemoteOK, Wellfound, YC, StartupJobs, and Bangladesh sources, queried with retry and rate limiting.",
  Normalize: "Divergent source formats mapped into one consistent schema.",
  Dedupe: "Exact hash plus fuzzy similarity; history filtering removes seen roles.",
  Rank: "10-factor weighted scoring blended with freshness, novelty, and preference.",
  "Digest & Dashboard": "Telegram digest with actions plus the Next.js dashboard workspace.",
  Tracker: "Application lifecycle tracking. Tracking never submits — apply through the original listing.",
};

export function CareerosStepper() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const m = window.location.hash.match(/^#stage-(\d)$/);
    if (m) {
      const i = Number(m[1]) - 1;
      if (i >= 0 && i < STAGES.length) setIndex(i);
    }
  }, []);
  const go = useCallback((i: number) => {
    const n = (i + STAGES.length) % STAGES.length;
    setIndex(n);
    window.location.hash = `stage-${n + 1}`;
  }, []);
  const stage = STAGES[index];
  return (
    <div className="explorer">
      <p className="entry-meta">
        Stage {index + 1} of {STAGES.length}
      </p>
      <div className="stepper-bar" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={STAGES.length} aria-label="Pipeline progress">
        <span style={{ width: `${((index + 1) / STAGES.length) * 100}%` }} />
      </div>
      <p>
        <strong>{stage}.</strong> {DETAILS[stage]}
      </p>
      <p>
        <button type="button" onClick={() => go(index - 1)} className="button">
          Previous
        </button>{" "}
        <button type="button" onClick={() => go(index + 1)} className="button">
          Next
        </button>
      </p>
    </div>
  );
}
```

(All stage names and details are already-published case-study facts.)

- [ ] **Step 3: Write CaseTabs + wire MDX sections**

```tsx
import Link from "next/link";

export function CaseTabs({ tabs }: { tabs: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label="Case study sections" className="segmented-tabs">
      {tabs.map((t) => (
        <Link key={t.id} href={`#${t.id}`} className="segmented-tab">
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
```

```css
.tab-panel { display: none; }
.tab-panel:target { display: block; }
.tabs-root .tab-default { display: block; }
.tabs-root:has(> .tab-panel:target) .tab-default { display: none; }
```

In `aura.mdx` and `careeros.mdx`: wrap each `##` section body in `<section id="<slug>" className="tab-panel">` (first section additionally `tab-default`), wrap all five in `<div className="tabs-root">`, insert `<CaseTabs tabs={[...5 entries...]} />` before the first section. Labels: Problem, Architecture, Decisions, Evidence, Limitations. Copy inside sections byte-unchanged; only wrappers + import lines added.

- [ ] **Step 4: Explorer CSS** — `.explorer`, `.explorer-buttons` (wrap, gap), `.explorer-button` (44px, pill, `aria-pressed=true` filled accent-ink style), `.explorer-panel` (surface-raised, radius, padding), `.stepper-bar` (track + fill span, accent fill).

- [ ] **Step 5: Verify gate + DOM** — full gate; dev DOM: explorer buttons (5), stepper progressbar, tab anchors, all five section ids present per case study; no-JS reasoning documented in report (anchors + stacked CSS guarantee).

- [ ] **Step 6: Commit**

```bash
git add src/components/explorers src/components/content/case-tabs.tsx src/content src/app/globals.css
git commit -m "feat: interactive architecture explorers and tabbed case studies"
```

### Task 5: Motion system

**Files:**
- Create: `src/app/template.tsx`
- Modify: `src/app/globals.css` (route transition, entrance stagger, theme crossfade)
- Test: build green + dev DOM (template wrapper present, keyframes in CSS)

**Interfaces:**
- Consumes: existing reduced-motion kill-switch (extend, don't replace).
- Produces: route transition wrapper used automatically by App Router.

- [ ] **Step 1: Write template.tsx**

```tsx
import type { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-transition">{children}</div>;
}
```

- [ ] **Step 2: Add motion CSS**

```css
@keyframes route-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.route-transition {
  animation: route-enter 250ms ease-out both;
}
.bento-grid > * {
  animation: hero-settle 300ms ease-out both;
}
.bento-grid > *:nth-child(2) { animation-delay: 50ms; }
.bento-grid > *:nth-child(3) { animation-delay: 100ms; }
.bento-grid > *:nth-child(4) { animation-delay: 150ms; }
body, .glass, .site-header, .ask-panel {
  transition: background-color 200ms ease, border-color 200ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .route-transition, .bento-grid > * { animation: none; }
}
```

(`hero-settle` keyframes already exist from the visual-system work — reuse, don't duplicate. The global reduced-motion block already zeroes transitions/animations; the explicit `.route-transition` line documents intent.)

- [ ] **Step 3: Verify gate + DOM** — full gate; dev DOM: `route-transition` wrapper present on `/`.
- [ ] **Step 4: Commit**

```bash
git add src/app/template.tsx src/app/globals.css
git commit -m "feat: route transitions and entrance motion"
```

### Task 6: Assistant restyle

**Files:**
- Modify: `src/app/globals.css` (restyle existing `.ask-*` classes only)
- Test: build green + dev DOM (launcher/panel classes present, no-JS fallback intact)

**Interfaces:**
- Consumes: Task 1 tokens; existing `.ask-*` markup (launcher, panel, suggestions, messages, sources, disclaimer, form, input, send, close).
- Produces: glass look on the same classes; zero component changes.

- [ ] **Step 1: Re-skin the widget (CSS only)**

```css
.ask-launcher {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 999px;
  box-shadow: var(--shadow-soft);
}
.ask-panel {
  background: var(--surface-glass);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}
@supports (backdrop-filter: blur(1px)) {
  .ask-panel {
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
  }
}
.ask-input {
  background: var(--background);
}
```

Keep all existing layout/positioning declarations untouched; only surfaces, borders, radii, shadow change. No component-file edits.

- [ ] **Step 2: Verify gate + DOM** — full gate; dev DOM: launcher + panel classes still present; API contract untouched (no route/lib changes in diff).
- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: restyle assistant widget in glass system"
```

### Task 7: Verification matrix + perf guard

**Files:** none (verification only) unless fixes surface — fixes go in a follow-up commit with the same gate.
**Test:** matrix + Lighthouse + contrast suite.

- [ ] **Step 1: Run the matrix** — dev server + production build; viewports 375/768/1280/1920 × light/dark: bento grid integrity, explorer/stepper/tabs usability, widget overlap, keyboard-only pass, visible focus, 200% zoom on `/`. Record results per route; file issues for anything failing.
- [ ] **Step 2: Re-measure contrast** — `npm run test` covers the extended guard suite; record the run.
- [ ] **Step 3: Lighthouse** — `npx lighthouse <url> --only-categories=performance,accessibility` on `/` and `/projects/aura` (production build). Targets: perf ≥90, a11y 95+, LCP ≤2.5s, CLS ≤0.1. Record version + scores; fix-or-document decision for anything below target.
- [ ] **Step 4: Commit only if fixes were needed** — otherwise the matrix report is the deliverable.

## Self-Review

- Spec coverage: §0→Task 1, §1→Task 2, §2→Task 3, §3→Task 4, §4→Task 5, §5→Task 6, §6→Task 7, §7→Tasks 1 (zero deps) + 7 (Lighthouse). Shiki excluded per non-goals.
- Placeholder scan: no TBD/TODO; every code block complete and copy-paste ready; paths exact.
- Type consistency: `TabDef`, `ClockWidget` (no props), explorer components (no props), `CaseTabs({tabs})`, class names (`.bento-grid`, `.widget-*`, `.explorer*`, `.stepper-bar`, `.tab-panel`, `.tabs-root`, `.route-transition`, `.glass`, `.chip`, `.segmented-*`, `.disclosure`) identical between TSX and CSS steps.
