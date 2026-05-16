"use client";

import {
  ResumeContent,
  ResumeSection,
  ExperienceItem,
  EducationItem,
  SkillsItem,
} from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

const ACCENT = "#3ecfac";

const formatDateRange = (start?: string, end?: string) => {
  const safeStart = (start || "").trim();
  const safeEnd = (end || "").trim();
  if (!safeStart && !safeEnd) return "";
  if (safeStart && safeEnd) return `${safeStart} - ${safeEnd}`;
  return safeStart || safeEnd;
};

const normalizeBarLevel = (level: unknown, max = 6) => {
  if (typeof level === "number") {
    return Math.max(0, Math.min(max, Math.round(level)));
  }
  if (typeof level === "string") {
    const trimmed = level.trim();
    const percentMatch = trimmed.match(/(\d{1,3})%/);
    if (percentMatch) {
      const percent = Math.max(0, Math.min(100, Number(percentMatch[1])));
      return Math.max(1, Math.round((percent / 100) * max));
    }
    const numericMatch = trimmed.match(/\d+/);
    if (numericMatch) {
      return Math.max(1, Math.min(max, Number(numericMatch[0])));
    }
    switch (trimmed.toLowerCase()) {
      case "perfectly":
        return 6;
      case "very good":
        return 5;
      case "good":
        return 4;
      case "normal":
        return 3;
      default:
        return 4;
    }
  }
  return 4;
};

const getSkillList = (sections: ResumeSection[], type: "skills" | "languages") => {
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

const getInitials = (name?: string) => {
  const safe = (name || "").trim();
  if (!safe) return "";
  return safe
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
};

function SkillBar({ level, max = 6 }: { level: number; max?: number }) {
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 4, marginBottom: 10 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 4,
            flex: 1,
            borderRadius: 2,
            background: i < level ? "#222" : "#d8d8d8",
          }}
        />
      ))}
    </div>
  );
}

export function ModernExecutive({ content }: TemplateProps) {
  const { header, sections } = content;
  const summarySection = sections.find((section) => section.type === "summary");
  const summaryText = summarySection?.items
    .map((item) => (item.content.text as string) || "")
    .filter(Boolean)
    .join(" ");

  const experienceSection = sections.find(
    (section) => section.type === "experience"
  );
  const experienceItems = (experienceSection?.items || []) as ExperienceItem[];

  const educationSection = sections.find((section) => section.type === "education");
  const educationItems = (educationSection?.items || []) as EducationItem[];

  const skills = getSkillList(sections, "skills");
  const languages = getSkillList(sections, "languages");

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        width: "100%",
        color: "#222",
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div
          style={{
            width: 200,
            minHeight: 170,
            background: "#c8b99a",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {header.photoUrl ? (
            <img
              src={header.photoUrl}
              alt={header.fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: 170,
                background: "linear-gradient(135deg, #c8b99a 0%, #a8917a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {getInitials(header.fullName)}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            background: ACCENT,
            padding: "28px 32px 20px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              color: "#111",
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            {header.fullName || "Your Name"}
          </div>
          {header.title && (
            <div
              style={{
                fontSize: 18,
                color: "#111",
                fontFamily: "'Arial', sans-serif",
                fontWeight: 400,
                marginTop: 4,
                marginBottom: 18,
              }}
            >
              {header.title}
            </div>
          )}
          <div
            style={{
              fontSize: 13,
              color: "#111",
              fontFamily: "'Arial', sans-serif",
              lineHeight: 1.7,
            }}
          >
            {header.location && <div>{header.location}</div>}
            {(header.phone || header.email) && (
              <div>
                {header.phone && <span>{header.phone}</span>}
                {header.phone && header.email && <span>&nbsp;&nbsp;</span>}
                {header.email && (
                  <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                    {header.email}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: 200,
            flexShrink: 0,
            padding: "28px 20px 28px 20px",
            background: "#fff",
          }}
        >
          {skills.length > 0 && (
            <>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: "'Arial', sans-serif",
                  marginBottom: 12,
                  color: "#111",
                }}
              >
                Skills
              </div>
              {skills.map((skill, index) => (
                <div key={`${skill.name}-${index}`}>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "'Arial', sans-serif",
                      color: "#222",
                      lineHeight: 1.3,
                    }}
                  >
                    {skill.name}
                  </div>
                  <SkillBar level={normalizeBarLevel(skill.level)} />
                </div>
              ))}
            </>
          )}

          {languages.length > 0 && (
            <>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: "'Arial', sans-serif",
                  marginTop: 20,
                  marginBottom: 12,
                  color: "#111",
                }}
              >
                Languages
              </div>
              {languages.map((language, index) => (
                <div key={`${language.name}-${index}`}>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "'Arial', sans-serif",
                      color: "#222",
                    }}
                  >
                    {language.name}
                  </div>
                  <SkillBar level={normalizeBarLevel(language.level)} />
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ flex: 1, padding: "28px 36px 36px 36px" }}>
          {summaryText && (
            <>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  marginBottom: 10,
                  color: "#111",
                }}
              >
                Profile
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  fontFamily: "'Arial', sans-serif",
                  color: "#222",
                  marginBottom: 28,
                }}
              >
                {summaryText}
              </div>
            </>
          )}

          {experienceItems.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  marginBottom: 14,
                  color: "#111",
                }}
              >
                Employment History
              </div>
              {experienceItems.map((job) => (
                <div key={job.id} style={{ marginBottom: 22 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      fontFamily: "'Arial', sans-serif",
                      color: "#111",
                    }}
                  >
                    {job.content.position}
                    {job.content.company ? `, ${job.content.company}` : ""}
                    {job.content.location ? `, ${job.content.location}` : ""}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#444",
                      fontFamily: "'Arial', sans-serif",
                      marginBottom: 7,
                    }}
                  >
                    {formatDateRange(job.content.startDate, job.content.endDate)}
                  </div>
                  {job.content.bullets && job.content.bullets.length > 0 && (
                    <ul
                      style={{
                        margin: "0 0 0 18px",
                        padding: 0,
                        listStyleType: "disc",
                      }}
                    >
                      {job.content.bullets.map((bullet, index) => (
                        <li
                          key={index}
                          style={{
                            fontSize: 13.5,
                            fontFamily: "'Arial', sans-serif",
                            lineHeight: 1.6,
                            color: "#222",
                            marginBottom: 2,
                          }}
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {educationItems.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: "'Arial Black', 'Arial', sans-serif",
                  marginTop: 8,
                  marginBottom: 14,
                  color: "#111",
                }}
              >
                Education
              </div>
              {educationItems.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      fontFamily: "'Arial', sans-serif",
                      color: "#111",
                    }}
                  >
                    {edu.content.degree || ""}
                    {edu.content.institution ? `, ${edu.content.institution}` : ""}
                    {edu.content.location ? `, ${edu.content.location}` : ""}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#444",
                      fontFamily: "'Arial', sans-serif",
                    }}
                  >
                    {formatDateRange(edu.content.startDate, edu.content.endDate)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
