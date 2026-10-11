import Link from "next/link";
import { getAllResearchMeta } from "@/lib/research";

export default async function ResearchPage() {
  const entries = await getAllResearchMeta();
  return (
    <article>
      <h1>Research</h1>
      <ul>
        {entries.map((e) => (
          <li key={e.slug}>
            <Link href={`/research/${e.slug}`}>
              <h2>{e.title}</h2>
            </Link>
            <p>{e.tagline}</p>
            <p>
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
