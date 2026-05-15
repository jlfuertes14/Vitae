import {
  ALL_SECTION_TYPES,
  DEFAULT_RESUME_SECTIONS,
  TEMPLATE_SECTION_CAPABILITIES,
} from "@/lib/constants";
import type { ResumeContent, ResumeSection, SectionType } from "@/lib/types";

const DEFAULT_HEADER = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  github: "",
};

const SECTION_TITLE_MAP = Object.fromEntries(
  DEFAULT_RESUME_SECTIONS.map((section) => [section.type, section.title])
) as Record<string, string>;

const normalizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeBullets = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);

const normalizeSkills = (value: unknown) => {
  const rawSkills = Array.isArray(value) ? value : [];
  return rawSkills
    .map((entry) => {
      if (typeof entry === "string") {
        return { name: entry.trim(), level: "Very good" };
      }
      if (entry && typeof entry === "object") {
        const name = normalizeString((entry as { name?: string }).name);
        const level = normalizeString((entry as { level?: string }).level) || "Very good";
        return name ? { name, level } : null;
      }
      return null;
    })
    .filter(Boolean) as { name: string; level: string }[];
};

const ensureAllowedSections = (
  templateId?: string,
  allowedSections?: SectionType[]
) => {
  if (Array.isArray(allowedSections) && allowedSections.length > 0) {
    return allowedSections;
  }
  if (templateId && TEMPLATE_SECTION_CAPABILITIES[templateId]) {
    return TEMPLATE_SECTION_CAPABILITIES[templateId];
  }
  return ALL_SECTION_TYPES;
};

const normalizeSection = (section: any, index: number): ResumeSection | null => {
  const type = normalizeString(section?.type) as SectionType;
  if (!type) return null;

  const title =
    normalizeString(section?.title) || SECTION_TITLE_MAP[type] || "Section";
  const visible =
    typeof section?.visible === "boolean" ? section.visible : true;

  let items = Array.isArray(section?.items) ? section.items : [];

  if (type === "summary" && items.length === 0) {
    const summaryText = normalizeString(section?.text || section?.summary);
    if (summaryText) {
      items = [{ content: { text: summaryText } }];
    }
  }

  const normalizedItems = items
    .map((item: any, itemIndex: number) => {
      const content = item?.content || item || {};
      const id = normalizeString(item?.id) || `item-${Date.now()}-${index}-${itemIndex}`;

      if (type === "summary") {
        const text = normalizeString(content.text || content.summary);
        return text ? { id, content: { text } } : null;
      }

      if (type === "experience") {
        const bullets = normalizeBullets(content.bullets);
        const description = normalizeString(content.description);
        return {
          id,
          content: {
            company: normalizeString(content.company || content.companyName),
            position: normalizeString(content.position || content.jobTitle),
            location: normalizeString(content.location),
            startDate: normalizeString(content.startDate),
            endDate: normalizeString(content.endDate),
            bullets: bullets.length > 0 ? bullets : description ? [description] : [],
          },
        };
      }

      if (type === "education") {
        return {
          id,
          content: {
            institution: normalizeString(content.institution || content.school),
            degree: normalizeString(content.degree),
            field: normalizeString(content.field || content.major),
            location: normalizeString(content.location),
            startDate: normalizeString(content.startDate),
            endDate: normalizeString(content.endDate),
            bullets: normalizeBullets(content.bullets),
          },
        };
      }

      if (type === "projects" || type === "leadership") {
        return {
          id,
          content: {
            name: normalizeString(content.name || content.title),
            description: normalizeString(content.description),
            url: normalizeString(content.url || content.link),
            location: normalizeString(content.location),
            startDate: normalizeString(content.startDate),
            endDate: normalizeString(content.endDate),
            bullets: normalizeBullets(content.bullets),
          },
        };
      }

      if (type === "skills" || type === "languages") {
        const skillList = normalizeSkills(content.skills);
        const fallbackName = normalizeString(content.name);
        if (skillList.length === 0 && fallbackName) {
          skillList.push({
            name: fallbackName,
            level: normalizeString(content.level) || "Very good",
          });
        }
        return {
          id,
          content: {
            category:
              normalizeString(content.category) ||
              (type === "languages" ? "Languages" : "Technical Skills"),
            skills: skillList,
          },
        };
      }

      if (type === "hobbies") {
        const text = normalizeString(content.text || content.hobbies);
        return text ? { id, content: { text } } : null;
      }

      if (type === "awards" || type === "certifications" || type === "custom") {
        const titleValue = normalizeString(content.title || content.name);
        const description = normalizeString(content.description || content.text);
        return titleValue || description
          ? { id, content: { title: titleValue, description } }
          : null;
      }

      return {
        id,
        content,
      };
    })
    .filter(Boolean) as ResumeSection["items"];

  return {
    id: normalizeString(section?.id) || type,
    type,
    title,
    visible,
    items: normalizedItems,
  };
};

export function normalizeResumeContent(
  raw: any,
  options?: { templateId?: string; allowedSections?: SectionType[] }
): ResumeContent {
  const allowed = ensureAllowedSections(
    options?.templateId,
    options?.allowedSections
  );

  const headerSource = raw?.header || {};
  const header = {
    ...DEFAULT_HEADER,
    fullName: normalizeString(headerSource.fullName),
    title: normalizeString(headerSource.title),
    photoUrl: normalizeString(headerSource.photoUrl),
    email: normalizeString(headerSource.email),
    phone: normalizeString(headerSource.phone),
    location: normalizeString(headerSource.location),
    linkedin: normalizeString(headerSource.linkedin),
    website: normalizeString(headerSource.website),
    github: normalizeString(headerSource.github),
    birthDate: normalizeString(headerSource.birthDate),
    birthPlace: normalizeString(headerSource.birthPlace),
    maritalStatus: normalizeString(headerSource.maritalStatus),
    nationality: normalizeString(headerSource.nationality),
    gender: normalizeString(headerSource.gender),
  };

  const rawSections = Array.isArray(raw?.sections) ? raw.sections : [];
  const sections = rawSections
    .map((section: any, index: number) => normalizeSection(section, index))
    .filter(Boolean)
    .filter((section) => allowed.includes(section!.type)) as ResumeSection[];

  return { header, sections };
}
