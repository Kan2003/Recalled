import { auth } from "@/lib/auth";
import OpenAI from "openai";

// Groq exposes an OpenAI-compatible API, so we reuse the OpenAI SDK and just
// point it at Groq's endpoint for Whisper speech-to-text.
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function  POST(req:Request) {

    const session = await auth();

    if (!session?.user?.id) {
        return new Response(null, { status: 401 });
    }

    //get audio file from request
    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if(!file) {
        return Response.json({error : "No audio file provided"}, { status: 400 });
    }
    
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: "whisper-large-v3-turbo",
            response_format: "json",
            language: "en",
        });

        return Response.json({ transcript: transcription.text });
    } catch (err) {
        console.error("[/api/transcribe] transcription failed:", err);
        const message = err instanceof Error ? err.message : "Transcription failed";
        return Response.json({ error: message }, { status: 500 });
    }
}