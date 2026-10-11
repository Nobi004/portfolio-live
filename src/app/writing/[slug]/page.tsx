import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ARTICLE_SLUGS, getArticleMeta } from "@/lib/writing";

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getArticleMeta((await params).slug);
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
    meta = await getArticleMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/writing/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article>
      <h1>{meta.title}</h1>
      <p>
        {meta.date} · {meta.tags.join(", ")}
      </p>
      <Post />
    </article>
  );
}
