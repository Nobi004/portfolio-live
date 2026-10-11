# Portfolio Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship research and writing sections (index + detail pages from typed MDX) plus the SEO and polish pass (metadata, OG image, JSON-LD, sitemap, security headers, skip link, 404 page, analytics).

**Architecture:** Research and writing mirror the proven Phase 2 projects pattern: `.mdx` files with exported `metadata` under `src/content/research/` and `src/content/writing/`, zod-validated loaders in `src/lib/`, `generateStaticParams` detail pages. Polish is additive: site URL config, root metadata template, `opengraph-image.tsx`, JSON-LD component, `sitemap.ts`/`robots.ts`, headers in `next.config.ts`, skip link, `not-found.tsx`, Vercel Analytics.

**Tech Stack:** Next.js 16 App Router + TypeScript + `@next/mdx` + `zod` + `next/og` (ImageResponse) + `@vercel/analytics`.

**Spec:** Strategic Master Plan v1.0 §6 (research categories + exact status labels), §8 (writing: decision-focused articles), §14 (SEO, a11y, security, performance targets).

## Global Constraints

- Canonical work root `D:\End to End projects\portfolio\portfolio`, branch `feat/phase-3-research-writing-polish`, base `main`.
- Status labels use ONLY: `published`, `accepted`, `under-review`, `ongoing`, `experiment`. Never present a presentation/manuscript as an indexed paper.
- No invented metrics, DOIs, venue details, or URLs. Unverified facts are `DRAFT:` inline; unknown links are omitted, never faked.
- Root layout props stay explicitly typed; no generated `LayoutProps`; no `dynamicParams` export under `cacheComponents`.
- Every task ends with `npm run typecheck` passing; tasks adding routes end with `npm run build` listing them.

---

## File Structure

- `src/lib/research.ts` — `ResearchMetaSchema`, `ResearchMeta`, `RESEARCH_SLUGS`, `getResearchMeta`, `getAllResearchMeta`.
- `src/content/research/insulator-fault-detection.mdx`, `wbfvd-colorization.mdx`, `aura-runtime-research.mdx`.
- `src/app/research/page.tsx` (modify), `src/app/research/[slug]/page.tsx`.
- `src/lib/writing.ts` — `ArticleMetaSchema`, `ArticleMeta`, `ARTICLE_SLUGS`, `getArticleMeta`, `getAllArticleMeta`.
- `src/content/writing/governed-agent-runtime.mdx`, `evaluate-agentic-ai.mdx`.
- `src/app/writing/page.tsx` (modify), `src/app/writing/[slug]/page.tsx`.
- `src/lib/site.ts` — `siteUrl`, `siteName`, `siteDescription` (env-overridable, localhost fallback).
- `src/app/layout.tsx` (modify) — metadataBase, title template, Open Graph, skip link, Analytics, main id.
- `src/app/opengraph-image.tsx` — 1200×630 OG image.
- `src/components/seo/person-jsonld.tsx` — Person JSON-LD (GitHub sameAs only; LinkedIn omitted until URL verified).
- `src/app/sitemap.ts`, `src/app/robots.ts`.
- `next.config.ts` (modify) — security headers.
- `src/app/globals.css` (modify) — skip-link + focus-visible styles.
- `src/app/not-found.tsx`.

### Task 1: Research section

**Files:**
- Create: `src/lib/research.ts`, `src/content/research/*.mdx` (3), `src/app/research/[slug]/page.tsx`
- Modify: `src/app/research/page.tsx`
- Test: terminal — `npm run build` lists `/research`, `/research/insulator-fault-detection`, `/research/wbfvd-colorization`, `/research/aura-runtime-research`

**Interfaces:**
- Consumes: `zod`, `@types/mdx` (existing ambient declarations, no new d.ts)
- Produces: `ResearchMeta`, `RESEARCH_SLUGS`, `getResearchMeta(slug)`, `getAllResearchMeta()`, routes `/research`, `/research/[slug]`

- [ ] **Step 1: Write src/lib/research.ts**

```ts
import { z } from "zod";

export const ResearchMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  summary: z.string().max(600),
  status: z.enum(["published", "accepted", "under-review", "ongoing", "experiment"]),
  venue: z.string().optional(),
  year: z.string().regex(/^\d{4}$/).optional(),
  doiUrl: z.string().url().optional(),
  bibtex: z.string().optional(),
});

export type ResearchMeta = z.infer<typeof ResearchMetaSchema>;

export const RESEARCH_SLUGS = [
  "insulator-fault-detection",
  "wbfvd-colorization",
  "aura-runtime-research",
] as const;

export async function getResearchMeta(slug: string): Promise<ResearchMeta> {
  if (!(RESEARCH_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Unknown research slug: ${slug}`);
  }
  const mod = await import(`@/content/research/${slug}.mdx`);
  const meta = ResearchMetaSchema.parse(mod.metadata);
  if (meta.slug !== slug) {
    throw new Error(`Slug mismatch: file ${slug} exports metadata.slug ${meta.slug}`);
  }
  return meta;
}

export async function getAllResearchMeta(): Promise<ResearchMeta[]> {
  return Promise.all(RESEARCH_SLUGS.map((slug) => getResearchMeta(slug)));
}
```

- [ ] **Step 2: Write the three research entries**

```mdx
// src/content/research/insulator-fault-detection.mdx
export const metadata = {
  slug: "insulator-fault-detection",
  title: "Power Line Insulator Fault Detection",
  tagline: "Interpretable attention-guided hybrid framework.",
  summary: "Research on interpretable attention-guided hybrid models for power-line insulator fault detection. DRAFT: confirm citation, IEEE link, dataset, metrics, and limitations before launch.",
  status: "published",
  venue: "DRAFT: confirm venue before launch.",
  year: "DRAFT: confirm year (YYYY) before launch.",
};

## Problem

DRAFT: problem statement, dataset, and evaluation metrics before launch.

## Method

DRAFT: architecture summary before launch.

## Limitations

DRAFT: limitations before launch. No unverified accuracy claims.
```

```mdx
// src/content/research/wbfvd-colorization.mdx
export const metadata = {
  slug: "wbfvd-colorization",
  title: "WBFVD — Image Colorization Research",
  tagline: "Deep-learning true-to-color reconstruction using U-Net.",
  summary: "Deep-learning-based true-to-color image reconstruction using U-Net. DRAFT: confirm publication status, experimental comparisons, and quantitative results before launch.",
  status: "ongoing",
};

## Problem

DRAFT: colorization problem framing before launch.

## Method

DRAFT: U-Net setup and training details before launch.

## Limitations

DRAFT: limitations and example outputs before launch.
```

```mdx
// src/content/research/aura-runtime-research.mdx
export const metadata = {
  slug: "aura-runtime-research",
  title: "AURA Runtime Research",
  tagline: "Experiments in runtime behavior, governance, and evidence reconstruction.",
  summary: "Independent experiments on agent runtime behavior, governance gating, and evidence reconstruction. Hypotheses clearly marked as such; only reproducible findings reported as findings.",
  status: "experiment",
};

## Objective

DRAFT: experimental objectives before launch.

## Method

DRAFT: methodology before launch. Hypotheses are labeled hypotheses, not results.

## Limitations

Independent experiment, not peer-reviewed work. DRAFT: reproducible findings before launch.
```

(Year rule: `year` must be `YYYY` or omitted — the insulator entry above uses a DRAFT string which FAILS the regex, so OMIT `year` there until verified. Do not commit the file with `year: "DRAFT..."`. Same for any field with a format constraint.)

- [ ] **Step 3: Rewrite research index + write detail page**

```tsx
// src/app/research/page.tsx
import Link from "next/link";
import { getAllResearchMeta } from "@/lib/research";

export default async function ResearchPage() {
  const entries = await getAllResearchMeta();
  return (
    <article>
      <h1>Research</h1>
      <ul>
        {entries.map((e) => (
          <li key={e.slug}>
            <Link href={`/research/${e.slug}`}>
              <h2>{e.title}</h2>
            </Link>
            <p>{e.tagline}</p>
            <p>
              Status: {e.status}
              {e.venue ? ` · ${e.venue}` : ""}
              {e.year ? ` · ${e.year}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
```

```tsx
// src/app/research/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RESEARCH_SLUGS, getResearchMeta } from "@/lib/research";

export function generateStaticParams() {
  return RESEARCH_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getResearchMeta((await params).slug);
    return { title: `${meta.title} — Research`, description: meta.summary };
  } catch {
    return { title: "Research entry not found" };
  }
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  let meta;
  try {
    meta = await getResearchMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/research/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article>
      <p>
        Status: {meta.status}
        {meta.venue ? ` · ${meta.venue}` : ""}
      </p>
      <h1>{meta.title}</h1>
      <p>{meta.tagline}</p>
      <Post />
      {meta.bibtex ? (
        <section aria-label="Citation">
          <h2>Cite</h2>
          <pre>{meta.bibtex}</pre>
        </section>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 4: Build and check routes**

Run: `npm run build`
Expected: compiled successfully; routes include `/research`, all three `/research/[slug]` entries.

- [ ] **Step 5: Commit**

```bash
git add src/lib/research.ts src/content/research src/app/research
git commit -m "feat: add research section with three entries"
```

### Task 2: Writing section

**Files:**
- Create: `src/lib/writing.ts`, `src/content/writing/*.mdx` (2), `src/app/writing/[slug]/page.tsx`
- Modify: `src/app/writing/page.tsx`
- Test: terminal — `npm run build` lists `/writing`, `/writing/governed-agent-runtime`, `/writing/evaluate-agentic-ai`

**Interfaces:**
- Consumes: `zod`, `@types/mdx`
- Produces: `ArticleMeta`, `ARTICLE_SLUGS`, `getArticleMeta(slug)`, `getAllArticleMeta()`, routes `/writing`, `/writing/[slug]`

- [ ] **Step 1: Write src/lib/writing.ts**

```ts
import { z } from "zod";

export const ArticleMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()),
});

export type ArticleMeta = z.infer<typeof ArticleMetaSchema>;

export const ARTICLE_SLUGS = ["governed-agent-runtime", "evaluate-agentic-ai"] as const;

export async function getArticleMeta(slug: string): Promise<ArticleMeta> {
  if (!(ARTICLE_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Unknown article slug: ${slug}`);
  }
  const mod = await import(`@/content/writing/${slug}.mdx`);
  const meta = ArticleMetaSchema.parse(mod.metadata);
  if (meta.slug !== slug) {
    throw new Error(`Slug mismatch: file ${slug} exports metadata.slug ${meta.slug}`);
  }
  return meta;
}

export async function getAllArticleMeta(): Promise<ArticleMeta[]> {
  const metas = await Promise.all(ARTICLE_SLUGS.map((slug) => getArticleMeta(slug)));
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1));
}
```

- [ ] **Step 2: Write the two seed articles** (decision-focused, from personal implementation experience; no generic AI news; each ends with trade-offs. Keep each body tight — the positions below are the full draft skeleton; expand with implementation detail only where already verified.)

```mdx
// src/content/writing/governed-agent-runtime.mdx
export const metadata = {
  slug: "governed-agent-runtime",
  title: "Designing a Governed AI Agent Runtime",
  summary: "Why policy gating belongs between orchestration and execution, and what it costs.",
  date: "2026-10-11",
  tags: ["agents", "architecture", "governance"],
};

## The problem with ungoverned tool use

An agent that can call tools without a control point can take unapproved actions. DRAFT: ground in AURA implementation detail before launch.

## Where the gate goes

Policy checks sit between orchestration and execution: orchestration proposes, governance disposes, execution runs only approved actions.

## Trade-offs

A gate adds latency and can block legitimate work when policies are too coarse. DRAFT: quantify from AURA event logs before launch — no invented numbers.
```

```mdx
// src/content/writing/evaluate-agentic-ai.mdx
export const metadata = {
  slug: "evaluate-agentic-ai",
  title: "How to Evaluate Agentic AI Beyond Demo Success",
  summary: "Demos pass; systems must be measured. What to track instead of vibes.",
  date: "2026-10-11",
  tags: ["agents", "evaluation"],
};

## Demo success is not system success

A golden-path demo exercises one trajectory. Production exercises the distribution. DRAFT: illustrate with ACORD evaluation protocol before launch.

## What to measure

Task completion rate, tool-call precision, recovery rate after failure, cost per task. DRAFT: define each metric precisely before launch.

## Trade-offs

Evaluation harnesses cost engineering time and can ossify behavior. Measure the load-bearing paths; sample the rest.
```

- [ ] **Step 3: Rewrite writing index + write detail page**

```tsx
// src/app/writing/page.tsx
import Link from "next/link";
import { getAllArticleMeta } from "@/lib/writing";

export default async function WritingPage() {
  const articles = await getAllArticleMeta();
  return (
    <article>
      <h1>Writing</h1>
      <ul>
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/writing/${a.slug}`}>
              <h2>{a.title}</h2>
            </Link>
            <p>{a.summary}</p>
            <p>
              {a.date} · {a.tags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
```

```tsx
// src/app/writing/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ARTICLE_SLUGS, getArticleMeta } from "@/lib/writing";

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getArticleMeta((await params).slug);
    return { title: `${meta.title} — Writing`, description: meta.summary };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  let meta;
  try {
    meta = await getArticleMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/writing/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article>
      <h1>{meta.title}</h1>
      <p>
        {meta.date} · {meta.tags.join(", ")}
      </p>
      <Post />
    </article>
  );
}
```

- [ ] **Step 4: Build and check routes**

Run: `npm run build`
Expected: compiled successfully; routes include `/writing` and both article slugs.

- [ ] **Step 5: Commit**

```bash
git add src/lib/writing.ts src/content/writing src/app/writing
git commit -m "feat: add writing section with two seed articles"
```

### Task 3: SEO core (site config, metadata, OG, JSON-LD, sitemap, robots)

**Files:**
- Create: `src/lib/site.ts`, `src/app/opengraph-image.tsx`, `src/components/seo/person-jsonld.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/layout.tsx`
- Test: terminal — `npm run build` lists `/opengraph-image`, `/sitemap.xml`, `/robots.txt`

**Interfaces:**
- Consumes: `PROJECT_SLUGS`, `RESEARCH_SLUGS`, `ARTICLE_SLUGS`; `siteUrl` used by sitemap/robots/metadataBase
- Produces: `siteUrl: string`, `siteName: string`, `siteDescription: string`; `PersonJsonLd` component (no props)

- [ ] **Step 1: Write src/lib/site.ts**

```ts
export const siteName = "Md. Mahmudun Nobi — AI Engineer";

export const siteDescription =
  "AI Engineer focused on agentic systems, applied machine learning, document intelligence, and production software architecture.";

// Set NEXT_PUBLIC_SITE_URL at deploy time (e.g. https://nobi.dev). Localhost fallback is dev-only.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
```

- [ ] **Step 2: Extend layout metadata + JSON-LD (edit src/app/layout.tsx)**

Replace the existing `metadata` export with:

```tsx
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { PersonJsonLd } from "@/components/seo/person-jsonld";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: "%s — Md. Mahmudun Nobi" },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Md. Mahmudun Nobi",
    title: siteName,
    description: siteDescription,
  },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription },
};
```

Render `<PersonJsonLd />` inside `<html>` (before `<body>` is valid placement for a script): add it as the first child of `<html lang="en" suppressHydrationWarning>`. Keep everything else in the file unchanged.

- [ ] **Step 3: Write person-jsonld.tsx, opengraph-image.tsx, sitemap.ts, robots.ts**

```tsx
// src/components/seo/person-jsonld.tsx
import { siteDescription, siteUrl } from "@/lib/site";

export function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Md. Mahmudun Nobi",
    jobTitle: "AI Engineer",
    description: siteDescription,
    url: siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
    sameAs: ["https://github.com/Nobi004"],
  };
  return <script type="application/ld+json">{JSON.stringify(json)}</script>;
}
```

(LinkedIn joins `sameAs` only after its URL is verified — never invent profile URLs.)

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#101014",
          color: "#f2f2f0",
        }}
      >
        <div style={{ fontSize: 32 }}>MD. MAHMUDUN NOBI / AI ENGINEER</div>
        <div style={{ fontSize: 64, marginTop: 24 }}>
          Building intelligent systems that work beyond the prototype.
        </div>
      </div>
    ),
    { ...size },
  );
}
```

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { ARTICLE_SLUGS } from "@/lib/writing";
import { PROJECT_SLUGS } from "@/lib/research";
```

STOP — that import is wrong. Correct imports:

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { ARTICLE_SLUGS } from "@/lib/writing";
import { PROJECT_SLUGS } from "@/lib/projects";
import { RESEARCH_SLUGS } from "@/lib/research";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/projects", "/research", "/writing", "/about", "/contact", "/resume"];
  const dynamics = [
    ...PROJECT_SLUGS.map((s) => `/projects/${s}`),
    ...RESEARCH_SLUGS.map((s) => `/research/${s}`),
    ...ARTICLE_SLUGS.map((s) => `/writing/${s}`),
  ];
  return [...statics, ...dynamics].map((path) => ({ url: `${siteUrl}${path}` }));
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
```

(`/resume` in sitemap serves a PDF route — allowed; it returns content with 200.)

- [ ] **Step 4: Build and check**

Run: `npm run build`
Expected: compiled successfully; route list includes `/opengraph-image`, `/robots.txt`, `/sitemap.xml`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/app/opengraph-image.tsx src/components/seo/person-jsonld.tsx src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx
git commit -m "feat: add SEO core (metadata, OG image, JSON-LD, sitemap, robots)"
```

### Task 4: Polish (headers, skip link, 404, analytics)

**Files:**
- Modify: `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `src/app/not-found.tsx`
- Test: terminal — full gate `npm run typecheck && npm run lint && npm run build` passes; `curl` the dev server `/` and confirm `strict-transport-security` header present (best verified post-deploy; locally assert config compiles via build)

**Interfaces:**
- Consumes: layout structure from Phase 1 (header/main/footer inside ThemeProvider)
- Produces: security headers on all routes; skip link targeting `#main-content`; styled `:focus-visible`; `not-found` route; `<Analytics />` mounted

- [ ] **Step 1: Install @vercel/analytics and mount it**

```bash
npm install @vercel/analytics
```

Edit `src/app/layout.tsx`: add `import { Analytics } from "@vercel/analytics/react";` and render `<Analytics />` inside `<body>`, after `<SiteFooter />` (still inside `ThemeProvider`; order irrelevant, keep it last).

- [ ] **Step 2: Add security headers to next.config.ts**

Inside `nextConfig` (before the `withMDX` wrap — the object literal already exists, add the key), insert:

```ts
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ];
},
```

(No CSP yet — MDX/inline-script hashes would need per-deploy tuning; record as Phase 4 follow-up, not a silent omission.)

- [ ] **Step 3: Skip link + main id + focus styles**

In `src/app/layout.tsx`: insert `<a href="#main-content" className="skip-link">Skip to content</a>` as the first child of `<body>` (before `ThemeProvider` so it is always first in tab order), and change `<main>` to `<main id="main-content">`.

Append to `src/app/globals.css`:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 50;
  padding: 0.5rem 1rem;
  background: var(--foreground);
  color: var(--background);
}
.skip-link:focus {
  left: 0;
}
:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

- [ ] **Step 4: Write not-found.tsx**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <article>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </article>
  );
}
```

- [ ] **Step 5: Run the full gate**

Run: `npm run typecheck; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: all three PASS; build lists all Phase 2 routes plus `/opengraph-image`, `/robots.txt`, `/sitemap.xml`, `/_not-found`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts src/app/layout.tsx src/app/globals.css src/app/not-found.tsx
git commit -m "feat: add security headers, skip link, 404 page, analytics"
```

### Task 5: Final gate, push, report

**Files:**
- Modify: none (verification + integration only)
- Test: terminal — `npm run typecheck && npm run lint && npm run build` all pass

**Interfaces:**
- Consumes: all tasks above
- Produces: pushed branch `feat/phase-3-research-writing-polish`; no merge (owner decides)

- [ ] **Step 1: Run the full gate once more on the final tree**

Run: `npm run typecheck; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: all three PASS.

- [ ] **Step 2: Push and report (do NOT merge)**

```bash
git push -u origin feat/phase-3-research-writing-polish
```

Then report the branch URL and wait for the owner's merge choice. Do not run `gh pr create` (stored token lacks repo access).

## Self-Review

- Spec coverage: §6 categories + exact status labels → Task 1 (insulator/WBFVD/AURA-runtime, BibTeX slot, venue/DOI optional); §8 decision-articles → Task 2 (two seed articles with trade-offs, no generic news); §14 SEO (titles, descriptions, OG, JSON-LD, sitemap, canonical via metadataBase) → Task 3; a11y (skip link, focus, semantic HTML, diagram text alternatives from Phase 2) → Task 4; security headers → Task 4; perf (static-first, next/font already, no new JS except Analytics) → Tasks 3–4. Analytics → Task 4 (Vercel, privacy-conscious). Monitoring beyond build/CI deferred with reason (needs provider + domain).
- Placeholder scan: no TBD/TODO; `DRAFT:` markers only for owner-verified facts; localhost fallback in site.ts is labeled dev-only with the deploy-time env var named.
- Type consistency: `ResearchMeta`/`RESEARCH_SLUGS`/`getResearchMeta`/`getAllResearchMeta` and `ArticleMeta`/`ARTICLE_SLUGS`/`getArticleMeta`/`getAllArticleMeta` used identically in loaders, indexes, and detail pages; `siteUrl`/`siteName`/`siteDescription` shared by layout/sitemap/robots/JSON-LD.
