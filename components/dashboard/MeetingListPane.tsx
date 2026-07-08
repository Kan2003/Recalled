"use client";

// components/dashboard/MeetingListPane.tsx
// Middle pane: search, filter chips, scrollable list of meeting rows.

import { useState, useMemo, useRef, useCallback } from "react";
import { tokens } from "../landing/tokens";
import type { Meeting } from "./data";
import { SpeakerStack } from "./SpeakerStack";
import { SearchIcon } from "./Icons";
import { useRouter } from "next/navigation";

type FilterKey = "all" | "open" | "live";

// Drag-to-resize config for the pane. Dragging past COLLAPSE_THRESHOLD
// snaps the pane into a slim collapsed rail instead of shrinking further.
const DEFAULT_WIDTH = 360;
const MIN_WIDTH = 280;
const MAX_WIDTH = 560;
const COLLAPSE_THRESHOLD = 200;
const COLLAPSED_WIDTH = 56;

function FilterChip({
  children,
  active,
  onClick,
  count,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 99,
        background: active ? `${tokens.cyan}1a` : "transparent",
        border: `1px solid ${active ? tokens.cyan + "55" : tokens.border}`,
        color: active ? tokens.cyan : tokens.textDim,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: "0.02em",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {children}
      {count !== undefined && <span style={{ opacity: 0.7 }}>· {count}</span>}
    </button>
  );
}

function MeetingRow({
  m,
  selected,
  onClick,
}: {
  m: Meeting;
  selected?: boolean;
  onClick?: () => void;
}) {
  const router = useRouter();
  return (
    <button
      onDoubleClick={() => {
        router.push(`/dashboard/${m.id}`);
      }}
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "14px 18px 14px 16px",
        background: selected
          ? `linear-gradient(90deg, ${tokens.cyan}10 0%, transparent 100%)`
          : "transparent",
        borderLeft: `2px solid ${selected ? tokens.cyan : "transparent"}`,
        borderBottom: `1px solid ${tokens.border}`,
        cursor: "pointer",
        transition: "background 0.12s",
        position: "relative",
        color: "inherit",
        font: "inherit",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {m.live && (
            <span
              style={{
                width: 6, height: 6, borderRadius: 99,
                background: "#ef4444",
                boxShadow: "0 0 8px #ef444499",
                animation: "recalled-pulse 1.6s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13.5,
              color: tokens.text,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {m.title}
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: tokens.textMute, flexShrink: 0 }}>
          {m.when}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: 12,
          color: tokens.textDim,
          lineHeight: 1.45,
          marginBottom: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {m.summary}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SpeakerStack speakers={m.speakers} max={4} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-mono)", fontSize: 10, color: tokens.textMute }}>
          {m.actions.open > 0 ? (
            <span style={{ color: tokens.cyan, fontWeight: 600, letterSpacing: "0.02em" }}>
              {m.actions.open} OPEN
            </span>
          ) : (
            <span style={{ color: "#34d399", letterSpacing: "0.02em" }}>✓ DONE</span>
          )}
          <span>·</span>
          <span>{m.duration}</span>
        </div>
      </div>
    </button>
  );
}

export function MeetingListPane({
  meetings,
  selectedId,
  onSelect,
}: {
  meetings: Meeting[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragState.current) return;
    const next = dragState.current.startWidth + (e.clientX - dragState.current.startX);
    if (next < COLLAPSE_THRESHOLD) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    setResizing(false);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startWidth: collapsed ? MIN_WIDTH : width };
    setResizing(true);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const filtered = useMemo(
    () =>
      meetings.filter((m) => {
        if (filter === "open" && m.actions.open === 0) return false;
        if (filter === "live" && !m.live) return false;
        if (query && !(m.title + " " + m.summary).toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [meetings, filter, query]
  );

  const openCount = meetings.filter((m) => m.actions.open > 0).length;

  const resizeHandle = (
    <div
      onPointerDown={startResize}
      onDoubleClick={() => { setCollapsed(false); setWidth(DEFAULT_WIDTH); }}
      title="Drag to resize · double-click to reset"
      style={{
        position: "absolute",
        top: 0,
        right: -3,
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
  );

  if (collapsed) {
    return (
      <section
        style={{
          position: "relative",
          width: COLLAPSED_WIDTH,
          borderRight: `1px solid ${tokens.border}`,
          background: tokens.surface,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 18,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          title="Expand meetings list"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <span
          style={{
            marginTop: 14,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            color: tokens.textMute,
            letterSpacing: "0.04em",
          }}
        >
          {meetings.length}
        </span>
        {resizeHandle}
      </section>
    );
  }

  return (
    <section
      style={{
        position: "relative",
        width,
        borderRight: `1px solid ${tokens.border}`,
        background: tokens.surface,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {resizeHandle}
      <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${tokens.border}` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <h1 style={{ fontFamily: "var(--font-geist-sans)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: tokens.text, margin: 0 }}>
            Meetings
          </h1>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10.5, color: tokens.textMute, letterSpacing: "0.04em" }}>
            {filtered.length} OF {meetings.length}
          </span>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            background: tokens.surface2,
            border: `1px solid ${tokens.border}`,
            borderRadius: 7,
            marginBottom: 12,
          }}
        >
          <SearchIcon size={13} stroke={tokens.textMute} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings & transcripts…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12.5,
              color: tokens.text,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "#3d3b49",
              padding: "1px 5px",
              border: `1px solid ${tokens.border}`,
              borderRadius: 3,
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <FilterChip active={filter === "all"}  onClick={() => setFilter("all")}  count={meetings.length}>ALL</FilterChip>
          <FilterChip active={filter === "open"} onClick={() => setFilter("open")} count={openCount}>OPEN</FilterChip>
          <FilterChip active={filter === "live"} onClick={() => setFilter("live")}>LIVE</FilterChip>
          <FilterChip>+ TAG</FilterChip>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
            No meetings match.
          </div>
        ) : (
          filtered.map((m) => (
            <MeetingRow key={m.id} m={m} selected={m.id === selectedId} onClick={() => onSelect(m.id)}  />
          ))
        )}
      </div>

      <div
        style={{
          padding: "10px 18px",
          borderTop: `1px solid ${tokens.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10,
          color: tokens.textMute,
          letterSpacing: "0.04em",
        }}
      >
        <span>NEWEST FIRST ↓</span>
        <span>SHIFT + ↑↓ TO MOVE</span>
      </div>
    </section>
  );
}
