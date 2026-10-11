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
        Simplified logical view of the v0.1.0 Runtime Core: the interface reaches the AURARuntime
        kernel, capability use passes the GovernanceGate allow/deny check, the CapabilityExecutor
        runs the validate-governance-execute lifecycle, and the EventBus carries events back. See
        the repository docs for the full five-layer architecture.
      </desc>
      {["Interface", "AURARuntime", "GovernanceGate", "Executor", "EventBus"].map((label, i) => {
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
