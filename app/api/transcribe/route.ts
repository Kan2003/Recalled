import { auth } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
    
    const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "json",
        language: "en",
        
    });

    return Response.json({transcript : transcription.text});
}