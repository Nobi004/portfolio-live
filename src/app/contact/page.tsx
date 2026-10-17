import { PageHero } from "@/components/layout/page-hero";
import { PageShell } from "@/components/layout/page-shell";

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero kicker="Md. Mahmudun Nobi" title="Contact" />
      <article className="prose-stock">
        <p>
          The fastest way to reach me is by email:{" "}
          <a href="mailto:mdmnb435@gmail.com">mdmnb435@gmail.com</a>.
        </p>
        <p>
          You can also find me on <a href="https://github.com/Nobi004">GitHub (@Nobi004)</a>.
        </p>
        <ul>
          <li>
            <a href="https://github.com/Nobi004">GitHub</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/nobi004/">LinkedIn</a>
          </li>
        </ul>
      </article>
    </PageShell>
  );
}
