import type { ReactNode } from "react";

export function Figure({
  caption,
  note,
  children,
}: {
  caption: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <figure className="diagram-figure">
      <div className="diagram-scroll" role="group" aria-label={caption} tabIndex={0}>
        {children}
      </div>
      <figcaption>
        {caption} {note && <span className="entry-meta">{note}</span>}
      </figcaption>
    </figure>
  );
}
