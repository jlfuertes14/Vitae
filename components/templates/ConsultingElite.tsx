"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function ConsultingElite({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-black font-serif text-[10.5pt] leading-[1.35] print:p-0 print:m-0" style={{ fontFamily: '"EB Garamond", Garamond, serif' }}>
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-[26pt] leading-[1.2] font-semibold tracking-wide uppercase mb-1">
          {header.fullName || "Jane Smith"}
        </h1>
        <div className="text-[10pt] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-gray-800">
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
      <div className="space-y-4">
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
    <section className="mb-4">
      <div className="flex items-center mb-2">
        <h2 className="text-[11pt] font-bold uppercase tracking-wider whitespace-nowrap pr-2">
          {section.title}
        </h2>
        <div className="h-[1px] w-full bg-black/60 flex-1"></div>
      </div>
      <div className="space-y-3 px-1">
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
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="font-bold text-[11pt]">{exp.content.company}</span>
            <span className="text-[10pt]">{exp.content.location}</span>
          </div>
          <div className="flex justify-between items-baseline italic mb-1 text-[10.5pt] text-gray-800">
            <span>{exp.content.position}</span>
            <span className="text-[10pt] not-italic">{exp.content.startDate} {exp.content.endDate && `- ${exp.content.endDate}`}</span>
          </div>
          <ul className="list-disc ml-5 space-y-0.5 mt-1.5">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10pt] pl-1 mb-0.5 leading-snug">{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }

    case "education": {
      const edu = item as EducationItem;
      return (
        <div>
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="font-bold text-[11pt]">{edu.content.institution}</span>
            <span className="text-[10pt]">{edu.content.location}</span>
          </div>
          <div className="flex justify-between items-baseline mb-1 text-[10.5pt]">
            <span className="italic">{edu.content.degree}{edu.content.field ? `, ${edu.content.field}` : ""}</span>
            <span className="text-[10pt]">{edu.content.startDate} {edu.content.endDate && `- ${edu.content.endDate}`}</span>
          </div>
        </div>
      );
    }

    case "skills": {
      const skill = item as SkillsItem;
      return (
        <div className="text-[10pt] flex gap-2">
          <span className="font-bold">{skill.content.category}:</span>
          <span>{Array.isArray(skill.content.skills) ? skill.content.skills.map((s: any) => typeof s === 'string' ? s : s.name).join(", ") : skill.content.skills}</span>
        </div>
      );
    }

    case "summary":
      return <div className="text-[10pt] leading-relaxed">{(item.content.text as string) || ""}</div>;

    case "projects": {
      const proj = item as ProjectItem;
      return (
        <div>
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="font-bold text-[11pt]">{proj.content.name}</span>
            <span className="text-[10pt]">{proj.content.url}</span>
          </div>
          <p className="text-[10pt] mb-1 italic">{proj.content.description}</p>
          <ul className="list-disc ml-5 space-y-0.5">
            {proj.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10pt] pl-1">{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    default:
      return null;
  }
}
