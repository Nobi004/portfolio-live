import { describe, expect, it } from "vitest";
import { KB_CHUNKS } from "../kb-data";

// Keep UNPUBLISHED_SLUGS in sync with content: remove a slug here the moment
// its entry flips to published:true, and add its route to PUBLISHED_ROUTES.
const UNPUBLISHED_SLUGS = [
  "aura",
  "document-intelligence",
  "voice-mind",
  "wbfvd-colorization",
  "aura-runtime-research",
  "governed-agent-runtime",
  "evaluate-agentic-ai",
];

describe("generated KB", () => {
  it("contains only published entries", () => {
    expect(KB_CHUNKS.length).toBeGreaterThan(0);
    for (const c of KB_CHUNKS) {
      expect(c.sourceRoute).toMatch(/^\/(projects|research|writing)\//);
      expect(c.sourceTitle.length).toBeGreaterThan(0);
      expect(c.text.length).toBeGreaterThan(0);
    }
    const routes = KB_CHUNKS.map((c) => c.sourceRoute);
    for (const slug of UNPUBLISHED_SLUGS) {
      expect(routes.some((r) => r.endsWith(`/${slug}`))).toBe(false);
    }
  });
});
