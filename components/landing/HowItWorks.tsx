// components/landing/HowItWorks.tsx

import { tokens } from "./tokens";

const STEPS = [
  {
    n: "01",
    title: "Drop the recording",
    body: "Audio file or pasted transcript — either works.",
    code: "POST /api/transcribe",
  },
  {
    n: "02",
    title: "AI does the read-through",
    body: "Whisper transcribes, Claude summarizes and extracts.",
    code: "POST /api/analyze",
  },
  {
    n: "03",
    title: "Ask, share, follow up",
    body: "Chat with the meeting, share a public link, get email nudges.",
    code: "POST /api/meetings/:id/ask",
  },
];

export function HowItWorks({ accent = tokens.cyan }: { accent?: string }) {
  return (
    <section
      id="how"
      style={{
        padding: "clamp(40px, 6vw, 60px) clamp(20px, 5vw, 56px) clamp(60px, 8vw, 100px)",
        borderTop: `1px solid ${tokens.border}`,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 11,
          color: tokens.textDim,
          letterSpacing: "0.1em",
          marginBottom: 12,
        }}
      >
        // HOW IT WORKS
      </div>
      <h2
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(24px, 3.5vw, 36px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          margin: "0 0 40px",
          color: tokens.text,
        }}
      >
        From audio to assigned in under a minute.
      </h2>
      <div className="how-grid">
        {STEPS.map((s) => (
          <div key={s.n} className="how-cell">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 11,
                  color: accent,
                  letterSpacing: "0.06em",
                }}
              >
                STEP {s.n}
              </div>
              <div style={{ flex: 1, height: 1, background: tokens.border }} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: tokens.text,
                marginBottom: 10,
              }}
            >
              {s.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 14,
                color: tokens.textDim,
                lineHeight: 1.55,
                marginBottom: 20,
              }}
            >
              {s.body}
            </div>
            <div
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 11.5,
                color: accent,
                padding: "6px 10px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${tokens.border}`,
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              {s.code}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
