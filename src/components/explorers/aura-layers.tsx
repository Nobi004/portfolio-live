"use client";

import { useState } from "react";

const LAYERS = [
  { n: 1, name: "Interaction", detail: "Voice, text, vision, and API surfaces. Planned — not part of the v0.1.0 Runtime Core.", implemented: false },
  { n: 2, name: "Runtime Kernel", detail: "Implemented in v0.1.0: AURARuntime, async EventBus, CapabilityRegistry, StateManager, GovernanceGate, CapabilityExecutor. See the case study below.", implemented: true },
  { n: 3, name: "Cognitive Services", detail: "Reasoning, memory, planning, learning, reflection. Planned.", implemented: false },
  { n: 4, name: "Execution Layer", detail: "Desktop, Android, browser, and terminal agents. Planned.", implemented: false },
  { n: 5, name: "Storage Layer", detail: "Memory store, cache, knowledge graph, vector store. Planned.", implemented: false },
];

export function AuraLayers() {
  const [active, setActive] = useState(1);
  const layer = LAYERS[active];
  return (
    <div className="explorer">
      <div role="group" aria-label="Architecture layers" className="explorer-buttons">
        {LAYERS.map((l, i) => (
          <button
            key={l.n}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className="explorer-button"
          >
            {l.n}. {l.name}
          </button>
        ))}
      </div>
      <div className="explorer-panel" aria-live="polite">
        <p>
          <strong>
            Layer {layer.n}: {layer.name}
          </strong>{" "}
          {layer.implemented ? "(implemented)" : "(planned)"}
        </p>
        <p>{layer.detail}</p>
      </div>
    </div>
  );
}
