// components/dashboard/Icons.tsx
// Inline SVG icons — no external icon library. Each takes optional size.

import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const HomeIcon    = ({ size = 17, ...p }: Props) => <svg {...base(size)} {...p}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V9.5z"/></svg>;
export const SearchIcon  = ({ size = 17, ...p }: Props) => <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
export const CheckBoxIcon= ({ size = 17, ...p }: Props) => <svg {...base(size)} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 12l3 3 5-5"/></svg>;
export const ShareIcon   = ({ size = 17, ...p }: Props) => <svg {...base(size)} {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.5 10.5l7-4M8.5 13.5l7 4"/></svg>;
export const ArchiveIcon = ({ size = 17, ...p }: Props) => <svg {...base(size)} {...p}><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4"/></svg>;
export const SettingsIcon= ({ size = 17, ...p }: Props) => <svg {...base(size)} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5h0a1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v0a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>;
export const PlusIcon    = ({ size = 18, ...p }: Props) => <svg {...base(size)} strokeWidth={2.4} {...p}><path d="M12 5v14M5 12h14"/></svg>;
export const ExportIcon  = ({ size = 13, ...p }: Props) => <svg {...base(size)} {...p}><path d="M5 12V5a2 2 0 012-2h9l5 5v9a2 2 0 01-2 2h-5"/><path d="M3 17l3 3 3-3M6 20V11"/></svg>;
export const CheckIcon   = ({ size = 11, ...p }: Props) => <svg {...base(size)} strokeWidth={3} {...p}><path d="M5 12l5 5 9-11"/></svg>;
