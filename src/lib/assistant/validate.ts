import { assistantConfig } from "./config";
import type { ChatTurn } from "./prompt";

export type ValidatedRequest =
  | { ok: true; message: string; history: ChatTurn[] }
  | { ok: false; error: string };

function cleanTurn(t: unknown): ChatTurn | null {
  if (typeof t !== "object" || t === null) return null;
  const role = (t as { role?: unknown }).role;
  const content = (t as { content?: unknown }).content;
  if ((role === "user" || role === "assistant") && typeof content === "string") {
    return { role, content: content.slice(0, assistantConfig.maxInputChars) };
  }
  return null;
}

export function validateAskRequest(body: unknown): ValidatedRequest {
  const message =
    typeof body === "object" && body !== null && "message" in body
      ? (body as { message?: unknown }).message
      : undefined;
  const rawHistory =
    typeof body === "object" && body !== null && "history" in body
      ? (body as { history?: unknown }).history
      : [];
  const text = typeof message === "string" ? message.trim() : "";
  if (!text || text.length > assistantConfig.maxInputChars) {
    return { ok: false, error: `Message must be 1–${assistantConfig.maxInputChars} characters.` };
  }
  const history = Array.isArray(rawHistory)
    ? rawHistory.map(cleanTurn).filter((t): t is ChatTurn => t !== null)
    : [];
  if (history.length > assistantConfig.maxTurns * 2) {
    return { ok: false, error: "Conversation too long — please start over." };
  }
  return { ok: true, message: text, history };
}
