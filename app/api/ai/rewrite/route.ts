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

    const { text, context, tone } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const systemPrompt = `You are an elite executive resume writer. Your goal is to rewrite the user's resume bullet point to make it highly impactful, action-oriented, and optimized for ATS systems.
    
    TONE: ${tone || "Professional and authoritative"}
    CONTEXT ABOUT THE USER/JOB: ${context || "None provided"}
    
    RULES:
    1. Start with a strong action verb.
    2. Focus on quantifiable achievements (metrics, percentages, dollars) if implied or possible.
    3. Keep it concise (1-2 lines maximum).
    4. Do not lie or invent fake metrics, but do frame their experience in the most impressive possible light.
    5. Return ONLY the rewritten bullet point text. No conversational filler. No quotes.`;

    const result = await generateCompletion("rewrite", systemPrompt, text, {
      temperature: 0.7,
      maxTokens: 150,
    });

    return NextResponse.json({ result: result.trim() });
  } catch (error) {
    console.error("[AI_REWRITE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to rewrite text" },
      { status: 500 }
    );
  }
}
