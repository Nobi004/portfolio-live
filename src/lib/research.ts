import { z } from "zod";

export const ResearchMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  summary: z.string().max(600),
  status: z.enum(["published", "accepted", "under-review", "ongoing", "experiment"]),
  venue: z.string().optional(),
  year: z.string().regex(/^\d{4}$/).optional(),
  doiUrl: z.string().url().optional(),
  bibtex: z.string().optional(),
});

export type ResearchMeta = z.infer<typeof ResearchMetaSchema>;

export const RESEARCH_SLUGS = [
  "insulator-fault-detection",
  "wbfvd-colorization",
  "aura-runtime-research",
] as const;

export async function getResearchMeta(slug: string): Promise<ResearchMeta> {
  if (!(RESEARCH_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Unknown research slug: ${slug}`);
  }
  const mod = await import(`@/content/research/${slug}.mdx`);
  const meta = ResearchMetaSchema.parse(mod.metadata);
  if (meta.slug !== slug) {
    throw new Error(`Slug mismatch: file ${slug} exports metadata.slug ${meta.slug}`);
  }
  return meta;
}

export async function getAllResearchMeta(): Promise<ResearchMeta[]> {
  return Promise.all(RESEARCH_SLUGS.map((slug) => getResearchMeta(slug)));
}
