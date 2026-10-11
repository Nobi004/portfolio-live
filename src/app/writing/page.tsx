import Link from "next/link";
import { getAllArticleMeta } from "@/lib/writing";

export default async function WritingPage() {
  const articles = await getAllArticleMeta();
  return (
    <article>
      <h1>Writing</h1>
      <ul>
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/writing/${a.slug}`}>
              <h2>{a.title}</h2>
            </Link>
            <p>{a.summary}</p>
            <p>
              {a.date} · {a.tags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
