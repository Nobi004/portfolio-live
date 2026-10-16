"use client";

import { useRef } from "react";

export interface TabDef {
  id: string;
  label: string;
  href: string;
}

export function SegmentedTabs({ tabs }: { tabs: TabDef[] }) {
  const refs = useRef<Array<HTMLAnchorElement | null>>([]);
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) {
      e.preventDefault();
      refs.current[next]?.focus();
      refs.current[next]?.click();
    }
  }
  return (
    <nav aria-label="Sections" className="segmented-tabs">
      {tabs.map((t, i) => (
        <a
          key={t.id}
          href={t.href}
          ref={(el) => {
            refs.current[i] = el;
          }}
          onKeyDown={(e) => onKeyDown(e, i)}
          className="segmented-tab"
        >
          {t.label}
        </a>
      ))}
    </nav>
  );
}
