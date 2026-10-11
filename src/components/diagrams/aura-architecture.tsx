export function AuraArchitecture() {
  return (
    <svg
      role="img"
      aria-labelledby="aura-arch-title aura-arch-desc"
      viewBox="0 0 640 220"
      width="100%"
    >
      <title id="aura-arch-title">AURA logical architecture</title>
      <desc id="aura-arch-desc">
        Illustrative logical architecture, not a complete current-state diagram. User and application
        interface feeds a runtime kernel for orchestration, gated by governance, driving execution, with
        events flowing back to the interface.
      </desc>
      {["Interface", "Runtime Kernel", "Governance", "Execution", "Events"].map((label, i) => {
        const x = 8 + i * 126;
        return (
          <g key={label}>
            <rect x={x} y={70} width={118} height={80} rx={8} fill="none" stroke="currentColor" />
            <text x={x + 59} y={115} textAnchor="middle" fontSize={13} fill="currentColor">
              {label}
            </text>
            {i < 4 && (
              <text x={x + 122} y={115} textAnchor="middle" fontSize={16} fill="currentColor">
                →
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
