export function AuraArchitecture({ className }: { className?: string }) {
  const layers = ["Layer 1", "Layer 2", "Layer 3", "Layer 4", "Layer 5"];
  const boxes = ["Interface", "AURARuntime", "GovernanceGate", "Executor", "EventBus"];
  return (
    <svg
      role="img"
      aria-labelledby="aura-arch-title aura-arch-desc"
      viewBox="0 0 640 156"
      width="100%"
      className={className}
    >
      <title id="aura-arch-title">AURA logical architecture</title>
      <desc id="aura-arch-desc">
        Simplified logical view of the v0.1.0 Runtime Core: a context strip shows all five layers
        with layer 2 highlighted; the interface reaches the AURARuntime kernel, capability use
        passes the GovernanceGate allow/deny check, the CapabilityExecutor runs the
        validate-governance-execute lifecycle, and the EventBus carries events back. See the
        repository docs for the full five-layer architecture.
      </desc>
      {layers.map((label, i) => {
        const x = 8 + i * 126;
        const active = i === 1;
        return (
          <g key={label}>
            <rect
              x={x}
              y={8}
              width={118}
              height={28}
              rx={8}
              fill="currentColor"
              fillOpacity={active ? 0.18 : 0}
              stroke={active ? "var(--accent)" : "currentColor"}
            />
            <text
              x={x + 59}
              y={27}
              textAnchor="middle"
              fontSize={12}
              fill={active ? "var(--accent)" : "currentColor"}
            >
              {label}
            </text>
          </g>
        );
      })}
      {boxes.map((label, i) => {
        const x = 8 + i * 126;
        return (
          <g key={label}>
            <rect x={x} y={64} width={118} height={84} rx={8} fill="none" stroke="currentColor" />
            <text x={x + 59} y={111} textAnchor="middle" fontSize={14} fill="currentColor">
              {label}
            </text>
            {i < 4 && (
              <text x={x + 122} y={111} textAnchor="middle" fontSize={18} fill="currentColor">
                →
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
