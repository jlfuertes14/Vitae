import Link from "next/link";
import { ArrowRight, Construction, Sparkles } from "lucide-react";

interface DashboardPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export function DashboardPlaceholder({
  eyebrow,
  title,
  description,
  primaryHref = "/dashboard",
  primaryLabel = "Back to dashboard",
}: DashboardPlaceholderProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          <Construction className="size-3.5" />
          {eyebrow}
        </div>

        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            {primaryLabel}
            <ArrowRight className="size-4" />
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/50">
            <Sparkles className="size-4" />
            Content will land here as features are built.
          </div>
        </div>
      </div>
    </div>
  );
}
