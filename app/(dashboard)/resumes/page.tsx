import Link from "next/link";
import { ArrowRight, FileText, Plus } from "lucide-react";

export default function ResumesPage() {
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
              This screen is ready for your real resume list. For now it acts as
              a polished holding page so the dashboard navigation feels complete.
            </p>
          </div>

          <Link
            href="/resumes/demo"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Plus className="size-4" />
            Open sample editor
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {["Executive Resume", "Product Resume", "Consulting Resume"].map(
          (title, index) => (
            <Link
              key={title}
              href={`/resumes/sample-${index + 1}`}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <FileText className="size-5 text-white" />
                </div>
                <ArrowRight className="size-4 text-white/35" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Placeholder entry wired to the editor route until real resume
                data is connected.
              </p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
