"use client";

import { useRef, useState } from "react";
import { ChatMessage, type Message, type Source } from "./chat-message";

const SUGGESTIONS = [
  "What has he published?",
  "What is the insulator fault detection paper about?",
  "Who are the authors of the IEEE paper?",
];

const DISCLAIMER = "Experimental assistant — answers are grounded in public portfolio content and may be incomplete.";

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);
  const nextId = () => ++idRef.current;

  async function send(text: string) {
    const clean = text.trim().slice(0, 1000);
    if (!clean || busy) return;
    const userMsg: Message = { id: nextId(), role: "user", text: clean };
    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, userMsg, { id: nextId(), role: "assistant", text: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, history: history.slice(0, -1) }),
      });
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok || !contentType.includes("text/event-stream")) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.message === "string"
            ? `${data.message} ${(data.suggestions ?? []).map((s: { q: string }) => s.q).join(" ")}`
            : typeof data.error === "string"
              ? data.error
              : "The assistant is unavailable right now.",
        );
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const obj = JSON.parse(payload);
            if (typeof obj.token === "string") {
              const token = obj.token;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  text: copy[copy.length - 1].text + token,
                };
                return copy;
              });
            } else if (Array.isArray(obj.sources)) {
              const sources = obj.sources as Source[];
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { ...copy[copy.length - 1], sources };
                return copy;
              });
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : "The assistant is unavailable right now.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Ask about my work" aria-live="polite">
      <button type="button" onClick={onClose} aria-label="Close assistant">
        Close
      </button>
      {messages.length === 0 && (
        <ul>
          {SUGGESTIONS.map((q) => (
            <li key={q}>
              <button type="button" onClick={() => void send(q)} disabled={busy}>
                {q}
              </button>
            </li>
          ))}
        </ul>
      )}
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
      <p>{DISCLAIMER}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <label htmlFor="ask-input">Ask about my work</label>
        <input
          id="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          disabled={busy}
          autoComplete="off"
        />
        <button type="submit" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
