// components/landing/tokens.ts
// Design tokens for the Aurora landing surface. Keep these centralized so a
// single change (e.g. swapping accent hue) ripples through every component.

export const tokens = {
  bg: "#0b0a12",
  surface: "#171522",
  surface2: "#201d2e",
  border: "rgba(255,255,255,0.14)",
  borderStrong: "rgba(255,255,255,0.22)",
  text: "#f8f7fc",
  textDim: "#b3b1c2",
  textMute: "#7a7889",
  // Iridescent accents — brightened for contrast against the new surfaces
  violet: "#c4b5fd",
  blue: "#7dd3fc",
  cyan: "#67e8f9",
  pink: "#f5d0fe",
  // Default accent — swap per-theme
  accent: "#67e8f9",
} as const;

export type Tokens = typeof tokens;
