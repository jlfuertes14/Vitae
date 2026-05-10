import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ai/groq";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Require authentication
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeContent, jobDescription } = await req.json();

    if (!resumeContent) {
      return NextResponse.json({ error: "Resume content is required" }, { status: 400 });
    }

    const systemPrompt = `You are an elite Applicant Tracking System (ATS) scoring engine and expert recruiter. 
    Analyze the provided JSON resume against best practices and the provided job description (if any).
    
    You MUST respond with a valid JSON object matching this exact structure:
    {
      "overall": 85, // out of 100
      "atsCompatibility": 90,
      "keywordMatch": 75,
      "readability": 80,
      "formatting": 95,
      "recruiterFriendliness": 85,
      "suggestions": ["Add more quantifiable metrics to Experience.", "Include cloud technologies in skills."],
      "missingSkills": ["AWS", "Docker"]
    }
    
    Be brutally honest but constructive.`;

    const userPrompt = `JOB DESCRIPTION:
    ${jobDescription || "N/A - General Review"}
    
    RESUME JSON:
    ${JSON.stringify(resumeContent)}`;

    const result = await generateCompletion("scoring", systemPrompt, userPrompt, {
      temperature: 0.2,
      jsonMode: true,
    });

    const parsedResult = JSON.parse(result);

    return NextResponse.json({ result: parsedResult });
  } catch (error) {
    console.error("[AI_SCORE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to score resume" },
      { status: 500 }
    );
  }
}
