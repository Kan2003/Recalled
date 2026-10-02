// app/dashboard/[meetingId]/loading.tsx
// Instant skeleton shown while the meeting page renders on the server.
// Mirrors MeetingDetailShell's three columns (TocPane / DocPane / RightRail).

import { tokens } from "@/components/landing/tokens";

function Bar({ w, h = 12, mb = 10 }: { w: number | string; h?: number; mb?: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        marginBottom: mb,
        borderRadius: 6,
        background: tokens.surface2,
        animation: "recalled-pulse 1.4s ease-in-out infinite",
      }}
    />
  );
}

export default function Loading() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: tokens.bg }}>
      <aside style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${tokens.border}`, padding: "24px 18px" }}>
        <Bar w={90} mb={32} />
        <Bar w={60} h={10} />
        <Bar w="85%" />
        <Bar w="70%" mb={32} />
        <Bar w={90} h={10} />
        {[80, 65, 75, 55, 70, 60].map((w, i) => (
          <Bar key={i} w={`${w}%`} />
        ))}
      </aside>

      <main style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ flex: 1, maxWidth: 760, padding: "32px 56px" }}>
          <Bar w={140} h={10} mb={20} />
          <Bar w="70%" h={36} mb={32} />
          <Bar w="100%" h={14} />
          <Bar w="95%" h={14} />
          <Bar w="60%" h={14} mb={40} />
          <Bar w={120} h={10} mb={16} />
          {[0, 1, 2].map((i) => (
            <Bar key={i} w="100%" h={44} />
          ))}
        </div>
      </main>

      <aside style={{ width: 360, flexShrink: 0, borderLeft: `1px solid ${tokens.border}`, padding: "24px 20px" }}>
        <Bar w={110} h={10} mb={16} />
        <Bar w="100%" h={120} mb={24} />
        <Bar w="100%" h={40} />
      </aside>
    </div>
  );
}
