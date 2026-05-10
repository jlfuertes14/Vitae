"use client";

import { ResumeContent, ResumeSection, SectionItem, ExperienceItem, EducationItem, SkillsItem } from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

export function LondonLuxury({ content }: TemplateProps) {
  const { header, sections } = content;

  // Split sections for double column layout
  const sidebarSectionTypes = ["skills", "education", "certifications", "awards", "languages"];
  const mainSectionTypes = ["summary", "experience", "projects", "leadership", "custom"];

  const sidebarSections = sections.filter(s => s.visible && sidebarSectionTypes.includes(s.type));
  const mainSections = sections.filter(s => s.visible && mainSectionTypes.includes(s.type));

  return (
    <div className="w-full h-full bg-white text-[#1a1a1a] font-sans text-[10pt] leading-[1.6] print:p-0 print:m-0 flex" style={{ fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-[32%] bg-[#2d3436] text-white p-8 flex flex-col shrink-0 min-h-[297mm]">
        {/* Header in Sidebar */}
        <div className="mb-10">
          <h1 className="text-[24pt] leading-[1.1] font-bold tracking-tight text-white mb-2 uppercase">
            {header.fullName || "John Doe"}
          </h1>
          <div className="h-1 w-12 bg-white/30 rounded-full mb-8" />
          
          <div className="space-y-4 text-[9pt] text-white/80">
            {header.location && (
              <div className="flex flex-col">
                <span className="text-[7pt] uppercase tracking-widest text-white/40 mb-1">Location</span>
                <span>{header.location}</span>
              </div>
            )}
            {header.phone && (
              <div className="flex flex-col">
                <span className="text-[7pt] uppercase tracking-widest text-white/40 mb-1">Phone</span>
                <span>{header.phone}</span>
              </div>
            )}
            {header.email && (
              <div className="flex flex-col">
                <span className="text-[7pt] uppercase tracking-widest text-white/40 mb-1">Email</span>
                <span className="break-all">{header.email}</span>
              </div>
            )}
            {header.linkedin && (
              <div className="flex flex-col">
                <span className="text-[7pt] uppercase tracking-widest text-white/40 mb-1">LinkedIn</span>
                <span className="break-all">{header.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-10">
          {sidebarSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h2 className="text-[10pt] font-bold uppercase tracking-[0.2em] text-white/90 border-b border-white/10 pb-2">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <SidebarItemRenderer key={item.id} type={section.type} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white min-h-[297mm]">
        <div className="space-y-10">
          {mainSections.map((section) => (
            <div key={section.id} className="space-y-5">
              <h2 className="text-[12pt] font-extrabold uppercase tracking-[0.15em] text-[#2d3436] flex items-center gap-3">
                {section.title}
                <div className="flex-1 h-[1px] bg-gray-100" />
              </h2>
              <div className="space-y-6">
                {section.items.map((item) => (
                  <MainItemRenderer key={item.id} type={section.type} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function SidebarItemRenderer({ type, item }: { type: string; item: SectionItem }) {
  switch (type) {
    case "skills": {
      const skills = item as SkillsItem;
      return (
        <div className="space-y-2">
          {skills.content.category && (
            <div className="text-[8pt] font-bold text-white/50 uppercase tracking-wider">
              {skills.content.category}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {skills.content.skills.map((skill, i) => (
              <span key={i} className="text-[9pt] text-white/90 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case "education": {
      const edu = item as EducationItem;
      return (
        <div className="space-y-1">
          <div className="font-bold text-[9.5pt] text-white/95">{edu.content.degree}</div>
          <div className="text-[8.5pt] text-white/70 italic">{edu.content.institution}</div>
          <div className="text-[8pt] text-white/40">{edu.content.startDate} - {edu.content.endDate || "Present"}</div>
        </div>
      );
    }
    default:
      return null;
  }
}

function MainItemRenderer({ type, item }: { type: string; item: SectionItem }) {
  switch (type) {
    case "summary": {
      return (
        <p className="text-[10pt] leading-[1.7] text-gray-700 font-medium">
          {item.content.text as string}
        </p>
      );
    }
    case "experience": {
      const exp = item as ExperienceItem;
      return (
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-bold text-[11pt] text-[#2d3436]">{exp.content.position}</span>
            <span className="text-[9pt] font-bold text-gray-400 uppercase tracking-wider">
              {exp.content.startDate} — {exp.content.endDate || "Present"}
            </span>
          </div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[10pt] font-bold text-[#2d3436]/70 uppercase tracking-widest">{exp.content.company}</span>
            <span className="text-[9pt] text-gray-500 italic">{exp.content.location}</span>
          </div>
          <ul className="space-y-2">
            {exp.content.bullets?.map((bullet, i) => (
              <li key={i} className="text-[9.5pt] leading-relaxed text-gray-600 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-[1px] before:bg-gray-300">
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
