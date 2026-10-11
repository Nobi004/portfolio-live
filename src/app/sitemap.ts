import type { MetadataRoute } from "next";
import { getAllPublishedArticleMeta } from "@/lib/writing";
import { getAllPublishedProjectMeta } from "@/lib/projects";
import { getAllPublishedResearchMeta } from "@/lib/research";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, research, articles] = await Promise.all([
    getAllPublishedProjectMeta(),
    getAllPublishedResearchMeta(),
    getAllPublishedArticleMeta(),
  ]);
  const statics = ["", "/projects", "/research", "/writing", "/about", "/contact", "/resume"];
  const dynamics = [
    ...projects.map((p) => `/projects/${p.slug}`),
    ...research.map((r) => `/research/${r.slug}`),
    ...articles.map((a) => `/writing/${a.slug}`),
  ];
  return [...statics, ...dynamics].map((path) => ({ url: `${siteUrl}${path}` }));
}
