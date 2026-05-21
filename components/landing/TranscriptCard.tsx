"use client";

// components/landing/TranscriptCard.tsx
// Live-feel transcript with streaming lines + animated waveform. Client-only
// because of the animation hooks.

import { useEffect, useRef } from "react";
import { tokens } from "./tokens";
import { TRANSCRIPT_LINES } from "./data";
import { useStream } from "./hooks";

export function TranscriptCard() {
  const lines = useStream(TRANSCRIPT_LINES, { delay: 1200, startDelay: 600, loop: true });
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [lines.length]);

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.surface2} 100%)`,
        border: `1px solid ${tokens.border}`,
        borderRadius: 14,
        padding: 18,
        width: "min(340px, 100%)",
        height: 380,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: "#ef4444",
              boxShadow: "0 0 8px #ef4444aa",
              animation: "recalled-pulse 1.6s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10.5,
              color: tokens.textDim,
              letterSpacing: "0.04em",
            }}
          >
            LIVE · TRANSCRIBING
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10.5, color: tokens.textMute }}>
          00:14:32
        </span>
      </div>

      <div style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: tokens.textMute, marginBottom: 10 }}>
        Q1 launch sync · 4 speakers
      </div>

      <div
        ref={scrollerRef}
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maskImage: "linear-gradient(to bottom, transparent, black 12%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 85%, transparent)",
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ opacity: i === lines.length - 1 ? 1 : 0.55, transition: "opacity 0.4s" }}>
            <div
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                color: tokens.textDim,
                marginBottom: 3,
                letterSpacing: "0.02em",
              }}
            >
              {l.speaker} · {l.role}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13.5,
                color: tokens.text,
                lineHeight: 1.45,
              }}
            >
              {l.text}
            </div>
          </div>
        ))}
      </div>

      {/* Waveform footer */}
      <div style={{ display: "flex", alignItems: "end", gap: 2, height: 22, marginTop: 12 }}>
        {Array.from({ length: 48 }).map((_, i) => {
          const h = 6 + Math.abs(Math.sin(i * 0.7) + Math.sin(i * 0.3)) * 7;
          return (
            <div
              key={i}
              style={{
                width: 3,
                height: `${h}px`,
                background: `linear-gradient(180deg, ${tokens.cyan} 0%, ${tokens.violet} 100%)`,
                borderRadius: 2,
                opacity: i > 36 ? 0.3 : 0.8,
                animation: `recalled-bar 1.${i % 9}s ease-in-out infinite alternate`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
