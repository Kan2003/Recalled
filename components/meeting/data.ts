// components/meeting/data.ts
// Types for the single-meeting detail page. Real data comes from Prisma via
// components/meeting/fromPrisma.ts — see app/dashboard/[meetingId]/page.tsx.

export type MeetingSpeaker = {
  initials: string;
  name: string;
  role: string;
  color: string;
  share: number; // % of speaking time
};

export type MeetingDecision = {
  id: string;
  text: string;
  cite: string; // transcript timestamp
};

export type MeetingAction = {
  id: string;
  who: string;
  what: string;
  due: string;
  cite: string;
  done: boolean;
};

export type TranscriptTurn = {
  t: string;
  who: string;
  role: string;
  text: string;
};

export type RelatedMeeting = {
  id: string;
  title: string;
  when: string;
  overlap: number;
};

export type MeetingDetail = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  language: string;
  speakers: MeetingSpeaker[];
  tags: string[];
  tldr: string;
  decisions: MeetingDecision[];
  actions: MeetingAction[];
  unresolved: string[];
  topics: string[];
  transcript: TranscriptTurn[];
  related: RelatedMeeting[];
};

export type AskMessage = {
  role: "user" | "ai";
  text: string;
  cites?: string[];
};

export const ASK_HISTORY_INITIAL: AskMessage[] = [
  { role: "user", text: "What did we decide about the launch date?" },
  {
    role: "ai",
    text: "March 14. Devon is owning the cutover, contingent on QA wrapping by the 10th.",
    cites: ["00:00", "00:14"],
  },
];

export const ASK_SUGGESTIONS = [
  "Recap in one sentence",
  "Who owns what?",
  "Any unresolved questions?",
  "What's the biggest risk?",
];

// Sample answers for the demo Ask AI submit. Real impl: stream from /api/meetings/:id/ask.
export const ASK_SAMPLE_ANSWERS: AskMessage[] = [
  {
    role: "ai",
    text: "Devon is on the launch checklist (today EOD). Priya is doing onboarding revisions and empty-states by Friday. Maya still owes a decision on the pricing tier.",
    cites: ["01:02", "01:18", "02:14"],
  },
  {
    role: "ai",
    text: "The only open item is the early-access pricing tier — Maya flagged it for the next sync. Everything else is decided.",
    cites: ["02:14"],
  },
  {
    role: "ai",
    text: "The QA cutoff. If QA doesn't wrap by March 10, the launch slips. Devon is owning the cutover, but they need three open bugs closed first.",
    cites: ["00:14", "01:42"],
  },
];
