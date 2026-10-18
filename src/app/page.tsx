import Link from "next/link";
import { AuraArchitecture } from "@/components/diagrams/aura-architecture";
import { GlassCard } from "@/components/ui/glass-card";
import { ClockWidget } from "@/components/widgets/clock-widget";
import { getAllPublishedProjectMeta } from "@/lib/projects";
import { getAllPublishedResearchMeta } from "@/lib/research";

export default async function HomePage() {
  const research = await getAllPublishedResearchMeta();
  const featured = (await getAllPublishedProjectMeta()).filter((p) => p.featured);
  const [flagship, ...restFeatured] = featured;
  return (
    <div className="bento-grid">
      <GlassCard className="widget-wide widget-span hero hero-signature" labelledBy="hero-heading">
        <p className="hero-kicker mono">Md. Mahmudun Nobi / AI Engineer</p>
        <h1 id="hero-heading">Building intelligent systems that work beyond the prototype.</h1>
        <p className="hero-rule" aria-hidden="true" />
        <p className="hero-sub">
          AI Engineer focused on agentic systems, applied machine learning, document intelligence,
          and production software architecture.
        </p>
        <p className="hero-actions">
          <Link href="/projects" className="button button-primary">
            Explore projects
          </Link>
          <Link href="/contact" className="button">
            Get in touch
          </Link>
        </p>
        <p className="hero-note">Dhaka, Bangladesh · Open to relevant AI engineering opportunities</p>
      </GlassCard>

      <GlassCard className="widget-clock-tile">
        <ClockWidget />
      </GlassCard>

      <GlassCard labelledBy="highlights-heading">
        <h2 id="highlights-heading">Verified highlights</h2>
        <ul className="entry-list">
          <li>
            <h3>
              <Link href="/research/insulator-fault-detection">
                First-author IEEE conference paper on interpretable insulator fault detection
              </Link>
            </h3>
            <p className="entry-meta">IEEE ICEESI 2026 · DOI 10.1109/iceesi68020.2026.11583598</p>
            <p className="clamp-3">
              An interpretable attention-guided hybrid framework for power line insulator fault
              detection, with citation verified against the publisher record.
            </p>
          </li>
          <li>
            <h3>
              <a href="https://github.com/Nobi004">Public engineering work on GitHub</a>
            </h3>
            <p className="entry-meta">github.com/Nobi004 · identity confirmed</p>
            <p className="clamp-3">
              Applied machine learning, document tooling, computer vision experiments, and this
              portfolio&apos;s own codebase — all public and inspectable.
            </p>
          </li>
        </ul>
      </GlassCard>

      <GlassCard className="widget-span widget-tall" labelledBy="projects-heading">
        <h2 id="projects-heading">Featured engineering work</h2>
        {featured.length === 0 ? (
          <p>
            In-depth architecture case studies are under technical review and will appear here
            once verified. Until then, the working code is browsable at{" "}
            <a href="https://github.com/Nobi004">github.com/Nobi004</a>.
          </p>
        ) : (
          <>
            {flagship ? (
              <article className="flagship-panel">
                <div className="flagship-copy">
                  <h3>
                    <Link href={`/projects/${flagship.slug}`}>{flagship.title}</Link>
                  </h3>
                  <p className="entry-meta">
                    Status: {flagship.status} · {flagship.stack.join(", ")}
                  </p>
                  <p>{flagship.tagline}</p>
                  <p className="clamp-3">{flagship.summary}</p>
                  <p>
                    <Link href={`/projects/${flagship.slug}`} className="button">
                      Read the case study
                    </Link>
                  </p>
                </div>
                {flagship.slug === "aura" ? (
                  <div className="flagship-diagram">
                    <AuraArchitecture />
                  </div>
                ) : null}
              </article>
            ) : null}
            {restFeatured.length > 0 ? (
              <ul className="entry-list">
                {restFeatured.map((p) => (
                  <li key={p.slug}>
                    <h3>
                      <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p className="entry-meta">
                      Status: {p.status} · {p.stack.join(", ")}
                    </p>
                    <p>{p.tagline}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
        <p>
          <Link href="/projects">All projects</Link>
        </p>
      </GlassCard>

      <GlassCard className="widget-half widget-half-a" labelledBy="approach-heading">
        <h2 id="approach-heading">How I work</h2>
        <ul className="principles-grid">
          <li>Reliability before novelty: systems must hold up outside the demo.</li>
          <li>Evaluation with reproducible methods, not unverified numbers.</li>
          <li>Explainability and governance where automated actions have consequences.</li>
          <li>Maintainable architecture: small units, clear boundaries, versioned review.</li>
        </ul>
      </GlassCard>

      <GlassCard className="widget-half widget-half-b" labelledBy="research-heading">
        <h2 id="research-heading">Research</h2>
        <ul className="entry-list">
          {research.map((entry) => (
            <li key={entry.slug} className="citation-row">
              <h3>
                <Link href={`/research/${entry.slug}`}>{entry.title}</Link>
              </h3>
              <p className="entry-meta">
                Status: {entry.status}
                {entry.venue ? ` · ${entry.venue}` : ""}
                {entry.year ? ` · ${entry.year}` : ""}
              </p>
              <p>{entry.tagline}</p>
              {entry.bibtex ? (
                <details>
                  <summary>BibTeX</summary>
                  <pre>{entry.bibtex}</pre>
                </details>
              ) : null}
            </li>
          ))}
        </ul>
        <p>
          <Link href="/research">All research</Link>
        </p>
      </GlassCard>

      <GlassCard className="widget-profile" labelledBy="profile-heading">
        <h2 id="profile-heading">Profile</h2>
        <div className="profile-minis">
          <section aria-labelledby="about-heading">
            <h3 id="about-heading">About</h3>
            <p>
              AI engineer in Dhaka working across agentic systems, applied ML, and production
              software — with an electrical engineering background.{" "}
              <Link href="/about">More about me</Link>
            </p>
          </section>
          <section aria-labelledby="contact-heading">
            <h3 id="contact-heading">Contact</h3>
            <p>
              The fastest way to reach me is by email at{" "}
              <a href="mailto:mdmnb435@gmail.com">mdmnb435@gmail.com</a>.{" "}
              <Link href="/contact">All contact options</Link>
            </p>
          </section>
          <section aria-labelledby="writing-heading">
            <h3 id="writing-heading">Writing</h3>
            <p>
              Technical articles on agent architecture and evaluation are under review and will
              appear here once verified. <Link href="/writing">Writing archive</Link>
            </p>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}
