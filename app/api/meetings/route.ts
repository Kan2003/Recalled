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

  const { title, transcript, summary } = await req.json();

  const meeting = await prisma.meeting.create({
    data: {
      title,
      transcript,
      summary,
      userId: session.user.id,
    },
  });

  return Response.json(meeting);
}