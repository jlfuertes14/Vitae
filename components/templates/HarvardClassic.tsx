"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, SkillsItem, Skill } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function HarvardClassic({ content }: TemplateProps) {
  const { header, sections } = content;

  return (
    <div className="w-full h-full bg-white text-black font-sans leading-relaxed selection:bg-blue-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header className="relative flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-[28pt] font-bold text-[#1a56db] leading-none mb-2">
            {header.fullName.toUpperCase()}
          </h1>
          <div className="text-[14pt] font-bold text-black uppercase tracking-wide mb-4">
            {header.title}
          </div>
          <div className="text-[9.5pt] text-gray-700 flex flex-wrap gap-x-3 gap-y-1">
            {header.location && <span>{header.location}</span>}
            {header.phone && (
              <>
                <span className="text-gray-300">|</span>
                <span>{header.phone}</span>
              </>
            )}
            {header.email && (
              <>
                <span className="text-gray-300">|</span>
                <span>{header.email}</span>
              </>
            )}
          </div>
        </div>

        {header.photoUrl && (
          <div className="w-32 h-32 shrink-0 ml-8 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
            <img src={header.photoUrl} alt={header.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Sections */}
      <div className="space-y-8">
        {sections.filter(s => s.visible && s.items.length > 0).map((section) => (
          <section key={section.id} className="space-y-4">
            <h2 className="text-[12pt] font-bold text-[#1a56db] uppercase tracking-wider border-t-[1.5pt] border-b-[1.5pt] border-[#1a56db] py-1.5">
              {section.title}
            </h2>
            
            <div className="space-y-6">
              {section.items.map((item) => (
                <ItemRenderer key={item.id} type={section.type} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ItemRenderer({ type, item }: { type: ResumeSection["type"]; item: SectionItem }) {
  switch (type) {
    case "summary":
      return (
        <div className="text-[10pt] text-gray-800 leading-normal text-justify">
          {item.content.text as string}
        </div>
      );

    case "experience": {
      const exp = item as ExperienceItem;
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <div className="text-[11pt] font-bold text-black">
              {exp.content.position}, {exp.content.company}
            </div>
            <div className="text-[10pt] font-bold text-black">
              {exp.content.startDate} — {exp.content.endDate}
            </div>
          </div>
          <ul className="list-disc ml-5 space-y-1.5">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[10pt] text-gray-800 pl-1">
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
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <div className="text-[11pt] font-bold text-black">
              {edu.content.degree || edu.content.field}
            </div>
            <div className="text-[10pt] font-bold text-black">
              {edu.content.startDate} — {edu.content.endDate}
            </div>
          </div>
          <div className="text-[10.5pt] text-gray-700 italic">
            {edu.content.institution}
          </div>
          <ul className="list-disc ml-5 space-y-1 text-[10pt] text-gray-800">
            {edu.content.bullets?.map((bullet, i) => (
              <li key={i} className="pl-1">{bullet}</li>
            ))}
          </ul>
        </div>
      );
    }

    case "skills":
    case "languages": {
      const skillsItem = item as SkillsItem;
      const skillList = (skillsItem.content.skills as any[] || []) as Skill[];
      
      return (
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 pt-1">
          {skillList.map((skill, i) => (
            <div key={i} className="text-[10pt] text-gray-800">
              {skill.name}
            </div>
          ))}
        </div>
      );
    }

    case "awards":
    case "certifications":
    case "custom": {
      const title = item.content.title || item.content.name || "";
      const description = item.content.description || item.content.text || "";
      return (
        <div className="text-[10pt] flex items-start gap-2">
          <span className="text-[#1a56db] mt-1.5">•</span>
          <div className="flex gap-1.5">
            <span className="font-bold whitespace-nowrap">{title}:</span>
            <span className="text-gray-800">{description}</span>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
