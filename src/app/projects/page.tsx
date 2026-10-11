import Link from "next/link";
import { getAllProjectMeta } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getAllProjectMeta();
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
