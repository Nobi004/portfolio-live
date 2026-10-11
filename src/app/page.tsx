import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading">
        <p>MD. MAHMUDUN NOBI / AI ENGINEER</p>
        <h1 id="hero-heading">Building intelligent systems that work beyond the prototype.</h1>
        <p>
          AI Engineer focused on agentic systems, applied machine learning, document intelligence, and
          production software architecture.
        </p>
        <p>
          <Link href="/projects">Explore Projects</Link> <Link href="/resume">View Resume</Link>
        </p>
        <p>Dhaka, Bangladesh · Open to relevant AI engineering opportunities</p>
      </section>
      <section aria-label="DRAFT sections">
        <p>
          DRAFT: proof strip, featured work, approach, research, writing, about snapshot, contact CTA land
          here in Phase 2–3.
        </p>
      </section>
    </>
  );
}
