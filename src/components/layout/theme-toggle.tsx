"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button type="button" aria-label="Toggle color theme" disabled>
        <span aria-hidden="true">◐</span>
      </button>
    );
  }

  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button type="button" aria-label={`Switch to ${next} theme`} onClick={() => setTheme(next)}>
      <span aria-hidden="true">{resolvedTheme === "dark" ? "☾" : "☀"}</span>
    </button>
  );
}
