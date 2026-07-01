// components/landing/Stack.tsx

import { tokens } from "./tokens";

const STACK = [
  { name: "Next.js 14", cat: "framework" },
  { name: "TypeScript", cat: "language" },
  { name: "PostgreSQL", cat: "database" },
  { name: "Prisma", cat: "orm" },
  { name: "NextAuth v5", cat: "auth" },
  { name: "Claude", cat: "ai · summary" },
  { name: "Whisper", cat: "ai · audio" },
  { name: "Resend", cat: "email" },
  { name: "Tailwind", cat: "styles" },
  { name: "Vercel", cat: "hosting" },
];

export function Stack({ accent = tokens.cyan }: { accent?: string }) {
  return (
    <section
      id="stack"
      style={{
        padding: "clamp(40px, 6vw, 60px) clamp(20px, 5vw, 56px) clamp(60px, 8vw, 80px)",
        borderTop: `1px solid ${tokens.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 32, gap: 16, flexWrap: "wrap" }}>
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
            // STACK
          </div>
          <h2
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: 0,
              color: tokens.text,
            }}
          >
            Built with the tools you&apos;d hire someone for.
          </h2>
        </div>
        <a
          href="https://github.com/Kan2003/Recalled"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 12,
            color: accent,
            textDecoration: "none",
          }}
        >
          View repo on GitHub ↗
        </a>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {STACK.map((s) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 8,
              background: tokens.surface,
              border: `1px solid ${tokens.border}`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: 13.5,
                color: tokens.text,
                fontWeight: 500,
              }}
            >
              {s.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10.5,
                color: tokens.textDim,
                letterSpacing: "0.04em",
              }}
            >
              · {s.cat}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
