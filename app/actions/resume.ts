"use server";

import { revalidatePath } from "next/cache";

import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createInitialResumeContent, getResumeTitle } from "@/lib/resume-data";
import { createClient } from "@/lib/supabase/server";
import { ensureTemplateRecord } from "@/lib/template-records";
import type { ResumeContent } from "@/lib/types";

const DEFAULT_TEMPLATE_ID = "harvard-classic";

const getAuthorizedAppUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return ensureAppUser(user);
};

export async function createResumeDraft(input?: {
  templateId?: string;
  content?: ResumeContent;
  title?: string;
}) {
  const appUser = await getAuthorizedAppUser();

  if (!appUser) {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const templateId = input?.templateId || DEFAULT_TEMPLATE_ID;
    const content = input?.content || createInitialResumeContent();
    const title = input?.title?.trim() || getResumeTitle(content);

    await ensureTemplateRecord(templateId);

    const resume = await prisma.resume.create({
      data: {
        userId: appUser.id,
        title,
        templateId,
        content: content as any,
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/resumes");

    return { success: true as const, resumeId: resume.id };
  } catch (error) {
    console.error("[CREATE_RESUME_DRAFT_ERROR]", error);
    return { success: false as const, error: "Failed to create resume" };
  }
}

export async function saveResumeContent(
  resumeId: string,
  content: ResumeContent,
  templateId: string,
  title: string
) {
  const appUser = await getAuthorizedAppUser();

  if (!appUser) {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    await ensureTemplateRecord(templateId);

    const updateResult = await prisma.resume.updateMany({
      where: { 
        id: resumeId,
        userId: appUser.id 
      },
      data: {
        title: title.trim() || getResumeTitle(content),
        templateId,
        content: content as any,
      },
    });

    if (updateResult.count === 0) {
      return { success: false as const, error: "Resume not found or not authorized" };
    }

    revalidatePath("/resumes");
    revalidatePath(`/resumes/${resumeId}`);
    revalidatePath(`/resumes/${resumeId}/print`);

    return { success: true as const };
  } catch (error) {
    console.error("[SAVE_RESUME_CONTENT_ERROR]", error);
    return { success: false as const, error: "Failed to save resume" };
  }
}

export async function updateResumeTitle(resumeId: string, title: string) {
  const appUser = await getAuthorizedAppUser();

  if (!appUser) {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return { success: false as const, error: "Title is required" };
    }

    const updateResult = await prisma.resume.updateMany({
      where: { 
        id: resumeId,
        userId: appUser.id 
      },
      data: { title: normalizedTitle },
    });

    if (updateResult.count === 0) {
      return { success: false as const, error: "Resume not found or not authorized" };
    }

    revalidatePath("/resumes");
    revalidatePath(`/resumes/${resumeId}`);

    return { success: true as const, title: normalizedTitle };
  } catch (error) {
    console.error("[UPDATE_RESUME_TITLE_ERROR]", error);
    return { success: false as const, error: "Failed to update resume title" };
  }
}
