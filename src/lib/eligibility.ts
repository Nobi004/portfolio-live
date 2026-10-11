export interface Publishable {
  published: boolean;
}

export function isEligible(meta: Publishable): boolean {
  return meta.published === true;
}

export function eligibleOnly<T extends Publishable>(items: readonly T[]): T[] {
  return items.filter(isEligible);
}

const VIOLATIONS = [/DRAFT:/, /TODO/, /hello@example\.com/, /https:\/\/www\.linkedin\.com\/(?!\S)/];

export function assertPublishable(meta: Publishable & { slug: string }, body: string): void {
  if (!isEligible(meta)) return;
  for (const pattern of VIOLATIONS) {
    if (pattern.test(body)) {
      throw new Error(`Published entry "${meta.slug}" contains unresolved marker ${pattern}`);
    }
  }
}
