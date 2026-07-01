"use client";

// components/landing/AskAICard.tsx
// Animated chat card. Cycles through Q&A pairs with a "thinking" stage.

import { tokens } from "./tokens";
import { ASK_AI_PAIRS } from "./data";
import { useAskAICycle } from "./hooks";

export function AskAICard({ accent = tokens.cyan }: { accent?: string }) {
  const { q, a, stage } = useAskAICycle(ASK_AI_PAIRS, { qSpeed: 24, aSpeed: 12, hold: 2400 });

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.surface2} 100%)`,
        border: `1px solid ${tokens.borderStrong}`,
        borderRadius: 14,
        padding: 18,
        width: "min(360px, 100%)",
        height: 320,
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 30px 80px -20px ${accent}25, 0 0 0 1px ${accent}15`,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: `linear-gradient(135deg, ${tokens.violet}, ${accent})`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9,
              fontWeight: 700,
              color: tokens.bg,
            }}
          >
            AI
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13,
            color: tokens.text,
            fontWeight: 500,
          }}
        >
          Ask this meeting
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            color: tokens.textMute,
          }}
        >
          ⌘K
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        {/* User question */}
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "85%",
            background: "rgba(255,255,255,0.06)",
            border: `1px solid ${tokens.border}`,
            padding: "8px 12px",
            borderRadius: 10,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13,
            color: tokens.text,
            lineHeight: 1.45,
          }}
        >
          {q}
          <span style={{ opacity: stage === "q" ? 1 : 0, marginLeft: 1, color: accent }}>▌</span>
        </div>

        {/* AI response */}
        {(stage === "thinking" || stage === "a" || stage === "hold") && (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "90%",
              background: `linear-gradient(135deg, ${tokens.violet}12, ${accent}10)`,
              border: `1px solid ${accent}33`,
              padding: "10px 12px",
              borderRadius: 10,
              fontFamily: "var(--font-geist-sans)",
              fontSize: 13,
              color: tokens.text,
              lineHeight: 1.5,
            }}
          >
            {stage === "thinking" ? (
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: accent, animation: "recalled-dot 1s ease-in-out infinite" }} />
                <div style={{ width: 6, height: 6, borderRadius: 99, background: accent, animation: "recalled-dot 1s ease-in-out 0.15s infinite" }} />
                <div style={{ width: 6, height: 6, borderRadius: 99, background: accent, animation: "recalled-dot 1s ease-in-out 0.3s infinite" }} />
              </div>
            ) : (
              <>
                {a}
                <span style={{ opacity: stage === "a" ? 1 : 0, color: accent }}>▌</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Input row */}
      <div
        style={{
          marginTop: 14,
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${tokens.border}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: tokens.textMute }}>›</span>
        <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12.5, color: tokens.textDim }}>
          Ask a follow-up…
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["transcript", "decisions", "actions"].map((c) => (
            <span
              key={c}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 9.5,
                color: tokens.textDim,
                border: `1px solid ${tokens.border}`,
                padding: "2px 6px",
                borderRadius: 4,
                letterSpacing: "0.04em",
              }}
            >
              #{c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
