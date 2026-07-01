// components/landing/Logo.tsx
// Server-renderable iridescent mark used in nav + footer.

import { tokens } from "./tokens";

export function Logo({ accent = tokens.cyan, size = 26 }: { accent?: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        background: `conic-gradient(from 200deg at 50% 50%, ${tokens.violet}, ${accent}, ${tokens.pink}, ${tokens.violet})`,
        display: "grid",
        placeItems: "center",
        boxShadow: `0 0 24px ${accent}55`,
      }}
    >
      <div style={{ width: size * 0.3, height: size * 0.3, borderRadius: 2, background: tokens.bg }} />
    </div>
  );
}
