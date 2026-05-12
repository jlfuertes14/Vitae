"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, ProjectItem, SkillsItem, Skill } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function LondonLuxury({ content }: TemplateProps) {
  const { header, sections } = content;

  // Map long section titles to short ones common in this template
  const getShortTitle = (title: string, type: string) => {
    const t = title.toUpperCase();
    if (t.includes("SUMMARY") || type === "summary") return "PROFILE";
    if (t.includes("EXPERIENCE") || type === "experience") return "EXPERIENCE";
    if (t.includes("EDUCATION") || type === "education") return "EDUCATION";
    if (t.includes("SKILLS") || type === "skills") return "SKILLS";
    if (t.includes("PROJECTS") || type === "projects") return "PROJECTS";
    if (t.includes("LANGUAGES") || type === "languages") return "LANGUAGES";
    if (t.includes("HOBBIES") || type === "hobbies") return "HOBBIES";
    return t;
  };

  return (
    <div className="w-full h-full bg-white text-black font-serif text-[10pt] leading-[1.4] print:p-0 print:m-0 selection:bg-gray-200" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Header */}
      <header className="text-center pt-10 pb-6">
        <h1 className="text-[20pt] font-normal mb-1">
          {header.fullName}{header.title ? `, ${header.title}` : ""}
        </h1>
        <div className="text-[9pt] text-gray-800 space-y-0.5">
          <div>{header.location}</div>
          <div>
            {[header.phone, header.email].filter(Boolean).join(" — ")}
          </div>
        </div>
      </header>

      {/* Sections Container */}
      <div className="mt-2">
        {sections.filter((s) => s.visible).map((section) => (
          <div key={section.id} className="border-t border-gray-300">
             <SectionRenderer 
              section={section} 
              displayTitle={getShortTitle(section.title, section.type)} 
            />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {(header.birthDate || header.maritalStatus || header.nationality) && (
        <div className="mt-12 pt-4 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-y-3 text-[9pt]">
            <div className="flex">
              <span className="w-40 text-gray-800 font-bold uppercase text-[8.5pt]">Date / Place of birth</span>
              <span className="flex-1">
                {header.birthDate}{header.birthPlace ? ` — ${header.birthPlace}` : ""}
              </span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-800 font-bold uppercase text-[8.5pt]">Marital status</span>
              <span className="flex-1">{header.maritalStatus}</span>
            </div>
            <div className="flex">
              <span className="w-40 text-gray-800 font-bold uppercase text-[8.5pt]">Nationality / Gender</span>
              <span className="flex-1">
                {[header.nationality, header.gender].filter(Boolean).join(" / ")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRenderer({ section, displayTitle }: { section: ResumeSection; displayTitle: string }) {
  if (!section.items || section.items.length === 0) return null;

  // Hobbies is a special case where we might just want a single row
  if (section.type === "hobbies") {
    return (
      <div className="py-4 flex gap-4">
        <div className="w-[18%] shrink-0">
          <h2 className="text-[9pt] font-bold uppercase tracking-widest text-black">
            {displayTitle}
          </h2>
        </div>
        <div className="flex-1 text-[9.5pt]">
          {section.items.map(item => item.content.text || item.content.name || "").join(", ")}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Left Column for Section Title */}
      <div className="w-[18%] mb-4">
        <h2 className="text-[9pt] font-bold uppercase tracking-widest text-black">
          {displayTitle}
        </h2>
      </div>

      <div className="space-y-6">
        {section.items.map((item, idx) => (
          <div key={item.id} className="flex gap-4">
             {/* Date Column (Matches Title Width) */}
             <div className="w-[18%] shrink-0 text-[8.5pt] text-gray-600 font-sans pt-1">
                {(section.type !== "summary" && section.type !== "skills" && section.type !== "languages") && (
                  <span>{item.content.startDate} {item.content.endDate && `— ${item.content.endDate}`}</span>
                )}
                {(section.type === "skills" || section.type === "languages") && idx === 0 && (
                   <div className="text-[8pt] text-gray-400 italic">In decreasing order</div>
                )}
             </div>

             {/* Content Column */}
             <div className="flex-1">
                <ItemRenderer type={section.type} item={item} />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemRenderer({ type, item }: { type: ResumeSection["type"]; item: SectionItem }) {
  switch (type) {
    case "summary":
      return (
        <div className="text-[9.5pt] leading-relaxed text-justify">
          {item.content.text as string || ""}
        </div>
      );

    case "experience": {
      const exp = item as ExperienceItem;
      return (
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="font-bold text-[10.5pt] text-black">
              {exp.content.position}, {exp.content.company}
            </div>
            <ul className="mt-2 space-y-1.5">
              {exp.content.bullets?.map((bullet, i) => (
                <li key={i} className="text-[9.5pt] relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-black">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[130px] shrink-0 text-right text-[8.5pt] text-gray-500 italic pt-0.5">
            {exp.content.location}
          </div>
        </div>
      );
    }

    case "education": {
      const edu = item as EducationItem;
      return (
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="font-bold text-[10.5pt] text-black">
              {edu.content.institution}
            </div>
            <div className="text-[9.5pt] italic text-gray-700 mt-0.5">
              {edu.content.degree}{edu.content.field ? `, ${edu.content.field}` : ""}
            </div>
            {edu.content.bullets && edu.content.bullets.length > 0 && (
              <ul className="mt-2 space-y-1">
                {edu.content.bullets.map((bullet, i) => (
                  <li key={i} className="text-[9.5pt] relative pl-4 before:content-['•'] before:absolute before:left-0">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-[130px] shrink-0 text-right text-[8.5pt] text-gray-500 italic pt-0.5">
            {edu.content.location}
          </div>
        </div>
      );
    }

    case "skills":
    case "languages": {
      const skills = item as SkillsItem;
      const skillList = (skills.content.skills as any[] || []) as Skill[];
      
      return (
        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
          {skillList.map((skill, i) => (
            <div key={i} className="flex justify-between items-baseline border-b border-gray-100 pb-1">
              <span className="text-[9.5pt]">{skill.name}</span>
              <span className="text-[8pt] text-gray-400 italic">{skill.level}</span>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
