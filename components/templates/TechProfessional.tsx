"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function TechProfessional({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-gray-900 font-sans text-[10pt] leading-[1.4] print:p-0 print:m-0" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      {/* Header */}
      <header className="mb-5 flex flex-col items-start border-l-4 border-blue-600 pl-4">
        <h1 className="text-[24pt] leading-none font-bold tracking-tight text-gray-900 mb-2">
          {header.fullName || "John Doe"}
        </h1>
        <div className="text-[9.5pt] flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600">
          {header.email && <span className="flex items-center gap-1">✉ {header.email}</span>}
          {header.phone && <span className="flex items-center gap-1">📱 {header.phone}</span>}
          {header.location && <span className="flex items-center gap-1">📍 {header.location}</span>}
          {header.linkedin && <span className="flex items-center gap-1">🔗 {header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
          {header.github && <span className="flex items-center gap-1">💻 {header.github.replace(/^https?:\/\/(www\.)?/, "")}</span>}
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
    <section>
      <h2 className="text-[12pt] font-semibold text-blue-700 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2">
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
            <span className="font-semibold text-[11pt]">{exp.content.position}</span>
            <span className="text-[9.5pt] text-blue-600 font-medium">{exp.content.startDate} {exp.content.endDate && `— ${exp.content.endDate}`}</span>
          </div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-[10pt] font-medium text-gray-700">{exp.content.company}</span>
            <span className="text-[9.5pt] text-gray-500">{exp.content.location}</span>
          </div>
          <ul className="list-disc ml-4 space-y-0.5 text-gray-700">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[9.5pt] pl-1 leading-snug">{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Fallback simple rendering for others to keep files compact
    default:
      return (
        <div className="text-[9.5pt]">
          <pre className="whitespace-pre-wrap font-mono text-[8pt] bg-slate-50 p-1 rounded text-blue-800">{JSON.stringify(item.content, null, 2)}</pre>
        </div>
      );
  }
}
