import { describe, expect, it } from "vitest";
import { KB_CHUNKS } from "../kb-data";

describe("generated KB", () => {
  it("has chunks from all three sections", () => {
    const routes = new Set(KB_CHUNKS.map((c) => c.sourceRoute.split("/")[1]));
    expect(routes).toEqual(new Set(["projects", "research", "writing"]));
  });
  it("every chunk has a route, title, and non-empty text", () => {
    for (const c of KB_CHUNKS) {
      expect(c.sourceRoute).toMatch(/^\/(projects|research|writing)\//);
      expect(c.sourceTitle.length).toBeGreaterThan(0);
      expect(c.text.length).toBeGreaterThan(0);
    }
  });
});
