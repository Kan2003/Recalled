// components/meeting/data.ts
// Types + mock data for the single-meeting detail page. Mirrors what
// /api/meetings/:id should return — swap the MEETING export for a fetch.

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

// ── Mock data ────────────────────────────────────────────────────────────
export const MEETING: MeetingDetail = {
  id: "mtg_2403",
  title: "Q1 launch sync",
  date: "March 14, 2026",
  time: "14:32",
  duration: "42:18",
  language: "English",
  speakers: [
    { initials: "MK", name: "Maya",   role: "PM",     color: "#a78bfa", share: 32 },
    { initials: "DC", name: "Devon",  role: "Eng",    color: "#22d3ee", share: 28 },
    { initials: "PR", name: "Priya",  role: "Design", color: "#f0abfc", share: 24 },
    { initials: "JL", name: "Jordan", role: "QA",     color: "#34d399", share: 16 },
  ],
  tags: ["launch", "q1", "cutover"],
  tldr:
    "Launch locked to March 14, contingent on QA wrapping by the 10th. Devon owns the cutover; Priya is finalizing onboarding revisions and empty-states. Early-access pricing tier still needs Maya's sign-off — flagged for next sync.",
  decisions: [
    { id: "d1", text: "Launch date locked to March 14",           cite: "00:00" },
    { id: "d2", text: "QA cutoff is March 10",                    cite: "00:14" },
    { id: "d3", text: "Devon owns the cutover",                   cite: "00:32" },
    { id: "d4", text: "Onboarding empty-states finalized by Fri", cite: "01:18" },
  ],
  actions: [
    { id: "a1", who: "Devon", what: "Send launch checklist to #launch channel", due: "Today, EOD", cite: "01:02", done: false },
    { id: "a2", who: "Priya", what: "Finalize onboarding revisions",            due: "Friday",     cite: "00:38", done: false },
    { id: "a3", who: "Priya", what: "Share empty-states with marketing",        due: "Friday",     cite: "01:18", done: false },
    { id: "a4", who: "Maya",  what: "Confirm early-access pricing tier",        due: "Next sync",  cite: "02:14", done: false },
    { id: "a5", who: "Devon", what: "Tag QA leads in cutover thread",           due: "Tomorrow",   cite: "00:32", done: true  },
  ],
  unresolved: [
    "Early-access pricing tier not confirmed",
    "Slack channel for QA escalations",
  ],
  topics: ["launch", "qa", "onboarding", "cutover", "pricing", "empty-states"],
  transcript: [
    { t: "00:00", who: "Maya",   role: "PM",     text: "Let's lock the launch date — I'm seeing March 14 in the deck. Does that still work for everyone?" },
    { t: "00:14", who: "Devon",  role: "Eng",    text: "We can hit it if QA wraps by the 10th. I'll own the cutover. The main risk is the data migration window — we'll need a 30-minute write freeze." },
    { t: "00:32", who: "Devon",  role: "Eng",    text: "I'll tag the QA leads in the cutover thread today so we're aligned on the gate." },
    { t: "00:38", who: "Priya",  role: "Design", text: "Onboarding revisions are in review. I'll have them final by Friday. The skip-button placement still needs one more round, but the core flow is locked." },
    { t: "01:02", who: "Maya",   role: "PM",     text: "Good. Devon, can you send the launch checklist to the channel so everyone's on the same page?" },
    { t: "01:08", who: "Devon",  role: "Eng",    text: "Yep — by EOD today." },
    { t: "01:18", who: "Priya",  role: "Design", text: "I'll also share the updated empty-states with marketing so they can build collateral around the launch. Also Friday." },
    { t: "01:42", who: "Jordan", role: "QA",     text: "On the QA side, we're tracking three open bugs from last week. All P2, none of them block launch. I'll send the daily report tomorrow." },
    { t: "02:14", who: "Maya",   role: "PM",     text: "One open question — early-access pricing tier. We haven't confirmed whether we're going $19 or $29. I'll bring it back to the next sync." },
    { t: "02:36", who: "Devon",  role: "Eng",    text: "Sounds good. Anything else blocking?" },
    { t: "02:42", who: "Maya",   role: "PM",     text: "Nope. We're good. Let's reconvene Monday." },
  ],
  related: [
    { id: "mtg_2390", title: "Onboarding teardown", when: "Today · 09:15", overlap: 2 },
    { id: "mtg_2380", title: "Eng all-hands",       when: "Mar 11",         overlap: 1 },
    { id: "mtg_2375", title: "Design crit",         when: "Mar 10",         overlap: 1 },
  ],
};

export const CHAPTERS: { t: string; label: string }[] = [
  { t: "00:00", label: "Launch date discussion" },
  { t: "00:32", label: "QA cutover planning" },
  { t: "01:02", label: "Action item handoff" },
  { t: "01:42", label: "Open bugs review" },
  { t: "02:14", label: "Open: pricing tier" },
];

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
