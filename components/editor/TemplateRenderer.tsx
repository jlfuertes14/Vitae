"use client";

import { useResumeStore } from "@/lib/store/resume-store";
import { HarvardClassic } from "@/components/templates/HarvardClassic";
import { ConsultingElite } from "@/components/templates/ConsultingElite";
import { InvestmentBanking } from "@/components/templates/InvestmentBanking";
import { ModernExecutive } from "@/components/templates/ModernExecutive";
import { TechProfessional } from "@/components/templates/TechProfessional";
import { LondonLuxury } from "@/components/templates/LondonLuxury";

interface TemplateRendererProps {
  templateId?: string;
  zoom?: number;
}

export function TemplateRenderer({ templateId: propTemplateId, zoom = 1 }: TemplateRendererProps) {
  const { content, templateId: storeTemplateId } = useResumeStore();
  const templateId = propTemplateId || storeTemplateId;

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
      case "harvard-classic":
      default:
        return <HarvardClassic content={content} />;
    }
  };

  return (
    <div 
      className="bg-white shadow-xl ring-1 ring-border/50 shrink-0 mx-auto transform-gpu origin-top transition-transform duration-200"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm", // Balanced margins for high-density templates
        transform: `scale(${zoom})`,
      }}
    >
      {renderTemplate()}
    </div>
  );
}
