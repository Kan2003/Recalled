"use client";

// components/dashboard/SpeakerStack.tsx
// Overlapping avatar pile. Server-renderable but used inside client panes,
// so kept here for colocation.

import type { Speaker } from "./data";
import { tokens } from "../landing/tokens";

export function SpeakerStack({
  speakers,
  max = 4,
  size = 18,
}: {
  speakers: Speaker[];
  max?: number;
  size?: number;
}) {
  const visible = speakers.slice(0, max);
  const extra = Math.max(0, speakers.length - max);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((s, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: 99,
            background: s.color ? `${s.color}33` : tokens.surface2,
            border: `1.5px solid ${tokens.surface}`,
            color: s.color || tokens.textDim,
            fontFamily: "var(--font-geist-mono)",
            fontSize: size * 0.42,
            fontWeight: 700,
            display: "grid",
            placeItems: "center",
            marginLeft: i === 0 ? 0 : -6,
            position: "relative",
            zIndex: visible.length - i,
          }}
        >
          {s.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 99,
            background: tokens.surface2,
            color: tokens.textDim,
            fontFamily: "var(--font-geist-mono)",
            fontSize: size * 0.4,
            fontWeight: 600,
            display: "grid",
            placeItems: "center",
            marginLeft: -6,
            border: `1.5px solid ${tokens.surface}`,
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
