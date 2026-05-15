"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function ModernExecutive({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-[#1a1a1a] font-sans text-[10.5pt] leading-[1.5] print:p-0 print:m-0" style={{ fontFamily: '"Outfit", "Helvetica Neue", Helvetica, sans-serif' }}>
      {/* Header */}
      <header className="mb-8 border-l-4 border-black pl-6 py-2">
        <h1 className="text-[28pt] leading-[1.1] font-black tracking-tight text-black mb-1 uppercase">
          {header.fullName || "John Doe"}
        </h1>
        <div className="text-[10pt] font-medium text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
          {header.location && <span>{header.location}</span>}
          {header.phone && <span>{header.phone}</span>}
          {header.email && <span className="text-black underline">{header.email}</span>}
          {header.linkedin && <span>{header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-8">
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
      <h2 className="text-[12pt] font-black uppercase tracking-[0.1em] text-black mb-4 flex items-center gap-4">
        {section.title}
        <div className="flex-1 h-[2px] bg-black/5" />
      </h2>
      <div className="space-y-6">
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
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-extrabold text-[11pt] text-black">{exp.content.position}</span>
            <span className="text-[9pt] font-bold text-gray-400 uppercase tracking-wider">{exp.content.startDate} — {exp.content.endDate || "Present"}</span>
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10pt] font-bold text-gray-700">{exp.content.company}</span>
            <span className="text-[9pt] text-gray-400 italic">{exp.content.location}</span>
          </div>
          <ul className="space-y-1.5">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10pt] leading-relaxed text-gray-700 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:bg-black before:rounded-full">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case "education": {
      const edu = item as EducationItem;
      return (
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <div className="font-bold text-[11pt] text-black">{edu.content.degree}{edu.content.field ? `, ${edu.content.field}` : ""}</div>
            <div className="text-[10pt] text-gray-600 font-medium">{edu.content.institution}</div>
          </div>
          <div className="text-right">
            <div className="text-[9pt] font-bold text-gray-400 uppercase">{edu.content.startDate} — {edu.content.endDate || "Present"}</div>
            <div className="text-[9pt] text-gray-400 italic">{edu.content.location}</div>
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
        <div className="text-[10pt] flex gap-3 flex-wrap">
          <span className="font-bold text-black uppercase tracking-wider min-w-[120px]">{skill.content.category}</span>
          <span className="text-gray-600 flex-1">
            {skillNames.join(" • ")}
          </span>
        </div>
      );
    }

    case "summary":
      return <div className="text-[10.5pt] leading-relaxed text-gray-700 font-medium">{item.content.text as string || ""}</div>;

    case "projects": {
      const proj = item as ProjectItem;
      return (
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-[11pt] text-black">{proj.content.name}</span>
            <span className="text-[9pt] text-gray-400">{proj.content.url}</span>
          </div>
          <p className="text-[10pt] text-gray-600 mb-2 italic">{proj.content.description}</p>
          <ul className="space-y-1">
            {proj.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10pt] leading-relaxed text-gray-700 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1 before:h-1 before:bg-gray-400 before:rounded-full">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    default:
      return null;
  }
}
