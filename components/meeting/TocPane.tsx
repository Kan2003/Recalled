"use client";

// components/meeting/TocPane.tsx
// Left rail: back link, meta, speaker share, TOC, chapters, sticky audio player.

import { useState } from "react";
import Link from "next/link";
import { tokens } from "../landing/tokens";
import { MEETING, CHAPTERS } from "./data";

function TocLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        color: tokens.textMute,
        letterSpacing: "0.08em",
        fontWeight: 600,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function SpeakerShareBar() {
  return (
    <div
      style={{
        display: "flex",
        height: 6,
        borderRadius: 99,
        overflow: "hidden",
        marginBottom: 12,
        background: tokens.surface2,
      }}
    >
      {MEETING.speakers.map((s) => (
        <div key={s.name} title={`${s.name}: ${s.share}%`} style={{ width: `${s.share}%`, background: s.color, opacity: 0.85 }} />
      ))}
    </div>
  );
}

function TocNav({
  active,
  onJump,
  openCount,
}: {
  active: string;
  onJump: (id: string) => void;
  openCount: number;
}) {
  const sections = [
    { id: "tldr",       label: "TL;DR" },
    { id: "decisions",  label: "Key decisions", count: MEETING.decisions.length },
    { id: "actions",    label: "Action items",  count: openCount, accent: true },
    { id: "unresolved", label: "Unresolved",    count: MEETING.unresolved.length },
    { id: "topics",     label: "Topics" },
    { id: "transcript", label: "Transcript" },
  ];
  return (
    <div>
      <TocLabel>// ON THIS PAGE</TocLabel>
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onJump(s.id)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "7px 12px",
            background: active === s.id ? `linear-gradient(90deg, ${tokens.cyan}12 0%, transparent 100%)` : "transparent",
            borderLeft: `2px solid ${active === s.id ? tokens.cyan : "transparent"}`,
            border: "none",
            color: active === s.id ? tokens.text : tokens.textDim,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13,
            fontWeight: active === s.id ? 600 : 400,
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.12s",
            marginLeft: -2,
            letterSpacing: "-0.005em",
          }}
          onMouseEnter={(e) => { if (active !== s.id) e.currentTarget.style.color = tokens.text; }}
          onMouseLeave={(e) => { if (active !== s.id) e.currentTarget.style.color = tokens.textDim; }}
        >
          <span>{s.label}</span>
          {s.count !== undefined && (
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                color: s.accent && s.count > 0 ? tokens.cyan : tokens.textMute,
                fontWeight: 600,
              }}
            >
              {s.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const progress = 34; // %, static demo
  return (
    <div
      style={{
        padding: 12,
        background: tokens.surface2,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 99,
            background: `linear-gradient(135deg, ${tokens.violet}, ${tokens.cyan})`,
            border: "none",
            color: tokens.bg,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10.5, color: tokens.text, letterSpacing: "0.02em" }}>
            14:32 <span style={{ color: tokens.textMute }}>/ {MEETING.duration}</span>
          </div>
        </div>
        <button
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 9,
            fontWeight: 600,
          }}
        >
          1×
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "end", gap: 1.5, height: 22, position: "relative" }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const h = 4 + Math.abs(Math.sin(i * 0.5) + Math.sin(i * 0.27)) * 8;
          const passed = (i / 60) * 100 < progress;
          return (
            <div
              key={i}
              style={{
                width: 2,
                height: `${h}px`,
                background: passed ? tokens.cyan : "#1a1827",
                borderRadius: 1,
                opacity: passed ? 0.85 : 1,
                flex: 1,
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            top: -3,
            bottom: -3,
            left: `${progress}%`,
            width: 2,
            background: tokens.text,
            boxShadow: `0 0 10px ${tokens.cyan}`,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

function Chapters({ onJump }: { onJump: (t: string) => void }) {
  return (
    <div>
      <TocLabel>// CHAPTERS · AUTO-DETECTED</TocLabel>
      {CHAPTERS.map((c) => (
        <button
          key={c.t}
          onClick={() => onJump(c.t)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            width: "100%",
            padding: "6px 0",
            background: "transparent",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10.5,
              color: tokens.cyan,
              fontWeight: 600,
              minWidth: 44,
              paddingTop: 2,
            }}
          >
            {c.t}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 12.5,
              color: tokens.textDim,
              lineHeight: 1.4,
            }}
          >
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export function TocPane({
  activeSection,
  onJumpSection,
  onJumpTime,
  openActionCount,
}: {
  activeSection: string;
  onJumpSection: (id: string) => void;
  onJumpTime: (t: string) => void;
  openActionCount: number;
}) {
  return (
    <aside
      style={{
        width: 240,
        borderRight: `1px solid ${tokens.border}`,
        background: tokens.bg,
        padding: "24px 18px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <Link
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: tokens.textDim,
          textDecoration: "none",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          letterSpacing: "0.02em",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All meetings
      </Link>

      <div>
        <TocLabel>// META</TocLabel>
        <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11.5, color: tokens.text, lineHeight: 1.8 }}>
          <div>
            <span style={{ color: tokens.textMute }}>WHEN </span>
            {MEETING.date}
          </div>
          <div>
            <span style={{ color: tokens.textMute }}>TIME </span>
            {MEETING.time} · {MEETING.duration}
          </div>
          <div>
            <span style={{ color: tokens.textMute }}>LANG </span>
            {MEETING.language}
          </div>
        </div>
      </div>

      <div>
        <TocLabel>// SPEAKERS · {MEETING.speakers.length}</TocLabel>
        <SpeakerShareBar />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {MEETING.speakers.map((s) => (
            <div
              key={s.name}
              style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-geist-sans)", fontSize: 11.5 }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 99, background: s.color, flexShrink: 0 }} />
              <span style={{ color: tokens.text, flex: 1 }}>
                {s.name} <span style={{ color: tokens.textMute }}>· {s.role}</span>
              </span>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: tokens.textMute }}>{s.share}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginLeft: -10, marginRight: -10 }}>
        <TocNav active={activeSection} onJump={onJumpSection} openCount={openActionCount} />
      </div>

      <Chapters onJump={onJumpTime} />

      <div style={{ flex: 1 }} />

      <AudioPlayer />
    </aside>
  );
}
