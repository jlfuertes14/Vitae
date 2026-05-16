import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Plus,
  Sparkles,
  TrendingUp,
  Mail,
} from "lucide-react";

import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const ACTIONS = [
  {
    title: "Build a resume",
    description:
      "Start a clean executive draft and shape it inside the live editor.",
    href: "/resumes",
  },
  {
    title: "Run job match",
    description:
      "Compare a target description against your current resume and spot gaps fast.",
    href: "/job-match",
  },
  {
    title: "Open AI assistant",
    description:
      "Generate sharper bullet points, reframe impact, and tune tone instantly.",
    href: "/ai-assistant",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let stats = [
    {
      label: "Resumes created",
      value: "00",
      hint: "Create your first saved resume to begin tracking.",
      icon: FileText,
    },
    {
      label: "AI sessions",
      value: "00",
      hint: "Rewrite, score, and chat activity appears here.",
      icon: Sparkles,
    },
    {
      label: "Cover letters",
      value: "00",
      hint: "Generated letter drafts will accumulate here.",
      icon: Mail,
    },
    {
      label: "Export cadence",
      value: "00",
      hint: "PDF deliveries this month.",
      icon: TrendingUp,
    },
  ];

  if (user) {
    const appUser = await ensureAppUser(user);

    const [resumeCount, aiSessionCount, coverLetterCount, exportCount] =
      await Promise.all([
        prisma.resume.count({
          where: { userId: appUser.id },
        }),
        prisma.aIUsageLog.count({
          where: { userId: appUser.id },
        }),
        prisma.coverLetter.count({
          where: { userId: appUser.id },
        }),
        prisma.export.count({
          where: {
            createdAt: { gte: startOfMonth },
            resume: {
              userId: appUser.id,
            },
          },
        }),
      ]);

    stats = [
      {
        label: "Resumes created",
        value: String(resumeCount).padStart(2, "0"),
        hint:
          resumeCount > 0
            ? "Saved resumes connected to your workspace."
            : "Create your first saved resume to begin tracking.",
        icon: FileText,
      },
      {
        label: "AI sessions",
        value: String(aiSessionCount).padStart(2, "0"),
        hint:
          aiSessionCount > 0
            ? "Tracked across rewrite, score, chat, and letter generation."
            : "Your next AI action will show up here.",
        icon: Sparkles,
      },
      {
        label: "Cover letters",
        value: String(coverLetterCount).padStart(2, "0"),
        hint:
          coverLetterCount > 0
            ? "Drafts generated and saved from the studio."
            : "Generate a cover letter to populate this metric.",
        icon: Mail,
      },
      {
        label: "Export cadence",
        value: String(exportCount).padStart(2, "0"),
        hint:
          exportCount > 0
            ? "PDF exports recorded this month."
            : "No PDF exports recorded this month yet.",
        icon: TrendingUp,
      },
    ];
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          <Sparkles className="size-3.5" />
          Control room
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Shape every application with the same sharp cinematic polish.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              This workspace now matches the homepage and auth experience:
              darker, glassier, and more deliberate. Use it to build resumes,
              test role fit, and keep every document aligned with your target.
            </p>
          </div>

          <Link
            href="/resumes"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Plus className="size-4" />
            Start new resume
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/45">{stat.label}</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-white">
                <stat.icon className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/45">{stat.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                Quick actions
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Move from draft to interview-ready faster
              </h3>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ACTIONS.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-medium text-white">
                    {action.title}
                  </h4>
                  <ArrowRight className="size-4 text-white/45 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
            Next move
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Suggested workflow
          </h3>

          <div className="mt-6 space-y-4">
            {[
              "Open your primary resume and tighten the summary.",
              "Run Job Match against a target posting.",
              "Use AI Assistant to rework weak bullet points.",
              "Export the final version for submission.",
            ].map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-[22px] border border-white/10 bg-black/20 p-4"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-white/60">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
