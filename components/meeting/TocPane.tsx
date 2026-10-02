"use client";

// components/meeting/TocPane.tsx
// Left rail: back link, meta, speaker share, TOC.

import Link from "next/link";
import { tokens } from "../landing/tokens";
import { type MeetingDetail } from "./data";

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

function SpeakerShareBar({ speakers }: { speakers: MeetingDetail["speakers"] }) {
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
      {speakers.map((s) => (
        <div key={s.name} title={`${s.name}: ${s.share}%`} style={{ width: `${s.share}%`, background: s.color, opacity: 0.85 }} />
      ))}
    </div>
  );
}

function TocNav({
  active,
  onJump,
  openCount,
  decisionCount,
  unresolvedCount,
}: {
  active: string;
  onJump: (id: string) => void;
  openCount: number;
  decisionCount: number;
  unresolvedCount: number;
}) {
  const sections = [
    { id: "tldr",       label: "TL;DR" },
    { id: "decisions",  label: "Key decisions", count: decisionCount },
    { id: "actions",    label: "Action items",  count: openCount, accent: true },
    { id: "unresolved", label: "Unresolved",    count: unresolvedCount },
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

export function TocPane({
  meeting,
  activeSection,
  onJumpSection,
  onJumpTime,
  openActionCount,
}: {
  meeting: MeetingDetail;
  activeSection: string;
  onJumpSection: (id: string) => void;
  onJumpTime: (t: string) => void;
  openActionCount: number;
}) {
  return (
    <aside
      className="meeting-toc"
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
            {meeting.date}
          </div>
          <div>
            <span style={{ color: tokens.textMute }}>TIME </span>
            {meeting.time} · {meeting.duration}
          </div>
          <div>
            <span style={{ color: tokens.textMute }}>LANG </span>
            {meeting.language}
          </div>
        </div>
      </div>

      {meeting.speakers.length > 0 && (
        <div>
          <TocLabel>// SPEAKERS · {meeting.speakers.length}</TocLabel>
          <SpeakerShareBar speakers={meeting.speakers} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {meeting.speakers.map((s) => (
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
      )}

      <div style={{ marginLeft: -10, marginRight: -10 }}>
        <TocNav
          active={activeSection}
          onJump={onJumpSection}
          openCount={openActionCount}
          decisionCount={meeting.decisions.length}
          unresolvedCount={meeting.unresolved.length}
        />
      </div>
    </aside>
  );
}
