"use client";

import { useResumeStore } from "@/lib/store/resume-store";
import { HarvardClassic } from "@/components/templates/HarvardClassic";
import { ConsultingElite } from "@/components/templates/ConsultingElite";
import { InvestmentBanking } from "@/components/templates/InvestmentBanking";
import { ModernExecutive } from "@/components/templates/ModernExecutive";
import { TechProfessional } from "@/components/templates/TechProfessional";
import { LondonLuxury } from "@/components/templates/LondonLuxury";
import { Sydney } from "@/components/templates/Sydney";
import type { ResumeContent } from "@/lib/types";

interface TemplateRendererProps {
  templateId?: string;
  content?: ResumeContent;
  zoom?: number;
}

export function TemplateRenderer({
  templateId: propTemplateId,
  content: propContent,
  zoom = 1,
}: TemplateRendererProps) {
  const { content: storeContent, templateId: storeTemplateId } = useResumeStore();
  const templateId = propTemplateId || storeTemplateId;
  const content = propContent || storeContent;

  // Dynamic template selection based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case "consulting-elite":
        return <ConsultingElite content={content} />;
      case "investment-banking":
        return <InvestmentBanking content={content} />;
      case "modern-executive":
        return <ModernExecutive content={content} />;
      case "tech-professional":
        return <TechProfessional content={content} />;
      case "london-luxury":
        return <LondonLuxury content={content} />;
      case "sydney":
        return <Sydney content={content} />;
      case "harvard-classic":
      default:
        return <HarvardClassic content={content} />;
    }
  };

  const pagePadding = "15mm 12.7mm";

  return (
    <div 
      className="bg-white shadow-xl ring-1 ring-border/50 shrink-0 mx-auto transform-gpu origin-top transition-transform duration-200"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: pagePadding,
        transform: `scale(${zoom})`,
      }}
    >
      {renderTemplate()}
    </div>
  );
}
