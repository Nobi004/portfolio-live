export function CareerosPipeline({ className }: { className?: string }) {
  const stages = [
    "Profile",
    "Strategy",
    "Sources",
    "Normalize",
    "Dedupe",
    "Rank",
    "Digest/\nDashboard",
    "Tracker",
  ];
  const boxW = 100;
  const pitch = 114;
  return (
    <svg
      role="img"
      aria-labelledby="careeros-pipe-title careeros-pipe-desc"
      viewBox="0 0 914 150"
      width="100%"
      className={className}
    >
      <title id="careeros-pipe-title">CareerOS discovery pipeline</title>
      <desc id="careeros-pipe-desc">
        Horizontal flow of the full platform pipeline: Profile compiles into a search Strategy,
        Sources are queried, results are Normalized into one schema, Deduped, Ranked, delivered to
        the Digest and Dashboard, and saved applications move to the Tracker.
      </desc>
      {stages.map((label, i) => {
        const x = 8 + i * pitch;
        const lines = label.split("\n");
        return (
          <g key={label}>
            <rect x={x} y={43} width={boxW} height={64} rx={8} fill="none" stroke="currentColor" />
            {lines.map((line, j) => (
              <text
                key={line}
                x={x + boxW / 2}
                y={lines.length > 1 ? 70 + j * 18 : 79}
                textAnchor="middle"
                fontSize={13}
                fill="currentColor"
              >
                {line}
              </text>
            ))}
            {i < stages.length - 1 && (
              <text
                x={x + boxW + (pitch - boxW) / 2}
                y={79}
                textAnchor="middle"
                fontSize={16}
                fill="currentColor"
              >
                →
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
