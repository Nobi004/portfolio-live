import type { MetadataRoute } from "next";
import { ARTICLE_SLUGS } from "@/lib/writing";
import { PROJECT_SLUGS } from "@/lib/projects";
import { RESEARCH_SLUGS } from "@/lib/research";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["", "/projects", "/research", "/writing", "/about", "/contact", "/resume"];
  const dynamics = [
    ...PROJECT_SLUGS.map((s) => `/projects/${s}`),
    ...RESEARCH_SLUGS.map((s) => `/research/${s}`),
    ...ARTICLE_SLUGS.map((s) => `/writing/${s}`),
  ];
  return [...statics, ...dynamics].map((path) => ({ url: `${siteUrl}${path}` }));
}
