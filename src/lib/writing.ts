import { z } from "zod";

export const ArticleMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()),
});

export type ArticleMeta = z.infer<typeof ArticleMetaSchema>;

export const ARTICLE_SLUGS = ["governed-agent-runtime", "evaluate-agentic-ai"] as const;

export async function getArticleMeta(slug: string): Promise<ArticleMeta> {
  if (!(ARTICLE_SLUGS as readonly string[]).includes(slug)) {
    throw new Error(`Unknown article slug: ${slug}`);
  }
  const mod = await import(`@/content/writing/${slug}.mdx`);
  const meta = ArticleMetaSchema.parse(mod.metadata);
  if (meta.slug !== slug) {
    throw new Error(`Slug mismatch: file ${slug} exports metadata.slug ${meta.slug}`);
  }
  return meta;
}

export async function getAllArticleMeta(): Promise<ArticleMeta[]> {
  const metas = await Promise.all(ARTICLE_SLUGS.map((slug) => getArticleMeta(slug)));
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1));
}
