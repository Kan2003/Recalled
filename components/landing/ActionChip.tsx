// components/landing/ActionChip.tsx
// Compact action-item card. Server-renderable.

import { tokens } from "./tokens";
import type { ActionItem } from "./data";

export function ActionChip({
  item,
  offset = 0,
  accent = tokens.cyan,
}: {
  item: ActionItem;
  offset?: number;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        padding: "8px 12px 9px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transform: `translateX(${offset}px)`,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)",
        width: 260,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `1.5px solid ${accent}`,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 2, background: accent }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 12,
            color: tokens.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.what}
        </div>
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 10,
            color: tokens.textDim,
            marginTop: 2,
          }}
        >
          {item.who} · {item.due}
        </div>
      </div>
    </div>
  );
}
