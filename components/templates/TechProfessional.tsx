"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function TechProfessional({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-[#2d3436] font-sans text-[10pt] leading-[1.4] print:p-0 print:m-0" style={{ fontFamily: '"Roboto Mono", monospace' }}>
      {/* Header */}
      <header className="mb-6 flex justify-between items-start border-b-2 border-emerald-500 pb-4">
        <div>
          <h1 className="text-[22pt] leading-tight font-bold tracking-tighter text-black mb-1">
            {header.fullName || "John Doe"}
          </h1>
          <div className="text-[9pt] font-medium text-emerald-600 flex flex-wrap gap-x-3">
            {header.location && <span>{header.location}</span>}
            {header.phone && <span>{header.phone}</span>}
            {header.email && <span>{header.email}</span>}
          </div>
        </div>
        <div className="text-right text-[9pt] text-gray-500 space-y-0.5">
          {header.linkedin && <div className="hover:text-emerald-600 underline cursor-pointer">{header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
          {header.github && <div className="hover:text-emerald-600 underline cursor-pointer">{header.github.replace(/^https?:\/\/(www\.)?/, "")}</div>}
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-6">
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
      <h2 className="text-[10pt] font-bold uppercase tracking-widest text-white bg-emerald-500 inline-block px-2 py-0.5 mb-3">
        {section.title}
      </h2>
      <div className="space-y-4">
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
        <div className="border-l-2 border-gray-100 pl-4 ml-1">
          <div className="flex justify-between items-baseline mb-0.5">
            <span className="font-bold text-[10.5pt] text-black">{exp.content.position} @ {exp.content.company}</span>
            <span className="text-[9pt] font-bold text-emerald-600">{exp.content.startDate} — {exp.content.endDate || "Present"}</span>
          </div>
          <div className="text-[9pt] text-gray-400 mb-2 italic">{exp.content.location}</div>
          <ul className="space-y-1">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[9.5pt] leading-relaxed text-gray-600 flex gap-2">
                <span className="text-emerald-500 font-bold mt-[1px]">{">"}</span>
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
        <div className="flex justify-between items-start border-l-2 border-gray-100 pl-4 ml-1">
          <div>
            <div className="font-bold text-[10pt] text-black">{edu.content.degree}{edu.content.field ? ` in ${edu.content.field}` : ""}</div>
            <div className="text-[9pt] text-gray-500">{edu.content.institution}</div>
          </div>
          <div className="text-right text-[9pt]">
            <div className="font-bold text-emerald-600">{edu.content.startDate} — {edu.content.endDate || "Present"}</div>
            <div className="text-gray-400">{edu.content.location}</div>
          </div>
        </div>
      );
    }

    case "skills": {
      const skill = item as SkillsItem;
      return (
        <div className="flex gap-3 items-start border-l-2 border-gray-100 pl-4 ml-1">
          <span className="font-bold text-black text-[9pt] uppercase tracking-tighter min-w-[100px] text-emerald-600">{skill.content.category}:</span>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {(Array.isArray(skill.content.skills) ? skill.content.skills : []).map((s, i) => (
              <span key={i} className="text-[9pt] text-gray-600 bg-gray-50 px-1.5 border border-gray-200 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>
      );
    }

    case "summary":
      return (
        <div className="text-[9.5pt] leading-relaxed text-gray-600 border-l-2 border-gray-100 pl-4 ml-1 italic">
          {item.content.text as string || ""}
        </div>
      );

    case "projects": {
      const proj = item as ProjectItem;
      return (
        <div className="border-l-2 border-gray-100 pl-4 ml-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-[10pt] text-black">{proj.content.name}</span>
            <span className="text-[9pt] text-emerald-600 underline font-mono">{proj.content.url}</span>
          </div>
          <p className="text-[9pt] text-gray-500 mb-2">{proj.content.description}</p>
          <ul className="space-y-1">
            {proj.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[9pt] leading-relaxed text-gray-600 flex gap-2">
                <span className="text-gray-300">#</span>
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
