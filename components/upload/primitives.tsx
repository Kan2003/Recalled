// components/upload/primitives.tsx
// Small shared primitives used across the upload screen.

import type { ReactNode } from "react";
import { tokens } from "../landing/tokens";

// Tiny monospace section label
export function Eyebrow({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: 10.5,
        color: accent || tokens.textDim,
        letterSpacing: "0.08em",
        fontWeight: 600,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

// Card frame with optional accent bloom
export function Card({
  children,
  accent,
  padding = 22,
  style = {},
}: {
  children: ReactNode;
  accent?: string;
  padding?: number;
  style?: React.CSSProperties;
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
        ...style,
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 160,
            height: 160,
            borderRadius: 99,
            background: `radial-gradient(circle, ${accent}1f 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
