"use client";

import {
  ResumeContent,
  ResumeSection,
  ExperienceItem,
  EducationItem,
  SkillsItem,
  SectionItem,
} from "@/lib/types";

interface TemplateProps {
  content: ResumeContent;
}

const DARK_NAVY = "#0d2137";
const ACCENT_TEAL = "#3bb8c3";
const PAGE_HEIGHT = "297mm";
const PAGE_PADDING_Y = "15mm";
const PAGE_PADDING_X = "12.7mm";
const CONTENT_PADDING_TOP = 36;
const CONTENT_PADDING_X = 40;
const CONTENT_PADDING_BOTTOM = 40;
const AVATAR_SIZE = 80;
const HEADER_BLOCK_GAP = 32;
const SECTION_TITLE_MARGIN_TOP = 8;
const SIDEBAR_PADDING_X = 24;
const PROFILE_SECTION_OFFSET =
  CONTENT_PADDING_TOP + AVATAR_SIZE + HEADER_BLOCK_GAP + SECTION_TITLE_MARGIN_TOP;

const formatDateRange = (start?: string, end?: string) => {
  const safeStart = (start || "").trim();
  const safeEnd = (end || "").trim();
  if (!safeStart && !safeEnd) return "";
  if (safeStart && safeEnd) return `${safeStart} — ${safeEnd}`;
  return safeStart || safeEnd;
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

const getSkills = (sections: ResumeSection[]) => {
  const section = sections.find((item) => item.type === "skills");
  if (!section) return [];
  return section.items.flatMap((item) => {
    const skillsItem = item as SkillsItem;
    const skills = Array.isArray(skillsItem.content.skills)
      ? skillsItem.content.skills
      : [];
    return skills.map((skill: any) =>
      typeof skill === "string" ? skill : skill.name
    );
  });
};

const getReferences = (sections: ResumeSection[]) => {
  const section = sections.find((item) =>
    item.title?.toLowerCase().includes("reference")
  );
  if (!section) return "";
  const lines = section.items
    .map((item: SectionItem) =>
      (item.content.text as string) ||
      (item.content.description as string) ||
      (item.content.title as string) ||
      ""
    )
    .filter(Boolean);
  return lines.join(" ");
};

const splitAddress = (location?: string) => {
  if (!location) return [];
  return location
    .split(/\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);
};

export function Sydney({ content }: TemplateProps) {
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

  const skills = getSkills(sections).filter(Boolean);
  const references = getReferences(sections);
  const addressLines = splitAddress(header.location);

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        display: "flex",
        width: "100%",
        minHeight: PAGE_HEIGHT,
        background: "#fff",
        color: "#222",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: `${CONTENT_PADDING_TOP}px ${CONTENT_PADDING_X}px ${CONTENT_PADDING_BOTTOM}px ${CONTENT_PADDING_X}px`,
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: HEADER_BLOCK_GAP,
          }}
        >
          <div
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: "#b0a090",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "Arial",
            }}
          >
            {header.photoUrl ? (
              <img
                src={header.photoUrl}
                alt={header.fullName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              getInitials(header.fullName)
            )}
          </div>
          <div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                fontFamily: "'Arial', sans-serif",
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
                  fontSize: 12,
                  letterSpacing: 2.5,
                  color: "#444",
                  fontFamily: "'Arial', sans-serif",
                  marginTop: 5,
                  textTransform: "uppercase",
                }}
              >
                {header.title}
              </div>
            )}
          </div>
        </div>

        {summaryText && (
          <>
            <SectionTitle>Profile</SectionTitle>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.75,
                color: "#222",
                fontFamily: "'Arial', sans-serif",
                marginBottom: 30,
                marginTop: 8,
              }}
            >
              {summaryText}
            </p>
          </>
        )}

        {experienceItems.length > 0 && (
          <>
            <SectionTitle>Employment History</SectionTitle>
            {experienceItems.map((job) => (
              <div key={job.id} style={{ marginBottom: 24, marginTop: 12 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    fontFamily: "'Arial', sans-serif",
                    color: "#111",
                    marginBottom: 3,
                  }}
                >
                  {job.content.position}
                  {job.content.company ? `, ${job.content.company}` : ""}
                  {job.content.location ? `, ${job.content.location}` : ""}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.8,
                    color: "#888",
                    fontFamily: "'Arial', sans-serif",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {formatDateRange(job.content.startDate, job.content.endDate)}
                </div>
                {job.content.bullets && job.content.bullets.length > 0 && (
                  <ul style={{ margin: "0 0 0 20px", padding: 0 }}>
                    {job.content.bullets.map((bullet, index) => (
                      <li
                        key={index}
                        style={{
                          fontSize: 13.5,
                          lineHeight: 1.65,
                          color: "#222",
                          fontFamily: "'Arial', sans-serif",
                          marginBottom: 3,
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
            <SectionTitle>Education</SectionTitle>
            {educationItems.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 18, marginTop: 12 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    fontFamily: "'Arial', sans-serif",
                    color: "#111",
                    marginBottom: 3,
                  }}
                >
                  {edu.content.degree}
                  {edu.content.institution ? `, ${edu.content.institution}` : ""}
                  {edu.content.location ? `, ${edu.content.location}` : ""}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.8,
                    color: "#888",
                    fontFamily: "'Arial', sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  {formatDateRange(edu.content.startDate, edu.content.endDate)}
                </div>
              </div>
            ))}
          </>
        )}

        {references && (
          <>
            <SectionTitle>References</SectionTitle>
            <p
              style={{
                fontSize: 13.5,
                color: "#222",
                fontFamily: "'Arial', sans-serif",
                marginTop: 8,
              }}
            >
              {references}
            </p>
          </>
        )}
      </div>

      <div
        style={{
          width: 240,
          flexShrink: 0,
          background: DARK_NAVY,
          paddingTop: `calc(${PAGE_PADDING_Y} + ${PROFILE_SECTION_OFFSET}px)`,
          paddingBottom: 40,
          marginTop: `-${PAGE_PADDING_Y}`,
          marginBottom: `-${PAGE_PADDING_Y}`,
          transform: `translateX(${PAGE_PADDING_X})`,
          minHeight: `calc(${PAGE_HEIGHT} + ${PAGE_PADDING_Y} + ${PAGE_PADDING_Y})`,
        }}
      >
        <div style={{ padding: `0 ${SIDEBAR_PADDING_X}px` }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: ACCENT_TEAL,
              fontFamily: "'Arial', sans-serif",
              marginBottom: 14,
            }}
          >
            Details
          </div>
          {addressLines.map((line, index) => (
            <div
              key={index}
              style={{
                fontSize: 12.5,
                color: "#ffffff",
                fontFamily: "'Arial', sans-serif",
                lineHeight: 1.7,
              }}
            >
              {line}
            </div>
          ))}
          {header.phone && (
            <div
              style={{
                fontSize: 12.5,
                color: "#ffffff",
                fontFamily: "'Arial', sans-serif",
                lineHeight: 1.7,
                marginTop: addressLines.length > 0 ? 4 : 0,
              }}
            >
              {header.phone}
            </div>
          )}
          {header.email && (
            <div
              style={{
                fontSize: 12.5,
                color: "#ffffff",
                fontFamily: "'Arial', sans-serif",
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: 2,
              }}
            >
              {header.email}
            </div>
          )}

          {skills.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: ACCENT_TEAL,
                  fontFamily: "'Arial', sans-serif",
                  marginTop: 32,
                  marginBottom: 14,
                }}
              >
                Skills
              </div>
              {skills.map((skill, index) => (
                <div key={`${skill}-${index}`} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#ffffff",
                      fontFamily: "'Arial', sans-serif",
                      marginBottom: 5,
                    }}
                  >
                    {skill}
                  </div>
                  <div
                    style={{
                      height: 3,
                      background: "#ffffff",
                      borderRadius: 1,
                      width: "100%",
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 22,
        fontWeight: 400,
        fontFamily: "'Georgia', serif",
        color: "#111",
        borderBottom: "2px solid #111",
        paddingBottom: 4,
        marginBottom: 2,
        marginTop: SECTION_TITLE_MARGIN_TOP,
      }}
    >
      {children}
    </div>
  );
}
