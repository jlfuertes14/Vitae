import type { ResumeContent } from "@/lib/types";

export const createInitialResumeContent = (): ResumeContent => ({
  header: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    github: "",
  },
  sections: [
    {
      id: "summary",
      type: "summary",
      title: "Professional Summary",
      visible: true,
      items: [{ id: "summary-1", content: { text: "" } }],
    },
    {
      id: "experience",
      type: "experience",
      title: "Professional Experience",
      visible: true,
      items: [],
    },
    {
      id: "education",
      type: "education",
      title: "Education",
      visible: true,
      items: [],
    },
    {
      id: "skills",
      type: "skills",
      title: "Skills & Expertise",
      visible: true,
      items: [],
    },
  ],
});

export const getResumeTitle = (
  content: ResumeContent,
  fallback = "Untitled Resume"
) => {
  const fullName = content.header.fullName?.trim();
  return fullName ? `${fullName} Resume` : fallback;
};
