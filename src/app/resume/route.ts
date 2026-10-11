import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "resume", "resume.pdf");
  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    // No approved resume published yet — honest 404, not a placeholder file.
    notFound();
  }
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": "application/pdf" },
  });
}
