# Implementation plan

## Starting point

The repository already has core routes, MDX loaders, draft entries, a theme provider, metadata routes, a resume handler, and a GitHub Actions workflow. These are inspected files, not a verified production-readiness assessment. This planning pass changes documentation only. Historical plans in `docs/superpowers/plans/` remain available.

Implement in dependency order. Do not mark a phase done merely because its files exist. Every phase should record changes, checks run, failures or limitations, and outstanding evidence.

## Phase 1 — Evidence and publication controls

Collect the inputs in [the evidence inventory](CONTENT_REQUIREMENTS.md). Extend schemas with editorial publication state and build a shared eligible-content access layer. Audit static pages and public assets as well as MDX.

Acceptance criteria:

- Every existing consequential professional claim has a recorded evidence decision.
- Drafts are absent from public lists, featured modules, detail routes, static params, sitemap and structured data; direct draft URLs return 404.
- Invalid published metadata produces an actionable validation failure; unknown slugs return 404.
- Published content rejects unresolved draft markers and placeholder links.
- Focused checks cover published/draft/unknown slugs, slug mismatches, invalid metadata, and draft leakage through discovery surfaces.
- Missing owner evidence leaves affected content unpublished; it does not prevent independent layout work.

## Phase 2 — Design system and core experience

Apply [the design system](DESIGN_SYSTEM.md) to the existing header, footer, home, about, contact, and resume experience. Build reusable layout and content primitives without introducing a component framework solely for branding.

Acceptance criteria:

- Visitors can understand the proposed specialization and reach projects, resume, and contact without friction.
- Both themes are readable; theme preference persists without hydration errors.
- Mobile menu and all controls work by keyboard and touch; focus and reduced motion are respected.
- Representative pages pass the documented viewport/zoom inspection with no page overflow.
- Contact destinations and resume are approved before public exposure; no fake email or generic profile destination remains.

## Phase 3 — Engineering case studies

Complete AURA, Document Intelligence, and Voice Mind using the shared template. Add verified diagrams, contributions, choices, evaluation, limitations, and evidence links.

Acceptance criteria:

- Three complete studies receive technical review and meet the content checklist.
- No unsupported metrics, sole-ownership assertions, shipped claims, or future features presented as implemented.
- Diagrams are readable on mobile and have text equivalents.
- A fourth project can be added through MDX plus registry metadata without creating a new route template.

## Phase 4 — Research, writing, and discoverability

Finish approved research entries and at least one original reviewed article. Provide honest empty states for collections with no approved content. Review metadata, social previews, resume, robots, sitemap, and canonical configuration together.

Acceptance criteria:

- Research status, author order, citations and any BibTeX match verified records.
- Articles have original substance, checked references, real dates and accessible code.
- Every public page has a meaningful title and description; social image content is readable.
- Production origin is validated and all discovery surfaces agree on published URLs.
- Sitemap and structured data contain no drafts, placeholders, or localhost URLs.

## Phase 5 — Release verification

Run typecheck, lint and production build; inspect production output locally. Check actual CI results before release. Verify internal navigation, external contact/profile links, PDF delivery, invalid routes, and publication controls. Inspect both themes and run accessibility and performance audits against the production build.

Acceptance criteria:

- `npm run typecheck`, `npm run lint`, and `npm run build` pass; these are separate checks, not implied by a build alone.
- No broken internal links, missing assets, console errors, keyboard traps, or unresolved public placeholders.
- Target Lighthouse accessibility and performance scores of 95+ on representative home/list/detail pages; record tool version, device settings, route and results. Fix material failures or explicitly document unmet targets.
- Performance objectives: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Treat these as goals; prelaunch lab results do not establish real-user INP or field performance.
- HTTPS and response headers are checked on the eventual host, dependencies reviewed, and analytics (if enabled) confirmed not to collect personal message content.
- Owner content approval and technical case-study review are recorded. No public launch is declared while required content remains unresolved.

## Phase 6 — Deployment and use

When deployment is requested, confirm the production origin and hosting configuration, release the reviewed build, and verify the deployed routes, metadata, PDF, sitemap, and contact actions. Preserve a rollback path to the previous deployment. README reports automatic deployment from `main`, so pushing there is a release-affecting action.

Acceptance criteria:

- Deployment URL and canonical origin agree; no draft content or preview indexing leaks remain.
- Production smoke checks pass and rollback destination is known.
- Owner can link relevant case studies from applications, resume, GitHub and LinkedIn. Updating external profiles or sending outreach is a separate authorized action.
- Monthly maintenance covers claims, links, resume, dependency updates and, if configured, meaningful aggregate engagement signals.

## Deferred work

API Monitoring and Job Apply Agent case studies, larger writing search, interactive diagrams, monitoring widgets, and a source-grounded assistant are optional later phases. Do not block the initial portfolio on them. Any assistant requires an approved public corpus, source citations, uncertainty handling, rate/cost limits, prompt-injection defenses, and independent access to all ordinary pages.

## Next implementation task

Start with publication controls and the evidence inventory. Gather public email, exact profile URLs, an approved resume, project repository/demo/release references, publication records, permitted contributions, and canonical origin. Layout and schema work can proceed while evidence is pending; publishable professional copy depends on those inputs.
