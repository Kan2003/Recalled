// components/landing/AuroraBackdrop.tsx
// Layered radial gradients + faint grid + grain. Pure CSS, no client JS needed.

import { tokens } from "./tokens";

export function AuroraBackdrop({ accent = tokens.cyan }: { accent?: string }) {
  return (
    <>
      {/* iridescent bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 50% at 70% 30%, ${accent}33 0%, transparent 60%),
                       radial-gradient(50% 45% at 25% 60%, ${tokens.violet}40 0%, transparent 60%),
                       radial-gradient(40% 40% at 80% 80%, ${tokens.pink}22 0%, transparent 60%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* SVG grain — embedded inline as data URI so there's nothing to fetch */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>")`,
          opacity: 0.08,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${tokens.border} 1px, transparent 1px), linear-gradient(90deg, ${tokens.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(60% 60% at 50% 30%, black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(60% 60% at 50% 30%, black, transparent 80%)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
