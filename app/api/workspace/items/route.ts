import { NextResponse } from "next/server";
import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ items: [] });
    }

    const appUser = await ensureAppUser(user);

    const [resumes, coverLetters] = await Promise.all([
      prisma.resume.findMany({
        where: { userId: appUser.id },
        select: {
          id: true,
          title: true,
          templateId: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.coverLetter.findMany({
        where: { userId: appUser.id },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const items = [
      ...resumes.map((r) => ({
        id: `resume-${r.id}`,
        label: r.title || "Untitled Resume",
        href: `/resumes/${r.id}`,
        category: "Resume",
        description: `Last updated ${r.updatedAt.toLocaleDateString()}`,
        keywords: ["resume", "cv", r.title],
      })),
      ...coverLetters.map((cl) => ({
        id: `cover-letter-${cl.id}`,
        label: cl.title || "Untitled Cover Letter",
        href: `/cover-letters`, // or a specific ID if we have dynamic routing
        category: "Cover Letter",
        description: `Last updated ${cl.updatedAt.toLocaleDateString()}`,
        keywords: ["cover letter", "application", cl.title],
      })),
    ];

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[WORKSPACE_ITEMS_ERROR]", error);
    return NextResponse.json({ items: [] });
  }
}
