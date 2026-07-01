"use client";

// components/meeting/DocPane.tsx
// Center column — the meeting document itself.

import { useState } from "react";
import { tokens } from "../landing/tokens";
import { MEETING, type MeetingAction, type TranscriptTurn } from "./data";

// ── Primitives ────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        color: tokens.textDim,
        padding: "3px 9px",
        borderRadius: 99,
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </span>
  );
}

function H2({
  id,
  children,
  count,
  accent,
}: {
  id: string;
  children: React.ReactNode;
  count?: string | number;
  accent?: string;
}) {
  return (
    <h2
      id={id}
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 11,
        color: accent || tokens.textDim,
        letterSpacing: "0.1em",
        fontWeight: 600,
        margin: "40px 0 14px",
        scrollMarginTop: 24,
      }}
    >
      <span># {children}</span>
      {count !== undefined && <span style={{ color: tokens.textMute, fontWeight: 500 }}>{count}</span>}
      <span style={{ flex: 1, height: 1, background: tokens.border, marginLeft: 4 }} />
    </h2>
  );
}

function Cite({ time, onJump }: { time: string; onJump?: (t: string) => void }) {
  return (
    <button
      onClick={() => onJump?.(time)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        color: tokens.cyan,
        padding: "2px 6px",
        borderRadius: 4,
        background: "transparent",
        border: `1px solid ${tokens.cyan}33`,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = tokens.cyan + "15"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      ↳ {time}
    </button>
  );
}

function HeaderSpeakers() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {MEETING.speakers.map((s, i) => (
        <div
          key={s.name}
          title={`${s.name} · ${s.role}`}
          style={{
            width: 26,
            height: 26,
            borderRadius: 99,
            background: `${s.color}33`,
            color: s.color,
            border: `1.5px solid ${tokens.bg}`,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            fontWeight: 700,
            display: "grid",
            placeItems: "center",
            marginLeft: i === 0 ? 0 : -7,
            zIndex: MEETING.speakers.length - i,
            position: "relative",
          }}
        >
          {s.initials}
        </div>
      ))}
    </div>
  );
}

function ActionRow({
  action,
  onToggle,
  onJump,
}: {
  action: MeetingAction;
  onToggle: () => void;
  onJump: (t: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "14px 0",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: `1.5px solid ${action.done ? "#34d399" : tokens.cyan}`,
          background: action.done ? "#34d399" : "transparent",
          display: "grid",
          placeItems: "center",
          marginTop: 1,
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
        }}
      >
        {action.done && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={tokens.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5 9-11" />
          </svg>
        )}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            color: tokens.text,
            lineHeight: 1.45,
            textDecoration: action.done ? "line-through" : "none",
            opacity: action.done ? 0.5 : 1,
          }}
        >
          {action.what}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 5,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textMute,
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: tokens.violet, fontWeight: 600 }}>{action.who.toUpperCase()}</span>
          <span>·</span>
          <span style={{ color: action.done ? tokens.textMute : tokens.text }}>{action.due.toUpperCase()}</span>
          <span>·</span>
          <Cite time={action.cite} onJump={onJump} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <button
          title="Assign"
          style={{
            width: 24,
            height: 24,
            borderRadius: 5,
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0116 0" />
          </svg>
        </button>
        <button
          title="More"
          style={{
            width: 24,
            height: 24,
            borderRadius: 5,
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
          }}
        >
          ⋯
        </button>
      </div>
    </div>
  );
}

function TranscriptTurnRow({
  turn,
  active,
  onJump,
}: {
  turn: TranscriptTurn;
  active: boolean;
  onJump: (t: string) => void;
}) {
  const speakerColor = MEETING.speakers.find((s) => s.name === turn.who)?.color || tokens.violet;
  return (
    <div
      id={`t-${turn.t}`}
      data-time={turn.t}
      style={{
        display: "grid",
        gridTemplateColumns: "50px 1fr",
        gap: 16,
        padding: "14px 14px 14px 0",
        marginLeft: -14,
        background: active ? `${tokens.cyan}0e` : "transparent",
        borderLeft: active ? `2px solid ${tokens.cyan}` : "2px solid transparent",
        paddingLeft: 12,
        borderRadius: "0 6px 6px 0",
        scrollMarginTop: 24,
        transition: "background 0.2s",
      }}
    >
      <button
        onClick={() => onJump(turn.t)}
        style={{ background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            color: active ? tokens.cyan : tokens.textMute,
            letterSpacing: "0.02em",
          }}
        >
          {turn.t}
        </span>
      </button>
      <div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            color: speakerColor,
            fontWeight: 700,
            marginBottom: 4,
            letterSpacing: "0.02em",
          }}
        >
          {turn.who.toUpperCase()} <span style={{ color: tokens.textMute, fontWeight: 500 }}>· {turn.role}</span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14.5,
            color: tokens.text,
            lineHeight: 1.6,
            letterSpacing: "-0.005em",
          }}
        >
          {turn.text}
        </div>
      </div>
    </div>
  );
}

// ── Main pane ─────────────────────────────────────────────────────────────
export function DocPane({
  actions,
  setActions,
  activeTranscriptTime,
  onTimeJump,
}: {
  actions: MeetingAction[];
  setActions: React.Dispatch<React.SetStateAction<MeetingAction[]>>;
  activeTranscriptTime: string | null;
  onTimeJump: (t: string) => void;
}) {
  const openCount = actions.filter((a) => !a.done).length;
  const [firstSentence, ...rest] = MEETING.tldr.split(".");

  return (
    <main
      style={{
        flex: 1,
        maxWidth: 760,
        padding: "32px 56px 80px",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(50% 30% at 50% 0%, ${tokens.cyan}0c 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Status row + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 99,
              background: "#34d3991a",
              border: "1px solid #34d39944",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "#34d399",
              letterSpacing: "0.06em",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: 99,
                background: "#34d399",
                boxShadow: "0 0 6px #34d399",
              }}
            />
            ANALYZED
          </span>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10.5, color: tokens.textMute, letterSpacing: "0.04em" }}>
            CLAUDE · 92S · 14.3K TOKENS
          </span>
          <span style={{ flex: 1 }} />
          <button
            style={{
              background: "transparent",
              color: tokens.textDim,
              border: `1px solid ${tokens.border}`,
              padding: "7px 12px",
              borderRadius: 7,
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12.5,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12V5a2 2 0 012-2h9l5 5v9a2 2 0 01-2 2h-5" />
              <path d="M3 17l3 3 3-3M6 20V11" />
            </svg>
            Export
          </button>
          <button
            style={{
              background: tokens.text,
              color: tokens.bg,
              border: "none",
              padding: "7px 12px",
              borderRadius: 7,
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.5 10.5l7-4M8.5 13.5l7 4" />
            </svg>
            Share
          </button>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 44,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: tokens.text,
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          {MEETING.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
          <HeaderSpeakers />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MEETING.tags.map((t) => (
              <Tag key={t}>#{t}</Tag>
            ))}
          </div>
        </div>

        {/* ─ TL;DR ─ */}
        <section id="tldr" style={{ scrollMarginTop: 24 }}>
          <H2 id="h-tldr">TL;DR</H2>
          <p
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: 30,
              fontWeight: 400,
              color: tokens.text,
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: "-0.01em",
              maxWidth: 640,
            }}
          >
            <em
              style={{
                background: `linear-gradient(120deg, ${tokens.violet} 0%, ${tokens.cyan} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              &ldquo;{firstSentence}.&rdquo;
            </em>
          </p>
          <p
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 16,
              color: tokens.textDim,
              lineHeight: 1.6,
              marginTop: 18,
              maxWidth: 640,
            }}
          >
            {rest.join(".").trim()}
          </p>
        </section>

        {/* ─ Key decisions ─ */}
        <section id="decisions" style={{ scrollMarginTop: 24 }}>
          <H2 id="h-decisions" count={MEETING.decisions.length}>KEY DECISIONS</H2>
          {MEETING.decisions.map((d, i) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                padding: "12px 0",
                borderBottom: i < MEETING.decisions.length - 1 ? `1px solid ${tokens.border}` : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "Instrument Serif, serif",
                  fontStyle: "italic",
                  fontSize: 24,
                  color: tokens.violet,
                  minWidth: 32,
                  fontWeight: 400,
                }}
              >
                {String(i + 1).padStart(2, "0")}.
              </span>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 15.5, color: tokens.text, lineHeight: 1.5, marginBottom: 4 }}>
                  {d.text}
                </div>
                <Cite time={d.cite} onJump={onTimeJump} />
              </div>
            </div>
          ))}
        </section>

        {/* ─ Action items ─ */}
        <section id="actions" style={{ scrollMarginTop: 24 }}>
          <H2 id="h-actions" count={`${openCount} OPEN · ${actions.length} TOTAL`} accent={tokens.cyan}>
            ACTION ITEMS
          </H2>
          {actions.map((a) => (
            <ActionRow
              key={a.id}
              action={a}
              onToggle={() =>
                setActions((arr) => arr.map((x) => (x.id === a.id ? { ...x, done: !x.done } : x)))
              }
              onJump={onTimeJump}
            />
          ))}
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: tokens.surface2,
              border: `1px dashed ${tokens.border}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: tokens.textDim, letterSpacing: "0.02em" }}>
              Daily reminder emails are <span style={{ color: "#34d399", fontWeight: 600 }}>ON</span> for open actions
            </span>
            <button
              style={{
                background: "transparent",
                color: tokens.cyan,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Configure →
            </button>
          </div>
        </section>

        {/* ─ Unresolved ─ */}
        <section id="unresolved" style={{ scrollMarginTop: 24 }}>
          <H2 id="h-unresolved" count={MEETING.unresolved.length}>UNRESOLVED</H2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MEETING.unresolved.map((u) => (
              <div
                key={u}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "#fbbf240a",
                  border: "1px solid #fbbf2433",
                  borderRadius: 8,
                }}
              >
                <span style={{ color: "#fbbf24", fontFamily: "var(--font-geist-mono)", fontSize: 14, fontWeight: 700 }}>?</span>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: tokens.text }}>{u}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─ Topics ─ */}
        <section id="topics" style={{ scrollMarginTop: 24 }}>
          <H2 id="h-topics" count={MEETING.topics.length}>TOPICS</H2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {MEETING.topics.map((t) => (
              <span
                key={t}
                style={{
                  padding: "8px 14px",
                  borderRadius: 99,
                  background: tokens.surface,
                  border: `1px solid ${tokens.border}`,
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 12,
                  color: tokens.textDim,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </section>

        {/* ─ Transcript ─ */}
        <section id="transcript" style={{ scrollMarginTop: 24 }}>
          <H2 id="h-transcript" count={`${MEETING.transcript.length} TURNS`}>TRANSCRIPT</H2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: tokens.textDim,
            }}
          >
            <button style={{ padding: "4px 8px", background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 5, color: "inherit", cursor: "pointer", font: "inherit" }}>
              ⌕ Find in transcript
            </button>
            <button style={{ padding: "4px 8px", background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 5, color: "inherit", cursor: "pointer", font: "inherit" }}>
              ♦ Filter by speaker
            </button>
            <button style={{ padding: "4px 8px", background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 5, color: "inherit", cursor: "pointer", font: "inherit" }}>
              ↓ Download .txt
            </button>
          </div>
          {MEETING.transcript.map((turn) => (
            <TranscriptTurnRow
              key={turn.t}
              turn={turn}
              active={activeTranscriptTime === turn.t}
              onJump={onTimeJump}
            />
          ))}
        </section>

        {/* End marker */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${tokens.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textMute,
            letterSpacing: "0.04em",
          }}
        >
          <span>END · {MEETING.duration}</span>
          <span>SHARED BY @KAN · ANALYZED MAR 14</span>
        </div>
      </div>
    </main>
  );
}
