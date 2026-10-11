import { existsSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getAllPublishedArticleMeta } from "@/lib/writing";
import { getAllPublishedProjectMeta } from "@/lib/projects";
import { getAllPublishedResearchMeta } from "@/lib/research";
import { siteUrl } from "@/lib/site";

function hasResume(): boolean {
  return existsSync(path.join(process.cwd(), "public", "resume", "resume.pdf"));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, research, articles] = await Promise.all([
    getAllPublishedProjectMeta(),
    getAllPublishedResearchMeta(),
    getAllPublishedArticleMeta(),
  ]);
  const statics = ["", "/projects", "/research", "/writing", "/about", "/contact"];
  if (hasResume()) statics.push("/resume");
  const dynamics = [
    ...projects.map((p) => `/projects/${p.slug}`),
    ...research.map((r) => `/research/${r.slug}`),
    ...articles.map((a) => `/writing/${a.slug}`),
  ];
  return [...statics, ...dynamics].map((path) => ({ url: `${siteUrl}${path}` }));
}
