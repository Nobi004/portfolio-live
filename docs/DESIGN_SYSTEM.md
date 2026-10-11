# Design system

## Direction

Technical editorial: clear type, intentional whitespace, fine borders, and diagrams grounded in the work. Dark by default with a persistent light option. These are target specifications, not a claim that the current CSS already implements them.

## Tokens

| Token | Dark | Light |
| --- | --- | --- |
| Canvas | `#101014` | `#FAFAFA` |
| Surface | `#18181F` | `#FFFFFF` |
| Primary text | `#F2F2F0` | `#111111` |
| Secondary text | `#B4B4BF` | `#52525B` |
| Accent / link | `#67D4E8` | `#086B83` |
| Decorative border | `#33333D` | `#D4D4D8` |

Measure contrast on actual rendered combinations before acceptance: 4.5:1 for normal text, 3:1 for large text and meaningful UI boundaries. Decorative border tokens are not suitable as the sole indicator of a control. Underline prose links; never encode status with color alone.

Use Geist Sans for body and headings, Geist Mono for short technical labels and code, with resilient system fallbacks. Load fonts through the existing framework mechanism and verify that body styles actually use the font token. No additional font family is needed for v1.

| Element | Target |
| --- | --- |
| Body | 16–18px, line height 1.6–1.75 |
| Hero title | Fluid 36–72px, line height about 1.08 |
| Section title | Fluid 28–40px, line height about 1.2 |
| Technical label | 12–14px; keep long text out of uppercase |
| Article measure | 65–75 characters |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96px |
| Content width | Up to 1200px, centered |
| Page gutter | 20px phone, 32px tablet, 48px desktop |
| Corners | 6–12px; subtle and consistent |

Use a 12-column desktop grid, adapting to two or one column as content requires. Prefer layout breakpoints around 640, 768, and 1024px, validated against actual content. Avoid fixed heights for text. At 320px wide, the page must not horizontally overflow; allow contained scrolling for code and large diagrams.

## Component requirements

- Header: identity plus six primary destinations; visible active state, skip link, keyboard-accessible mobile navigation with expanded state and reliable close/focus behavior.
- Hero: one h1, concise specialization, project and resume links, verified availability only. No animated typing or artificial status indicators.
- Project preview: title, problem, contribution summary, truthful status, concise technologies, explicit case-study link. Keep nested actions outside an all-clickable card.
- Case study: summary, contribution, problem, readable architecture, decisions and alternatives, evidence, limitations, next steps, repository/demo links when verified.
- Research entry: exact title, authorship and status, verified citation, paper link, reproducible supporting material when available.
- Article: heading hierarchy, date, accessible code blocks, readable tables, useful inline references. Avoid elaborate search UI for two posts.
- Contact: direct verified email and profile links; no account or chatbot required.
- Footer: compact navigation and professional links; no invented copyright entity or credentials.

Use descriptive link labels and real controls. If data is missing, omit the unavailable action or keep the entry unpublished; do not use `#` links or fake disabled navigation. Empty public collections should have an honest short explanation and a useful onward link, without displaying draft titles as published work.

## Diagrams and motion

Use SVG or semantic HTML/React diagrams with text explanations; include an accessible name and preserve reading order. Mark conceptual diagrams as illustrative until verified against implementation. Provide a legible mobile alternative for dense systems. Do not use generated imagery as evidence of a real project.

Transitions should be short, around 120–200ms, and limited to useful feedback. Honor `prefers-reduced-motion`. No autoplay, parallax, decorative 3D brains, or animation that delays content. Keep focus indicators visible in both themes and touch targets at least 44px where practical.

## Visual acceptance

Inspect home, listing, detail, contact, and error pages at 320, 390, 768, and 1440px in both themes. Check long titles, sparse content, keyboard focus, menu operation, 200% zoom, reduced motion, and image/diagram loading. Capture representative screenshots and resolve clipping, layout shifts, unreadable code, and inconsistent spacing before calling visual design complete.
