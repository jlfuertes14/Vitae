// ============================================
// VITAE — Application Constants
// ============================================

import type { SectionType } from "@/lib/types";

export const APP_NAME = "Vitae";
export const APP_DESCRIPTION = "Harvard-style resumes powered by AI. 100% free.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// AI Model Configuration (Groq)
export const AI_MODELS = {
  generation: "meta-llama/llama-4-maverick-17b-128e-instruct",
  rewrite: "meta-llama/llama-4-scout-17b-16e-instruct",
  scoring: "meta-llama/llama-4-maverick-17b-128e-instruct",
  chat: "meta-llama/llama-4-scout-17b-16e-instruct",
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  ai: { requests: 20, window: "1m" },
  export: { requests: 10, window: "1m" },
  general: { requests: 100, window: "1m" },
} as const;

// Resume Defaults
export const DEFAULT_RESUME_SECTIONS = [
  { type: "summary", title: "Professional Summary" },
  { type: "education", title: "Education" },
  { type: "experience", title: "Experience" },
  { type: "leadership", title: "Leadership & Activities" },
  { type: "projects", title: "Projects" },
  { type: "skills", title: "Skills" },
  { type: "certifications", title: "Certifications" },
  { type: "languages", title: "Languages" },
  { type: "hobbies", title: "Hobbies" },
] as const;

// Tone Labels
export const TONE_LABELS = {
  CORPORATE: "Corporate",
  STARTUP: "Modern Startup",
  CREATIVE: "Creative",
  EXECUTIVE: "Executive",
  MINIMALIST: "Minimalist",
} as const;

// Template Labels
export const TEMPLATE_LABELS = {
  CLASSIC_HARVARD: "Classic Harvard",
  CONSULTING_ELITE: "Consulting Elite",
  INVESTMENT_BANKING: "Investment Banking",
  MODERN_EXECUTIVE: "Modern Executive",
  TECH_PROFESSIONAL: "Tech Professional",
  LONDON_LUXURY: "London Luxury",
} as const;

// Navigation Items
export const DASHBOARD_NAV = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Resumes", href: "/resumes", icon: "FileText" },
  { label: "Templates", href: "/templates", icon: "Palette" },
  { label: "Import", href: "/import", icon: "UploadCloud" },
  { label: "Cover Letters", href: "/cover-letters", icon: "Mail" },
  { label: "Job Match", href: "/job-match", icon: "Target" },
] as const;

export const DASHBOARD_NAV_BOTTOM = [
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const TEMPLATES: { id: string; name: string; description: string; category: string; previewUrl: string }[] = [
  {
    id: "london-luxury",
    name: "London",
    description: "A professional, double-column layout with a bold sidebar. Perfect for corporate roles.",
    category: "Modern",
    previewUrl: "https://resume.io/assets/templates/london-bd8262b0.jpg",
  },
  {
    id: "harvard-classic",
    name: "Harvard Classic",
    description: "Prestigious blue-accented design with a profile photo. Replicated for high-end professional applications.",
    category: "Classic",
    previewUrl: "https://resume.io/assets/templates/helsinki-ca1d2b7f.jpg", // Using Helsinki as a placeholder for classic
  },
  {
    id: "consulting-elite",
    name: "Santiago",
    description: "Elegant and modern with a focus on hierarchy and readability.",
    category: "Professional",
    previewUrl: "https://resume.io/assets/templates/santiago-e9da5710.jpg",
  },
  {
    id: "tech-professional",
    name: "Berlin",
    description: "Clean, efficient layout for software engineers and designers.",
    category: "Creative",
    previewUrl: "https://resume.io/assets/templates/berlin-37dd67af.jpg",
  },
  {
    id: "modern-executive",
    name: "Vienna",
    description: "Bold headings and efficient use of space for senior leadership.",
    category: "Executive",
    previewUrl: "https://s3.resume.io/uploads/local_template_image/image/406/persistent-resource/vienna-resume-templates.jpg?v=1656070334",
  },
];

export const ALL_SECTION_TYPES: SectionType[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "leadership",
  "awards",
  "certifications",
  "languages",
  "hobbies",
  "custom",
];

export const TEMPLATE_SECTION_CAPABILITIES: Record<string, SectionType[]> = {
  "harvard-classic": [
    "summary",
    "experience",
    "education",
    "skills",
    "languages",
    "awards",
    "certifications",
    "custom",
  ],
  "consulting-elite": ["summary", "experience", "education", "skills", "projects"],
  "investment-banking": ["summary", "experience", "education", "skills"],
  "modern-executive": ["summary", "experience", "education", "skills", "projects"],
  "tech-professional": ["summary", "experience", "education", "skills", "projects"],
  "london-luxury": [
    "summary",
    "experience",
    "education",
    "skills",
    "languages",
    "hobbies",
  ],
};

export const OPEN_ROUTER_FREE_MODEL_PREFIXES = [
  "deepseek/",
  "nvidia/nemotron",
  "google/gemma",
  "minimax/",
  "openai/gpt-oss",
  "qwen/",
  "meta-llama/",
  "nousresearch/",
  "arcee-ai/",
];
