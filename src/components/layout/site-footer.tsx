import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <p>Md. Mahmudun Nobi — AI Engineer, Dhaka, Bangladesh</p>
        <ul>
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
          <li>
            <a href="https://github.com/Nobi004">GitHub</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/nobi004/">LinkedIn</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
