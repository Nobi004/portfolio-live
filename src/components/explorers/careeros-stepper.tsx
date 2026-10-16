"use client";

import { useCallback, useEffect, useState } from "react";

const STAGES = [
  "Profile",
  "Strategy",
  "Sources",
  "Normalize",
  "Dedupe",
  "Rank",
  "Digest & Dashboard",
  "Tracker",
];

const DETAILS: Record<string, string> = {
  Profile: "Skills, roles, location, and preferences compile into a search strategy.",
  Strategy: "Synonym expansion and keyword optimization from the profile.",
  Sources: "Remotive, RemoteOK, Wellfound, YC, StartupJobs, and Bangladesh sources, queried with retry and rate limiting.",
  Normalize: "Divergent source formats mapped into one consistent schema.",
  Dedupe: "Exact hash plus fuzzy similarity; history filtering removes seen roles.",
  Rank: "10-factor weighted scoring blended with freshness, novelty, and preference.",
  "Digest & Dashboard": "Telegram digest with actions plus the Next.js dashboard workspace.",
  Tracker: "Application lifecycle tracking. Tracking never submits — apply through the original listing.",
};

export function CareerosStepper() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const m = window.location.hash.match(/^#stage-(\d)$/);
    if (m) {
      const i = Number(m[1]) - 1;
      // Hash-driven initial stage avoids hydration mismatch (intentional sync set on mount).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (i >= 0 && i < STAGES.length) setIndex(i);
    }
  }, []);
  const go = useCallback((i: number) => {
    const n = (i + STAGES.length) % STAGES.length;
    setIndex(n);
    window.location.hash = `stage-${n + 1}`;
  }, []);
  const stage = STAGES[index];
  return (
    <div className="explorer">
      <p className="entry-meta">
        Stage {index + 1} of {STAGES.length}
      </p>
      <div className="stepper-bar" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={STAGES.length} aria-label="Pipeline progress">
        <span style={{ width: `${((index + 1) / STAGES.length) * 100}%` }} />
      </div>
      <p>
        <strong>{stage}.</strong> {DETAILS[stage]}
      </p>
      <p>
        <button type="button" onClick={() => go(index - 1)} className="button">
          Previous
        </button>{" "}
        <button type="button" onClick={() => go(index + 1)} className="button">
          Next
        </button>
      </p>
    </div>
  );
}
