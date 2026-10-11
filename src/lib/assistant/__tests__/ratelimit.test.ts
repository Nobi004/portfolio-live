import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../ratelimit";

describe("createRateLimiter", () => {
  it("allows up to the limit then blocks with retryAfterMs", () => {
    const t = 0;
    const rl = createRateLimiter({ limit: 2, windowMs: 1000, now: () => t });
    expect(rl.check("1.2.3.4").ok).toBe(true);
    expect(rl.check("1.2.3.4").ok).toBe(true);
    const blocked = rl.check("1.2.3.4");
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
  it("tracks IPs independently and expires old hits", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("b").ok).toBe(true);
    t = 2000;
    expect(rl.check("a").ok).toBe(true);
  });
});
