"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function ModernExecutive({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-slate-800 font-sans text-[10.5pt] leading-[1.5] print:p-0 print:m-0" style={{ fontFamily: 'var(--font-inter), "Helvetica Neue", Helvetica, sans-serif' }}>
      {/* Header */}
      <header className="mb-8 border-b-2 border-slate-200 pb-6 text-center">
        <h1 className="text-[28pt] leading-tight font-extrabold tracking-tight text-slate-900 mb-2">
          {header.fullName || "John Doe"}
        </h1>
        <div className="text-[10pt] font-medium flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-500 uppercase tracking-wider">
          {header.location && <span>{header.location}</span>}
          {header.location && (header.phone || header.email || header.linkedin) && <span className="text-slate-300">•</span>}
          
          {header.phone && <span>{header.phone}</span>}
          {header.phone && (header.email || header.linkedin) && <span className="text-slate-300">•</span>}
          
          {header.email && <span>{header.email}</span>}
          {header.email && header.linkedin && <span className="text-slate-300">•</span>}
          
          {header.linkedin && <span>{header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
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
      <h2 className="text-[12pt] font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center">
        <span className="bg-slate-900 text-white px-2 py-0.5 mr-3 inline-block rounded-sm text-[10pt]">{section.title.charAt(0)}</span>
        {section.title}
      </h2>
      <div className="space-y-4 pl-[38px]">
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
            <span className="font-bold text-[11pt] text-slate-900">{exp.content.position}</span>
            <span className="text-[10pt] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
              {exp.content.startDate} {exp.content.endDate && `- ${exp.content.endDate}`}
            </span>
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-medium text-[10.5pt] text-slate-700">{exp.content.company}</span>
            <span className="text-[10pt] text-slate-500">{exp.content.location}</span>
          </div>
          <ul className="list-none space-y-1.5">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10pt] leading-relaxed relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[8px] before:w-1.5 before:h-1.5 before:bg-slate-300 before:rounded-full">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Fallback simple rendering for others to keep files compact
    default:
      return (
        <div className="text-[10pt]">
          <pre className="whitespace-pre-wrap font-mono text-[9pt] bg-slate-50 rounded-md p-2 border border-slate-100">{JSON.stringify(item.content, null, 2)}</pre>
        </div>
      );
  }
}
