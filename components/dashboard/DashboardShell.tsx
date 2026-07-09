"use client";

// components/dashboard/DashboardShell.tsx
// Composes the three panes and owns selection + nav state.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokens } from "../landing/tokens";
import { toMeetingSummary, type RawMeeting } from "./data";
import { Rail, type RailItem } from "./Rail";
import { MeetingListPane } from "./MeetingListPane";
import { MeetingDetailPane } from "./MeetingDetailPane";
import { useSession } from "next-auth/react";

export function DashboardShell() {
  const session = useSession();
  const [meetings, setMeetings] = useState<RawMeeting[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [nav, setNav] = useState<RailItem>("home");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/meetings")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: RawMeeting[]) => {
        if (cancelled) return;
        setMeetings(data);
        setSelectedId((current) => current ?? data[0]?.id);
      })
      .catch(() => {
        if (!cancelled) setMeetings([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const summaries = (meetings ?? []).map(toMeetingSummary);
  const selectedRaw = meetings?.find((m) => m.id === selectedId);
  const openActions = (meetings ?? []).reduce(
    (sum, m) => sum + m.actionItems.filter((a) => !a.done).length,
    0,
  );

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
        session={session}
      />
      {meetings === null ? (
        <div style={{ flex: 1, display: "grid", placeItems: "center", color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
          Loading meetings…
        </div>
      ) : meetings.length === 0 ? (
        <div style={{ flex: 1, display: "grid", placeItems: "center", color: tokens.textMute, fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
          No meetings yet — upload one to get started.
        </div>
      ) : (
        <>
          <MeetingListPane meetings={summaries} selectedId={selectedId ?? ""} onSelect={setSelectedId} />
          <MeetingDetailPane
            meeting={selectedRaw ? toMeetingSummary(selectedRaw) : undefined}
            raw={selectedRaw}
            onActionItemsChange={(updated) =>
              setMeetings((prev) =>
                prev?.map((m) => (m.id === selectedRaw?.id ? { ...m, actionItems: updated } : m)) ?? prev,
              )
            }
          />
        </>
      )}
    </div>
  );
}
