import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getAllPublishedResearchMeta, getPublishedResearchMeta } from "@/lib/research";

export async function generateStaticParams() {
  const metas = await getAllPublishedResearchMeta();
  return metas.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getPublishedResearchMeta((await params).slug);
    return { title: `${meta.title} — Research`, description: meta.summary };
  } catch {
    return { title: "Research entry not found" };
  }
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  let meta;
  try {
    meta = await getPublishedResearchMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/research/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article>
      <p>
        Status: {meta.status}
        {meta.venue ? ` · ${meta.venue}` : ""}
      </p>
      <h1>{meta.title}</h1>
      <p>{meta.tagline}</p>
      <Post />
      {meta.bibtex ? (
        <section aria-label="Citation">
          <h2>Cite</h2>
          <pre>{meta.bibtex}</pre>
        </section>
      ) : null}
    </article>
  );
}
