import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ai/groq";
import { createClient } from "@/lib/supabase/server";

const MAX_MESSAGES = 8;
const MAX_RESUME_CHARS = 8000;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, resumeContent, templateId, allowedSections } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const recentMessages = messages
      .slice(-MAX_MESSAGES)
      .map((message) => ({
        role: message?.role === "assistant" ? "assistant" : "user",
        content: String(message?.content || "").trim(),
      }))
      .filter((message) => message.content.length > 0);

    if (recentMessages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const conversation = recentMessages
      .map((message) =>
        message.role === "assistant"
          ? `Assistant: ${message.content}`
          : `User: ${message.content}`
      )
      .join("\n");

    const resumeJson = resumeContent
      ? JSON.stringify(resumeContent).slice(0, MAX_RESUME_CHARS)
      : "Not provided";

    const allowedSectionList = Array.isArray(allowedSections)
      ? allowedSections.filter((section) => typeof section === "string")
      : [];

    const systemPrompt = `You are Vitae AI, an elite resume coach and career strategist.
Provide concise, actionable guidance grounded in the user's resume data when available.
If you need more detail, ask one direct clarifying question.
Avoid filler, avoid hallucinations, and keep responses under 6 sentences.

Return ONLY a JSON object with this shape:
{
  "reply": "string",
  "resumePatches": [
    {
      "type": "summary" | "experience" | "education" | "skills" | "projects" | "leadership" | "awards" | "certifications" | "languages" | "hobbies" | "custom",
      "item": {
        // summary
        "text": "string",
        // experience
        "position": "string",
        "company": "string",
        "location": "string",
        "startDate": "string",
        "endDate": "string",
        "bullets": ["string"],
        "description": "string",
        // education
        "institution": "string",
        "degree": "string",
        "field": "string",
        // projects / leadership
        "name": "string",
        "url": "string",
        // skills / languages
        "category": "string",
        "skills": [
          { "name": "string", "level": "string" }
        ],
        // awards / certifications / custom
        "title": "string",
        "description": "string",
        // hobbies
        "text": "string"
      }
    }
  ]
}

Only set resumePatches when the user explicitly asks to add or update resume items.
If multiple sections are requested, return multiple patches.
Use empty strings for unknown fields. Keep bullets concise.
${
  allowedSectionList.length
    ? `Only use these section types: ${allowedSectionList.join(", ")}.`
    : ""
}`;

    const userPrompt = `CONVERSATION:\n${conversation}\n\nRESUME JSON:\n${resumeJson}\n\nReply to the most recent user message.`;

    const result = await generateCompletion("chat", systemPrompt, userPrompt, {
      temperature: 0.4,
      maxTokens: 500,
      jsonMode: true,
    });

    try {
      const parsed = JSON.parse(result);
      if (typeof parsed?.reply === "string") {
        const resumePatches = Array.isArray(parsed?.resumePatches)
          ? parsed.resumePatches
          : parsed?.resumePatch
          ? [parsed.resumePatch]
          : [];

        const filteredPatches = allowedSectionList.length
          ? resumePatches.filter((patch) => allowedSectionList.includes(patch?.type))
          : resumePatches;

        return NextResponse.json({
          reply: parsed.reply,
          resumePatches: filteredPatches,
        });
      }
    } catch (parseError) {
      console.warn("[AI_CHAT_PARSE_ERROR]", parseError);
    }

    return NextResponse.json({ result: result.trim() });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
