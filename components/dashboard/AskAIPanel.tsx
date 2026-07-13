"use client";

// components/dashboard/AskAIPanel.tsx
// Persistent chat-with-the-meeting widget. Manages its own state — input,
// chat history, typewriter for the streamed answer. History is persisted
// to localStorage per meeting so a reload doesn't lose the conversation.

import { useState, useEffect, useRef } from "react";
import { tokens } from "../landing/tokens";
import { ASK_SUGGESTIONS } from "./data";

const INITIAL_Q = "What did we decide about the launch date?";
const INITIAL_A = "March 14. Devon is owning the cutover, contingent on QA wrapping by the 10th.";

type ChatMessage = { q: string; a: string; error?: boolean };

function storageKey(meetingId: string) {
  return `recalled:ask:${meetingId}`;
}

export function AskAIPanel({ meetingId }: { meetingId: string }) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Load saved history on mount; if none, play the canned intro exchange.
  useEffect(() => {
    const saved = localStorage.getItem(storageKey(meetingId));
    if (saved) {
      setMessages(JSON.parse(saved));
      return;
    }

    setMessages([{ q: INITIAL_Q, a: "" }]);
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setMessages([{ q: INITIAL_Q, a: INITIAL_A.slice(0, i) }]);
      if (i >= INITIAL_A.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, 18);
    return () => clearInterval(id);
  }, [meetingId]);

  // Persist history whenever it changes.
  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem(storageKey(meetingId), JSON.stringify(messages));
  }, [messages, meetingId]);

  // Keep the latest exchange in view as it streams in.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading, typing]);

  const submit = async () => {
    if (!value.trim()) return;
    const question = value;
    setMessages((prev) => [...prev, { q: question, a: "" }]);
    setTyping(false);
    setLoading(true);
    setValue("");

    try {
      const res = await fetch(`/api/meetings/${meetingId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: {
          question,
          meetingId,
        } }),
      });
      const result = await res.json();
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { q: question, a: result.answer ?? "" };
        return next;
      });
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { q: question, a: "Something went wrong, please try again.", error: true };
        return next;
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.cyan}33`,
        borderRadius: 12,
        padding: 18,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner bloom */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 140,
          height: 140,
          borderRadius: 99,
          background: `radial-gradient(circle, ${tokens.cyan}1f 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${tokens.violet}, ${tokens.cyan})`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 800, color: tokens.bg }}>AI</span>
            </div>
            <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13.5, color: tokens.text, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Ask this meeting
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: tokens.textMute,
              padding: "2px 6px",
              border: `1px solid ${tokens.border}`,
              borderRadius: 4,
            }}
          >
            ⌘ /
          </span>
        </div>

        {messages.length > 0 && (
          <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 14, maxHeight: 360, overflowY: "auto" }}>
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      alignSelf: "flex-end",
                      maxWidth: "85%",
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${tokens.border}`,
                      padding: "8px 12px",
                      borderRadius: 9,
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: 13,
                      color: tokens.text,
                      lineHeight: 1.4,
                    }}
                  >
                    {m.q}
                  </div>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      maxWidth: "95%",
                      background: `linear-gradient(135deg, ${tokens.violet}10, ${tokens.cyan}10)`,
                      border: `1px solid ${tokens.cyan}33`,
                      padding: "10px 12px",
                      borderRadius: 9,
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: 13,
                      color: tokens.text,
                      lineHeight: 1.5,
                    }}
                  >
                    {isLast && loading ? (
                      <span style={{ color: tokens.textMute, fontStyle: "italic" }}>
                        Fetching meeting detail
                        <span style={{ color: tokens.cyan, marginLeft: 2, animation: "recalled-blink 0.9s steps(2,end) infinite" }}>....</span>
                      </span>
                    ) : m.error ? (
                      <span style={{ color: "#f87171" }}>{m.a}</span>
                    ) : (
                      m.a
                    )}
                    {isLast && typing && (
                      <span style={{ color: tokens.cyan, marginLeft: 2, animation: "recalled-blink 0.9s steps(2,end) infinite" }}>▌</span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        )}

        {/* Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: tokens.surface2,
            border: `1px solid ${tokens.border}`,
            borderRadius: 9,
          }}
        >
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: tokens.cyan, fontWeight: 700 }}>?</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="Ask a follow-up about this meeting…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              color: tokens.text,
            }}
          />
          <button
            onClick={submit}
            style={{
              background: tokens.text,
              color: tokens.bg,
              border: "none",
              padding: "4px 10px",
              borderRadius: 6,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↵
          </button>
        </div>

        {/* Suggestions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {ASK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setValue(s)}
              style={{
                background: "transparent",
                border: `1px solid ${tokens.border}`,
                borderRadius: 99,
                padding: "4px 10px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 11.5,
                color: tokens.textDim,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tokens.cyan + "55";
                e.currentTarget.style.color = tokens.cyan;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tokens.border;
                e.currentTarget.style.color = tokens.textDim;
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
