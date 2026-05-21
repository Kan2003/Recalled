// components/landing/FooterCTA.tsx

import Link from "next/link";
import { tokens } from "./tokens";
import { Logo } from "./Logo";

export function FooterCTA({ accent = tokens.cyan }: { accent?: string }) {
  return (
    <footer style={{ padding: "0 clamp(20px, 5vw, 56px) clamp(40px, 6vw, 56px)" }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 18,
          border: `1px solid ${tokens.borderStrong}`,
          background: `linear-gradient(135deg, ${tokens.surface} 0%, ${tokens.surface2} 100%)`,
          padding: "clamp(24px, 5vw, 56px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(40% 80% at 80% 50%, ${accent}30 0%, transparent 60%), radial-gradient(40% 80% at 20% 50%, ${tokens.violet}30 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                margin: 0,
                color: tokens.text,
                maxWidth: 520,
                lineHeight: 1.05,
              }}
            >
              Stop forwarding meeting recordings to yourself.
            </h3>
            <p
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 16,
                color: tokens.textDim,
                marginTop: 14,
                maxWidth: 480,
              }}
            >
              Sign in with Google, upload a recording, and see what your meetings actually said.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/login"
              style={{
                background: tokens.text,
                color: tokens.bg,
                border: "none",
                padding: "14px 22px",
                borderRadius: 10,
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Try Recalled →
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 28,
          paddingTop: 24,
          borderTop: `1px solid ${tokens.border}`,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo accent={accent} />
          <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: tokens.textDim }}>
            Recalled — AI-powered meeting intelligence platform build by Kanha
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            color: tokens.textMute,
            letterSpacing: "0.04em",
          }}
        >
          <span>MIT LICENSE</span>
          <span>BUILT 2025</span>
          <a
            href="https://github.com/Kan2003/Recalled"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            GITHUB.COM/KAN2003/RECALLED
          </a>
        </div>
      </div>
    </footer>
  );
}
