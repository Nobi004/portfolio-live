export function InsulatorFramework({ className }: { className?: string }) {
  const stages = [
    { label: "Input image", lines: ["Input", "image"] },
    { label: "Attention maps", lines: ["Attention", "maps"] },
    { label: "Hybrid model", lines: ["Hybrid", "model"] },
    { label: "Detection output", lines: ["Detection +", "interpretability"] },
  ];
  const boxW = 140;
  const pitch = 156;
  return (
    <svg
      role="img"
      aria-labelledby="insulator-fw-title insulator-fw-desc"
      viewBox="0 0 640 210"
      width="100%"
      className={className}
    >
      <title id="insulator-fw-title">Conceptual framework overview</title>
      <desc id="insulator-fw-desc">
        Conceptual flow of the attention-guided hybrid framework: an input image feeds attention
        maps, which guide a hybrid model, producing detection output with interpretability
        evidence. Illustrative only; method details per the IEEE publication record.
      </desc>
      {stages.map((stage, i) => {
        const x = 8 + i * pitch;
        return (
          <g key={stage.label}>
            <rect
              x={x}
              y={56}
              width={boxW}
              height={72}
              rx={24}
              fill="none"
              stroke="currentColor"
            />
            {stage.lines.map((line, j) => (
              <text
                key={line}
                x={x + boxW / 2}
                y={84 + j * 18}
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
                y={96}
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
      <path
        d="M 556 128 C 556 168, 84 168, 84 128"
        fill="none"
        stroke="currentColor"
        strokeDasharray="6 5"
      />
      <text x={320} y={190} textAnchor="middle" fontSize={12} fill="currentColor">
        interpretability evidence
      </text>
    </svg>
  );
}
