import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { getAllPublishedArticleMeta } from "@/lib/writing";

export default async function WritingPage() {
  const articles = await getAllPublishedArticleMeta();
  if (articles.length === 0) {
    return (
      <PageShell>
        <PageHero kicker="Md. Mahmudun Nobi" title="Writing" />
        <p>Technical articles are under review and will appear here once verified.</p>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <PageHero kicker="Md. Mahmudun Nobi" title="Writing" />
      <ul className="entry-card-grid">
        {articles.map((a) => (
          <li key={a.slug} className="entry-card glass">
            <Link href={`/writing/${a.slug}`}>
              <h2>{a.title}</h2>
            </Link>
            <p>{a.summary}</p>
            <p className="entry-meta">
              {a.date} · {a.tags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
