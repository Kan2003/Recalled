// components/upload/AuroraBg.tsx
// Subtle aurora + grid background for the upload page. Server-renderable.

import { tokens } from "../landing/tokens";

export function AuroraBg() {
  return (
    <>
      {/* iridescent bloom */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(50% 40% at 20% 10%, ${tokens.violet}10 0%, transparent 60%),
                       radial-gradient(45% 35% at 85% 90%, ${tokens.cyan}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      {/* faint grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(${tokens.border} 1px, transparent 1px), linear-gradient(90deg, ${tokens.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(70% 70% at 50% 20%, black, transparent 90%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 50% 20%, black, transparent 90%)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
