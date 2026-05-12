// ============================================
// VITAE — Core Type Definitions
// ============================================

// Resume Content Schema (stored as JSON in Prisma)
export interface ResumeContent {
  header: ResumeHeader;
  sections: ResumeSection[];
}

export interface ResumeHeader {
  fullName: string;
  title?: string;
  photoUrl?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  birthDate?: string;
  birthPlace?: string;
  maritalStatus?: string;
  nationality?: string;
  gender?: string;
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  items: SectionItem[];
}

export type SectionType =
  | "summary"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "awards"
  | "leadership"
  | "languages"
  | "hobbies"
  | "custom";

export interface SectionItem {
  id: string;
  content: Record<string, any>;
}

// Specific section item types
export interface ExperienceItem extends SectionItem {
  content: {
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  };
}

export interface EducationItem extends SectionItem {
  content: {
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    honors?: string;
    bullets: string[];
  };
}

export interface ProjectItem extends SectionItem {
  content: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    bullets: string[];
  };
}

export interface Skill {
  name: string;
  level: string;
}

export interface SkillsItem extends SectionItem {
  content: {
    category: string;
    skills: Skill[];
  };
}

// AI Types
export interface AIGenerateRequest {
  jobTitle: string;
  experience: string;
  skills: string[];
  education: string;
  targetJobDescription?: string;
  tone: ResumeTone;
}

export interface AIScoreResult {
  overall: number;
  atsCompatibility: number;
  keywordMatch: number;
  readability: number;
  formatting: number;
  recruiterFriendliness: number;
  suggestions: string[];
  missingSkills: string[];
}

export interface AIRewriteRequest {
  bullet: string;
  context: string;
  tone: ResumeTone;
}

export interface AIJobMatchResult {
  compatibility: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

export type ResumeTone =
  | "CORPORATE"
  | "STARTUP"
  | "CREATIVE"
  | "EXECUTIVE"
  | "MINIMALIST";

export type TemplateCategory =
  | "CLASSIC_HARVARD"
  | "CONSULTING_ELITE"
  | "INVESTMENT_BANKING"
  | "MODERN_EXECUTIVE"
  | "TECH_PROFESSIONAL"
  | "LONDON_LUXURY";

// Template definition
export interface TemplateDefinition {
  id: string;
  name: string;
  slug: string;
  category: TemplateCategory;
  description: string;
  previewUrl: string;
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    primary: string;
    text: string;
    accent: string;
    divider: string;
  };
  spacing: {
    margin: string;
    sectionGap: string;
    itemGap: string;
  };
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}
