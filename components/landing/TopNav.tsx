// components/landing/TopNav.tsx
// Header. Pure presentation — wrap the buttons with next/link + signIn() when wiring up.

import Link from "next/link";
import { tokens } from "./tokens";
import { Logo } from "./Logo";

export function TopNav({ accent = tokens.cyan }: { accent?: string }) {
  const linkStyle: React.CSSProperties = {
    color: tokens.textDim,
    textDecoration: "none",
    fontSize: 13.5,
    letterSpacing: "-0.005em",
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px clamp(20px, 5vw, 56px)",
        position: "relative",
        zIndex: 5,
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Logo accent={accent} />
        <span
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: "-0.02em",
            color: tokens.text,
          }}
        >
          Recalled
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textMute,
            border: `1px solid ${tokens.border}`,
            padding: "2px 6px",
            borderRadius: 4,
            marginLeft: 4,
          }}
        >
          v0.1 · BETA
        </span>
      </div>

      <div className="nav-links">
        <Link href="#features" className="nav-link" style={linkStyle}>Features</Link>
        <Link href="#how" className="nav-link" style={linkStyle}>How it works</Link>
        <Link href="#stack" className="nav-link" style={linkStyle}>Stack</Link>
        <a
          href="https://github.com/Kan2003/Recalled"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
          style={linkStyle}
        >
          GitHub ↗
        </a>
        <Link
          href="/login"
          style={{
            background: tokens.text,
            color: tokens.bg,
            border: "none",
            padding: "8px 14px",
            borderRadius: 7,
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Sign in →
        </Link>
      </div>
    </nav>
  );
}
