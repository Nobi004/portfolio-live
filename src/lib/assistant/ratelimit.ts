export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
}

export function createRateLimiter(opts: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) {
  const hits = new Map<string, number[]>();
  const now = opts.now ?? Date.now;
  return {
    check(ip: string): RateLimitResult {
      const t = now();
      const arr = (hits.get(ip) ?? []).filter((ts) => t - ts < opts.windowMs);
      if (arr.length >= opts.limit) {
        const oldest = arr[0];
        return { ok: false, retryAfterMs: opts.windowMs - (t - oldest) };
      }
      arr.push(t);
      hits.set(ip, arr);
      return { ok: true, retryAfterMs: 0 };
    },
  };
}
