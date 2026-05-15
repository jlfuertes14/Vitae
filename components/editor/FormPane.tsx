"use client";

import { useResumeStore } from "@/lib/store/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
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
import { Plus, Camera } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DEFAULT_RESUME_SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FormPane() {
  const { content, setHeader, reorderSections, addSection } = useResumeStore();

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
            <div className="space-y-2 col-span-2">
              <Label htmlFor="photoUrl">Profile Photo URL</Label>
              <div className="relative">
                <Input
                  id="photoUrl"
                  placeholder="https://example.com/photo.jpg"
                  value={content.header.photoUrl || ""}
                  onChange={(e) => setHeader({ photoUrl: e.target.value })}
                  className="pl-10"
                />
                <Camera className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
              </div>
            </div>
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
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                placeholder="Accountant"
                value={content.header.title || ""}
                onChange={(e) => setHeader({ title: e.target.value })}
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
              <Label htmlFor="location">Location / Address</Label>
              <Input
                id="location"
                placeholder="Budennovskij, 35, Rostov-on-Don"
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
          </div>

          <Separator className="bg-white/5" />
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">Personal Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date of Birth</Label>
                <Input
                  id="birthDate"
                  placeholder="04/07/1969"
                  value={content.header.birthDate || ""}
                  onChange={(e) => setHeader({ birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Input
                  id="maritalStatus"
                  placeholder="Married"
                  value={content.header.maritalStatus || ""}
                  onChange={(e) => setHeader({ maritalStatus: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  placeholder="Russian"
                  value={content.header.nationality || ""}
                  onChange={(e) => setHeader({ nationality: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  placeholder="Male"
                  value={content.header.gender || ""}
                  onChange={(e) => setHeader({ gender: e.target.value })}
                />
              </div>
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

          <div className="pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 h-12 rounded-2xl gap-2 text-white/50 hover:text-white transition-all"
                )}
              >
                <Plus className="size-4" />
                Add New Section
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0f0f0f] border-white/10 text-white">
                {DEFAULT_RESUME_SECTIONS.filter(s => !content.sections.some(existing => existing.type === s.type)).map((section) => (
                  <DropdownMenuItem 
                    key={section.type}
                    className="hover:bg-white/5 cursor-pointer py-2.5 rounded-lg"
                    onClick={() => addSection({
                      id: section.type,
                      type: section.type as any,
                      title: section.title,
                      visible: true,
                      items: []
                    })}
                  >
                    <Plus className="size-3.5 mr-2 opacity-50" />
                    {section.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="hover:bg-white/5 cursor-pointer py-2.5 rounded-lg border-t border-white/5 mt-1">
                  <Plus className="size-3.5 mr-2 opacity-50" />
                  Custom Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
