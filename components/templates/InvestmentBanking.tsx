"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function InvestmentBanking({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-black font-serif text-[10pt] leading-[1.15] print:p-0 print:m-0" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Header */}
      <header className="text-center mb-3">
        <h1 className="text-[20pt] leading-tight font-bold uppercase mb-1">
          {header.fullName || "John Doe"}
        </h1>
        <div className="text-[9.5pt] flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          {header.location && <span>{header.location}</span>}
          {header.location && (header.phone || header.email || header.linkedin) && <span>|</span>}
          
          {header.phone && <span>{header.phone}</span>}
          {header.phone && (header.email || header.linkedin) && <span>|</span>}
          
          {header.email && <span>{header.email}</span>}
          {header.email && header.linkedin && <span>|</span>}
          
          {header.linkedin && <span>{header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-2.5">
        {sections.filter((s) => s.visible).map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function SectionRenderer({ section }: { section: ResumeSection }) {
  if (!section.items || section.items.length === 0) return null;

  return (
    <section>
      <h2 className="text-[11pt] font-bold uppercase border-b-[1px] border-black pb-0.5 mb-1.5">
        {section.title}
      </h2>
      <div className="space-y-2">
        {section.items.map((item) => (
          <ItemRenderer key={item.id} type={section.type} item={item} />
        ))}
      </div>
    </section>
  );
}

function ItemRenderer({ type, item }: { type: ResumeSection["type"]; item: SectionItem }) {
  switch (type) {
    case "experience": {
      const exp = item as ExperienceItem;
      return (
        <div>
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-[10pt]">{exp.content.company}</span>
            <span className="text-[9.5pt]">{exp.content.location}</span>
          </div>
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="italic text-[10pt]">{exp.content.position}</span>
            <span className="text-[9.5pt]">{exp.content.startDate} {exp.content.endDate && `- ${exp.content.endDate}`}</span>
          </div>
          <ul className="list-disc ml-4 space-y-0">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[9.5pt] pl-0.5">{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }

    case "education": {
      const edu = item as EducationItem;
      return (
        <div>
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-[10pt]">{edu.content.institution}</span>
            <span className="text-[9.5pt]">{edu.content.location}</span>
          </div>
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="italic text-[10pt]">{edu.content.degree}{edu.content.field ? `, ${edu.content.field}` : ""}</span>
            <span className="text-[9.5pt]">{edu.content.startDate} {edu.content.endDate && `- ${edu.content.endDate}`}</span>
          </div>
        </div>
      );
    }

    case "skills": {
      const skill = item as SkillsItem;
      const rawSkills = Array.isArray(skill.content.skills)
        ? skill.content.skills
        : typeof skill.content.skills === "string"
        ? [skill.content.skills]
        : [];
      const skillNames = rawSkills
        .map((entry) => (typeof entry === "string" ? entry : entry?.name))
        .filter(Boolean) as string[];
      return (
        <div className="text-[9.5pt] flex gap-2">
          <span className="font-bold">{skill.content.category}:</span>
          <span>{skillNames.join(", ")}</span>
        </div>
      );
    }

    case "summary":
      return <div className="text-[9.5pt] leading-snug">{(item.content.text as string) || ""}</div>;
    
    default:
      return null;
  }
}
