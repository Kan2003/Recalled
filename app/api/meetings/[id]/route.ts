// GET single meeting
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
