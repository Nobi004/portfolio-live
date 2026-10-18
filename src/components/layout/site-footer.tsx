import Link from "next/link";
import { SystemGlyph } from "@/components/diagrams/system-glyph";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <p className="footer-identity">
          <SystemGlyph />
          <span>Md. Mahmudun Nobi — AI Engineer, Dhaka, Bangladesh</span>
        </p>
        <ul className="footer-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
          <li>
            <Link href="/research">Research</Link>
          </li>
          <li>
            <Link href="/writing">Writing</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li className="footer-external">
            <a href="https://github.com/Nobi004">GitHub</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/nobi004/">LinkedIn</a>
          </li>
          <li>
            <a href="mailto:mdmnb435@gmail.com">Email</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
