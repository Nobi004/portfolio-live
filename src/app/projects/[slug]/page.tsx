import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPublishedProjectMeta } from "@/lib/projects";

// No generateStaticParams while no project is published: Cache Components
// rejects empty static-param lists. This route renders on demand and returns
// 404 for unpublished or unknown slugs. Re-add static params once the first
// case study is published.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const meta = await getPublishedProjectMeta((await params).slug);
    return { title: `${meta.title} — Projects`, description: meta.summary };
  } catch {
    return { title: "Project not found" };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  let meta;
  try {
    meta = await getPublishedProjectMeta(slug);
  } catch {
    notFound();
  }
  const mod = await import(`@/content/projects/${slug}.mdx`);
  const Post = mod.default as (props: { components?: Record<string, ReactNode> }) => ReactNode;
  return (
    <article>
      <p>Case study · Status: {meta.status}</p>
      <h1>{meta.title}</h1>
      <p>{meta.tagline}</p>
      <p>Role: {meta.role}</p>
      <p>Stack: {meta.stack.join(", ")}</p>
      <Post />
    </article>
  );
}
