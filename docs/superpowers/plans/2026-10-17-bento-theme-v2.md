# OriginOS Bento Restructure + Site-Wide Glass Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hand-tune the homepage bento (deliberate spans, merged profile strip, no empty-stretch cards) and extend the OriginOS glass shell to every subpage.

**Architecture:** Pure CSS/TSX restructuring on top of the existing token + glass system. New tiny layout components (`PageHero`, `PageShell`) applied to all subpages; homepage bento switched from auto-flow uniform grid to explicit per-card placement at ≥1280px with tablet/mobile fallbacks. No new dependencies, no copy changes, no token changes.

**Tech Stack:** Next.js 16.4 App Router, React 19, Tailwind v4 tokens (plain CSS in `globals.css`), existing `GlassCard` kit.

**Spec:** `docs/superpowers/specs/2026-10-17-bento-theme-v2-design.md` — the plan argues from the spec. The spec's approved row table was adjusted for geometric consistency (a 2×2 featured card makes the spec's row-3 pairing impossible in a 4-col grid). Final placement below is authoritative; rationale: big clock tile vertically centered (deliberate bento look), profile strip full-width at the bottom.

## Global Constraints

- Zero new dependencies.
- Verified-only content: no copy edits, no invented text (UI chrome labels like kickers must be factual, e.g. the site name).
- Contrast pairs stay covered by `src/lib/__tests__/tokens.test.ts` (no new colors introduced).
- Motion: no new animation classes; existing reduced-motion rules must keep covering anything new (`animation: none` opt-outs already target `.bento-grid > *`).
- Every task ends with `npm run test; npm run typecheck; npm run lint; npm run build` all green.
- Next 16: `dynamicParams`/`runtime`/`dynamic` route exports are rejected; `cacheComponents` is on. Do not touch route configs.
- Branch: `feat/bento-theme-v2` off current `main`. Never touch `main` directly. Known dirty files to leave alone: `AGENTS.md` (Next-regenerated), `PORTFOLIO_PLAN.md` (untracked).

---

### Task 1: Homepage bento restructure

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (bento section, currently ~lines 756–781; clamp utility appended near it)

**Interfaces:**
- Consumes: existing `GlassCard` (`className?: string; labelledBy?: string`), `ClockWidget`, tokens.
- Produces: card classes used by CSS: `widget-clock-tile`, `widget-tall`, `widget-half`, `widget-profile`; utility class `clamp-3`. Task 2+ do not depend on these (home-only), but the `clamp-3` utility is reused on index pages in Task 2.

**Final ≥1280px placement (authoritative):**

| Card | Columns | Rows |
|---|---|---|
| Hero (`widget-wide`) | 1/-1 | 1 |
| Clock (`widget-clock-tile`) | 1 | 2/span 2 (vertically centered tile) |
| Highlights | 2 | 2/span 2 |
| Featured (`widget-span widget-tall`) | 3/5 | 2/span 2 |
| How I work (`widget-half`) | 1/3 | 4 |
| Research (`widget-half`) | 3/5 | 4 |
| Profile strip (`widget-profile`) | 1/-1 | 5 |

- [ ] **Step 1: Restructure `src/app/page.tsx`**

Replace the About/Contact/Writing trio with one profile strip card, add span classes to the other cards, and apply `clamp-3` to teaser paragraphs. Exact final JSX body inside `<div className="bento-grid">` (hero card unchanged, omitted here for brevity — keep it byte-identical):

```tsx
<GlassCard className="widget-clock-tile">
  <ClockWidget />
</GlassCard>

<GlassCard labelledBy="highlights-heading">
  <h2 id="highlights-heading">Verified highlights</h2>
  <ul className="entry-list">
    <li>
      <h3>
        <Link href="/research/insulator-fault-detection">
          First-author IEEE conference paper on interpretable insulator fault detection
        </Link>
      </h3>
      <p className="entry-meta">IEEE ICEESI 2026 · DOI 10.1109/iceesi68020.2026.11583598</p>
      <p className="clamp-3">
        An interpretable attention-guided hybrid framework for power line insulator fault
        detection, with citation verified against the publisher record.
      </p>
    </li>
    <li>
      <h3>
        <a href="https://github.com/Nobi004">Public engineering work on GitHub</a>
      </h3>
      <p className="entry-meta">github.com/Nobi004 · identity confirmed</p>
      <p className="clamp-3">
        Applied machine learning, document tooling, computer vision experiments, and this
        portfolio&apos;s own codebase — all public and inspectable.
      </p>
    </li>
  </ul>
</GlassCard>

<GlassCard className="widget-span widget-tall" labelledBy="projects-heading">
  <h2 id="projects-heading">Featured engineering work</h2>
  {/* keep existing featured block EXACTLY as-is (flagship-panel + entry-list + All projects link),
      except add className="clamp-3" to the flagship <p>{flagship.summary}</p> */}
</GlassCard>

<GlassCard className="widget-half" labelledBy="approach-heading">
  <h2 id="approach-heading">How I work</h2>
  <ul className="principles-grid">
    {/* keep the four existing <li> items byte-identical */}
  </ul>
</GlassCard>

<GlassCard className="widget-half" labelledBy="research-heading">
  <h2 id="research-heading">Research</h2>
  <ul className="entry-list">
    {/* keep existing research mapping byte-identical */}
  </ul>
  <p>
    <Link href="/research">All research</Link>
  </p>
</GlassCard>

<GlassCard className="widget-profile" labelledBy="profile-heading">
  <h2 id="profile-heading">Profile</h2>
  <div className="profile-minis">
    <section aria-labelledby="about-heading">
      <h3 id="about-heading">About</h3>
      <p>
        AI engineer in Dhaka working across agentic systems, applied ML, and production software
        — with an electrical engineering background. <Link href="/about">More about me</Link>
      </p>
    </section>
    <section aria-labelledby="contact-heading">
      <h3 id="contact-heading">Contact</h3>
      <p>
        The fastest way to reach me is by email at{" "}
        <a href="mailto:mdmnb435@gmail.com">mdmnb435@gmail.com</a>.{" "}
        <Link href="/contact">All contact options</Link>
      </p>
    </section>
    <section aria-labelledby="writing-heading">
      <h3 id="writing-heading">Writing</h3>
      <p>
        Technical articles on agent architecture and evaluation are under review and will appear
        here once verified. <Link href="/writing">Writing archive</Link>
      </p>
    </section>
  </div>
</GlassCard>
```

Card order in DOM must be: hero, clock, highlights, featured, how-I-work, research, profile (mobile reading order).

- [ ] **Step 2: Rework bento CSS in `src/app/globals.css`**

Replace the existing `.bento-grid` block (lines ~756–781, including the `@media` rules and `.bento-grid > .glass` / `.hero-signature` padding rules — keep those two padding rules) with:

```css
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bento-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(min-content, auto);
  padding-block: 2rem 3rem;
}
@media (min-width: 768px) {
  .bento-grid { grid-template-columns: 1fr 1fr; }
  .widget-span,
  .widget-wide,
  .widget-half,
  .widget-profile { grid-column: span 2; }
  .widget-clock-tile { align-self: start; }
}
@media (min-width: 1280px) {
  .bento-grid { grid-template-columns: repeat(4, 1fr); }
  .bento-grid > * { grid-column: auto; grid-row: auto; }
  .hero-signature { grid-column: 1 / -1; grid-row: 1; }
  .widget-clock-tile { grid-column: 1; grid-row: 2 / span 2; align-self: stretch; }
  .bento-grid > [labelledby="highlights-heading"] { grid-column: 2; grid-row: 2 / span 2; }
  .widget-tall { grid-column: 3 / 5; grid-row: 2 / span 2; }
  .widget-half:nth-of-type(1) { grid-column: 1 / 3; grid-row: 4; }
  .widget-half:nth-of-type(2) { grid-column: 3 / 5; grid-row: 4; }
  .widget-profile { grid-column: 1 / -1; grid-row: 5; }
}
.widget-clock-tile {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.profile-minis {
  display: grid;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .profile-minis { grid-template-columns: repeat(3, 1fr); }
}
.profile-minis h3 { margin-top: 0; }
```

Note on the two `nth-of-type` selectors: how-I-work and research are the only `.widget-half` siblings and are consecutive `section` elements — verify with a quick DOM check after `npm run dev` that both land on row 4 as placed; if `nth-of-type` proves brittle (e.g. GlassCard renders `section` and sibling type indexing differs), fall back to adding distinct classes `widget-half-a` / `widget-half-b` in page.tsx and targeting those instead. Keep the chosen approach consistent between page.tsx and CSS.

- [ ] **Step 3: Run gates**

Run: `npm run test; npm run typecheck; npm run lint; npm run build`
Expected: all green (31 tests). If `nth-of-type` placement fails the DOM check in Step 2's note, apply the fallback classes and re-run.

- [ ] **Step 4: Spot-check DOM on dev**

Run dev server hidden (`Start-Process cmd /c "npm run dev > dev-server.log 2>&1"`), fetch `http://localhost:3000`, assert HTML contains `widget-clock-tile`, `widget-tall`, `widget-half`, `widget-profile`, `profile-minis`, `clamp-3`. Stop the server and delete `dev-server.log`.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat: hand-tuned bento layout with merged profile strip"
```

---

### Task 2: PageHero + PageShell, applied to index, about, and contact pages

**Files:**
- Create: `src/components/layout/page-hero.tsx`
- Create: `src/components/layout/page-shell.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/contact/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/research/page.tsx`
- Modify: `src/app/writing/page.tsx`
- Modify: `src/app/globals.css` (page-shell/page-hero/entry-card styles)

**Interfaces:**
- Consumes: `clamp-3` utility (from Task 1), glass tokens.
- Produces:
  - `PageHero({ kicker, title }: { kicker: string; title: string })` — server component, no state.
  - `PageShell({ children }: { children: ReactNode })` — server component, no state.
  - CSS: `.page-shell`, `.page-hero`, `.entry-card-grid`, `.entry-card`.
  Task 3 imports `PageShell` with the exact same signature.

- [ ] **Step 1: Create `src/components/layout/page-shell.tsx`**

```tsx
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="page-shell glass">{children}</div>;
}
```

- [ ] **Step 2: Create `src/components/layout/page-hero.tsx`**

```tsx
export function PageHero({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="page-hero">
      <p className="hero-kicker mono">{kicker}</p>
      <h1>{title}</h1>
    </header>
  );
}
```

- [ ] **Step 3: Add shell CSS to `src/app/globals.css`**

Append (after the bento section, before the explorers section):

```css
/* Page shell + hero + entry cards (site-wide OriginOS surfaces) */
.page-shell {
  max-width: 72rem;
  margin-block: 2rem 3rem;
  padding: clamp(1.5rem, 4vw, 3rem);
  border-radius: var(--radius-lg);
}
.page-hero { margin-bottom: 2rem; }
.page-hero h1 { margin-top: 0.25rem; }
.entry-card-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .entry-card-grid { grid-template-columns: 1fr 1fr; }
}
.entry-card {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
}
.entry-card h2 { margin-top: 0; font-size: 1.25rem; }
```

- [ ] **Step 4: Apply shell to about page**

`src/app/about/page.tsx` becomes (existing paragraphs kept byte-identical, only h1 removed and shell/hero added):

```tsx
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero kicker="Md. Mahmudun Nobi" title="About" />
      <article className="prose-stock">
        <p>
          Md. Mahmudun Nobi is an AI engineer in Dhaka, Bangladesh, working on agentic systems,
          applied machine learning, document intelligence, and production software architecture.
        </p>
        <p>
          His background is in electrical and electronic engineering (Faridpur Engineering College,
          as listed on his IEEE publication record). Further background, employment history, and
          credentials will be added here once verified.
        </p>
        <p>
          Peer-reviewed work:{" "}
          <Link href="/research/insulator-fault-detection">
            interpretable fault detection for power line insulators (IEEE ICEESI 2026)
          </Link>
          .
        </p>
        <p>
          Public code: <a href="https://github.com/Nobi004">github.com/Nobi004</a>.
        </p>
      </article>
    </PageShell>
  );
}
```

Kicker on every subpage is the factual site identity string `Md. Mahmudun Nobi` — no invented copy.

- [ ] **Step 5: Apply shell to contact page**

Same pattern — wrap existing `prose-stock` body (minus its `<h1>Contact</h1>`) in `PageShell` + `PageHero kicker="Md. Mahmudun Nobi" title="Contact"`. Keep the two paragraphs and the GitHub/LinkedIn list byte-identical.

- [ ] **Step 6: Convert projects index to glass entry cards**

`src/app/projects/page.tsx`:

```tsx
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { getAllPublishedProjectMeta } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getAllPublishedProjectMeta();
  if (projects.length === 0) {
    return (
      <PageShell>
        <PageHero kicker="Md. Mahmudun Nobi" title="Projects" />
        <p>
          Engineering case studies are under technical review and will appear here once verified. In
          the meantime, see public code at <a href="https://github.com/Nobi004">GitHub</a>.
        </p>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <PageHero kicker="Md. Mahmudun Nobi" title="Projects" />
      <ul className="entry-card-grid">
        {projects
          .filter((p) => p.featured)
          .map((p) => (
            <li key={p.slug} className="entry-card glass">
              <Link href={`/projects/${p.slug}`}>
                <h2>{p.title}</h2>
              </Link>
              <p>{p.tagline}</p>
              <p className="clamp-3">{p.summary}</p>
              <p className="entry-meta">
                Status: {p.status} · Role: {p.role}
              </p>
            </li>
          ))}
      </ul>
    </PageShell>
  );
}
```

- [ ] **Step 7: Convert research index identically**

Same pattern in `src/app/research/page.tsx`: `PageShell` + `PageHero title="Research"`; `entry-list` → `entry-card-grid` with `<li className="entry-card glass">`; keep each entry's Link/h2/tagline/entry-meta block byte-identical inside the li. No empty-state branch exists — keep it that way.

- [ ] **Step 8: Convert writing index identically**

Same pattern in `src/app/writing/page.tsx`, preserving the existing empty-state branch (wrapped in `PageShell`/`PageHero`, body paragraph unchanged) and the entry cards (title, summary, date · tags).

- [ ] **Step 9: Run gates**

Run: `npm run test; npm run typecheck; npm run lint; npm run build`
Expected: all green.

- [ ] **Step 10: Spot-check DOM on dev**

Dev server; assert each of `/about`, `/contact`, `/projects`, `/research`, `/writing` HTML contains `page-shell`, `page-hero`, and (indexes) `entry-card`. Assert `/projects` still shows only featured projects and no draft slugs. Stop server, delete log.

- [ ] **Step 11: Commit**

```bash
git add src/components/layout/page-hero.tsx src/components/layout/page-shell.tsx src/app/about/page.tsx src/app/contact/page.tsx src/app/projects/page.tsx src/app/research/page.tsx src/app/writing/page.tsx src/app/globals.css
git commit -m "feat: site-wide glass page shell with hero headers and entry cards"
```

---

### Task 3: Glass shell on detail pages

**Files:**
- Modify: `src/app/projects/[slug]/page.tsx` (return JSX, ~lines 39–65)
- Modify: `src/app/research/[slug]/page.tsx` (return JSX, ~lines 38–54)
- Modify: `src/app/writing/[slug]/page.tsx` (return JSX, ~lines 39–47)

**Interfaces:**
- Consumes: `PageShell` from Task 2 (`{ children }: { children: ReactNode }`), exported from `src/components/layout/page-shell.tsx`.
- Produces: nothing new for later tasks.

- [ ] **Step 1: Wrap projects detail**

In `src/app/projects/[slug]/page.tsx`, change only the return wrapper — keep `case-header` block, `<Post />`, metadata, `instant = false`, and all logic byte-identical:

```tsx
import { PageShell } from "@/components/layout/page-shell";
// ...existing code unchanged...
  return (
    <PageShell>
      <article className="prose-stock">
        {/* existing case-header div and <Post /> exactly as-is */}
      </article>
    </PageShell>
  );
```

- [ ] **Step 2: Wrap research detail**

Same one-line-surface change in `src/app/research/[slug]/page.tsx`: wrap the existing `<article className="prose-stock">…</article>` in `<PageShell>`. BibTeX section and all logic unchanged.

- [ ] **Step 3: Wrap writing detail**

Same change in `src/app/writing/[slug]/page.tsx`. Note there are currently no published articles (`instant = false` route) — the change must still compile and the route must still 404 for unknown slugs; do not add `generateStaticParams`.

- [ ] **Step 4: Run gates**

Run: `npm run test; npm run typecheck; npm run lint; npm run build`
Expected: all green.

- [ ] **Step 5: Spot-check DOM on dev**

Dev server; assert `/projects/aura` and `/projects/careeros` HTML contains `page-shell` and still contains `explorer-buttons` / `stepper-bar` / `tab-panel`; assert `/research/insulator-fault-detection` contains `page-shell` and `Cite`; assert `/projects/voice-mind` still returns the not-found UI with no draft content leak. Stop server, delete log.

- [ ] **Step 6: Commit**

```bash
git add src/app/projects/[slug]/page.tsx src/app/research/[slug]/page.tsx src/app/writing/[slug]/page.tsx
git commit -m "feat: glass page shell on detail pages"
```

---

### Task 4: Verification matrix

**Files:**
- None created; verification-only task (artifacts under `.superpowers/sdd/2026-10-17-bento-theme-v2/`).

**Interfaces:**
- Consumes: all previous tasks.

- [ ] **Step 1: Full gates + production build**

Run: `npm run check-content; npm run test; npm run typecheck; npm run lint; npm run build`
Expected: all green; `check-content: published content clean`.

- [ ] **Step 2: Route + DOM matrix (production server)**

Start `npm run start` hidden. Assert (HTTP 200 + markers):

| Route | Markers |
|---|---|
| `/` | `bento-grid`, `widget-clock-tile`, `widget-profile`, `profile-minis`, `clamp-3`, `mailto:mdmnb435@gmail.com` |
| `/about` `/contact` | `page-shell`, `page-hero` |
| `/projects` `/research` `/writing` | `page-shell`, `page-hero`, `entry-card` |
| `/projects/aura` | `page-shell`, `explorer-buttons`, `tab-panel` |
| `/projects/careeros` | `page-shell`, `stepper-bar` |
| `/research/insulator-fault-detection` | `page-shell`, `Cite` |
| `/projects/voice-mind` | not-found UI, no draft leak, `noindex` |
| `/sitemap.xml` | no draft slugs |

- [ ] **Step 3: Lighthouse (mobile + desktop, `/` and `/projects/aura`)**

Four runs, thresholds: perf ≥ 90, a11y ≥ 95, CLS ≤ 0.1, LCP ≤ 2.5s (desktop) / ≤ 3s (mobile). Record numbers; home LCP on mobile previously 2.4s — treat regression >0.3s as fail.

- [ ] **Step 4: Both themes + reduced motion spot check**

Via DOM/CSS assertions (no visual claim without measurement): confirm `defaultTheme="light"` still applies, `.glass` fallback `@supports` block intact, and reduced-motion rule still sets `.route-transition, .bento-grid > * { animation: none; }`.

- [ ] **Step 5: Record results in ledger; no code commits**

Write results to `.superpowers/sdd/2026-10-17-bento-theme-v2/progress.md` (gitignored). Commit nothing.

---

## Self-Review Notes

- Spec coverage: §1 bento → Task 1 (with documented placement adjustment for geometric consistency); §2 site-wide shell → Tasks 2–3; §3 verification → Task 4. Clamp utility reused on `/projects` cards (teaser presentation only — spec permits).
- Placeholders: none; every step carries exact code or exact assertions.
- Type consistency: `PageShell({ children })` and `PageHero({ kicker, title })` signatures identical in Tasks 2 and 3.
