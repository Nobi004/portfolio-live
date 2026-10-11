import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPublishedArticleMeta } from "@/lib/writing";

// No generateStaticParams while no article is published: Cache Components
// rejects empty static-param lists. This route renders on demand and returns
// 404 for unpublished or unknown slugs. Re-add static params once the first
// article is published.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getPublishedArticleMeta((await params).slug);
    return { title: `${meta.title} — Writing`, description: meta.summary };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  let meta;
  try {
    meta = await getPublishedArticleMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/writing/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article className="prose-stock">
      <h1>{meta.title}</h1>
      <p className="entry-meta">
        {meta.date} · {meta.tags.join(", ")}
      </p>
      <Post />
    </article>
  );
}
