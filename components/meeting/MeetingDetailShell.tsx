"use client";

// components/meeting/MeetingDetailShell.tsx
// Composes the three columns and wires cross-pane scroll/jump. Responsive
// layout (column hiding/stacking) lives in globals.css under .meeting-*.

import { useState, useEffect, useRef } from "react";
import { tokens } from "../landing/tokens";
import { type MeetingDetail } from "./data";
import { TocPane } from "./TocPane";
import { DocPane } from "./DocPane";
import { RightRail } from "./RightRail";
import { AskAIPanel } from "../dashboard/AskAIPanel";
import { useMediaQuery } from "../dashboard/useIsMobile";

const SECTION_IDS = ["tldr", "decisions", "actions", "unresolved", "topics", "transcript"];

// Single-column breakpoint — keep in sync with the 899px rules in globals.css.
const NARROW_QUERY = "(max-width: 899px)";

export function MeetingDetailShell({ meeting }: { meeting: MeetingDetail }) {
  // Actions live at the top so the TOC count + the doc stay in sync.
  const [actions, setActions] = useState(meeting.actions);
  const openCount = actions.filter((a) => !a.done).length;

  const [activeSection, setActiveSection] = useState<string>("tldr");
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // In the single-column layout the right rail stacks below the whole doc,
  // so Ask AI moves into the doc (above the transcript) to stay reachable.
  const narrow = useMediaQuery(NARROW_QUERY);

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
    <div className="meeting-shell" style={{ display: "flex", minHeight: "100vh", background: tokens.bg, color: tokens.text }}>
      <TocPane
        meeting={meeting}
        activeSection={activeSection}
        onJumpSection={jumpToSection}
        onJumpTime={jumpToTime}
        openActionCount={openCount}
      />
      <div
        ref={scrollRef}
        className="meeting-doc-scroll"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <DocPane
          meeting={meeting}
          actions={actions}
          setActions={setActions}
          activeTranscriptTime={activeTime}
          onTimeJump={jumpToTime}
          askPanel={narrow ? <AskAIPanel meetingId={meeting.id} /> : undefined}
        />
      </div>
      <RightRail meeting={meeting} onTimeJump={jumpToTime} showAsk={!narrow} />
    </div>
  );
}
