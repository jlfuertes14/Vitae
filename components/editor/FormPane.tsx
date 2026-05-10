"use client";

import { useResumeStore } from "@/lib/store/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSection } from "./SortableSection";

export function FormPane() {
  const { content, setHeader, reorderSections } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = content.sections.findIndex((s) => s.id === active.id);
      const newIndex = content.sections.findIndex((s) => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-6 space-y-8 pb-24">
        {/* Personal Details Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight font-heading">Personal Details</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Provide your contact information. Keep it professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={content.header.fullName}
                onChange={(e) => setHeader({ fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={content.header.email}
                onChange={(e) => setHeader({ email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={content.header.phone || ""}
                onChange={(e) => setHeader({ phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="New York, NY"
                value={content.header.location || ""}
                onChange={(e) => setHeader({ location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/johndoe"
                value={content.header.linkedin || ""}
                onChange={(e) => setHeader({ linkedin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                placeholder="github.com/johndoe"
                value={content.header.github || ""}
                onChange={(e) => setHeader({ github: e.target.value })}
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* Dynamic Sections using dnd-kit */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight font-heading">Resume Sections</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag to reorder sections. Click to edit contents.
            </p>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {content.sections.map((section) => (
                  <SortableSection key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      </div>
    </ScrollArea>
  );
}
