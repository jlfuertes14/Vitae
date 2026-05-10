"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ResumeContent } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveResumeContent(resumeId: string, content: ResumeContent) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // In a real app we'd verify the user owns the resume first.
    // Assuming resumeId is "new" for now as a mock, or we update an existing one.
    // For this boilerplate, we'll just upsert by ID or create a dummy one if it's 'new'
    
    // We'll just return success for the mock UI to show the "Saved" state properly.
    // In actual implementation:
    /*
    await prisma.resume.update({
      where: { id: resumeId, userId: user.id },
      data: { content: content as any },
    });
    */
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    revalidatePath(`/resumes/${resumeId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save resume:", error);
    return { success: false, error: "Failed to save resume" };
  }
}
