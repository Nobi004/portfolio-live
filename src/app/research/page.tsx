import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { getAllPublishedResearchMeta } from "@/lib/research";

export default async function ResearchPage() {
  const entries = await getAllPublishedResearchMeta();
  return (
    <PageShell>
      <PageHero kicker="Md. Mahmudun Nobi" title="Research" />
      <ul className="entry-card-grid">
        {entries.map((e) => (
          <li key={e.slug} className="entry-card glass">
            <Link href={`/research/${e.slug}`}>
              <h2>{e.title}</h2>
            </Link>
            <p>{e.tagline}</p>
            <p className="entry-meta">
              Status: {e.status}
              {e.venue ? ` · ${e.venue}` : ""}
              {e.year ? ` · ${e.year}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
