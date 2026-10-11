# Portfolio Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a typed MDX content pipeline and three draft engineering case studies (AURA, ACORD Document Intelligence, Voice Mind) with a real projects index.

**Architecture:** Case studies live as `.mdx` files under `src/content/projects/`, each exporting a `metadata` object. A zod-validated loader (`src/lib/projects.ts`) supplies index and detail pages; detail pages render MDX via dynamic import with `generateStaticParams` and `dynamicParams = false`. AURA gets an inline-SVG architecture diagram component.

**Tech Stack:** Next.js 16 App Router + TypeScript + `@next/mdx` + `zod` + Tailwind v4 (prose via plain article styling; no typography plugin in this phase).

**Spec:** Strategic Master Plan v1.0 §5 (case-study template + 10-section spec), §13 (repo structure: `src/content/projects/`).

## Global Constraints

- Canonical work root `D:\End to End projects\portfolio\portfolio`, branch `feat/phase-2-case-studies`, base `main`.
- No invented metrics, benchmarks, or business-impact claims anywhere in draft copy. Anything unverified is labeled `DRAFT:` inline.
- Repository/demo URLs the owner has not confirmed are OMITTED from metadata (fields are optional) and noted as `DRAFT: link pending verification` in the Evidence section.
- Every task ends with `npm run typecheck` passing; tasks that add routes end with `npm run build` listing the new routes.
- Root layout props stay explicitly typed (`{ children: ReactNode }`); never use generated `LayoutProps` (broke CI in Phase 1).

---

## File Structure

- `src/lib/projects.ts` — `ProjectMetaSchema` (zod), `ProjectMeta` type, `PROJECT_SLUGS` const, `getAllProjectMeta()`, `getProjectMeta(slug)`.
- `src/types/mdx.d.ts` — ambient `*.mdx` module declaration (only if `@types/mdx` does not already provide one; check first).
- `src/content/projects/aura.mdx` — flagship case study, imports `AuraArchitecture`.
- `src/content/projects/document-intelligence.mdx` — ACORD applied-ML case study.
- `src/content/projects/voice-mind.mdx` — shipped voice-RAG case study.
- `src/components/diagrams/aura-architecture.tsx` — accessible inline-SVG logical architecture.
- `src/app/projects/page.tsx` (modify) — featured cards from `getAllProjectMeta()`.
- `src/app/projects/[slug]/page.tsx` — detail page, `generateStaticParams`, `generateMetadata` (no `dynamicParams` export: rejected under `cacheComponents`; unknown slugs 404 via `notFound()`).

### Task 1: Typed project content pipeline

**Files:**
- Create: `src/lib/projects.ts`, possibly `src/types/mdx.d.ts`
- Test: terminal — `npm run typecheck` passes

**Interfaces:**
- Consumes: `zod`, `@types/mdx`
- Produces: `ProjectMeta`, `PROJECT_SLUGS: ["aura", "document-intelligence", "voice-mind"]`, `getAllProjectMeta(): Promise<ProjectMeta[]>`, `getProjectMeta(slug: string): Promise<ProjectMeta>` (throws on unknown slug or schema mismatch)

- [ ] **Step 1: Check whether @types/mdx declares *.mdx modules**

Run: `node -e "const fs=require('fs'); const p=require.resolve('@types/mdx/package.json'); const dir=require('path').dirname(p); console.log(fs.readdirSync(dir))" && grep -r "declare module" node_modules/@types/mdx/ | head -5`
Expected: file list printed. If grep finds a `declare module '*.mdx'` (or `*.mdx` pattern), SKIP creating `src/types/mdx.d.ts`. Otherwise create it:

```ts
declare module "*.mdx" {
  import type { MDXComponents } from "mdx/types";
  import type { ComponentType } from "react";

  export const metadata: unknown;
  const MDXContent: ComponentType<{ components?: MDXComponents }>;
  export default MDXContent;
}
```

- [ ] **Step 2: Write src/lib/projects.ts**

```ts
import { z } from "zod";

export const ProjectMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  summary: z.string().max(600),
  role: z.string(),
  status: z.enum(["ongoing", "shipped", "research", "archived"]),
  stack: z.array(z.string()),
  featured: z.boolean(),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  paper: z.string().url().optional(),
});

export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;

export const PROJECT_SLUGS = ["aura", "document-intelligence", "voice-mind"] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export async function getProjectMeta(slug: string): Promise<ProjectMeta> {
  if (!(PROJECT_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Unknown project slug: ${slug}`);
  }
  const mod = await import(`@/content/projects/${slug}.mdx`);
  const meta = ProjectMetaSchema.parse(mod.metadata);
  if (meta.slug !== slug) {
    throw new Error(`Slug mismatch: file ${slug} exports metadata.slug ${meta.slug}`);
  }
  return meta;
}

export async function getAllProjectMeta(): Promise<ProjectMeta[]> {
  return Promise.all(PROJECT_SLUGS.map((slug) => getProjectMeta(slug)));
}
```

(Note: at this point no `.mdx` files exist yet, so importing this module is fine but calling the functions throws. Typecheck does not execute it.)

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS with no output (exit 0).

- [ ] **Step 4: Commit**

```bash
git add src/lib/projects.ts src/types/mdx.d.ts
git commit -m "feat: add typed project content pipeline"
```

(If `src/types/mdx.d.ts` was skipped in Step 1, commit only `src/lib/projects.ts`.)

### Task 2: AURA flagship case study + architecture diagram

**Files:**
- Create: `src/components/diagrams/aura-architecture.tsx`, `src/content/projects/aura.mdx`
- Test: terminal — `npm run typecheck` passes and MDX compiles (verified in Task 4 build; here typecheck suffices since no route consumes it yet)

**Interfaces:**
- Consumes: `ProjectMetaSchema` field names from Task 1 (slug, title, tagline, summary, role, status, stack, featured, github/demo/paper)
- Produces: `AuraArchitecture` component (no props), `aura.mdx` default export + `metadata` export satisfying `ProjectMeta`

- [ ] **Step 1: Write the AuraArchitecture SVG component**

```tsx
export function AuraArchitecture() {
  return (
    <svg
      role="img"
      aria-labelledby="aura-arch-title aura-arch-desc"
      viewBox="0 0 640 220"
      width="100%"
    >
      <title id="aura-arch-title">AURA logical architecture</title>
      <desc id="aura-arch-desc">
        Illustrative logical architecture, not a complete current-state diagram. User and application
        interface feeds a runtime kernel for orchestration, gated by governance, driving execution, with
        events flowing back to the interface.
      </desc>
      {["Interface", "Runtime Kernel", "Governance", "Execution", "Events"].map((label, i) => {
        const x = 8 + i * 126;
        return (
          <g key={label}>
            <rect x={x} y={70} width={118} height={80} rx={8} fill="none" stroke="currentColor" />
            <text x={x + 59} y={115} textAnchor="middle" fontSize={13} fill="currentColor">
              {label}
            </text>
            {i < 4 && (
              <text x={x + 122} y={115} textAnchor="middle" fontSize={16} fill="currentColor">
                →
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
```

Accessibility rule: every diagram component in this repo MUST include `<title>`, `<desc>`, `role="img"`, and a visible or sr-only caption stating when the diagram is illustrative rather than complete.

- [ ] **Step 2: Write src/content/projects/aura.mdx**

Frontmatter is via export (per Next MDX docs; gray-matter is not used for these files):

```mdx
import { AuraArchitecture } from "@/components/diagrams/aura-architecture";

export const metadata = {
  slug: "aura",
  title: "AURA — Adaptive AI Operating System",
  tagline: "Research-driven architecture for a governed, extensible personal AI agent runtime.",
  summary: "Personal AI agent runtime exploring how to coordinate tools and applications while keeping execution control, policy gating, and observability. Async event-driven orchestration with a governance layer; research-stage, capabilities clearly separated from plans.",
  role: "Designer and sole implementer: runtime kernel, orchestration, governance hooks, event bus, tests.",
  status: "ongoing",
  stack: ["Python", "AsyncIO", "Event-driven architecture", "Docker"],
  featured: true,
};

## 01 / Problem

How can an AI system coordinate tools and applications while maintaining execution control and observability?

DRAFT: expand target users (self-directed power users, researchers) before launch.

## 02 / Architecture

<AuraArchitecture />

Illustrative logical architecture, not a complete current-state diagram.

DRAFT: confirm layer names against the current codebase before launch.

## 03 / Engineering decisions

- Asynchronous execution isolates long-running tool calls from interaction latency.
- Event-driven behavior decouples orchestration stages; trade-off: harder to trace than direct calls, mitigated by the event log.
- Policy gating sits between orchestration and execution so unapproved actions never run.
- DRAFT: state-management and testing approach to be confirmed against the repo before launch.

## 04 / Evidence

DRAFT: repository URL pending verification. Release tags, test reports, and architecture decision records to be linked here before launch.

## 05 / Limitations and next steps

Implemented functionality is distinguished from research experiments and planned capabilities. DRAFT: enumerate both lists from the repo before launch.
```

Summary rule: `summary` ≤ 600 chars (schema-enforced), no success percentages, no benchmark numbers without a reproducible method.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/diagrams/aura-architecture.tsx src/content/projects/aura.mdx
git commit -m "feat: add AURA flagship case study and architecture diagram"
```

### Task 3: ACORD + Voice Mind case studies

**Files:**
- Create: `src/content/projects/document-intelligence.mdx`, `src/content/projects/voice-mind.mdx`
- Test: terminal — `npm run typecheck` passes

**Interfaces:**
- Consumes: `ProjectMetaSchema` from Task 1 (same contract as Task 2)
- Produces: two more `metadata` exports satisfying `ProjectMeta`; slugs `document-intelligence`, `voice-mind`

- [ ] **Step 1: Write document-intelligence.mdx**

```mdx
export const metadata = {
  slug: "document-intelligence",
  title: "ACORD Document Intelligence",
  tagline: "OCR and document understanding with structured extraction and model evaluation.",
  summary: "Applied-ML pipeline for OCR, document understanding, and structured information extraction, with explicit model evaluation. DRAFT: confirm datasets, metrics, and what may be disclosed before launch.",
  role: "DRAFT: confirm role and contributions before launch.",
  status: "ongoing",
  stack: ["Python", "OCR", "Computer Vision", "DRAFT: confirm stack"],
  featured: true,
};

## 01 / Problem

DRAFT: define document types, users, and the extraction accuracy problem before launch.

## 02 / Architecture

DRAFT: pipeline diagram (ingest → OCR → understanding → structured extraction → evaluation) before launch.

## 03 / Engineering decisions

DRAFT: OCR engine choice, extraction approach, and evaluation protocol before launch.

## 04 / Evidence

DRAFT: repository URL pending verification. Evaluation metrics and sample outputs to be linked here before launch.

## 05 / Limitations and next steps

DRAFT: enumerate before launch. No unverified accuracy claims.
```

- [ ] **Step 2: Write voice-mind.mdx**

```mdx
export const metadata = {
  slug: "voice-mind",
  title: "Voice Mind",
  tagline: "Shipped voice-based RAG application for real-world use.",
  summary: "Consumer AI application combining voice input with retrieval-augmented generation. DRAFT: confirm adoption figures, platforms, and stack against what is publicly verifiable before launch.",
  role: "DRAFT: confirm role and contributions before launch.",
  status: "shipped",
  stack: ["RAG", "Voice interfaces", "DRAFT: confirm stack"],
  featured: true,
};

## 01 / Problem

DRAFT: define the user problem (hands-free knowledge access) and target users before launch.

## 02 / Architecture

DRAFT: pipeline diagram (voice input → transcription → retrieval → generation → speech/output) before launch.

## 03 / Engineering decisions

DRAFT: transcription, chunking/retrieval, latency, and fallback decisions before launch.

## 04 / Evidence

DRAFT: repository/demo URL pending verification. Only publicly verifiable adoption evidence before launch.

## 05 / Limitations and next steps

DRAFT: enumerate before launch.
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects/document-intelligence.mdx src/content/projects/voice-mind.mdx
git commit -m "feat: add ACORD and Voice Mind draft case studies"
```

### Task 4: Projects index + detail pages

**Files:**
- Modify: `src/app/projects/page.tsx`
- Create: `src/app/projects/[slug]/page.tsx`
- Test: terminal — `npm run build` lists `/projects`, `/projects/aura`, `/projects/document-intelligence`, `/projects/voice-mind`

**Interfaces:**
- Consumes: `getAllProjectMeta`, `getProjectMeta`, `PROJECT_SLUGS` from Task 1; MDX default exports from Tasks 2–3
- Produces: routes `/projects`, `/projects/[slug]` (unknown slugs 404 via `notFound()`; no `dynamicParams` export — incompatible with `cacheComponents`)

- [ ] **Step 1: Rewrite the projects index**

```tsx
import Link from "next/link";
import { getAllProjectMeta } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getAllProjectMeta();
  return (
    <article>
      <h1>Projects</h1>
      <ul>
        {projects
          .filter((p) => p.featured)
          .map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`}>
                <h2>{p.title}</h2>
              </Link>
              <p>{p.tagline}</p>
              <p>{p.summary}</p>
              <p>
                Status: {p.status} · Role: {p.role}
              </p>
            </li>
          ))}
      </ul>
    </article>
  );
}
```

- [ ] **Step 2: Write the detail page**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PROJECT_SLUGS, getProjectMeta } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getProjectMeta((await params).slug);
    return { title: `${meta.title} — Projects`, description: meta.summary };
  } catch {
    return { title: "Project not found" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  let meta;
  try {
    meta = await getProjectMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/projects/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article>
      <p>Case study · Status: {meta.status}</p>
      <h1>{meta.title}</h1>
      <p>{meta.tagline}</p>
      <p>Role: {meta.role}</p>
      <p>Stack: {meta.stack.join(", ")}</p>
      <Post />
    </article>
  );
}
```

(Next 16: `params` is a Promise — awaited above. `notFound()` inside try/catch: `notFound()` throws a special internal error that must NOT be swallowed — the `catch { notFound(); }` only runs when `getProjectMeta` throws, and calling `notFound()` there rethrows correctly. Do not wrap the MDX import in the same try/catch.)

- [ ] **Step 3: Build and check routes**

Run: `npm run build`
Expected: `✓ Compiled successfully`; route list includes `/projects`, `/projects/aura`, `/projects/document-intelligence`, `/projects/voice-mind`; `/resume` still `ƒ`.

- [ ] **Step 4: Commit**

```bash
git add src/app/projects/page.tsx "src/app/projects/[slug]/page.tsx"
git commit -m "feat: add projects index and case-study detail pages"
```

### Task 5: Final gate, push, PR

**Files:**
- Modify: none (verification + integration only)
- Test: terminal — `npm run typecheck && npm run lint && npm run build` all pass on `main`-mergeable tree

**Interfaces:**
- Consumes: all tasks above
- Produces: pushed branch `feat/phase-2-case-studies`, PR against `main`

- [ ] **Step 1: Run the full gate**

Run: `npm run typecheck; if ($?) { npm run lint }; if ($?) { npm run build }`
Expected: all three PASS.

- [ ] **Step 2: Push and report (do NOT merge — integration decision belongs to the owner)**

```bash
git push -u origin feat/phase-2-case-studies
```

Then report the branch URL and wait for the owner's merge choice. Do not run `gh pr create` (stored token lacks repo access; owner creates the PR or grants access).

## Self-Review

- Spec coverage: §5 case-study template (problem → architecture → decisions → evidence → limitations) → Tasks 2–3 MDX; 10-section spec compressed to 5 draft sections per study with DRAFT markers for owner verification (full depth is a content task, not a code task); §13 `src/content/` structure → File Structure; SVG/Mermaid diagrams → Task 2 SVG component; typed schemas → Task 1.
- Placeholder scan: no TBD/TODO; only explicit `DRAFT:` copy markers (owner-verified pre-launch) and optional link fields omitted rather than faked.
- Type consistency: `ProjectMeta`/`ProjectSlug`/`PROJECT_SLUGS`/`getProjectMeta`/`getAllProjectMeta` names identical across Tasks 1 and 4; MDX `metadata` exports match `ProjectMetaSchema` keys; `params: Promise<{ slug }>` matches Next 16 convention used in the detail page.
