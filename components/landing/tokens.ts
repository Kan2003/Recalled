// components/landing/tokens.ts
// Design tokens for the Aurora landing surface. Keep these centralized so a
// single change (e.g. swapping accent hue) ripples through every component.

export const tokens = {
  bg: "#08070d",
  surface: "#0e0d15",
  surface2: "#15131f",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#f4f3fb",
  textDim: "#9a98a8",
  textMute: "#5a5867",
  // Iridescent accents
  violet: "#a78bfa",
  blue: "#60a5fa",
  cyan: "#22d3ee",
  pink: "#f0abfc",
  // Default accent — swap per-theme
  accent: "#22d3ee",
} as const;

export type Tokens = typeof tokens;
