import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCompletion } from "@/lib/ai/groq";
import { normalizeResumeContent } from "@/lib/import/normalize";
import { ALL_SECTION_TYPES, TEMPLATE_SECTION_CAPABILITIES } from "@/lib/constants";
import { createNotification } from "@/lib/notifications";
import type { SectionType } from "@/lib/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const parsePdf = async (buffer: Buffer) => {
  try {
    const pdf = await import("pdf-parse");
    // Handle both default and named export
    const pdfParse = pdf.default || pdf;
    const result = await pdfParse(buffer);
    return result.text || "";
  } catch (error) {
    console.error("[PDF_PARSE_ERROR]", error);
    throw new Error("Failed to parse PDF file. It might be password protected or corrupted.");
  }
};

const parseDocx = async (buffer: Buffer) => {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("[DOCX_PARSE_ERROR]", error);
    throw new Error("Failed to parse Word document.");
  }
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
    
    // Increase maxTokens to 4000 to handle long resumes and detailed bullet points
    const result = await generateCompletion("generation", systemPrompt, userPrompt, {
      temperature: 0.1, // Lower temperature for more stable JSON
      maxTokens: 4000,
      jsonMode: true,
    });

    let parsed: any = null;
    try {
      // Clean up the result in case the model included markdown blocks or trailing text
      let cleanedResult = result.trim();
      
      // Remove any markdown code block wrappers
      cleanedResult = cleanedResult.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      
      // Basic JSON Parse
      let tempParsed = JSON.parse(cleanedResult);

      // Handle AI "Helpfulness" Wrappers: 
      // Sometimes models return { "type": "json_object", "content": { ... } } 
      // or just { "content": { ... } }
      if (tempParsed.content && typeof tempParsed.content === "object" && !tempParsed.sections) {
        parsed = tempParsed.content;
      } else if (tempParsed.resume && typeof tempParsed.resume === "object") {
        parsed = tempParsed.resume;
      } else {
        parsed = tempParsed;
      }

    } catch (error) {
      console.error("[IMPORT_PARSE_ERROR] Raw AI response preview:", result.substring(0, 1000) + "...");
      
      // Fallback: If JSON.parse fails, try to extract the first { ... } block manually
      try {
        const match = result.match(/\{[\s\S]*\}/);
        if (match) {
          const extracted = match[0];
          const tempParsed = JSON.parse(extracted);
          if (tempParsed.content && typeof tempParsed.content === "object" && !tempParsed.sections) {
            parsed = tempParsed.content;
          } else {
            parsed = tempParsed;
          }
        }
      } catch (innerError) {
        console.error("[IMPORT_PARSE_FALLBACK_ERROR]", innerError);
      }
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

    await createNotification({
      supabaseId: user.id,
      type: "RESUME_IMPORT",
      title: "Resume import complete",
      body: `Imported ${file.name}.`,
      link: "/import",
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
