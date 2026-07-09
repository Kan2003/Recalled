// components/meeting/fromPrisma.ts
// Maps a real Meeting (+ actionItems) row to the MeetingDetail shape the UI
// panels expect. The mock data this used to come from was richer than what
// we actually store (no speakers, no per-line transcript timestamps, no
// unresolved questions, no related-meeting overlap) — those fields are
// degraded to empty/neutral values here rather than invented.

import type { MeetingDetail } from "./data";

type PrismaActionItem = {
  id: string;
  task: string;
  owner: string | null;
  dueDate: Date | null;
  done: boolean;
};

type PrismaMeeting = {
  id: string;
  title: string;
  transcript: string;
  summary: string | null;
  decisions: unknown;
  topics: unknown;
  createdAt: Date;
  actionItems: PrismaActionItem[];
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function formatDue(date: Date | null): string {
  if (!date) return "No due date";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function toMeetingDetail(meeting: PrismaMeeting): MeetingDetail {
  return {
    id: meeting.id,
    title: meeting.title,
    date: meeting.createdAt.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: meeting.createdAt.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    duration: "—",
    language: "English",
    speakers: [],
    tags: [],
    tldr: meeting.summary || "No summary available for this meeting yet.",
    decisions: asStringArray(meeting.decisions).map((text, i) => ({
      id: `d${i}`,
      text,
      cite: "",
    })),
    actions: meeting.actionItems.map((a) => ({
      id: a.id,
      who: a.owner || "Unassigned",
      what: a.task,
      due: formatDue(a.dueDate),
      cite: "",
      done: a.done,
    })),
    unresolved: [],
    topics: asStringArray(meeting.topics),
    transcript: [
      {
        t: "00:00",
        who: "",
        role: "",
        text: meeting.transcript,
      },
    ],
    related: [],
  };
}
