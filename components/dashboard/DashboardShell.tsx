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
import { useIsMobile } from "./useIsMobile";

export function DashboardShell() {
  const session = useSession();
  const [meetings, setMeetings] = useState<RawMeeting[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [nav, setNav] = useState<RailItem>("home");
  const router = useRouter();

  // Phones have no room for list + detail side by side, so show one at a
  // time: tapping a meeting opens its detail, Back returns to the list.
  const isMobile = useIsMobile();
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const showList = !isMobile || !mobileDetailOpen;
  const showDetail = !isMobile || mobileDetailOpen;

  const selectMeeting = (id: string) => {
    setSelectedId(id);
    setMobileDetailOpen(true);
  };

  // Drop the deleted meeting and select the one that slides into its spot
  // (or the new last one). Phones go back to the list.
  const handleMeetingDeleted = (id: string) => {
    const list = meetings ?? [];
    const index = list.findIndex((m) => m.id === id);
    const remaining = list.filter((m) => m.id !== id);
    setMeetings((prev) => prev?.filter((m) => m.id !== id) ?? prev);
    setSelectedId(remaining[Math.min(index, remaining.length - 1)]?.id);
    setMobileDetailOpen(false);
  };

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
          {showList && (
            <MeetingListPane
              meetings={summaries}
              selectedId={selectedId ?? ""}
              onSelect={selectMeeting}
              fullWidth={isMobile}
            />
          )}
          {showDetail && (
            <MeetingDetailPane
              meeting={selectedRaw ? toMeetingSummary(selectedRaw) : undefined}
              raw={selectedRaw}
              onBack={isMobile ? () => setMobileDetailOpen(false) : undefined}
              onDeleted={handleMeetingDeleted}
              onActionItemsChange={(updated) =>
                setMeetings((prev) =>
                  prev?.map((m) => (m.id === selectedRaw?.id ? { ...m, actionItems: updated } : m)) ?? prev,
                )
              }
            />
          )}
        </>
      )}
    </div>
  );
}
