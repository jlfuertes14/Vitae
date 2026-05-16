import { notFound } from "next/navigation";

import { TemplateRenderer } from "@/components/editor/TemplateRenderer";
import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function ResumePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resume = user
    ? await (async () => {
        const appUser = await ensureAppUser(user);
        return prisma.resume.findFirst({
          where: {
            id,
            userId: appUser.id,
          },
          select: {
            templateId: true,
            content: true,
          },
        });
      })()
    : await prisma.resume.findUnique({
        where: { id },
        select: {
          templateId: true,
          content: true,
        },
      });

  if (!resume) {
    notFound();
  }
  
  return (
    <div className="bg-white min-h-screen">
      <TemplateRenderer
        zoom={1}
        templateId={resume.templateId}
        content={resume.content as any}
      />
    </div>
  );
}
