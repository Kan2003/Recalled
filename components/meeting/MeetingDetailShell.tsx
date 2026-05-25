"use client";

// components/meeting/MeetingDetailShell.tsx
// Composes the three columns and wires cross-pane scroll/jump.

import { useState, useEffect, useRef } from "react";
import { tokens } from "../landing/tokens";
import { MEETING, type MeetingAction } from "./data";
import { TocPane } from "./TocPane";
import { DocPane } from "./DocPane";
import { RightRail } from "./RightRail";

const SECTION_IDS = ["tldr", "decisions", "actions", "unresolved", "topics", "transcript"];

export function MeetingDetailShell() {
  // Actions live at the top so the TOC count + the doc stay in sync.
  const [actions, setActions] = useState<MeetingAction[]>(MEETING.actions);
  const openCount = actions.filter((a) => !a.done).length;

  const [activeSection, setActiveSection] = useState<string>("tldr");
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Jump to a section from TOC clicks
  const jumpToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Jump to a transcript turn (TOC chapters + Cite chips)
  const jumpToTime = (t: string) => {
    setActiveTime(t);
    const el = document.getElementById(`t-${t}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Sync activeSection with scroll position in the doc pane
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handler = () => {
      const positions = SECTION_IDS
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, top: el.getBoundingClientRect().top };
        })
        .filter((p): p is { id: string; top: number } => p !== null);
      const above = positions.filter((p) => p.top < 200);
      if (above.length) {
        const current = above[above.length - 1].id;
        setActiveSection((prev) => (prev === current ? prev : current));
      }
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: tokens.bg, color: tokens.text }}>
      <TocPane
        activeSection={activeSection}
        onJumpSection={jumpToSection}
        onJumpTime={jumpToTime}
        openActionCount={openCount}
      />
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <DocPane
          actions={actions}
          setActions={setActions}
          activeTranscriptTime={activeTime}
          onTimeJump={jumpToTime}
        />
      </div>
      <RightRail onTimeJump={jumpToTime} />
    </div>
  );
}
