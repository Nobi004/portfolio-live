import type { ReactNode } from "react";

export function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={`glass ${className}`.trim()}>{children}</section>;
}
