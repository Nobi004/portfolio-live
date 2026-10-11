import Link from "next/link";
import { getAllPublishedProjectMeta } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getAllPublishedProjectMeta();
  if (projects.length === 0) {
    return (
      <article>
        <h1>Projects</h1>
        <p>
          Engineering case studies are under technical review and will appear here once verified. In
          the meantime, see public code at <a href="https://github.com/Nobi004">GitHub</a>.
        </p>
      </article>
    );
  }
  return (
    <article>
      <h1>Projects</h1>
      <ul>
        {projects
          .filter((p) => p.featured)
          .map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`}>
                <h2>{p.title}</h2>
              </Link>
              <p>{p.tagline}</p>
              <p>{p.summary}</p>
              <p>
                Status: {p.status} · Role: {p.role}
              </p>
            </li>
          ))}
      </ul>
    </article>
  );
}
