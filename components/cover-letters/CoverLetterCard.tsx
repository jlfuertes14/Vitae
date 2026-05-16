import { Mail } from "lucide-react";

interface CoverLetterCardProps {
  coverLetter: {
    id: string;
    title: string;
    jobTitle?: string | null;
    company?: string | null;
    tone: string;
    updatedAt: string;
  };
}

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-white/20 hover:bg-white/[0.04]">
      <div>
        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10">
          <Mail className="size-5 text-white/60" />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight line-clamp-1">
          {coverLetter.title}
        </h3>
        <p className="mt-1 text-sm text-white/50 line-clamp-1">
          {coverLetter.company ? `${coverLetter.jobTitle} at ${coverLetter.company}` : "General Application"}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[10px] uppercase tracking-widest text-white/30">
          {coverLetter.tone}
        </span>
        <span className="text-xs text-white/40">{coverLetter.updatedAt}</span>
      </div>
    </div>
  );
}
