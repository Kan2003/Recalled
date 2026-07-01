// components/dashboard/data.ts
// Types + mock data. Mirrors the Prisma Meeting / ActionItem models in the
// README, so swapping in `/api/meetings` data later is mostly a fetch swap.

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
  who: string;
  what: string;
  due: string;
  done: boolean;
};

export type Decision = {
  text: string;
  cite: string;
};

// ── Mock meetings ─────────────────────────────────────────────────────────
export const MEETINGS: Meeting[] = [
  {
    id: "mtg_2403",
    title: "Q1 launch sync",
    when: "Now",
    duration: "14:32",
    speakers: [
      { initials: "MK", name: "Maya · PM",      color: "#a78bfa" },
      { initials: "DC", name: "Devon · Eng",    color: "#22d3ee" },
      { initials: "PR", name: "Priya · Design", color: "#f0abfc" },
      { initials: "JL", name: "Jordan · QA",    color: "#34d399" },
    ],
    summary:
      "Launch locked to March 14, contingent on QA wrapping by the 10th. Devon owns the cutover; Priya is finalizing onboarding revisions and empty-states.",
    tags: ["launch", "q1"],
    actions: { total: 4, open: 3 },
    decisions: 3,
    live: true,
  },
  {
    id: "mtg_2390",
    title: "Onboarding teardown",
    when: "Today · 09:15",
    duration: "38:42",
    speakers: [
      { initials: "PR", name: "Priya", color: "#f0abfc" },
      { initials: "KS", name: "Kan",   color: "#22d3ee" },
      { initials: "AL", name: "Alex",  color: "#a78bfa" },
    ],
    summary:
      "Reduced first-run steps from 7 to 3. Priya to ship empty-states by Friday. Skip-button placement still TBD.",
    tags: ["onboarding", "design"],
    actions: { total: 5, open: 1 },
    decisions: 2,
  },
  {
    id: "mtg_2387",
    title: "Hiring panel · Dana K.",
    when: "Yesterday",
    duration: "45:10",
    speakers: [
      { initials: "KS", name: "Kan",    color: "#22d3ee" },
      { initials: "DK", name: "Dana",   color: "#fbbf24" },
      { initials: "MK", name: "Maya",   color: "#a78bfa" },
      { initials: "JL", name: "Jordan", color: "#34d399" },
      { initials: "DC", name: "Devon",  color: "#60a5fa" },
    ],
    summary:
      "Strong on systems thinking and trade-off reasoning. Needs a follow-up on infra depth. Recommended: bring back for system-design loop.",
    tags: ["hiring"],
    actions: { total: 2, open: 0 },
    decisions: 1,
  },
  {
    id: "mtg_2385",
    title: "Customer call · Acme Co.",
    when: "Yesterday",
    duration: "28:50",
    speakers: [
      { initials: "KS", name: "Kan",  color: "#22d3ee" },
      { initials: "AC", name: "Acme", color: "#f0abfc" },
    ],
    summary:
      "Renewal looks good. Asked for SOC2 docs and a roadmap walkthrough next week. No blockers.",
    tags: ["customer", "renewal"],
    actions: { total: 4, open: 3 },
    decisions: 2,
  },
  {
    id: "mtg_2380",
    title: "Eng all-hands",
    when: "Mar 11",
    duration: "1:02:18",
    speakers: Array.from({ length: 12 }, (_, i) => ({
      initials: ["MK","DC","PR","JL","KS","AL","RS","NK","TY","BV","MJ","OP"][i],
      color: "#a78bfa",
    })),
    summary:
      "Q1 roadmap walkthrough. Postgres → Neon migration on track for week 2. Cron rate-limit changes coming next sprint.",
    tags: ["eng", "roadmap"],
    actions: { total: 1, open: 1 },
    decisions: 4,
  },
  {
    id: "mtg_2375",
    title: "Design crit",
    when: "Mar 10",
    duration: "52:04",
    speakers: [
      { initials: "PR", name: "Priya", color: "#f0abfc" },
      { initials: "KS", name: "Kan",   color: "#22d3ee" },
      { initials: "AL", name: "Alex",  color: "#a78bfa" },
      { initials: "RS", name: "Riley", color: "#fbbf24" },
    ],
    summary:
      "Settled on new typography system: Geist + Geist Mono with Instrument Serif for editorial moments. Tokens to be merged this week.",
    tags: ["design", "tokens"],
    actions: { total: 6, open: 0 },
    decisions: 3,
  },
  {
    id: "mtg_2370",
    title: "Customer call · Globex",
    when: "Mar 09",
    duration: "36:11",
    speakers: [
      { initials: "KS", name: "Kan",    color: "#22d3ee" },
      { initials: "GL", name: "Globex", color: "#34d399" },
    ],
    summary:
      "New feature request: outbound API webhook for action items. Triaged for Q2. No urgent renewal risk.",
    tags: ["customer", "feedback"],
    actions: { total: 2, open: 2 },
    decisions: 1,
  },
];

export const ACTION_ITEMS: ActionItem[] = [
  { who: "Devon", what: "Send launch checklist to #launch channel", due: "Today, EOD", done: false },
  { who: "Priya", what: "Finalize onboarding revisions",            due: "Friday",      done: false },
  { who: "Priya", what: "Share empty-states with marketing",        due: "Friday",      done: false },
  { who: "Maya",  what: "Confirm early-access pricing tier",        due: "Next sync",   done: false },
];

export const DECISIONS: Decision[] = [
  { text: "Launch date locked to March 14", cite: "00:00" },
  { text: "QA cutoff is March 10",          cite: "00:14" },
  { text: "Devon owns the cutover",         cite: "00:32" },
];

export const ASK_SUGGESTIONS = [
  "Recap in one sentence",
  "What was decided?",
  "Who owns what?",
  "Any unresolved questions?",
];
