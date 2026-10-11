# portfolio-live

Personal engineering portfolio — **Md. Mahmudun Nobi, AI Engineer (Agentic Systems & AI Architecture).**

Live: **https://mahamudunnobi.vercel.app**

Built with Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + MDX (`@next/mdx`) + Zod-typed content + Shiki. Deployed on Vercel from `main` (auto-deploy on push).

## Structure

- `src/app/` — routes: `/`, `/projects`, `/research`, `/writing`, `/about`, `/contact`, `/resume` (+ `[slug]` detail pages, `/sitemap.xml`, `/robots.txt`, OG image)
- `src/content/{projects,research,writing}/` — MDX case studies, research entries, articles (each exports zod-validated `metadata`)
- `src/lib/` — typed content loaders (`projects.ts`, `research.ts`, `writing.ts`) + site config (`site.ts`)
- `src/components/` — layout, diagrams, SEO primitives
- `docs/superpowers/plans/` — phased implementation plans

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run typecheck
npm run lint
npm run build    # full gate: typecheck + lint + build must pass
```

CI (`.github/workflows/ci.yml`) runs typecheck, lint, and build on every push/PR.

## Configuration

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (production env is set in Vercel; defaults to `http://localhost:3000` for local dev). Used by metadata, sitemap, robots, and JSON-LD.

## Content status

Case studies, research entries, and articles currently carry `DRAFT:` markers wherever facts (repo URLs, metrics, venues, dates) still need owner verification. Nothing launches as final until every `DRAFT:` is resolved — see the Definition of Done in the strategic master plan.
