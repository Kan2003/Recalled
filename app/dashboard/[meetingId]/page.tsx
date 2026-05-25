// app/dashboard/[meetingId]/page.tsx
// Dynamic route — single meeting detail.
//
// `params.meetingId` is the URL segment (e.g. "mtg_2403"). Right now we render
// the same mock meeting regardless; when you wire the API, fetch the meeting
// here and pass it into the shell as a prop.
//
//   export default async function Page({ params }: { params: { meetingId: string } }) {
//     const meeting = await fetch(`${process.env.API_URL}/api/meetings/${params.meetingId}`).then(r => r.json());
//     return <MeetingDetailShell meeting={meeting} />;
//   }

import { MeetingDetailShell } from "@/components/meeting/MeetingDetailShell";

export const metadata = {
  title: "Q1 launch sync · Recalled",
  description: "AI-extracted summary, decisions, action items, and transcript.",
};

export default function MeetingDetailPage({
  params,
}: {
  params: { meetingId: string };
}) {
  // params.meetingId is available here for the fetch call (see comment above).
  void params;
  return <MeetingDetailShell />;
}
