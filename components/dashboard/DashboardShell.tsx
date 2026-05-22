"use client";

// components/dashboard/DashboardShell.tsx
// Composes the three panes and owns selection + nav state.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "../landing/tokens";
import { MEETINGS } from "./data";
import { Rail, type RailItem } from "./Rail";
import { MeetingListPane } from "./MeetingListPane";
import { MeetingDetailPane } from "./MeetingDetailPane";

export function DashboardShell() {
  const [selectedId, setSelectedId] = useState(MEETINGS[0].id);
  const [nav, setNav] = useState<RailItem>("home");
  const router = useRouter();

  const selected = MEETINGS.find((m) => m.id === selectedId);
  const openActions = MEETINGS.reduce((sum, m) => sum + m.actions.open, 0);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: tokens.bg,
        color: tokens.text,
        overflow: "hidden",
      }}
    >
      <Rail
        active={nav}
        onNav={setNav}
        onCreate={() => router.push("/upload")}
        openActions={openActions}
      />
      <MeetingListPane meetings={MEETINGS} selectedId={selectedId} onSelect={setSelectedId} />
      <MeetingDetailPane meeting={selected} />
    </div>
  );
}
