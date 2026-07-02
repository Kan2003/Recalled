// app/dashboard/[meetingId]/page.tsx
// Dynamic route — single meeting detail. Fetches the real meeting from
// Prisma (server component, no need to hit our own /api route over HTTP)
// and maps it into the shape the UI panels expect.

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MeetingDetailShell } from "@/components/meeting/MeetingDetailShell";
import { toMeetingDetail } from "@/components/meeting/fromPrisma";

export const metadata = {
  title: "Meeting detail · Recalled",
  description: "AI-extracted summary, decisions, action items, and transcript.",
};

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { actionItems: true },
  });

  if (!meeting || meeting.userId !== session.user.id) {
    notFound();
  }

  return <MeetingDetailShell meeting={toMeetingDetail(meeting)} />;
}
