import { describe, expect, it } from "vitest";
import { assertPublishable, eligibleOnly, isEligible } from "../eligibility";

describe("isEligible", () => {
  it("returns true only for published entries", () => {
    expect(isEligible({ published: true })).toBe(true);
    expect(isEligible({ published: false })).toBe(false);
  });
});

describe("eligibleOnly", () => {
  it("filters out unpublished entries preserving order", () => {
    const items = [
      { slug: "a", published: true },
      { slug: "b", published: false },
      { slug: "c", published: true },
    ];
    expect(eligibleOnly(items).map((i) => i.slug)).toEqual(["a", "c"]);
  });
});

describe("assertPublishable", () => {
  it("passes clean published content", () => {
    expect(() =>
      assertPublishable({ slug: "a", published: true }, "Real verified summary."),
    ).not.toThrow();
  });
  it("rejects DRAFT markers in published content", () => {
    expect(() => assertPublishable({ slug: "a", published: true }, "DRAFT: verify later")).toThrow(
      /a/,
    );
  });
  it("rejects placeholder contact links in published content", () => {
    expect(() =>
      assertPublishable({ slug: "a", published: true }, "mail me at hello@example.com"),
    ).toThrow();
    expect(() =>
      assertPublishable({ slug: "a", published: true }, "see https://www.linkedin.com/ today"),
    ).toThrow();
  });
  it("ignores markers in unpublished content", () => {
    expect(() =>
      assertPublishable({ slug: "a", published: false }, "DRAFT: verify later"),
    ).not.toThrow();
  });
});
