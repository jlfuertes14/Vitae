import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCompletion } from "@/lib/ai/groq";
import { normalizeResumeContent } from "@/lib/import/normalize";
import { ALL_SECTION_TYPES, TEMPLATE_SECTION_CAPABILITIES } from "@/lib/constants";
import type { SectionType } from "@/lib/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const parsePdf = async (buffer: Buffer) => {
  const pdfParse = (await import("pdf-parse")).default as (data: Buffer) => Promise<{ text: string }>;
  const result = await pdfParse(buffer);
  return result.text || "";
};

const parseDocx = async (buffer: Buffer) => {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const templateId = (formData.get("templateId") as string | null) || undefined;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const extension = fileName.split(".").pop();

    if (!extension || !["pdf", "docx", "txt"].includes(extension)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (extension === "pdf") {
      extractedText = await parsePdf(buffer);
    } else if (extension === "docx") {
      extractedText = await parseDocx(buffer);
    } else {
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 400 }
      );
    }

    const allowedSections: SectionType[] =
      (templateId && TEMPLATE_SECTION_CAPABILITIES[templateId]) ||
      ALL_SECTION_TYPES;

    const systemPrompt = `You are an ATS resume conversion engine.
Convert the provided resume text into a clean JSON resume that fits this schema:
{
  "header": {
    "fullName": "string",
    "title": "string",
    "photoUrl": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string",
    "github": "string",
    "birthDate": "string",
    "birthPlace": "string",
    "maritalStatus": "string",
    "nationality": "string",
    "gender": "string"
  },
  "sections": [
    {
      "type": "summary | experience | education | skills | projects | leadership | awards | certifications | languages | hobbies | custom",
      "title": "string",
      "visible": true,
      "items": [
        {
          "content": {}
        }
      ]
    }
  ]
}
Use only these section types: ${allowedSections.join(", ")}.
Populate the section content using these conventions:
- summary: { text }
- experience: { position, company, location, startDate, endDate, bullets }
- education: { institution, degree, field, location, startDate, endDate, bullets }
- skills/languages: { category, skills: [{ name, level }] }
- projects/leadership: { name, description, url, location, startDate, endDate, bullets }
- awards/certifications/custom: { title, description }
- hobbies: { text }
Return JSON only.`;

    const userPrompt = `RESUME TEXT:\n${extractedText}`;

    const result = await generateCompletion("generation", systemPrompt, userPrompt, {
      temperature: 0.2,
      maxTokens: 1200,
      jsonMode: true,
    });

    let parsed: any = null;
    try {
      parsed = JSON.parse(result);
    } catch (error) {
      console.error("[IMPORT_PARSE_ERROR]", error);
    }

    if (!parsed) {
      return NextResponse.json(
        { error: "Failed to parse resume text" },
        { status: 500 }
      );
    }

    const resumeContent = normalizeResumeContent(parsed, {
      templateId,
      allowedSections,
    });

    return NextResponse.json({ resumeContent, templateId });
  } catch (error) {
    console.error("[IMPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}
