"use client";

import { useState } from "react";
import { ChatPanel } from "./chat-panel";

export function AskWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="ask-widget">
      {open ? (
        <ChatPanel onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label="Open the Ask About My Work assistant"
        >
          Ask about my work
        </button>
      )}
    </div>
  );
}
