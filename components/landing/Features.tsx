// components/landing/Features.tsx

import { tokens } from "./tokens";

function FeatureCard({
  icon,
  eyebrow,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${tokens.surface} 0%, ${tokens.bg} 100%)`,
        border: `1px solid ${tokens.border}`,
        borderRadius: 16,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: 99,
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: `linear-gradient(135deg, ${tokens.violet}22, ${accent}22)`,
          border: `1px solid ${accent}33`,
          display: "grid",
          placeItems: "center",
          color: accent,
          position: "relative",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10.5,
            color: tokens.textDim,
            letterSpacing: "0.08em",
            marginBottom: 8,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 20,
            fontWeight: 500,
            color: tokens.text,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            color: tokens.textDim,
            lineHeight: 1.55,
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

export function Features({ accent = tokens.cyan }: { accent?: string }) {
  return (
    <section
      id="features"
      style={{
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 56px) clamp(40px, 6vw, 60px)",
        borderTop: `1px solid ${tokens.border}`,
        position: "relative",
      }}
    >
      <div className="section-head">
        <div>
          <div
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: tokens.textDim,
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            // FEATURES
          </div>
          <h2
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: 0,
              color: tokens.text,
              maxWidth: 600,
            }}
          >
            Four primitives. One source of truth for every meeting.
          </h2>
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 14,
            color: tokens.textDim,
            maxWidth: 280,
            lineHeight: 1.5,
          }}
        >
          Each step is a separate API surface, composable from the dashboard or scripted via cron.
        </div>
      </div>
      <div className="features-grid">
        <FeatureCard
          accent={accent}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
            </svg>
          }
          eyebrow="01 · INGEST"
          title="Transcribe"
          body="Drop an mp3/wav/m4a or paste a raw transcript. Whisper handles speakers, timestamps, and six languages."
        />
        <FeatureCard
          accent={accent}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          }
          eyebrow="02 · DISTILL"
          title="Summarize"
          body="Claude pulls a TL;DR, key decisions, and topic clusters. Always cited back to the line in the transcript."
        />
        <FeatureCard
          accent={accent}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M8 11l3 3 6-6" />
            </svg>
          }
          eyebrow="03 · ASSIGN"
          title="Action items"
          body="Auto-detects task, owner, and due date. Daily email nudges via Resend until each one is checked off."
        />
        <FeatureCard
          accent={accent}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          }
          eyebrow="04 · RECALL"
          title="Ask AI"
          body="Chat with any past meeting. Answers cite the moment in the transcript, so you can verify in one click."
        />
      </div>
    </section>
  );
}
