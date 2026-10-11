import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "resume", "resume.pdf");
  const data = await readFile(filePath);
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": "application/pdf" },
  });
}
