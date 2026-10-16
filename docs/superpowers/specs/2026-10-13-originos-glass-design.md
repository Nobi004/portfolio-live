# OriginOS Glass Interactive Overhaul — Design Spec

**Status:** user-approved in chat (2026-10-13). Next: writing-plans → implementation plan.

**Goal:** Replace the dark editorial look with a light-first OriginOS-style glass aesthetic and make the portfolio genuinely interactive — widget home, clickable explorers, fluid motion — with zero new dependencies.

**Locked decisions:** light OriginOS default + dark-glass toggle; everything interactive (widget home + explorers + motion); SVG/code-drawn visuals only (unchanged).

## 0. Theme foundation

Light-first tokens: frosted surfaces (translucent white over a low-saturation ambient wash: pale blue/peach/mint blobs), ink text `#1a1d21`, pastel accents (blue/violet/coral, active states only), radii 20–28px, single subtle elevation. Dark-glass mirror tokens (frosted charcoal, deepened accents). `backdrop-blur` utilities with solid-color `@supports` fallback. Default theme flips to light; toggle kept. All pairs re-measured ≥4.5:1.

## 1. Glass component kit (`src/components/ui/`)

`GlassCard`, `Chip`, `SegmentedTabs` (pill tab bar, buttons + arrow-key support), `Disclosure` (styled details/summary), press-physics buttons (`:active` scale .97, 150ms). Keyboard-native, 44px targets, both themes.

## 2. Widget home

Bento grid 1→2→4 columns. Widgets: hero/clock (live Dhaka time + date, client-only, presentational), featured AURA panel, CareerOS panel, research card, writing/about/contact tiles. Every widget routes on tap; hover lift + press scale. Existing copy untouched; honest empty states kept.

## 3. Interactive explorers

AURA layer explorer (click layers 1–5 → detail panel; layer 2 deep-links Runtime Core), CareerOS pipeline stepper (prev/next, progress, URL-hash deep links), tabbed case-study sections (Overview/Architecture/Evidence/Limitations) following published MDX order, restyled citation expander. Progressive enhancement: no-JS shows full stacked content. Keyboard-operable throughout.

## 4. Motion system

Route-change fade/slide via `template.tsx` + CSS keyframes; staggered one-shot widget entrances (capped delays); press physics; theme crossfade. All behind `prefers-reduced-motion`. No scroll-jacking, parallax, or autoplay.

## 5. Assistant restyle

Launcher + panel rebuilt on the glass kit. API contract, guardrails, KB, and behavior completely unchanged.

## 6. Verification matrix

375/768/1280/1920 × light/dark: grid integrity, explorer usability, overflow, keyboard-only pass, focus, zoom, contrast re-measure. Real-device screenshots stay an owner pre-launch step.

## 7. Performance guard

Blur containment (`contain: paint`, limited radii), zero new deps, `next/font` retained. Targets: Lighthouse perf ≥90 / a11y 95+, LCP ≤2.5s, CLS ≤0.1. Fallback rule: if backdrop-blur tanks low-end perf, widen solid-surface fallback.

## Non-goals

No new copy claims (verified-only rule), publication gating untouched, no CMS/DB/auth, no paid services, no photography, no animation libraries.

## Self-review

- Placeholders: none — every phase names concrete artifacts and files.
- Consistency: tokens feed kit → home → explorers → motion; verification covers each; perf guard constrains blur use from phase 0.
- Scope: single implementation plan; phases ordered with Figure/diagram reuse from the visual-system work where applicable (AURA diagram embeds in explorer panels).
- Ambiguity resolved: "light default" = next-themes defaultTheme light with toggle kept; "clock widget" = presentational Dhaka time, not a claim; tab order follows MDX section order.
