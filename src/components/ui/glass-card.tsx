import type { ReactNode } from "react";

export function GlassCard({
  className = "",
  labelledBy,
  children,
}: {
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section className={`glass ${className}`.trim()} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
