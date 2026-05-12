import { create } from "zustand";
import { ResumeContent, ResumeHeader, ResumeSection, SectionItem } from "@/lib/types";

interface ResumeState {
  // Data
  content: ResumeContent;
  templateId: string;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  
  // Actions
  setTemplate: (id: string) => void;
  setHeader: (header: Partial<ResumeHeader>) => void;
  updateSection: (sectionId: string, updates: Partial<ResumeSection>) => void;
  addSectionItem: (sectionId: string, item: SectionItem) => void;
  updateSectionItem: (sectionId: string, itemId: string, itemUpdates: Partial<SectionItem["content"]>) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  reorderSectionItems: (sectionId: string, startIndex: number, endIndex: number) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  addSection: (section: ResumeSection) => void;
  removeSection: (sectionId: string) => void;
  
  // Save State Management
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

const initialContent: ResumeContent = {
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
};

export const useResumeStore = create<ResumeState>()((set) => ({
  content: initialContent,
  templateId: "harvard-classic",
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  setTemplate: (id) => set({ templateId: id, isDirty: true }),

  setHeader: (headerUpdates) =>
    set((state) => ({
      content: {
        ...state.content,
        header: { ...state.content.header, ...headerUpdates },
      },
      isDirty: true,
    })),

  updateSection: (sectionId, updates) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: state.content.sections.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
      },
      isDirty: true,
    })),

  addSectionItem: (sectionId, item) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: state.content.sections.map((section) =>
          section.id === sectionId
            ? { ...section, items: [...section.items, item] }
            : section
        ),
      },
      isDirty: true,
    })),

  updateSectionItem: (sectionId, itemId, itemUpdates) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: state.content.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === itemId
                    ? { ...item, content: { ...item.content, ...itemUpdates } as SectionItem["content"] }
                    : item
                ),
              }
            : section
        ),
      },
      isDirty: true,
    })),

  removeSectionItem: (sectionId, itemId) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: state.content.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.filter((item) => item.id !== itemId),
              }
            : section
        ),
      },
      isDirty: true,
    })),

  reorderSectionItems: (sectionId, startIndex, endIndex) =>
    set((state) => {
      const newSections = state.content.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const items = Array.from(section.items);
        const [reorderedItem] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, reorderedItem);
        return { ...section, items };
      });
      return {
        content: { ...state.content, sections: newSections },
        isDirty: true,
      };
    }),

  reorderSections: (startIndex, endIndex) =>
    set((state) => {
      const sections = Array.from(state.content.sections);
      const [reorderedSection] = sections.splice(startIndex, 1);
      sections.splice(endIndex, 0, reorderedSection);
      return {
        content: { ...state.content, sections },
        isDirty: true,
      };
    }),

  addSection: (newSection) =>
    set((state) => {
      if (state.content.sections.some(s => s.id === newSection.id)) return state;
      return {
        content: {
          ...state.content,
          sections: [...state.content.sections, newSection],
        },
        isDirty: true,
      };
    }),

  removeSection: (sectionId) =>
    set((state) => ({
      content: {
        ...state.content,
        sections: state.content.sections.filter(s => s.id !== sectionId),
      },
      isDirty: true,
    })),

  setSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSavedAt: date, isDirty: false }),
}));
