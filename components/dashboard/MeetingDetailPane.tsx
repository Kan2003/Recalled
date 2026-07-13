"use client";

// components/dashboard/MeetingDetailPane.tsx
// Right pane — selected meeting's TL;DR, action items, decisions, Ask AI.

import { tokens } from "../landing/tokens";
import type { Meeting, ActionItem, RawMeeting, RawActionItem } from "./data";
import { toActionItems, toDecisions } from "./data";
import { SpeakerStack } from "./SpeakerStack";
import { AskAIPanel } from "./AskAIPanel";
import { ExportIcon, ShareIcon, CheckIcon } from "./Icons";
import { useRouter } from "next/navigation";

function Card({
  eyebrow,
  sticky,
  children,
  accent,
  padding = 22,
}: {
  eyebrow?: string;
  sticky?: string;
  children: React.ReactNode;
  accent?: string;
  padding?: number;
}) {
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${accent ? accent + "33" : tokens.border}`,
        borderRadius: 12,
        padding,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 140,
            height: 140,
            borderRadius: 99,
            background: `radial-gradient(circle, ${accent}1f 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>
        {eyebrow && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                color: accent || tokens.textDim,
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              {eyebrow}
            </span>
            {sticky && (
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 10,
                  color: tokens.textMute,
                  letterSpacing: "0.04em",
                }}
              >
                {sticky}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function ActionRow({ item, onToggle }: { item: ActionItem; onToggle: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 0",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          border: `1.5px solid ${item.done ? "#34d399" : tokens.cyan}`,
          background: item.done ? "#34d399" : "transparent",
          display: "grid",
          placeItems: "center",
          marginTop: 1,
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
        }}
      >
        {item.done && <CheckIcon stroke={tokens.bg} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13.5,
            color: tokens.text,
            textDecoration: item.done ? "line-through" : "none",
            opacity: item.done ? 0.5 : 1,
            lineHeight: 1.4,
          }}
        >
          {item.what}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 4,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textMute,
            letterSpacing: "0.02em",
          }}
        >
          <span style={{ color: tokens.violet, fontWeight: 600 }}>{item.who.toUpperCase()}</span>
          <span>·</span>
          <span>{item.due.toUpperCase()}</span>
        </div>
      </div>
      <button
        style={{
          background: "transparent",
          border: `1px solid ${tokens.border}`,
          borderRadius: 5,
          color: tokens.textMute,
          padding: "4px 8px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 10,
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
      >
        ↳ 01:18
      </button>
    </div>
  );
}

export function MeetingDetailPane({
  meeting,
  raw,
  onActionItemsChange,
}: {
  meeting: Meeting | undefined;
  raw: RawMeeting | undefined;
  onActionItemsChange?: (updated: RawActionItem[]) => void;
}) {
  const router = useRouter();
  const actions = raw ? toActionItems(raw) : [];
  const decisions = raw ? toDecisions(raw) : [];
  const openCount = actions.filter((a) => !a.done).length;

  const toggleAction = async (item: ActionItem) => {
    if (!raw) return;
    const nextDone = !item.done;
    const optimistic = raw.actionItems.map((a) =>
      a.id === item.id ? { ...a, done: nextDone } : a,
    );
    onActionItemsChange?.(optimistic);

    try {
      const res = await fetch(`/api/meetings/${raw.id}/action-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: nextDone }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      onActionItemsChange?.(raw.actionItems);
    }
  };

  if (!meeting) {
    return (
      <section
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          color: tokens.textMute,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 12,
        }}
      >
        Select a meeting to preview.
      </section>
    );
  }

  return (
    <section style={{ flex: 1, overflow: "auto", position: "relative" }}>
      {/* Subtle aurora bloom backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(50% 40% at 80% 0%, ${tokens.cyan}12 0%, transparent 60%),
                       radial-gradient(40% 35% at 10% 30%, ${tokens.violet}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", padding: "24px 32px 40px" }}>
        {/* Header */}
        <header style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {meeting.live && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 9px",
                  borderRadius: 99,
                  background: "#ef44441a",
                  border: "1px solid #ef444444",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 10,
                  color: "#ef4444",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 99,
                    background: "#ef4444",
                    animation: "recalled-pulse 1.6s ease-in-out infinite",
                  }}
                />
                LIVE · TRANSCRIBING
              </span>
            )}
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10.5, color: tokens.textMute, letterSpacing: "0.04em" }}>
              {meeting.when.toUpperCase()} · {meeting.duration} · {meeting.speakers.length} SPEAKERS
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
              <ExportIcon />
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
              <ShareIcon size={13} />
              Share
            </button>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: tokens.text,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {meeting.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <SpeakerStack speakers={meeting.speakers} max={6} size={22} />
            <div style={{ display: "flex", gap: 6 }}>
              {meeting.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10.5,
                    color: tokens.textDim,
                    padding: "3px 8px",
                    borderRadius: 99,
                    background: tokens.surface,
                    border: `1px solid ${tokens.border}`,
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card eyebrow="// TL;DR">
            <p
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 16,
                color: tokens.text,
                lineHeight: 1.55,
                margin: 0,
                letterSpacing: "-0.005em",
              }}
            >
              {meeting.summary}
            </p>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
            <Card eyebrow="// ACTION ITEMS" sticky={`${openCount} OPEN · ${actions.length} TOTAL`}>
              {actions.length === 0 ? (
                <div style={{ padding: "12px 0", color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
                  No action items extracted.
                </div>
              ) : (
                actions.map((a) => (
                  <ActionRow key={a.id} item={a} onToggle={() => toggleAction(a)} />
                ))
              )}
            </Card>

            <Card eyebrow="// KEY DECISIONS" sticky={`${decisions.length} EXTRACTED`}>
              {decisions.length === 0 ? (
                <div style={{ padding: "12px 0", color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>
                  No decisions extracted.
                </div>
              ) : (
              decisions.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: i < decisions.length - 1 ? `1px solid ${tokens.border}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 11,
                      color: tokens.violet,
                      fontWeight: 700,
                      minWidth: 22,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: tokens.text, lineHeight: 1.45 }}>
                      {d.text}
                    </div>
                    {d.cite && (
                      <div style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: tokens.textMute, marginTop: 3 }}>
                        ↳ {d.cite}
                      </div>
                    )}
                  </div>
                </div>
              ))
              )}
            </Card>
          </div>

          <AskAIPanel  meetingId={meeting.id}/>

          {/* Transcript footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: 10,
              border: `1px dashed ${tokens.border}`,
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "end", gap: 1.5, height: 14 }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const h = 3 + Math.abs(Math.sin(i * 0.6) + Math.sin(i * 0.3)) * 5;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 2,
                        height: `${h}px`,
                        background: tokens.cyan,
                        opacity: 0.6,
                        borderRadius: 1,
                      }}
                    />
                  );
                })}
              </div>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: tokens.textDim }}>
                Full transcript · {meeting.duration} · {meeting.speakers.length} speakers
              </span>
            </div>
            <button
              style={{
                background: "transparent",
                color: tokens.cyan,
                border: `1px solid ${tokens.cyan}55`,
                padding: "7px 12px",
                borderRadius: 7,
                fontFamily: "var(--font-geist-sans)",
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
              }}

              onClick={() => {
                router.push(`/dashboard/${meeting.id}`);
              }}
            >
              Open transcript →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
