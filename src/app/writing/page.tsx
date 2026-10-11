import Link from "next/link";
import { getAllPublishedArticleMeta } from "@/lib/writing";

export default async function WritingPage() {
  const articles = await getAllPublishedArticleMeta();
  if (articles.length === 0) {
    return (
      <article>
        <h1>Writing</h1>
        <p>Technical articles are under review and will appear here once verified.</p>
      </article>
    );
  }
  return (
    <article>
      <h1>Writing</h1>
      <ul className="entry-list">
        {articles.map((a) => (
          <li key={a.slug}>
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
    </article>
  );
}
