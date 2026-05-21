// components/landing/data.ts
// Mock data the hero demos cycle through. Replace with real meeting data once
// the dashboard is wired up — the shape mirrors what /api/analyze returns.

export type TranscriptLine = { speaker: string; role: string; text: string };
export type AskPair = { q: string; a: string };
export type ActionItem = { who: string; what: string; due: string };

export const TRANSCRIPT_LINES: TranscriptLine[] = [
  { speaker: "Maya", role: "PM", text: "Let's lock the launch date — I'm seeing March 14 in the deck." },
  { speaker: "Devon", role: "Eng", text: "We can hit it if QA wraps by the 10th. I'll own the cutover." },
  { speaker: "Priya", role: "Design", text: "Onboarding revisions are in review. Final by Friday." },
  { speaker: "Maya", role: "PM", text: "Good. Devon, can you send the launch checklist to the channel?" },
  { speaker: "Devon", role: "Eng", text: "Yep — by EOD today." },
  { speaker: "Priya", role: "Design", text: "I'll also share the updated empty-states with marketing." },
];

export const ASK_AI_PAIRS: AskPair[] = [
  {
    q: "What did we decide about the launch date?",
    a: "March 14. Devon is owning the cutover, contingent on QA wrapping by the 10th.",
  },
  {
    q: "Who owns what from this meeting?",
    a: "Devon → launch checklist (EOD today). Priya → final onboarding revisions (Friday) + empty-states to marketing.",
  },
  {
    q: "Any unresolved questions?",
    a: "Pricing tier for early-access wasn't confirmed. Maya flagged it for the next sync.",
  },
];

export const ACTION_ITEMS: ActionItem[] = [
  { who: "Devon", what: "Send launch checklist to #launch channel", due: "Today, EOD" },
  { who: "Priya", what: "Finalize onboarding revisions", due: "Friday" },
  { who: "Priya", what: "Share empty-states with marketing", due: "Friday" },
  { who: "Maya", what: "Confirm early-access pricing tier", due: "Next sync" },
];
