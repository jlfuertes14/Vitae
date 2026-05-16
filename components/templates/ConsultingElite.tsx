"use client";

import {
  ResumeContent,
  ResumeSection,
  SectionItem,
  ExperienceItem,
  EducationItem,
  SkillsItem,
  ProjectItem,
} from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

const formatDateRange = (start?: string, end?: string) => {
  const safeStart = start || "";
  const safeEnd = end || "";
  if (!safeStart && !safeEnd) return "";
  if (safeStart && safeEnd) return `${safeStart} - ${safeEnd}`;
  return safeStart || safeEnd;
};

const getExperienceTitle = (exp: ExperienceItem) => {
  const position = exp.content.position || "";
  const company = exp.content.company || "";
  if (position && company) return `${position} - ${company}`;
  return position || company;
};

const getEducationTitle = (edu: EducationItem) => {
  const parts = [edu.content.degree, edu.content.field, edu.content.institution]
    .filter(Boolean)
    .join(", ");
  return parts || "Education";
};

export function ConsultingElite({ content }: TemplateProps) {
  const { header, sections } = content;
  const visibleSections = sections.filter(
    (section) => section.visible && section.items.length > 0
  );

  const summarySection = visibleSections.find((section) => section.type === "summary");
  const experienceSection = visibleSections.find(
    (section) => section.type === "experience"
  );
  const educationSection = visibleSections.find(
    (section) => section.type === "education"
  );
  const additionalSections = visibleSections.filter(
    (section) =>
      section.type !== "summary" &&
      section.type !== "experience" &&
      section.type !== "education"
  );

  const summaryText = summarySection?.items
    .map((item) => (item.content.text as string) || "")
    .filter(Boolean)
    .join(" ");

  const contactItems = [header.phone, header.email].filter(Boolean);
  const contactLayout = contactItems.length > 1 ? "justify-between" : "justify-center";

  return (
    <div className="w-full h-full bg-white text-[#1a1a1a] font-serif text-[0.95rem] leading-relaxed">
      <div className="py-6">
        <header className="text-center mb-3">
          <h1 className="text-4xl font-semibold tracking-wide mb-1">
            {header.fullName || "Your Name"}
          </h1>
          {header.title && (
            <p className="text-lg font-bold italic text-gray-800">
              {header.title}
            </p>
          )}
          {header.location && (
            <p className="text-sm text-gray-600 mt-1">{header.location}</p>
          )}
        </header>

        {(header.phone || header.email) && (
          <div className="mt-4">
            <div className={`flex items-center px-1 border-t-2 border-b border-black py-1 ${contactLayout}`}>
              {header.phone && (
                <span className="font-bold text-sm tracking-widest">
                  {header.phone}
                </span>
              )}
              {header.email && (
                <span className="font-bold text-sm">{header.email}</span>
              )}
            </div>
            <div className="h-[1px] bg-black mt-[2px] w-full" />
          </div>
        )}

        {summaryText && (
          <section className="mt-6 mb-8">
            <div className="bg-[#e2e8f0] py-1 text-center mb-6">
              <h2 className="text-base font-bold tracking-[0.25em] uppercase">
                Profile
              </h2>
            </div>
            <div className="px-6 text-center italic leading-relaxed text-[0.92rem] text-gray-800">
              <p>{summaryText}</p>
            </div>
          </section>
        )}

        {experienceSection && (
          <section className="mb-8">
              <div className="bg-[#e2e8f0] py-1 text-center mb-6">
                <h2 className="text-base font-bold tracking-[0.25em] uppercase">
                  Experience
                </h2>
              </div>

              {experienceSection.items.map((item) => {
                const exp = item as ExperienceItem;
                const bullets = exp.content.bullets || [];
                const summary = bullets.length > 1 ? bullets[0] : "";
                const listBullets = bullets.length > 1 ? bullets.slice(1) : bullets;
                return (
                  <div key={item.id} className="mb-6">
                    <div className="flex items-baseline mb-0">
                      <div className="flex items-baseline gap-3 flex-shrink-0">
                        <span className="text-lg">{"\u2756"}</span>
                        <h3 className="text-lg font-bold text-gray-900 leading-none">
                          {getExperienceTitle(exp)}
                        </h3>
                      </div>
                      <div className="flex-grow border-b border-dotted border-gray-400 mx-2 relative top-[-4px]" />
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-700 leading-none">
                          {formatDateRange(exp.content.startDate, exp.content.endDate) || " "}
                        </p>
                      </div>
                    </div>
                    {exp.content.location && (
                      <div className="text-right mb-1">
                        <p className="text-[11px] italic text-gray-500 uppercase tracking-tighter">
                          {exp.content.location}
                        </p>
                      </div>
                    )}

                    <div className="pl-9 pr-2">
                      {summary && (
                        <p className="italic text-[0.9rem] leading-relaxed mb-3 text-gray-800">
                          {summary}
                        </p>
                      )}
                      {listBullets.length > 0 && (
                        <ul className="list-disc pl-5 text-[0.88rem] text-gray-800">
                          {listBullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
        )}

        {educationSection && (
          <section>
            <div className="bg-[#e2e8f0] py-1 text-center mb-6">
              <h2 className="text-base font-bold tracking-[0.25em] uppercase">
                Education
              </h2>
            </div>

            {educationSection.items.map((item) => {
              const edu = item as EducationItem;
              return (
                <div key={item.id} className="flex items-baseline mb-4 px-1">
                  <div className="flex items-baseline gap-3 flex-shrink-0">
                    <span className="text-lg">{"\u2756"}</span>
                    <h4 className="text-base font-bold text-gray-900 leading-none">
                      {getEducationTitle(edu)}
                    </h4>
                  </div>
                  <div className="flex-grow border-b border-dotted border-gray-400 mx-2 relative top-[-4px]" />
                  <span className="text-sm text-gray-700 font-medium flex-shrink-0 leading-none">
                    {formatDateRange(edu.content.startDate, edu.content.endDate) || " "}
                  </span>
                </div>
              );
            })}
          </section>
        )}

        {additionalSections.map((section) => (
          <AdditionalSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function AdditionalSection({ section }: { section: ResumeSection }) {
  return (
    <section className="mt-10">
      <div className="bg-[#e2e8f0] py-1 text-center mb-6">
        <h2 className="text-base font-bold tracking-[0.25em] uppercase">
          {section.title}
        </h2>
      </div>
      <div className="space-y-4">
        {section.items.map((item) => (
          <AdditionalItem key={item.id} type={section.type} item={item} />
        ))}
      </div>
    </section>
  );
}

function AdditionalItem({
  type,
  item,
}: {
  type: ResumeSection["type"];
  item: SectionItem;
}) {
  if (type === "skills" || type === "languages") {
    const skillsItem = item as SkillsItem;
    const skills = Array.isArray(skillsItem.content.skills)
      ? skillsItem.content.skills
      : [];
    return (
      <div className="flex flex-wrap gap-2 text-[0.9rem]">
        <span className="font-bold">{skillsItem.content.category}:</span>
        <span>
          {skills.map((skill: any) => (typeof skill === "string" ? skill : skill.name)).join(", ")}
        </span>
      </div>
    );
  }

  if (type === "projects" || type === "leadership") {
    const proj = item as ProjectItem;
    const bullets = proj.content.bullets || [];
    return (
      <div className="pl-2">
        <div className="font-bold text-[0.95rem] text-gray-900">
          {proj.content.name}
        </div>
        {proj.content.description && (
          <p className="italic text-[0.9rem] text-gray-800">
            {proj.content.description}
          </p>
        )}
        {bullets.length > 0 && (
          <ul className="list-disc pl-5 text-[0.88rem] text-gray-800 mt-2">
            {bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const textContent =
    (item.content.text as string) ||
    (item.content.description as string) ||
    "";

  if (textContent) {
    return <p className="italic text-[0.9rem] text-gray-800">{textContent}</p>;
  }

  return null;
}
