# Content requirements and evidence inventory

## Editorial policy

The supplied conversation and existing website copy are planning inputs, not independent evidence. Verify each professional assertion before public release. This pass inspected repository text only; no external project, profile, publication, or deployment was verified.

Record each consequential claim with: claim ID, exact wording, related page, evidence URL or approved local reference, project version/date, review date, reviewer, disclosure permission, and decision (`unverified`, `verified`, `omit`). Keep private evidence outside the public repository; store only a safe reference and approval outcome.

Use evidence appropriate to the claim: source/release for implemented functionality, publisher record for publication status, a reproducible evaluation for a metric, and owner-approved records for employment or contributions. A repository URL alone does not prove every feature described. Owner confirmation can establish identity/preferences but is not a substitute for benchmark methodology.

## Initial inventory

All rows remain unresolved until evidence is supplied and checked.

| ID | Item / current observation | Evidence needed | Public action before verification |
| --- | --- | --- | --- |
| ID-01 | Name, AI Engineer headline, Dhaka location, availability | Owner confirmation of exact public wording | Keep as proposed positioning |
| BIO-01 | EEE degree and transition into AI | Approved institution, qualification, dates, background | Omit unsupported specifics |
| BIO-02 | Employment, responsibilities, dates | Approved resume and disclosure review | Do not invent a timeline |
| PRJ-01 | AURA role says sole implementer; runtime/governance assertions exist | Repository/release, contribution history, execution tests, architecture review | Draft until verified; separate plans from implementation |
| PRJ-02 | ACORD Document Intelligence has draft role, stack, dataset, pipeline | Approved contribution statement, anonymized samples, evaluation protocol, permission | No client documents or accuracy claims |
| PRJ-03 | Voice Mind currently says shipped | Working release/demo, platforms, role, implementation evidence | Treat shipped status and adoption as unverified |
| RES-01 | Insulator fault detection currently says published | Exact title, author order, venue, year, DOI/publisher record | Do not advertise publication status as established |
| RES-02 | WBFVD colorization method and ongoing status | Approved manuscript/experiment, dataset, outputs, current status | Keep unpublished pending review |
| RES-03 | AURA runtime research described as experiment | Objective, method, versioned artifacts, reproducible findings | No peer-review implication |
| WRT-01 | Two draft engineering articles exist | Author review, original experience, checked references and code | Do not present drafts as published articles |
| CON-01 | Contact uses `hello@example.com` and generic LinkedIn homepage | Public email and exact owner-approved profile URLs | Replace before public launch |
| CON-02 | GitHub profile path appears in current code | Confirm owner and exact public destination | Existing link is a candidate, not verified identity |
| CV-01 | `public/resume/resume.pdf` exists | Inspect PDF, approve current content, dates and contact details | Do not infer readiness from existence |
| URL-01 | README gives a Vercel URL; domain suggestions exist in attachment | Confirm canonical origin and ownership | No domain availability or ownership claims |

Current content is registered for rendering even when it includes `DRAFT:`. Markers do not prevent public access. Implement publication gating before treating the inventory as a release safeguard.

## Case-study template

Each of the three flagship studies needs:

1. Title, one-sentence problem, and executive summary under 100 words.
2. Target users and constraints; why the problem matters.
3. Exact role, collaborators where relevant, and direct contributions.
4. Architecture with a version/date and accessible explanation.
5. Technology choices, alternatives, and explicit trade-offs.
6. Critical implementation details and a concrete challenge addressed.
7. Evaluation method, tests, baseline, measured results, and evidence links.
8. Limitations, failure cases, implemented capability list, and separate future work.
9. Verified repository, demo, documentation, or permitted substitute evidence.

For every numerical result include measurement scope, dataset/sample size where relevant, hardware/configuration, baseline, method, date/version, and limitations. If no defensible number exists, use precise qualitative evidence rather than inventing a metric. Adoption claims need a definition, timeframe, and source.

## Research and writing

Research must distinguish published, accepted, under review, ongoing research, and independent experiment. Include exact citation and author order, method, dataset rights/access, evaluation, limitations, and publisher link when available. Generate BibTeX only from verified metadata. Do not add ORCID or Scholar URLs until identity is confirmed.

Writing must explain a real decision or investigation, include original analysis and references, and distinguish example code from implemented project behavior. Dates must reflect publication rather than an invented posting history. Candidate topics include governed agent runtimes, document extraction evaluation, voice RAG trade-offs, and agent evaluation beyond demos.

## Publication workflow

Draft → evidence review → editorial/technical review → ready → published. This is the intended workflow; the current schemas do not yet encode it. Keep editorial state separate from research and project lifecycle status. Reject unresolved markers and placeholder URLs from published entries. Exclude drafts from public listings, detail routes, static params, metadata, structured data and sitemaps; do not rely only on hiding cards.

Before release, the owner confirms identity, resume, public contact, availability, disclosure rights and canonical URL. A technical reviewer checks the three case studies. No credentials or private datasets belong in the repository. Review published claims monthly and whenever underlying releases change.
