import { FileText, Plus } from "lucide-react";

import { CreateResumeButton } from "@/components/resumes/CreateResumeButton";
import { ResumeLibraryCard } from "@/components/resumes/ResumeLibraryCard";
import { ensureAppUser } from "@/lib/app-user";
import { TEMPLATES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const getTemplateName = (templateId: string) =>
  TEMPLATES.find((template) => template.id === templateId)?.name || "Resume";

export default async function ResumesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const appUser = user ? await ensureAppUser(user) : null;

  const resumes = appUser
    ? await prisma.resume.findMany({
        where: { userId: appUser.id },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          templateId: true,
          updatedAt: true,
          createdAt: true,
          content: true,
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
              Resume library
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Keep every version organized and ready to tailor.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              Open a saved draft, keep iterating in the editor, and pick up exactly
              where you left off.
            </p>
          </div>

          <CreateResumeButton className="inline-flex h-auto items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90">
            <Plus className="size-4" />
            New resume
          </CreateResumeButton>
        </div>
      </section>

      {resumes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume: any) => {
            const header = (resume.content as any)?.header;
            const fullName =
              typeof header?.fullName === "string" ? header.fullName.trim() : "";

            return (
              <ResumeLibraryCard
                key={resume.id}
                resume={{
                  id: resume.id,
                  title: resume.title,
                  templateName: getTemplateName(resume.templateId),
                  fullName,
                  updatedAt: resume.updatedAt.toLocaleDateString(),
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <FileText className="size-6 text-white/60" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold text-white">
            No saved resumes yet
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
            Create your first draft from a template, then it will appear here
            automatically as you edit and save it.
          </p>
          <div className="mt-6 flex justify-center">
            <CreateResumeButton className="inline-flex h-auto items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90">
              <Plus className="size-4" />
              Create first resume
            </CreateResumeButton>
          </div>
        </div>
      )}
    </div>
  );
}
