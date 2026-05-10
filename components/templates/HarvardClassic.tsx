"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function HarvardClassic({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-black font-serif text-[11pt] leading-[1.3] print:p-0 print:m-0" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-[24pt] leading-[1.1] font-normal uppercase mb-2">
          {header.fullName || "John Doe"}
        </h1>
        <div className="text-[10pt] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {header.location && <span>{header.location}</span>}
          {header.location && (header.phone || header.email || header.linkedin) && <span>|</span>}
          
          {header.phone && <span>{header.phone}</span>}
          {header.phone && (header.email || header.linkedin) && <span>|</span>}
          
          {header.email && <span>{header.email}</span>}
          {header.email && header.linkedin && <span>|</span>}
          
          {header.linkedin && <span>{header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
          {header.linkedin && header.github && <span>|</span>}
          
          {header.github && <span>{header.github.replace(/^https?:\/\/(www\.)?/, "")}</span>}
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
      <h2 className="text-[12pt] font-bold uppercase border-b-[1.5px] border-black pb-0.5 mb-2">
        {section.title}
      </h2>
      <div className="space-y-3">
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
          <div className="flex justify-between items-baseline italic mb-1 text-[11pt]">
            <span>{exp.content.position}</span>
            <span className="text-[10pt]">{exp.content.startDate} {exp.content.endDate && `- ${exp.content.endDate}`}</span>
          </div>
          <ul className="list-disc ml-5 space-y-0.5">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10.5pt] pl-1">{bullet}</li>
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
          <div className="flex justify-between items-baseline mb-1">
            <span className="italic text-[11pt]">
              {edu.content.degree}{edu.content.field ? ` in ${edu.content.field}` : ""}
            </span>
            <span className="text-[10pt]">{edu.content.startDate} {edu.content.endDate && `- ${edu.content.endDate}`}</span>
          </div>
          {(edu.content.gpa || edu.content.honors) && (
            <div className="text-[10.5pt] mb-1">
              {edu.content.gpa && <span><span className="font-semibold">GPA:</span> {edu.content.gpa}</span>}
              {edu.content.gpa && edu.content.honors && <span className="mx-2">|</span>}
              {edu.content.honors && <span>{edu.content.honors}</span>}
            </div>
          )}
          {edu.content.bullets && edu.content.bullets.length > 0 && (
            <ul className="list-disc ml-5 space-y-0.5 mt-1">
              {edu.content.bullets.map((bullet, i) => (
                <li key={i} className="text-[10.5pt] pl-1">{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    case "projects": {
      const proj = item as ProjectItem;
      return (
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[11pt]">
              <span className="font-bold">{proj.content.name}</span>
              {proj.content.technologies && proj.content.technologies.length > 0 && (
                <span className="italic"> | {proj.content.technologies.join(", ")}</span>
              )}
            </span>
            {proj.content.url && (
              <span className="text-[10pt] underline">{proj.content.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
            )}
          </div>
          <ul className="list-disc ml-5 space-y-0.5">
            {proj.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10.5pt] pl-1">{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }

    case "skills": {
      const skill = item as SkillsItem;
      return (
        <div className="flex items-baseline text-[10.5pt]">
          <span className="font-bold mr-2 whitespace-nowrap">{skill.content.category}:</span>
          <span>{skill.content.skills?.join(", ")}</span>
        </div>
      );
    }

    case "summary": {
      return (
        <div className="text-[10.5pt] text-justify">
          {(item.content.text as string) || ""}
        </div>
      );
    }

    default:
      return null;
  }
}
