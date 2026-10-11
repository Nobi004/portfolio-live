// Fails the build if any PUBLISHED content entry contains unresolved markers.
// Drafts (published: false) are allowed to carry DRAFT: notes. Runs in CI.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const SECTIONS = ["projects", "research", "writing"];
const VIOLATIONS = [/DRAFT:/, /TODO/, /hello@example\.com/, /https:\/\/www\.linkedin\.com\/(?!\S)/];

let failures = 0;
for (const dir of SECTIONS) {
  const dirPath = path.join(process.cwd(), "src", "content", dir);
  for (const file of readdirSync(dirPath).filter((f) => f.endsWith(".mdx"))) {
    const full = path.join(dirPath, file);
    const raw = readFileSync(full, "utf8");
    if (!/published:\s*true/.test(raw)) continue;
    for (const pattern of VIOLATIONS) {
      const lines = raw.split("\n");
      lines.forEach((line, i) => {
        if (pattern.test(line)) {
          console.error(`${full}:${i + 1}: published entry contains ${pattern}`);
          failures += 1;
        }
      });
    }
  }
}

if (failures > 0) {
  console.error(`check-content: ${failures} violation(s) in published content`);
  process.exit(1);
}
console.log("check-content: published content clean");
