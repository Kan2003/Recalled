"use client";

// components/meeting/RightRail.tsx
// Right pane — sticky Ask AI + share status + related meetings.

import { useState, useEffect, useRef } from "react";
import { tokens } from "../landing/tokens";
import {
  ASK_HISTORY_INITIAL,
  ASK_SUGGESTIONS,
  ASK_SAMPLE_ANSWERS,
  type AskMessage,
  type MeetingDetail,
} from "./data";

// Typewriter — types out `text` while `run` is true.
function useType(text: string, run: boolean, speed = 14): [string, boolean] {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!run) return;
    setOut("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, run, speed]);
  return [out, done];
}

function Message({
  msg,
  typing,
  onTimeJump,
}: {
  msg: AskMessage;
  typing?: boolean;
  onTimeJump?: (t: string) => void;
}) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "92%",
        background: isUser
          ? "rgba(255,255,255,0.05)"
          : `linear-gradient(135deg, ${tokens.violet}10, ${tokens.cyan}10)`,
        border: isUser ? `1px solid ${tokens.border}` : `1px solid ${tokens.cyan}33`,
        padding: "10px 12px",
        borderRadius: 9,
        fontFamily: "var(--font-geist-sans)",
        fontSize: 13,
        color: tokens.text,
        lineHeight: 1.5,
      }}
    >
      {msg.text}
      {typing && (
        <span style={{ color: tokens.cyan, marginLeft: 2, animation: "recalled-blink 0.9s steps(2,end) infinite" }}>▌</span>
      )}
      {!typing && !isUser && msg.cites && msg.cites.length > 0 && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: `1px solid ${tokens.border}`,
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9.5, color: tokens.textMute, letterSpacing: "0.04em" }}>
            CITES
          </span>
          {msg.cites.map((c) => (
            <button
              key={c}
              onClick={() => onTimeJump?.(c)}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                color: tokens.cyan,
                padding: "1px 5px",
                border: `1px solid ${tokens.cyan}44`,
                borderRadius: 4,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ↳ {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AskAI({ onTimeJump }: { onTimeJump: (t: string) => void }) {
  const [history, setHistory] = useState<AskMessage[]>(ASK_HISTORY_INITIAL);
  const [pending, setPending] = useState<AskMessage | null>(null);
  const [value, setValue] = useState("");

  const [typed, done] = useType(pending?.text || "", !!pending, 12);

  useEffect(() => {
    if (done && pending) {
      setHistory((h) => [...h, pending]);
      setPending(null);
    }
  }, [done, pending]);

  const submit = () => {
    if (!value.trim()) return;
    const q = value.trim();
    setHistory((h) => [...h, { role: "user", text: q }]);
    setValue("");
    // Real impl: stream POST /api/meetings/:id/ask
    setTimeout(() => {
      const sample = ASK_SAMPLE_ANSWERS[Math.floor(Math.random() * ASK_SAMPLE_ANSWERS.length)];
      setPending(sample);
    }, 350);
  };

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history.length, typed]);

  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.cyan}33`,
        borderRadius: 12,
        padding: 18,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: 99,
          background: `radial-gradient(circle, ${tokens.cyan}1f 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: `linear-gradient(135deg, ${tokens.violet}, ${tokens.cyan})`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 800, color: tokens.bg }}>AI</span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 13.5,
                  color: tokens.text,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Ask this meeting
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 9.5,
                  color: tokens.textMute,
                  letterSpacing: "0.04em",
                  marginTop: 1,
                }}
              >
                ANSWERS CITE THE TRANSCRIPT
              </div>
            </div>
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

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            paddingRight: 4,
            marginRight: -4,
            marginBottom: 12,
          }}
        >
          {history.map((m, i) => (
            <Message key={i} msg={m} onTimeJump={onTimeJump} />
          ))}
          {pending && (
            <Message
              msg={{ role: "ai", text: typed, cites: pending.cites }}
              typing={!done}
              onTimeJump={onTimeJump}
            />
          )}
          <div ref={endRef} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 12px",
            background: tokens.surface2,
            border: `1px solid ${tokens.border}`,
            borderRadius: 9,
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: tokens.cyan, fontWeight: 700 }}>?</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Ask a follow-up…"
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10, flexShrink: 0 }}>
          {ASK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setValue(s)}
              style={{
                background: "transparent",
                border: `1px solid ${tokens.border}`,
                borderRadius: 99,
                padding: "3px 9px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: 11,
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

function ShareStatus() {
  const [enabled, setEnabled] = useState(true);
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textDim,
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          // PUBLIC LINK
        </div>
        <button
          onClick={() => setEnabled(!enabled)}
          style={{
            width: 30,
            height: 17,
            borderRadius: 99,
            background: enabled ? tokens.cyan : "#1a1827",
            border: `1px solid ${enabled ? tokens.cyan : tokens.border}`,
            padding: 2,
            display: "flex",
            justifyContent: enabled ? "flex-end" : "flex-start",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
        >
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: 99,
              background: enabled ? tokens.bg : tokens.textDim,
            }}
          />
        </button>
      </div>
      {enabled ? (
        <>
          <div
            style={{
              padding: "8px 10px",
              background: tokens.surface2,
              border: `1px solid ${tokens.border}`,
              borderRadius: 7,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: tokens.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span style={{ color: tokens.cyan, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              recalled.app/s/4f3a-9c12
            </span>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: tokens.textDim,
                cursor: "pointer",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              COPY
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10.5,
              color: tokens.textMute,
              letterSpacing: "0.02em",
            }}
          >
            <span>
              <span style={{ color: tokens.text, fontWeight: 600 }}>14</span> views
            </span>
            <span>last opened 2h ago</span>
          </div>
        </>
      ) : (
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: tokens.textDim, lineHeight: 1.45 }}>
          Off. Only people with workspace access can view this meeting.
        </div>
      )}
    </div>
  );
}

function RelatedMeetings({ related }: { related: MeetingDetail["related"] }) {
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10.5,
          color: tokens.textDim,
          letterSpacing: "0.08em",
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        // RELATED MEETINGS
      </div>
      {related.length === 0 ? (
        <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: tokens.textDim, lineHeight: 1.45 }}>
          No related meetings found yet.
        </div>
      ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {related.map((m) => (
          <a
            key={m.id}
            href={`/dashboard/${m.id}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 10px",
              margin: "0 -10px",
              borderRadius: 6,
              color: "inherit",
              textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                background: tokens.surface2,
                border: `1px solid ${tokens.border}`,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                color: tokens.textDim,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: 12.5,
                  color: tokens.text,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.title}
              </div>
              <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: tokens.textMute, marginTop: 2 }}>
                {m.when} · {m.overlap} SHARED TOPIC{m.overlap > 1 ? "S" : ""}
              </div>
            </div>
          </a>
        ))}
      </div>
      )}
    </div>
  );
}

export function RightRail({
  meeting,
  onTimeJump,
}: {
  meeting: MeetingDetail;
  onTimeJump: (t: string) => void;
}) {
  return (
    <aside
      style={{
        width: 360,
        borderLeft: `1px solid ${tokens.border}`,
        padding: "24px 20px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <AskAI onTimeJump={onTimeJump} />
      <div style={{ overflow: "auto", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        <ShareStatus />
        <RelatedMeetings related={meeting.related} />
      </div>
    </aside>
  );
}
