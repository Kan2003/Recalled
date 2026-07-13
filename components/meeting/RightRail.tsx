"use client";

// components/meeting/RightRail.tsx
// Right pane — sticky Ask AI + share status + related meetings.

import { useState, useRef, useCallback } from "react";
import { tokens } from "../landing/tokens";
import { type MeetingDetail } from "./data";
import { AskAIPanel } from "../dashboard/AskAIPanel";

// Drag-to-resize config for the pane, mirroring MeetingListPane's behavior.
const DEFAULT_WIDTH = 360;
const MIN_WIDTH = 360;
const MAX_WIDTH = 500;

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
  if (related.length === 0) return null;
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
    </div>
  );
}

export function RightRail({ meeting }: { meeting: MeetingDetail; onTimeJump: (t: string) => void }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [resizing, setResizing] = useState(false);
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragState.current) return;
    // Pane is on the right edge — dragging left (negative delta) grows it.
    const next = dragState.current.startWidth - (e.clientX - dragState.current.startX);
    setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    setResizing(false);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startWidth: width };
    setResizing(true);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <aside
      style={{
        position: "sticky",
        width,
        borderLeft: `1px solid ${tokens.border}`,
        padding: "24px 20px",
        flexShrink: 0,
        top: 0,
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        onPointerDown={startResize}
        onDoubleClick={() => setWidth(DEFAULT_WIDTH)}
        title="Drag to resize · double-click to reset"
        style={{
          position: "absolute",
          top: 0,
          left: -3,
          width: 6,
          height: "100%",
          cursor: "col-resize",
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: 2,
            height: "100%",
            margin: "0 auto",
            background: resizing ? tokens.cyan : "transparent",
            transition: resizing ? "none" : "background 0.15s",
          }}
        />
      </div>
      <AskAIPanel meetingId={meeting.id} />
      <div style={{ overflow: "auto", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        <ShareStatus />
        <RelatedMeetings related={meeting.related} />
      </div>
    </aside>
  );
}
