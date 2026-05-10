"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeSection } from "@/lib/types";
import { useResumeStore } from "@/lib/store/resume-store";
import { useState } from "react";
import { SectionItemEditor } from "./SectionItemEditor";

interface SortableSectionProps {
  section: ResumeSection;
}

export function SortableSection({ section }: SortableSectionProps) {
  const { updateSection, addSectionItem } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection(section.id, { visible: !section.visible });
  };

  const handleAddItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
    addSectionItem(section.id, {
      id: `item-${Date.now()}`,
      content: section.type === "experience" ? {
        company: "New Company", position: "Role", location: "", startDate: "", endDate: "", bullets: [""]
      } : {}
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 ${
        isDragging ? "ring-2 ring-primary border-transparent" : "border-border"
      }`}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="size-5" />
        </div>
        
        <div className="flex-1 font-semibold text-sm">
          {section.title}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={toggleVisibility}
            title={section.visible ? "Hide section" : "Show section"}
          >
            {section.visible ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4 text-muted-foreground" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Expanded Content Editor */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-border mt-1">
          <div className="space-y-4 mt-3">
            {section.items.map((item) => (
              <SectionItemEditor key={item.id} sectionId={section.id} type={section.type} item={item} />
            ))}
            
            {section.type !== "summary" && (
              <Button variant="outline" size="sm" className="w-full border-dashed" onClick={handleAddItem}>
                <Plus className="size-3 mr-2" /> Add {section.title} Item
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
