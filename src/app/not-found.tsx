import Link from "next/link";

export default function NotFound() {
  return (
    <article>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </article>
  );
}
