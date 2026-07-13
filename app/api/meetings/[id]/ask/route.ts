import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_ANALYZE_API_KEY!,
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const { question } = await req.json();

  const meeting = await prisma.meeting.findUnique({
    where: { id: question.meetingId },
    include: { actionItems: true },
  });

  if (!meeting || meeting.userId !== session.user.id) {
    return new Response(null, { status: 401 });
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 3000,
    messages: [
      {
        role: "system",
        content: `You are an assistant answering questions about a meeting. Use only the transcript below to answer. If the answer isn't in the transcript, say so.\n\nTranscript:\n${meeting.transcript}`,
      },
      {
        role: "user",
        content: question.question,
      },
    ],
  });

  const answer = completion.choices[0]?.message?.content ?? "";

  return Response.json({ answer });
}
