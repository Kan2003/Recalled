// app/page.tsx
// Recalled — landing page (Aurora direction).
// Server component composing the homepage. Client work is isolated inside
// TranscriptCard / AskAICard / hooks.

import { TopNav } from "@/components/landing/TopNav";
import { AuroraBackdrop } from "@/components/landing/AuroraBackdrop";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stack } from "@/components/landing/Stack";
import { FooterCTA } from "@/components/landing/FooterCTA";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { tokens } from "@/components/landing/tokens";

// Tweak the accent here — everything iridescent re-tints automatically.
const ACCENT = tokens.cyan;

// Hero headline — three pieces so the middle word can render as a gradient.

const HEADLINE = {
  before: "Every meeting, ",
  accent: "recalled",
  after: ".",
};

export default function HomePage() {
  return (
    <main
      style={{
        background: tokens.bg,
        color: tokens.text,
        fontFamily: "var(--font-geist-sans)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SmoothScroll />
      <AuroraBackdrop accent={ACCENT} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <TopNav accent={ACCENT} />
        <Hero headline={HEADLINE} accent={ACCENT} />
        <Features accent={ACCENT} />
        <HowItWorks accent={ACCENT} />
        <Stack accent={ACCENT} />
        <FooterCTA accent={ACCENT} />
      </div>
    </main>
  );
}
