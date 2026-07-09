// app/api/analyze/route.ts
import Groq from "groq-sdk";
import { auth } from "@/lib/auth";

const groq = new Groq({
  apiKey: process.env.GROQ_ANALYZE_API_KEY!,
});

export async function POST(req: Request) {
  const session = await auth()
  
  if(!session?.user?.id) {
    return new Response(null, { status: 401 })
  }

  const { transcript } = await req.json()

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `Analyze this meeting transcript and return ONLY a JSON object with no extra text:

{
  "summary": "2-3 sentence overview of the meeting",
  "decisions": ["decision 1", "decision 2"],
  "actionItems": [
    {
      "task": "what needs to be done",
      "owner": "person's name or null",
      "dueDate": "date string or null"
    }
  ],
  "topics": ["topic 1", "topic 2"]
}

Transcript:
${transcript}`,
      },
    ],
  })

  const raw = completion.choices[0]?.message?.content ?? "";

  try {
    const result = JSON.parse(raw.replace(/```json|```/g, "").trim())
    return Response.json(result)
  } catch {
    return Response.json({ error: "Failed to parse AI response" }, { status: 500 })
  }
}