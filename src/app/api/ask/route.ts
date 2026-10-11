import { NextRequest } from "next/server";
import { assistantConfig, openRouterKey, openRouterModel } from "@/lib/assistant/config";
import { KB_CHUNKS } from "@/lib/assistant/kb-data";
import { buildContext, retrieve } from "@/lib/assistant/kb";
import { buildMessages, type ChatTurn } from "@/lib/assistant/prompt";
import { createRateLimiter } from "@/lib/assistant/ratelimit";
import { siteUrl } from "@/lib/site";

const limiter = createRateLimiter({
  limit: assistantConfig.rateLimit,
  windowMs: assistantConfig.rateWindowMs,
});

const FALLBACK_SUGGESTIONS = [
  { q: "What agentic systems has he built?", route: "/projects/aura" },
  { q: "Explain the architecture of AURA.", route: "/projects/aura" },
  { q: "What has he published?", route: "/research/insulator-fault-detection" },
];

function sse(data: string): string {
  return `data: ${data}\n\n`;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  let body: { message?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history)
    ? (body.history as ChatTurn[]).filter(
        (t) => (t.role === "user" || t.role === "assistant") && typeof t.content === "string",
      )
    : [];
  if (!message || message.length > assistantConfig.maxInputChars) {
    return Response.json(
      { error: `Message must be 1–${assistantConfig.maxInputChars} characters.` },
      { status: 400 },
    );
  }
  if (history.length > assistantConfig.maxTurns * 2) {
    return Response.json({ error: "Conversation too long — please start over." }, { status: 400 });
  }

  const rl = limiter.check(clientIp(req));
  if (!rl.ok) {
    return Response.json(
      { error: "Too many questions too quickly — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const { chunks, topScore } = retrieve(message, KB_CHUNKS, assistantConfig.maxChunks);
  if (topScore < assistantConfig.minScore || chunks.length === 0) {
    return Response.json({
      fallback: true,
      message:
        "I don't have verified information on that in the public portfolio. Try one of these:",
      suggestions: FALLBACK_SUGGESTIONS,
    });
  }

  if (!openRouterKey) {
    return Response.json(
      {
        error:
          "The assistant is unavailable right now — browse the case studies or get in touch.",
      },
      { status: 503 },
    );
  }

  const context = buildContext(chunks, assistantConfig.wordBudget);
  const seen = new Set<string>();
  const sources = chunks
    .map((c) => ({ title: c.sourceTitle, route: c.sourceRoute }))
    .filter((s) => (seen.has(s.route) ? false : (seen.add(s.route), true)));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), assistantConfig.requestTimeoutMs);
  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": "Portfolio assistant",
      },
      body: JSON.stringify({
        model: openRouterModel,
        stream: true,
        max_tokens: assistantConfig.maxOutputTokens,
        messages: buildMessages([...history, { role: "user", content: message }], context),
      }),
    });
  } catch {
    clearTimeout(timeout);
    return Response.json({ error: "The assistant timed out — please try again." }, { status: 504 });
  }
  clearTimeout(timeout);

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { error: "The assistant is unavailable right now — browse the case studies or get in touch." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const payload = t.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta) {
                ctrl.enqueue(encoder.encode(sse(JSON.stringify({ token: delta }))));
              }
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
        ctrl.enqueue(encoder.encode(sse(JSON.stringify({ sources }))));
        ctrl.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        ctrl.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
