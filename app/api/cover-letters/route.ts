import { NextResponse } from "next/server";
import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUser = await ensureAppUser(user);
    const body = await request.json();

    const { title, content, jobTitle, company, tone } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId: appUser.id,
        title,
        content,
        jobTitle,
        company,
        tone: tone ? tone.toUpperCase() : "CORPORATE",
      },
    });

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("[COVER_LETTER_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to save cover letter" },
      { status: 500 }
    );
  }
}
