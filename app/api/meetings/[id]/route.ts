// GET single meeting · DELETE a meeting and its action items
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const { id } = await params;

  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { actionItems: true },
  });

  if (!meeting || meeting.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  return Response.json(meeting);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const { id } = await params;

  const meeting = await prisma.meeting.findUnique({ where: { id } });
  if (!meeting || meeting.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  // ActionItem → Meeting has no ON DELETE CASCADE, so the items have to go
  // first. One transaction so a failure can't leave a half-deleted meeting.
  await prisma.$transaction([
    prisma.actionItem.deleteMany({ where: { meetingId: id } }),
    prisma.meeting.deleteMany({ where: { id, userId: session.user.id } }),
  ]);

  return new Response(null, { status: 204 });
}
