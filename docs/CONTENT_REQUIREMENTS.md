# Content requirements and evidence inventory

## Editorial policy

The supplied conversation and existing website copy are planning inputs, not independent evidence. Verify each professional assertion before public release. This pass inspected repository text only; no external project, profile, publication, or deployment was verified.

Record each consequential claim with: claim ID, exact wording, related page, evidence URL or approved local reference, project version/date, review date, reviewer, disclosure permission, and decision (`unverified`, `verified`, `omit`). Keep private evidence outside the public repository; store only a safe reference and approval outcome.

Use evidence appropriate to the claim: source/release for implemented functionality, publisher record for publication status, a reproducible evaluation for a metric, and owner-approved records for employment or contributions. A repository URL alone does not prove every feature described. Owner confirmation can establish identity/preferences but is not a substitute for benchmark methodology.

## Initial inventory

All rows remain unresolved until evidence is supplied and checked, except rows
marked verified below (verification log at the end of this file).

| ID | Item / current observation | Evidence needed | Public action before verification |
| --- | --- | --- | --- |
| ID-01 | Name, AI Engineer headline, Dhaka location, availability | Owner confirmation of exact public wording | Keep as proposed positioning |
| BIO-01 | EEE degree and transition into AI | PARTIAL 2026-10-12: Crossref affiliation for RES-01 lists Faridpur Engineering College, Department of EEE. Qualification level, dates, and transition narrative still need owner records. | State only the Crossref-listed affiliation; omit degree specifics |
| BIO-02 | Employment, responsibilities, dates | Approved resume and disclosure review | Do not invent a timeline |
| PRJ-01 | AURA role says sole implementer; runtime/governance assertions exist | VERIFIED 2026-10-12: public repo `Adaptive-Intelligence-Research-Lab/AURA` (description matches); owner is lead contributor (70 commits as Mahmudun-Nobi, per API); stack from pyproject (Python ≥3.11, pydantic v2, pytest, ruff, mypy); v0.1.0 validation figures as reported in README (154 tests, ruff/mypy clean, 3 experiments, benchmarks — methodology not independently reviewed). Role reworded to lead contributor; capabilities beyond layer 2 marked future work. | Published with evidence links and as-reported framing |
| PRJ-02 | ACORD Document Intelligence has draft role, stack, dataset, pipeline | Approved contribution statement, anonymized samples, evaluation protocol, permission | No client documents or accuracy claims |
| PRJ-03 | Voice Mind currently says shipped | Working release/demo, platforms, role, implementation evidence | Treat shipped status and adoption as unverified |
| RES-01 | Insulator fault detection currently says published | VERIFIED 2026-10-12 via Crossref: "An Interpretable Attention-Guided Hybrid Framework for Power Line Insulator Fault Detection", first author Md. Mahmudun Nobi (+5 co-authors), publisher IEEE, DOI `10.1109/iceesi68020.2026.11583598`, venue ICEESI 2026 (Raigarh, India). Status `published` may be advertised with this citation. | Advertise only with the verified citation + DOI link |
| RES-02 | WBFVD colorization method and ongoing status | VERIFIED 2026-10-13 via Crossref: "WBFVD: A UNet-Based Deep Learning Model for True-to-Color Image Colorization of White-Background Fruits & Vegetables Dataset", owner is co-author (6th of 6; first author Mohammed Ahsan Hossain), publisher IEEE, DOI `10.1109/ncim65934.2025.11160093`, venue NCIM 2025 (Gazipur, Bangladesh). Status `published` may be advertised with this citation. | Advertise only with the verified citation + DOI link |
| RES-03 | AURA runtime research described as experiment | Objective, method, versioned artifacts, reproducible findings | No peer-review implication |
| WRT-01 | Two draft engineering articles exist | Author review, original experience, checked references and code | Do not present drafts as published articles |
| CON-01 | Contact email + LinkedIn | RESOLVED 2026-10-13: email `mdmnb435@gmail.com` supplied directly by owner (`gamil.com` spelling caught via MX check, confirmed as gmail). Format valid; inbox deliverability not independently verified. LinkedIn owner-supplied, browser check still advised. | Published; keep inbox monitored |
| CON-02 | GitHub profile path appears in current code | VERIFIED 2026-10-12: GitHub API `users/Nobi004` returns login `Nobi004`, name `Mahmudun Nobi`, location `Dhaka, Bangladesh`; local session authenticated as the same login. `https://github.com/Nobi004` is the owner-confirmed destination. | Existing link is verified identity |
| CV-01 | `public/resume/resume.pdf` exists | Inspect PDF, approve current content, dates and contact details | Do not infer readiness from existence |
| JOB-01 | Job Apply Agent / CareerOS at `Nobi004/Job_apply_agent` | VERIFIED 2026-10-12: private repo page supplied by owner (sole contributor Nobi004; FastAPI + SQLAlchemy + Next.js 14 + Docker; 19 Azure deployments; Oct 11 2026 release ed23e1d with 51 Python + 15 frontend tests and browser checks) corroborated by live product. Separately, owner supplied live product URL `https://careeros-app.azurewebsites.net/` — root marketing site verified live (HTTP 200): remote job discovery (Remotive), resume upload + local-rules feedback, interview prep templates, Google sign-in, free tier with stated limits; admin login at `/admin/login` also 200. Site's own copy disclaims paid AI and automatic applications. Ownership owner-asserted; stack, role, and repo access still pending. | Published with live demo + public repo links; contribution history verified (378 + 4 commits across owner accounts) |
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

## Verification log
| Date | Check | Method (public sources only) | Outcome |
| --- | --- | --- | --- |
| 2026-10-12 | GitHub identity (CON-02) | GitHub REST API `users/Nobi004` + local session login | Verified: login `Nobi004`, name `Mahmudun Nobi`, location Dhaka |
| 2026-10-12 | IEEE paper (RES-01) | Crossref REST API author/title query | Verified: IEEE ICEESI 2026, DOI `10.1109/iceesi68020.2026.11583598`, first author, 6 authors |
| 2026-10-12 | EEE affiliation (BIO-01, partial) | Crossref affiliation field on RES-01 | Corroborated: Faridpur Engineering College, Dept of EEE; degree/dates still pending |
| 2026-10-12 | AURA / Voice Mind repos (PRJ-01, PRJ-03) | GitHub REST API repo listing (56 public repos) | Not found: no public repo clearly matching AURA, Voice Mind, or ACORD (`accord25_extractor` has no description). Links stay unresolved. |
| 2026-10-12 | AURA repo direct URL (PRJ-01) | GitHub REST API `repos/Adaptive-Intelligence-Research-Lab/AURA` + README/pyproject/contributors/languages endpoints | Verified public: description, v0.1.0 scope, 70 commits by Mahmudun-Nobi, Python-only, pyproject stack. Case study rewritten from this evidence. |
| 2026-10-12 | Job Apply Agent (JOB-01) | GitHub REST API `repos/Nobi004/Job_apply_agent` + public repo name search | 404: unresolved. Owner must supply exact URL/visibility. |
| 2026-10-12 | CareerOS repo evidence (JOB-01) | Owner-supplied private repo page (structure, README, release notes, contributor list) + live product corroboration | Verified: sole contributor, stack, Oct 2026 release record. Case study published from this evidence. |
| 2026-10-12 | LinkedIn URL (CON-01) | Owner-supplied `https://www.linkedin.com/in/nobi004/`; automated fetch blocked (HTTP 999) | Accepted as owner-approved; browser eyeball-check still advised. |
| 2026-10-12 | Job repo pub/priv flip (JOB-01) | GitHub REST API + unauthenticated curl, twice | Briefly public (378 + 4 commits verified, case study linked), 404 again within the hour; delinked, history recorded as verified-while-public. |
| 2026-10-13 | WBFVD paper (RES-02) | Owner-supplied IEEE Xplore URL (document/11160093) + Crossref author/title lookup | Verified: IEEE NCIM 2025, DOI `10.1109/ncim65934.2025.11160093`, owner co-author (6th of 6). Entry published with citation. |

No private evidence was collected or stored. Owner-supplied secrets and contact details never enter this file.

## Known platform behaviors

- Unpublished/unknown detail slugs render the not-found page with HTTP 200 (soft 404) under this Next.js version's Cache Components PPR, despite `notFound()` + `instant = false` (`dynamic` configs are rejected). Mitigations in place: `noindex` on the fallback, exclusion from sitemap/listings/metadata, no inbound links. Revisit when the framework supports proper statuses for on-demand dynamic routes.
