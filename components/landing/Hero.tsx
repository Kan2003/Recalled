// components/landing/Hero.tsx
// Hero block: eyebrow, big headline, sub, CTAs, stat row + collage of demo cards.

import Link from "next/link";
import { tokens } from "./tokens";
import { TranscriptCard } from "./TranscriptCard";
import { AskAICard } from "./AskAICard";
import { ActionChip } from "./ActionChip";
import { ACTION_ITEMS } from "./data";

export type HeroHeadline = {
  before: string;
  accent: string;
  after: string;
};

export function Hero({
  headline,
  accent = tokens.cyan,
}: {
  headline: HeroHeadline;
  accent?: string;
}) {
  return (
    <section
      className="hero-grid"
      style={{
        padding: "clamp(40px, 6vw, 60px) clamp(20px, 5vw, 56px) clamp(60px, 8vw, 80px)",
        position: "relative",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 99,
            border: `1px solid ${tokens.borderStrong}`,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 99,
              background: accent,
              boxShadow: `0 0 10px ${accent}`,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10.5,
              color: tokens.textDim,
              letterSpacing: "0.06em",
            }}
          >
            POWERED BY CLAUDE + WHISPER
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
            fontSize: "clamp(36px, 7vw, 68px)",
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            margin: 0,
            color: tokens.text,
          }}
        >
          {headline.before}
          <span
            style={{
              background: `linear-gradient(120deg, ${tokens.violet} 0%, ${accent} 50%, ${tokens.pink} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
              fontWeight: 400,
              display: "inline-block",
              paddingRight: "0.12em",
              marginRight: "-0.05em",
            }}
          >
            {headline.accent}
          </span>
          {headline.after}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(15px, 1.6vw, 18px)",
            lineHeight: 1.5,
            color: tokens.textDim,
            marginTop: 24,
            maxWidth: 480,
            letterSpacing: "-0.01em",
          }}
        >
          Upload a recording or paste a transcript. Recalled extracts decisions, assigns action
          items, and lets you chat with any meeting like it's a teammate that took perfect notes.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
          <Link
            href="/upload"
            style={{
              background: tokens.text,
              color: tokens.bg,
              border: "none",
              padding: "13px 20px",
              borderRadius: 9,
              fontFamily: "var(--font-geist-sans)",
              fontWeight: 500,
              fontSize: 14.5,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            Try the demo
            <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>→</span>
          </Link>
          <a
            href="https://github.com/Kan2003/Recalled"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "transparent",
              color: tokens.text,
              border: `1px solid ${tokens.borderStrong}`,
              padding: "13px 20px",
              borderRadius: 9,
              fontFamily: "var(--font-geist-sans)",
              fontWeight: 500,
              fontSize: 14.5,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 0a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.5c-2.22.48-2.7-.95-2.7-.95-.36-.92-.89-1.16-.89-1.16-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.88 2.34.67.07-.52.28-.88.5-1.08-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.65 7.65 0 014 0c1.52-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 008 0z" />
            </svg>
            Star on GitHub
          </a>
        </div>

        {/* Stat row */}
        <div
          style={{
            display: "flex",
            gap: "clamp(16px, 3vw, 32px)",
            marginTop: 56,
            paddingTop: 28,
            borderTop: `1px solid ${tokens.border}`,
            flexWrap: "wrap",
          }}
        >
          {[
            { k: "~12s", v: "per minute of audio" },
            { k: "6 langs", v: "Whisper supports" },
            { k: "MIT", v: "open source" },
          ].map((s) => (
            <div key={s.k}>
              <div
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 500,
                  fontSize: 22,
                  color: tokens.text,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.k}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  color: tokens.textDim,
                  marginTop: 2,
                  letterSpacing: "0.02em",
                }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: demo collage */}
      <div className="hero-collage">
        <div style={{ position: "absolute", left: -10, top: 20 }}>
          <TranscriptCard />
        </div>
        <div style={{ position: "absolute", right: -20, top: 100, zIndex: 2 }}>
          <AskAICard accent={accent} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            bottom: -20,
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <ActionChip item={ACTION_ITEMS[0]} offset={0} accent={accent} />
          <ActionChip item={ACTION_ITEMS[1]} offset={20} accent={accent} />
        </div>
      </div>
    </section>
  );
}
