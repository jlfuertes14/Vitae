import { notFound } from "next/navigation";

import { EditorLayout } from "@/components/editor/EditorLayout";
import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const appUser = await ensureAppUser(user);
  const resume = await prisma.resume.findFirst({
    where: {
      id,
      userId: appUser.id,
    },
    select: {
      title: true,
      templateId: true,
      content: true,
      updatedAt: true,
    },
  });

  if (!resume) {
    notFound();
  }

  return (
    <EditorLayout
      resumeId={id}
      initialResume={{
        title: resume.title,
        templateId: resume.templateId,
        content: resume.content as any,
        lastSavedAt: resume.updatedAt.toISOString(),
      }}
    />
  );
}
