export function PageHero({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="page-hero">
      <p className="hero-kicker mono">{kicker}</p>
      <h1>{title}</h1>
    </header>
  );
}
