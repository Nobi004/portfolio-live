import Link from "next/link";

export function CaseTabs({ tabs }: { tabs: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label="Case study sections" className="segmented-tabs">
      {tabs.map((t) => (
        <Link key={t.id} href={`#${t.id}`} className="segmented-tab">
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
