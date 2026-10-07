import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const meetings = await prisma.meeting.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { actionItems: true },
  });

  return Response.json(meetings);
}



export async function POST(req : Request) {

  const session = await auth();

  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const { title, transcript, summary, decisions, topics, actionItems } =
    await req.json();

  // Normalize action items coming from /api/analyze ({ task, owner, dueDate }).
  // dueDate is often free text ("Friday", "Next sync") — only keep it if it
  // parses to a real date, otherwise drop it.
  const items = Array.isArray(actionItems) ? actionItems : [];
  const parseDue = (v: unknown) => {
    if (typeof v !== "string" || !v.trim()) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const meeting = await prisma.meeting.create({
    data: {
      title: title?.trim() || "Untitled meeting",
      transcript,
      summary: summary ?? null,
      decisions: Array.isArray(decisions) ? decisions : undefined,
      topics: Array.isArray(topics) ? topics : undefined,
      userId: session.user.id,
      actionItems: {
        create: items
          .filter((a) => a && typeof a.task === "string" && a.task.trim())
          .map((a) => ({
            task: a.task,
            owner: a.owner ?? null,
            dueDate: parseDue(a.dueDate),
          })),
      },
    },
    include: { actionItems: true },
  });

  return Response.json(meeting);
}