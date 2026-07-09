// components/dashboard/data.ts
// Types + mappers from the `/api/meetings` Prisma shape to the UI shape.

export type Speaker = {
  initials: string;
  name?: string;
  color?: string;
};

export type Meeting = {
  id: string;
  title: string;
  when: string;
  duration: string;
  speakers: Speaker[];
  summary: string;
  tags: string[];
  actions: { total: number; open: number };
  decisions: number;
  live?: boolean;
};

export type ActionItem = {
  id: string;
  who: string;
  what: string;
  due: string;
  done: boolean;
};

export type Decision = {
  text: string;
  cite: string;
};

// ── Raw shape returned by GET /api/meetings and GET /api/meetings/:id ──────
export type RawActionItem = {
  id: string;
  task: string;
  owner: string | null;
  dueDate: string | null;
  done: boolean;
};

export type RawMeeting = {
  id: string;
  title: string;
  transcript: string;
  summary: string | null;
  decisions: unknown;
  topics: unknown;
  createdAt: string;
  actionItems: RawActionItem[];
};

function formatWhen(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (isSameDay(date, now)) {
    return `Today · ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString([], { month: "short", day: "2-digit" });
}

function formatDue(dueDate: string | null): string {
  if (!dueDate) return "No due date";
  return new Date(dueDate).toLocaleDateString([], { month: "short", day: "2-digit" });
}

export function toMeetingSummary(raw: RawMeeting): Meeting {
  const tags = Array.isArray(raw.topics) ? (raw.topics as string[]) : [];
  const decisions = Array.isArray(raw.decisions) ? (raw.decisions as string[]).length : 0;
  const open = raw.actionItems.filter((a) => !a.done).length;

  return {
    id: raw.id,
    title: raw.title,
    when: formatWhen(raw.createdAt),
    duration: "—",
    speakers: [],
    summary: raw.summary ?? "No summary yet.",
    tags,
    actions: { total: raw.actionItems.length, open },
    decisions,
    live: false,
  };
}

export function toActionItems(raw: RawMeeting): ActionItem[] {
  return raw.actionItems.map((a) => ({
    id: a.id,
    who: a.owner ?? "Unassigned",
    what: a.task,
    due: formatDue(a.dueDate),
    done: a.done,
  }));
}

export function toDecisions(raw: RawMeeting): Decision[] {
  const decisions = Array.isArray(raw.decisions) ? (raw.decisions as string[]) : [];
  return decisions.map((text) => ({ text, cite: "" }));
}

export const ASK_SUGGESTIONS = [
  "Recap in one sentence",
  "What was decided?",
  "Who owns what?",
  "Any unresolved questions?",
];
