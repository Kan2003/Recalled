// components/upload/UploadHeader.tsx
// Page chrome: logo, breadcrumb, step indicator, "Save as draft" button.

import Link from "next/link";
import { tokens } from "../landing/tokens";
import { Logo } from "../landing/Logo";

const STEPS = ["INGEST", "ANALYZE", "REVIEW"] as const;

export function UploadHeader({ step = 1 }: { step?: 1 | 2 | 3 }) {
  return (
    <header
      style={{
        borderBottom: `1px solid ${tokens.border}`,
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: tokens.bg,
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Logo />
        <span
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "-0.02em",
            color: tokens.text,
          }}
        >
          Recalled
        </span>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: tokens.textMute, marginLeft: 4 }}>/</span>
        <Link
          href="/dashboard"
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11.5,
            color: tokens.textDim,
            textDecoration: "none",
          }}
        >
          ← Dashboard
        </Link>
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11, color: tokens.textMute }}>/</span>
        <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 14, color: tokens.text, fontWeight: 500 }}>
          New meeting
        </span>
      </div>

      {/* Step pipeline indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {STEPS.map((s, i) => {
          const done = i + 1 < step;
          const active = i + 1 === step;
          const color = active ? tokens.cyan : done ? "#34d399" : tokens.textMute;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 99,
                    border: `1.5px solid ${color}`,
                    background: active ? `${tokens.cyan}1f` : done ? "#34d399" : "transparent",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: done ? tokens.bg : color,
                    boxShadow: active ? `0 0 12px ${tokens.cyan}55` : "none",
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10.5,
                    color,
                    letterSpacing: "0.08em",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: tokens.border }} />}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          style={{
            background: "transparent",
            border: `1px solid ${tokens.border}`,
            color: tokens.textDim,
            padding: "7px 12px",
            borderRadius: 7,
            fontFamily: "var(--font-geist-sans)",
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          Save as draft
        </button>
      </div>
    </header>
  );
}
