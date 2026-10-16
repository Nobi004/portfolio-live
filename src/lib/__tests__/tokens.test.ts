// src/lib/__tests__/tokens.test.ts
import { describe, expect, it } from "vitest";

function lum(hex: string): number {
  const c: number[] = [];
  for (let i = 1; i < 7; i += 2) {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    c.push(v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  }
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function ratio(a: string, b: string): number {
  return (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
}

const PAIRS: Array<[string, string, string]> = [
  ["dark fg", "#f2f2f0", "#101014"],
  ["dark secondary", "#b4b4bf", "#101014"],
  ["dark accent", "#67d4e8", "#101014"],
  ["dark raised-on-canvas", "#f2f2f0", "#18181f"],
  ["light fg", "#111111", "#fafafa"],
  ["light secondary", "#52525b", "#fafafa"],
  ["light accent", "#086b83", "#fafafa"],
  ["light raised-on-canvas", "#111111", "#ffffff"],
  ["light glass ink", "#1a1d21", "#f4f7fb"],
  ["light accent", "#0b5fff", "#f4f7fb"],
  ["light violet ink", "#5b21b6", "#f4f7fb"],
  ["dark glass ink", "#eef1f6", "#14161c"],
  ["dark accent", "#7dd3fc", "#14161c"],
];

describe("design tokens", () => {
  for (const [name, fg, bg] of PAIRS) {
    it(`${name} meets AA (${ratio(fg, bg).toFixed(2)}:1)`, () => {
      expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
