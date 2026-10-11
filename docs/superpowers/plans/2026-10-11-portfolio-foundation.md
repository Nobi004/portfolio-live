# Portfolio v1 Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the portfolio-live Next.js site and ship working Home, About, Contact, and Resume routes with dark-default theming and CI green.

**Architecture:** Static-first Next.js App Router site. Routes render from colocated `page.tsx` files with shared layout, theme tokens, and header/footer. MDX dependencies installed and wired in config now; full content pipeline arrives in Phase 2.

**Tech Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui primitives + next-themes + MDX (`@next/mdx`, `gray-matter`, `zod`) + Shiki + Vercel.

**Spec:** Strategic Master Plan v1.0 (2026-10, in chat): §2 dark technical editorial, §3 route structure, §4 home flow, §12 stack, §13 repo structure, §14 quality gates, §18 v1 scope.

## Global Constraints

- Canonical work root is the inner clone: `D:\End to End projects\portfolio\portfolio` (branch `main`, remote `origin → https://github.com/Nobi004/portfolio-live.git`).
- No nested git repos: outer `D:\End to End projects\portfolio\.git` stays deleted.
- Static-first: no database, no auth, no server actions for dynamic data in Phase 1.
- Dark theme is default; light-mode toggle must work without flash of wrong theme.
- No invented metrics or unverifiable claims in page copy; draft copy only from Master Plan §4 hero text.
- Contact page uses `mailto:` + profile links only; no form backend in v1.
- Every task ends with `tsc --noEmit` + `next lint` (or `next build` where stated) passing.

---

## File Structure

- `package.json` — scripts: `dev`, `build`, `start`, `lint`, `typecheck`. Deps add: `next-themes`, `@next/mdx`, `gray-matter`, `zod`, `shiki`.
- `next.config.mjs` — MDX page extensions (`.mdx`) wired via `@next/mdx`, nothing else custom.
- `src/app/layout.tsx` — `<html suppressHydrationWarning>`, font vars, `ThemeProvider`, header/footer slots.
- `src/app/globals.css` — Tailwind import + CSS vars for dark/light tokens.
- `src/components/layout/site-header.tsx` — nav with 6 entries (Home, Projects, Research, Writing, About, Contact).
- `src/components/layout/site-footer.tsx` — copyright + GitHub/LinkedIn/email links.
- `src/components/providers/theme-provider.tsx` — re-export wrapper around `next-themes` `ThemeProvider`.
- `src/app/page.tsx` — Home per §4 hero copy (headline, subcopy, CTAs, location line) + placeholder sections marked `DRAFT`.
- `src/app/about/page.tsx` — draft About blocks per Master Plan §7.
- `src/app/contact/page.tsx` — `mailto:` + LinkedIn/GitHub links.
- `src/app/resume/route.ts` — serves `public/resume/resume.pdf` (placeholder PDF slot until real resume provided).
- `src/app/projects/page.tsx`, `src/app/research/page.tsx`, `src/app/writing/page.tsx` — stub index pages labeled `Coming in Phase 2` (so nav never 404s).
- `.github/workflows/ci.yml` — install + typecheck + lint + build on push/PR.

### Task 1: Scaffold Next.js app in place

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` (via scaffolder, then verify each exists)
- Test: terminal — `npm run typecheck` passes

**Interfaces:**
- Consumes: empty repo (only `README.md`, `.gitattributes`, `.gitignore` to be generated)
- Produces: runnable `npm run dev`, scripts `dev/build/start/lint/typecheck`

- [ ] **Step 1: Run scaffolder non-interactively**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
Expected: completes without prompts; `package.json`, `src/app/page.tsx` exist.

- [ ] **Step 2: Verify generated tree**

```bash
Get-ChildItem -Path "src/app" ; node -e "const p=require('./package.json'); console.log(p.scripts)"
```

Run: `Get-ChildItem -Path "src/app"; node -e "const p=require('./package.json'); console.log(p.scripts)"`
Expected: `layout.tsx`, `page.tsx`, `globals.css` listed; scripts include `dev`, `build`, `start`, `lint`.

- [ ] **Step 3: Add typecheck script and run it**

```json
{ "scripts": { "typecheck": "tsc --noEmit" } }
```

Edit `package.json`: add `"typecheck": "tsc --noEmit"` alongside existing scripts, changing nothing else.
Run: `npm run typecheck`
Expected: PASS with no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js App Router + TS + Tailwind"
```

### Task 2: Install content/theming dependencies and wire MDX config

**Files:**
- Modify: `package.json`, `next.config.mjs`
- Test: terminal — `npm run typecheck` passes and `next.config.mjs` contains `mdxRs`/`withMDX` wiring

**Interfaces:**
- Consumes: Task 1 scripts and `next.config.mjs`
- Produces: `withMDX`-wrapped config accepting `.mdx` pages; installed `next-themes`, `@next/mdx`, `gray-matter`, `zod`, `shiki`

- [ ] **Step 1: Install packages**

```bash
npm install next-themes @next/mdx gray-matter zod shiki
```

Run: `npm install next-themes @next/mdx gray-matter zod shiki`
Expected: exit 0; `node -e "const p=require('./package.json'); console.log(Object.keys(p.dependencies).filter(k=>/next-themes|mdx|gray-matter|zod|shiki/.test(k)))"` lists all five.

- [ ] **Step 2: Wire MDX into next.config.mjs**

```js
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({});
export default withMDX(nextConfig);
```

Replace `next.config.mjs` content with the block above (preserve nothing else; Phase 1 needs no extra config).
Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json next.config.mjs
git commit -m "chore: add MDX + theming + content dependencies"
```

### Task 3: Theme tokens, provider, header, footer, root layout

**Files:**
- Create: `src/components/providers/theme-provider.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Test: terminal — `npm run build` passes; browser — `/` shows nav + toggle flips `class="dark"` on `<html>`

**Interfaces:**
- Consumes: `next-themes` from Task 2
- Produces: `ThemeProvider`, `SiteHeader`, `SiteFooter` components used by `layout.tsx`

- [ ] **Step 1: Write theme provider**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Write header with 6 nav entries**

```tsx
import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header>
      <nav aria-label="Primary">
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Write footer**

```tsx
export function SiteFooter() {
  return (
    <footer>
      <p>Md. Mahmudun Nobi — AI Engineer</p>
      <ul>
        <li>
          <a href="https://github.com/Nobi004">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/">LinkedIn</a>
        </li>
        <li>
          <a href="mailto:hello@example.com">Email</a>
        </li>
      </ul>
    </footer>
  );
}
```

(Note: `hello@example.com` and bare LinkedIn URL are explicit DRAFT placeholders the owner replaces with verified addresses; no other contact path is offered.)

- [ ] **Step 4: Wire layout and tokens**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Md. Mahmudun Nobi — AI Engineer",
  description:
    "AI Engineer focused on agentic systems, applied machine learning, document intelligence, and production software architecture.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Append to `src/app/globals.css` (keep the existing `@import "tailwindcss";` line first):

```css
:root {
  --background: #fafafa;
  --foreground: #111111;
}
.dark {
  --background: #101014;
  --foreground: #f2f2f0;
}
body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 5: Build to verify**

Run: `npm run build`
Expected: `✓ Compiled successfully` and route list includes `/`.

- [ ] **Step 6: Commit**

```bash
git add src/components src/app/layout.tsx src/app/globals.css
git commit -m "feat: add theme provider, header, footer, and design tokens"
```

### Task 4: Core routes (home, about, contact, resume, stubs)

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/resume/route.ts`, `src/app/projects/page.tsx`, `src/app/research/page.tsx`, `src/app/writing/page.tsx`, `public/resume/resume.pdf` (binary placeholder note: commit a real one-page PDF stating DRAFT)
- Test: terminal — `npm run build` passes and output lists `/`, `/about`, `/contact`, `/projects`, `/research`, `/writing`

**Interfaces:**
- Consumes: `SiteHeader`/`SiteFooter` layout from Task 3
- Produces: routable pages; `/resume` returns `application/pdf`

- [ ] **Step 1: Write Home page with §4 hero copy**

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading">
        <p>MD. MAHMUDUN NOBI / AI ENGINEER</p>
        <h1 id="hero-heading">Building intelligent systems that work beyond the prototype.</h1>
        <p>
          AI Engineer focused on agentic systems, applied machine learning, document intelligence, and
          production software architecture.
        </p>
        <p>
          <Link href="/projects">Explore Projects</Link> <Link href="/resume">View Resume</Link>
        </p>
        <p>Dhaka, Bangladesh · Open to relevant AI engineering opportunities</p>
      </section>
      <section aria-label="DRAFT sections">
        <p>DRAFT: proof strip, featured work, approach, research, writing, about snapshot, contact CTA land here in Phase 2–3.</p>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Write About, Contact, and stub index pages**

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <article>
      <h1>About</h1>
      <p>DRAFT: B.Sc. in EEE turned AI engineer. Verified employment history lands here before launch.</p>
    </article>
  );
}
```

```tsx
// src/app/contact/page.tsx
export default function ContactPage() {
  return (
    <article>
      <h1>Contact</h1>
      <p>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </p>
      <ul>
        <li>
          <a href="https://github.com/Nobi004">GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/">LinkedIn</a>
        </li>
      </ul>
    </article>
  );
}
```

```tsx
// src/app/projects/page.tsx (same shape for research/writing with adjusted copy)
export default function ProjectsPage() {
  return (
    <article>
      <h1>Projects</h1>
      <p>Coming in Phase 2: full case studies for AURA, ACORD Document Intelligence, and Voice Mind.</p>
    </article>
  );
}
```

```ts
// src/app/resume/route.ts
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "resume", "resume.pdf");
  const data = await readFile(filePath);
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": "application/pdf" },
  });
}
```

- [ ] **Step 3: Add placeholder PDF and build**

Place any one-page DRAFT PDF at `public/resume/resume.pdf` (owner replaces with verified resume before launch).
Run: `npm run build`
Expected: compiled successfully; routes `/`, `/about`, `/contact`, `/projects`, `/research`, `/writing` present.

- [ ] **Step 4: Commit**

```bash
git add src/app public/resume
git commit -m "feat: add home, about, contact, resume, and section stubs"
```

### Task 5: CI workflow and final verification

**Files:**
- Create: `.github/workflows/ci.yml`
- Test: terminal — `npm run typecheck && npm run lint && npm run build` all pass

**Interfaces:**
- Consumes: all tasks above
- Produces: green CI signal on push/PR

- [ ] **Step 1: Write CI workflow**

```yaml
name: ci
on:
  push:
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

- [ ] **Step 2: Run full gate locally**

Run: `npm run typecheck; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: all three PASS.

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add typecheck + lint + build workflow"
git push origin main
```

## Self-Review

- Spec coverage: §2 tokens/toggle → Task 3; §3 routes → Task 4 (+ stubs so nav never 404s); §4 hero copy → Task 4 Step 1; §12 stack/MDX → Tasks 1–2; §13 structure → File Structure; §14 gates → Task 5; §17–18 scope (foundation only, drafts flagged) → Global Constraints + DRAFT labels. Case studies, research detail, SEO/OG polish, and domain are Phase 2+.
- Placeholder scan: only explicit DRAFT markers remain (`hello@example.com`, LinkedIn URL, resume PDF, section copy) — each is owner-verified before launch, not shipped as final.
- Type consistency: `ThemeProvider`/`SiteHeader`/`SiteFooter` names match between Tasks 3 and 4; `/resume` GET signature matches App Router route-handler convention.
