import Link from "next/link";
import { getAllPublishedResearchMeta } from "@/lib/research";

export default async function ResearchPage() {
  const entries = await getAllPublishedResearchMeta();
  return (
    <article>
      <h1>Research</h1>
      <ul className="entry-list">
        {entries.map((e) => (
          <li key={e.slug}>
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
    </article>
  );
}
