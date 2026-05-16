"use client";

import {
  ResumeContent,
  ResumeSection,
  SectionItem,
  ExperienceItem,
  SkillsItem,
} from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

const splitName = (fullName?: string) => {
  const name = (fullName || "").trim();
  if (!name) {
    return { first: "Your", last: "Name" };
  }
  const parts = name.split(/\s+/);
  const first = parts.shift() || name;
  const last = parts.join(" ");
  return { first, last };
};

const resolveLevelPercent = (level?: string) => {
  const value = (level || "").trim();
  const match = value.match(/(\d{1,3})%/);
  if (match) {
    const percent = Number(match[1]);
    return Number.isNaN(percent) ? 75 : Math.max(0, Math.min(percent, 100));
  }
  switch (value.toLowerCase()) {
    case "perfectly":
      return 100;
    case "very good":
      return 85;
    case "good":
      return 70;
    case "normal":
      return 55;
    default:
      return 80;
  }
};

const formatDateRange = (start?: string, end?: string) => {
  const safeStart = (start || "").trim();
  const safeEnd = (end || "").trim();
  if (!safeStart && !safeEnd) return "";
  if (safeStart && safeEnd) return `${safeStart} - ${safeEnd}`;
  return safeStart || safeEnd;
};

const getSkillItems = (sections: ResumeSection[], type: "skills" | "languages") => {
  const section = sections.find((item) => item.type === type);
  if (!section) return [];
  return section.items.flatMap((item) => {
    const skillsItem = item as SkillsItem;
    const skills = Array.isArray(skillsItem.content.skills)
      ? skillsItem.content.skills
      : [];
    return skills.map((skill: any) => ({
      name: typeof skill === "string" ? skill : skill.name,
      level: typeof skill === "string" ? "Very good" : skill.level,
    }));
  });
};

export function TechProfessional({ content }: TemplateProps) {
  const { header, sections } = content;
  const { first, last } = splitName(header.fullName);

  const summarySection = sections.find((section) => section.type === "summary");
  const summaryText = summarySection?.items
    .map((item) => (item.content.text as string) || "")
    .filter(Boolean)
    .join(" ");

  const experienceSection = sections.find(
    (section) => section.type === "experience"
  );
  const experienceItems = (experienceSection?.items || []) as ExperienceItem[];

  const skills = getSkillItems(sections, "skills");
  const languages = getSkillItems(sections, "languages");

  return (
    <div
      className="w-full h-full bg-white text-[#1a1a1a]"
      style={{ fontFamily: '"Montserrat", "Helvetica Neue", Arial, sans-serif' }}
    >
      <div className="h-full w-full">
        <header className="mb-6">
          <h1 className="text-[3.1rem] leading-[1.05] font-bold tracking-widest uppercase text-gray-900">
            {first}
            {last && (
              <>
                <br />
                {last}
              </>
            )}
          </h1>
          {header.title && (
            <p className="text-lg text-gray-500 mt-4 tracking-wide">
              {header.title}
            </p>
          )}
        </header>

        <div className="w-full h-px bg-gray-300 mb-8" />

        <div className="flex gap-10">
          <div className="w-[32%] flex-shrink-0 border-r border-gray-300 pr-8">
            <section className="mb-10">
              <h2 className="text-[1.05rem] font-bold tracking-widest uppercase text-gray-900">
                Info
              </h2>
              <div className="h-[2px] w-6 bg-gray-900 mt-2 mb-5" />

              {header.location && (
                <div className="mb-5">
                  <h3 className="text-[0.72rem] font-bold tracking-wider mb-1.5 text-gray-900 uppercase">
                    Address
                  </h3>
                  <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                    {header.location}
                  </p>
                </div>
              )}

              {header.phone && (
                <div className="mb-5">
                  <h3 className="text-[0.72rem] font-bold tracking-wider mb-1.5 text-gray-900 uppercase">
                    Phone
                  </h3>
                  <p className="text-[0.85rem] text-gray-600 leading-relaxed">
                    {header.phone}
                  </p>
                </div>
              )}

              {header.email && (
                <div className="mb-5">
                  <h3 className="text-[0.72rem] font-bold tracking-wider mb-1.5 text-gray-900 uppercase">
                    Email
                  </h3>
                  <p className="text-[0.85rem] text-gray-600 leading-relaxed break-all">
                    {header.email}
                  </p>
                </div>
              )}
            </section>

            {skills.length > 0 && (
              <section className="mb-10 mt-12">
                <h2 className="text-[1.05rem] font-bold tracking-widest uppercase text-gray-900">
                  Skills
                </h2>
                <div className="h-[2px] w-6 bg-gray-900 mt-2 mb-5" />
                {skills.map((skill, index) => (
                  <div key={`${skill.name}-${index}`} className="mb-4">
                    <p className="text-[0.85rem] font-semibold mb-1 text-gray-800">
                      {skill.name}
                    </p>
                    <div className="w-full h-[4px] bg-gray-200">
                      <div
                        className="h-full bg-gray-800"
                        style={{ width: `${resolveLevelPercent(skill.level)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}

            {languages.length > 0 && (
              <section className="mb-10 mt-12">
                <h2 className="text-[1.05rem] font-bold tracking-widest uppercase text-gray-900">
                  Languages
                </h2>
                <div className="h-[2px] w-6 bg-gray-900 mt-2 mb-5" />
                {languages.map((lang, index) => (
                  <div key={`${lang.name}-${index}`} className="mb-4">
                    <p className="text-[0.85rem] font-semibold mb-1 text-gray-800">
                      {lang.name}
                    </p>
                    <div className="w-full h-[4px] bg-gray-200">
                      <div
                        className="h-full bg-gray-800"
                        style={{ width: `${resolveLevelPercent(lang.level)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div className="flex-1 pl-2">
            {summaryText && (
              <section className="mb-8">
                <h2 className="text-[1.05rem] font-bold tracking-widest uppercase mb-4 text-gray-900">
                  Profile
                </h2>
                <div className="h-[2px] w-6 bg-gray-900 mb-4" />
                <p
                  className="text-[0.85rem] text-gray-600 leading-[1.75] font-medium pr-4"
                  style={{ textAlign: "justify", textJustify: "inter-word" }}
                >
                  {summaryText}
                </p>
              </section>
            )}

            {experienceItems.length > 0 && (
              <section>
                <h2 className="text-[1.05rem] font-bold tracking-widest uppercase mb-4 text-gray-900">
                  Employment History
                </h2>
                <div className="h-[2px] w-6 bg-gray-900 mb-4" />

                <div className="space-y-6">
                  {experienceItems.map((item) => (
                    <div key={item.id}>
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-[0.95rem] font-bold text-gray-900">
                          {item.content.position}
                          {item.content.company
                            ? `, ${item.content.company}`
                            : ""}
                        </h3>
                        <span className="text-[0.78rem] text-gray-500">
                          {item.content.location || ""}
                        </span>
                      </div>
                      <p className="text-[0.78rem] text-gray-500 mt-1">
                        {formatDateRange(
                          item.content.startDate,
                          item.content.endDate
                        )}
                      </p>
                      {item.content.bullets?.length ? (
                        <ul className="mt-3 space-y-1 text-[0.85rem] text-gray-600">
                          {item.content.bullets.map((bullet, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="mt-[5px] size-1.5 rounded-full bg-gray-700" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
