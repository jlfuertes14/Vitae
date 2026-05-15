import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ai/groq";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeContent, jobDescription, format, tone } = await req.json();

    if (!jobDescription || !resumeContent) {
      return NextResponse.json(
        { error: "Resume content and job description are required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite cover letter writer.
Write a ${format === "email" ? "direct email" : "formal cover letter"} in a ${tone || "professional"} tone.
Use the resume data to personalize the letter and match the job description.
Keep it concise, ATS-friendly, and focused on impact. Avoid fluff.`;

    const userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME JSON:\n${JSON.stringify(resumeContent)}\n\nOutput only the final letter.`;

    const result = await generateCompletion("generation", systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 800,
    });

    return NextResponse.json({ result: result.trim() });
  } catch (error) {
    console.error("[COVER_LETTER_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
