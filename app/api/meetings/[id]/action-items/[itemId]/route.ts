// PATCH — toggle an action item's `done` state
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const { id, itemId } = await params;
  const { done } = await req.json();

  if (typeof done !== "boolean") {
    return Response.json({ error: "done must be a boolean" }, { status: 400 });
  }

  const meeting = await prisma.meeting.findUnique({ where: { id } });
  if (!meeting || meeting.userId !== session.user.id) {
    return new Response(null, { status: 404 });
  }

  const actionItem = await prisma.actionItem.findUnique({ where: { id: itemId } });
  if (!actionItem || actionItem.meetingId !== id) {
    return new Response(null, { status: 404 });
  }

  const updated = await prisma.actionItem.update({
    where: { id: itemId },
    data: { done },
  });

  return Response.json(updated);
}
