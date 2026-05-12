"use client";

import { TEMPLATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/lib/store/resume-store";

export default function TemplatesPage() {
  const router = useRouter();
  const { setTemplate } = useResumeStore();

  const handleSelectTemplate = (id: string) => {
    setTemplate(id);
    // In a real app, you might create a new resume here via API
    // and then navigate to that specific ID.
    // For now, we'll just go to the demo editor.
    router.push("/resumes/demo");
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          <Palette className="size-3.5" />
          Template gallery
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Elite designs for every stage of your career.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              Replicated from high-performance standards like Resume.io and Harvard career services.
              Each template is ATS-optimized and designed for maximum readability.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id}
            className="group relative flex flex-col rounded-[28px] border border-white/10 bg-white/[0.04] overflow-hidden transition-all hover:border-white/20 hover:bg-white/[0.06]"
          >
            {/* Preview Image */}
            <div className="aspect-[3/4] w-full bg-neutral-900 overflow-hidden relative group-hover:after:content-[''] group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-black/20 transition-all">
               <img 
                 src={template.previewUrl} 
                 alt={template.name}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-[10pt] uppercase tracking-widest text-white/30 font-medium">
                  {template.category}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="size-3" />
                  <span className="text-[10px] font-bold uppercase">ATS Friendly</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                {template.description}
              </p>
              
              <Button 
                onClick={() => handleSelectTemplate(template.id)}
                className="w-full rounded-2xl bg-white text-black hover:bg-white/90"
              >
                Use this template
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
