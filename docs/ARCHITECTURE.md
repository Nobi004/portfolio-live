# Architecture

## Baseline and constraints

The inspected repository declares Next.js 16.4.0, React 19.3.0, TypeScript, Tailwind v4, `@next/mdx`, Zod, Shiki, next-themes, and Vercel Analytics. Dependency presence does not prove each feature is fully integrated. Preserve the existing application rather than regenerating it.

This plan follows the installed Next.js guides at `node_modules/next/dist/docs/01-app/02-guides/mdx.md`, `01-app/01-getting-started/05-server-and-client-components.md`, and `01-app/01-getting-started/14-metadata-and-og-images.md`. Read the relevant additional local guide before changing configuration, caching, routing, or deployment.

## Structure and responsibility

| Location | Responsibility |
| --- | --- |
| `src/app/` | Routes, layouts, metadata, sitemap, robots, resume response |
| `src/content/{projects,research,writing}/` | Trusted local MDX and exported metadata |
| `src/lib/{projects,research,writing}.ts` | Zod schemas, slug registries, content access |
| `src/lib/site.ts` | Site identity, description, canonical origin |
| `src/components/layout/` | Header, footer, theme control |
| `src/components/diagrams/` | Reusable accessible architecture visuals |
| `src/components/seo/` | Verified structured data |
| `src/mdx-components.tsx` | Shared MDX rendering components; required by App Router MDX |
| `public/resume/` | Approved public resume PDF |

Existing routes: `/`, `/projects`, `/projects/[slug]`, `/research`, `/research/[slug]`, `/writing`, `/writing/[slug]`, `/about`, `/contact`, and `/resume`. Keep optional `/uses` out of initial scope.

## Rendering and content flow

Trusted MDX → imported metadata → Zod validation → publication eligibility → listing/detail rendering → page metadata and sitemap.

The publication eligibility step is a planned addition. Current registries enumerate all entries and do not provide a publication gate. Use one shared eligible-content access path for lists, featured cards, detail routes, static params, sitemap, and structured data. An unpublished or unknown slug must return 404 in production. Known content with invalid metadata must fail validation/build with an actionable error rather than silently disappearing behind a generic 404.

Retain explicit slug registries for this small portfolio. Adding content requires one MDX file and one registry entry; it must not require a bespoke page component. Match filename and metadata slug. Keep exported metadata as the established contract; do not introduce a second frontmatter convention without a migration rationale.

Use Server Components for content and metadata, with small Client Components for navigation state or theme controls. Await dynamic route params as required by this version. Prerender eligible entries where supported; verify output from the installed framework. Static-first does not mean changing to `output: export`: the current PDF route and deployment configuration need separate compatibility review first.

## Publication contract to implement

Add an editorial state such as `draft | ready | published`, distinct from project status (`ongoing`, `shipped`, etc.) and research status (`published`, `accepted`, etc.). Record evidence references and review date in the content workflow. Only editorially published, validated entries may be exposed publicly. A research entry can describe a published paper while still being an editorial draft.

MDX is executable trusted repository content. Do not compile arbitrary visitor input or untrusted remote MDX. Keep credentials server-side and avoid unnecessary runtime fetching from GitHub or publication providers; use reviewed links and bounded snapshots instead.

## Metadata and deployment

Use `metadata` or `generateMetadata` in server components, supported metadata files for social images, and a single validated production origin. Fail a production readiness check if `NEXT_PUBLIC_SITE_URL` is missing or points to localhost. Generate canonical URLs, sitemap URLs, and JSON-LD from that origin and the same eligible content set. Structured data must not assert unverified employers, affiliations, or publications.

README reports Vercel auto-deployment from `main`; no live deployment was verified in this planning pass. Prefer the existing host until a concrete reason requires migration. Preview deployments containing drafts need access protection; `noindex` alone is not privacy protection. Public files are directly accessible even when routes hide their links.

Serve the approved PDF at `/resume` with the correct MIME type and a useful filename. Confirm content, readability, and current dates; file existence alone is insufficient. Remove stale or unapproved public assets before release.

## Integrations and trade-offs

Use direct email and profile links for v1. A form requires reliable delivery, validation, abuse protection, error states, and an explicit privacy decision before adding it. Analytics is optional and must not block rendering or capture message content. Existing security headers need deployment verification; do not claim security from configuration alone.

Avoid adding a CMS, database, queues, custom authentication, or an AI service for the present content volume. Local MDX favors versioned review and simplicity at the cost of repository-based editing. Revisit only when actual editorial needs justify it.
