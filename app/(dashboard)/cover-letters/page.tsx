import { Mail, Target, Sparkles, FileText } from "lucide-react";
import { CoverLetterGenerator } from "@/components/cover-letters/CoverLetterGenerator";
import { CoverLetterCard } from "@/components/cover-letters/CoverLetterCard";
import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function CoverLettersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const appUser = user ? await ensureAppUser(user) : null;

  const coverLetters = appUser
    ? await prisma.coverLetter.findMany({
        where: { userId: appUser.id },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          jobTitle: true,
          company: true,
          tone: true,
          updatedAt: true,
        },
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header & Education */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
              <Mail className="size-3.5" />
              Cover Letter Studio
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Turn your experience into a <span className="vitae-gradient-text italic">Narrative</span>.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/60 md:text-lg">
              A cover letter isn't just a resume summary—it's your chance to tell the story of 
              <span className="text-white italic"> why </span> you are the perfect fit for this specific team.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                   <Target className="size-4 text-emerald-500" />
                </div>
                <div className="text-sm font-bold text-white uppercase tracking-tight">Personalization</div>
                <p className="text-xs text-white/40 leading-relaxed">Bridge the gap between your resume and the job description.</p>
             </div>
             <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                   <Sparkles className="size-4 text-blue-500" />
                </div>
                <div className="text-sm font-bold text-white uppercase tracking-tight">AI Drafting</div>
                <p className="text-xs text-white/40 leading-relaxed">Our AI matches your tone to the company culture instantly.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Cover Letter Library */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white tracking-tight">Your Saved Letters</h3>
        {coverLetters.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coverLetters.map((letter) => (
              <CoverLetterCard
                key={letter.id}
                coverLetter={{
                  id: letter.id,
                  title: letter.title,
                  jobTitle: letter.jobTitle,
                  company: letter.company,
                  tone: letter.tone,
                  updatedAt: letter.updatedAt.toLocaleDateString(),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <FileText className="size-6 text-white/60" />
            </div>
            <h4 className="mt-5 text-xl font-semibold text-white">
              No saved letters yet
            </h4>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
              Generate your first cover letter below and save it to your workspace.
            </p>
          </div>
        )}
      </div>

      <div className="h-px bg-white/10 w-full my-12" />

      {/* Generator Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-white tracking-tight">Generate New Letter</h3>
        <CoverLetterGenerator />
      </div>
    </div>
  );
}
