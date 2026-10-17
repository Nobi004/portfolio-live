import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";
import { getAllPublishedProjectMeta } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getAllPublishedProjectMeta();
  if (projects.length === 0) {
    return (
      <PageShell>
        <PageHero kicker="Md. Mahmudun Nobi" title="Projects" />
        <p>
          Engineering case studies are under technical review and will appear here once verified. In
          the meantime, see public code at <a href="https://github.com/Nobi004">GitHub</a>.
        </p>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <PageHero kicker="Md. Mahmudun Nobi" title="Projects" />
      <ul className="entry-card-grid">
        {projects
          .filter((p) => p.featured)
          .map((p) => (
            <li key={p.slug} className="entry-card glass">
              <Link href={`/projects/${p.slug}`}>
                <h2>{p.title}</h2>
              </Link>
              <p>{p.tagline}</p>
              <p className="clamp-3">{p.summary}</p>
              <p className="entry-meta">
                Status: {p.status} · Role: {p.role}
              </p>
            </li>
          ))}
      </ul>
    </PageShell>
  );
}
