import { z } from "zod";

export const ProjectMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  summary: z.string().max(600),
  role: z.string(),
  status: z.enum(["ongoing", "shipped", "research", "archived"]),
  stack: z.array(z.string()),
  featured: z.boolean(),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  paper: z.string().url().optional(),
});

export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;

export const PROJECT_SLUGS = ["aura", "document-intelligence", "voice-mind"] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export async function getProjectMeta(slug: string): Promise<ProjectMeta> {
  if (!(PROJECT_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Unknown project slug: ${slug}`);
  }
  const mod = await import(`@/content/projects/${slug}.mdx`);
  const meta = ProjectMetaSchema.parse(mod.metadata);
  if (meta.slug !== slug) {
    throw new Error(`Slug mismatch: file ${slug} exports metadata.slug ${meta.slug}`);
  }
  return meta;
}

export async function getAllProjectMeta(): Promise<ProjectMeta[]> {
  return Promise.all(PROJECT_SLUGS.map((slug) => getProjectMeta(slug)));
}
