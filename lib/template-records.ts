import { TEMPLATES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const TEMPLATE_CATEGORY_BY_ID: Record<string, string> = {
  "harvard-classic": "CLASSIC_HARVARD",
  "consulting-elite": "CONSULTING_ELITE",
  "investment-banking": "INVESTMENT_BANKING",
  "modern-executive": "MODERN_EXECUTIVE",
  "tech-professional": "TECH_PROFESSIONAL",
  "london-luxury": "MODERN_EXECUTIVE",
  "sydney": "MODERN_EXECUTIVE",
};

export async function ensureTemplateRecord(templateId: string) {
  const template =
    TEMPLATES.find((entry) => entry.id === templateId) ?? TEMPLATES[0];

  const resolvedTemplateId = template?.id || "harvard-classic";
  const resolvedCategory =
    TEMPLATE_CATEGORY_BY_ID[resolvedTemplateId] || "CLASSIC_HARVARD";

  return prisma.template.upsert({
    where: { id: resolvedTemplateId },
    update: {
      name: template?.name || "Harvard Classic",
      slug: resolvedTemplateId,
      category: resolvedCategory as any,
      previewUrl: template?.previewUrl || "",
      styles: {},
      structure: {},
    },
    create: {
      id: resolvedTemplateId,
      name: template?.name || "Harvard Classic",
      slug: resolvedTemplateId,
      category: resolvedCategory as any,
      previewUrl: template?.previewUrl || "",
      styles: {},
      structure: {},
    },
  });
}
