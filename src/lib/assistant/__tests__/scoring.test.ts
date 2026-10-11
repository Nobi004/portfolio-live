import { describe, expect, it } from "vitest";
import { buildContext, retrieve, tokenize, type KbChunk } from "../kb";

const CHUNKS: KbChunk[] = [
  { sourceRoute: "/projects/aura", sourceTitle: "AURA", heading: "Architecture", text: "runtime kernel orchestration governance execution events" },
  { sourceRoute: "/writing/x", sourceTitle: "Other", heading: "", text: "completely unrelated baking recipes" },
];

describe("tokenize", () => {
  it("lowercases, drops stopwords and short tokens", () => {
    expect(tokenize("What IS the AURA runtime?")).toContain("aura");
    expect(tokenize("What IS the AURA runtime?")).not.toContain("what");
  });
});

describe("retrieve", () => {
  it("ranks the overlapping chunk first", () => {
    const r = retrieve("Explain the AURA runtime kernel architecture", CHUNKS, 4);
    expect(r.chunks[0].sourceRoute).toBe("/projects/aura");
    expect(r.topScore).toBeGreaterThan(0);
  });
  it("returns empty chunks and zero score for unrelated queries", () => {
    const r = retrieve("quantum banana teleportation zebra", CHUNKS, 4);
    expect(r.chunks).toEqual([]);
    expect(r.topScore).toBe(0);
  });
});

describe("buildContext", () => {
  it("stays within the word budget", () => {
    const ctx = buildContext(CHUNKS, 5);
    expect(ctx.split(/\s+/).length).toBeLessThanOrEqual(20);
  });
});
