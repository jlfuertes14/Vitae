"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/resume-store";
import { SectionItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Sparkles, Trash2, Plus, GripVertical, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionItemEditor({ sectionId, type, item }: { sectionId: string, type: string, item: SectionItem }) {
  const { updateSectionItem, removeSectionItem } = useResumeStore();

  const handleUpdate = (updates: Partial<SectionItem["content"]>) => {
    updateSectionItem(sectionId, item.id, updates);
  };

  const handleRewrite = async (index: number, currentText: string) => {
    if (!currentText.trim()) return;
    
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, tone: "Professional", context: type }),
      });
      const data = await res.json();
      if (data.result) {
        if (Array.isArray(item.content.bullets)) {
          const newBullets = [...(item.content.bullets as string[])];
          newBullets[index] = data.result;
          handleUpdate({ bullets: newBullets });
        } else if (typeof item.content.text === "string") {
          handleUpdate({ text: data.result });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addBullet = () => {
    const bullets = [...(item.content.bullets as string[] || []), ""];
    handleUpdate({ bullets });
  };

  const updateBullet = (index: number, value: string) => {
    const bullets = [...(item.content.bullets as string[] || [])];
    bullets[index] = value;
    handleUpdate({ bullets });
  };

  const removeBullet = (index: number) => {
    const bullets = [...(item.content.bullets as string[] || [])];
    bullets.splice(index, 1);
    handleUpdate({ bullets });
  };

  // 1. PROFESSIONAL SUMMARY
  if (type === "summary") {
    return (
      <div className="space-y-3 p-1">
        <div className="flex items-center justify-between">
           <Label className="text-xs font-bold uppercase tracking-widest text-white/40">Professional Narrative</Label>
           <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-[10px] text-emerald-500 hover:text-emerald-400 gap-1.5"
            onClick={() => handleRewrite(0, item.content.text as string || "")}
           >
              <Sparkles className="size-3" />
              AI Optimize
           </Button>
        </div>
        <Textarea 
          value={item.content.text as string || ""} 
          onChange={(e) => handleUpdate({ text: e.target.value })} 
          placeholder="A briefly summary of your career achievements and goals..."
          className="min-h-[140px] bg-white/[0.03] border-white/10 rounded-2xl p-4 text-sm leading-relaxed text-white/80 focus-visible:ring-emerald-500/20"
        />
      </div>
    );
  }

  // 2. EXPERIENCE & PROJECTS (Bullet-based)
  if (type === "experience" || type === "projects" || type === "leadership") {
    const isExperience = type === "experience";
    return (
      <div className="p-5 bg-white/[0.03] border border-white/10 rounded-[24px] space-y-5 mb-4 relative group transition-all hover:bg-white/[0.05]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => removeSectionItem(sectionId, item.id)}
        >
          <Trash2 className="size-4" />
        </Button>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{isExperience ? "Job Title" : "Project Name"}</Label>
            <Input 
              value={(isExperience ? item.content.position : item.content.name) as string || ""} 
              onChange={(e) => handleUpdate({ [isExperience ? "position" : "name"]: e.target.value })} 
              placeholder={isExperience ? "Software Engineer" : "E-commerce Platform"}
              className="bg-black/20 border-white/5 rounded-xl h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{isExperience ? "Company" : "Link (Optional)"}</Label>
            <Input 
              value={(isExperience ? item.content.company : item.content.url) as string || ""} 
              onChange={(e) => handleUpdate({ [isExperience ? "company" : "url"]: e.target.value })} 
              placeholder={isExperience ? "Google" : "github.com/..."}
              className="bg-black/20 border-white/5 rounded-xl h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Location</Label>
            <Input value={item.content.location as string || ""} onChange={(e) => handleUpdate({ location: e.target.value })} placeholder="Remote" className="bg-black/20 border-white/5 rounded-xl h-10" />
          </div>
          <div className="flex gap-2">
            <div className="space-y-1.5 flex-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Start</Label>
              <Input value={item.content.startDate as string || ""} onChange={(e) => handleUpdate({ startDate: e.target.value })} placeholder="2022" className="bg-black/20 border-white/5 rounded-xl h-10" />
            </div>
            <div className="space-y-1.5 flex-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">End</Label>
              <Input value={item.content.endDate as string || ""} onChange={(e) => handleUpdate({ endDate: e.target.value })} placeholder="Present" className="bg-black/20 border-white/5 rounded-xl h-10" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Key Accomplishments</Label>
          </div>
          
          <div className="space-y-3">
            {(item.content.bullets as string[] || []).map((bullet, i) => (
              <div key={i} className="flex items-start gap-2 group/bullet">
                <GripVertical className="size-4 text-white/10 mt-3 cursor-grab hover:text-white/30 transition-colors" />
                <div className="flex-1 relative">
                  <Textarea 
                    value={bullet} 
                    onChange={(e) => updateBullet(i, e.target.value)} 
                    className="min-h-[70px] text-sm pr-10 bg-black/40 border-white/10 rounded-xl leading-relaxed text-white/70" 
                    placeholder="Describe a significant impact or result..."
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-2 top-2 size-7 text-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg"
                    onClick={() => handleRewrite(i, bullet)}
                    title="AI Rewrite"
                  >
                    <Sparkles className="size-3.5" />
                  </Button>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="mt-1.5 size-8 opacity-0 group-hover/bullet:opacity-100 text-white/10 hover:text-red-400" 
                  onClick={() => removeBullet(i)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full h-10 text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5 border border-dashed border-white/10 rounded-xl" onClick={addBullet}>
            <Plus className="size-3 mr-2" /> Add Achievement
          </Button>
        </div>
      </div>
    );
  }

  // 3. EDUCATION
  if (type === "education") {
    const isBasicEducation = (item.content.level === "Junior High School" || item.content.level === "Elementary");
    
    return (
      <div className="p-5 bg-white/[0.03] border border-white/10 rounded-[24px] space-y-5 mb-4 relative group transition-all hover:bg-white/[0.05]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => removeSectionItem(sectionId, item.id)}
        >
          <Trash2 className="size-4" />
        </Button>
        
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Level</Label>
                <Select 
                  value={item.content.level as string || "Tertiary"} 
                  onValueChange={(value) => handleUpdate({ level: value })}
                >
                  <SelectTrigger className="w-full bg-black/20 border-white/5 rounded-xl h-10 px-3 text-sm text-white focus:ring-emerald-500/50">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    <SelectItem value="Tertiary">Tertiary</SelectItem>
                    <SelectItem value="Senior High School">Senior High School</SelectItem>
                    <SelectItem value="Junior High School">Junior High School</SelectItem>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">School Name</Label>
                <Input 
                  value={item.content.institution as string || ""} 
                  onChange={(e) => handleUpdate({ institution: e.target.value })} 
                  placeholder="Institution Name"
                  className="bg-black/20 border-white/5 rounded-xl h-10"
                />
              </div>
           </div>

           <div className={cn("grid gap-4", isBasicEducation ? "grid-cols-2" : "grid-cols-2")}>
              {!isBasicEducation && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    {item.content.level === "Senior High School" ? "Strand" : "Degree / Course"}
                  </Label>
                  <Input 
                    value={item.content.degree as string || ""} 
                    onChange={(e) => handleUpdate({ degree: e.target.value })} 
                    placeholder={item.content.level === "Senior High School" ? "STEM / ABM" : "B.S. Information Technology"}
                    className="bg-black/20 border-white/5 rounded-xl h-10"
                  />
                </div>
              )}
              
              <div className={cn("space-y-1.5", isBasicEducation && "col-span-2")}>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Location</Label>
                <Input value={item.content.location as string || ""} onChange={(e) => handleUpdate({ location: e.target.value })} placeholder="City, Country" className="bg-black/20 border-white/5 rounded-xl h-10" />
              </div>

              <div className="flex gap-2 col-span-2">
                <div className="space-y-1.5 flex-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Start Year</Label>
                  <Input value={item.content.startDate as string || ""} onChange={(e) => handleUpdate({ startDate: e.target.value })} placeholder="2018" className="bg-black/20 border-white/5 rounded-xl h-10" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">End Year</Label>
                  <Input value={item.content.endDate as string || ""} onChange={(e) => handleUpdate({ endDate: e.target.value })} placeholder="2022" className="bg-black/20 border-white/5 rounded-xl h-10" />
                </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 4. SKILLS
  if (type === "skills") {
    return (
      <div className="p-5 bg-white/[0.03] border border-white/10 rounded-[24px] space-y-4 group relative">
         <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400"
          onClick={() => removeSectionItem(sectionId, item.id)}
        >
          <Trash2 className="size-4" />
        </Button>
        <div className="space-y-1.5">
           <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Skill Category</Label>
           <Input 
            value={item.content.category as string || ""} 
            onChange={(e) => handleUpdate({ category: e.target.value })} 
            placeholder="e.g. Technical Skills"
            className="bg-black/20 border-white/5 rounded-xl h-10 font-bold"
           />
        </div>
        <div className="space-y-1.5">
           <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Skills (Comma separated)</Label>
           <Textarea 
            value={Array.isArray(item.content.skills) ? item.content.skills.join(", ") : (item.content.skills as string || "")} 
            onChange={(e) => handleUpdate({ skills: e.target.value.split(",").map(s => s.trim()) })} 
            placeholder="React, TypeScript, Node.js..."
            className="min-h-[80px] bg-black/20 border-white/5 rounded-xl text-sm"
           />
        </div>
      </div>
    );
  }

  // 5. PLAIN TEXT FALLBACK
  return (
    <div className="p-5 bg-white/[0.03] border border-white/10 rounded-[24px] group relative">
       <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400"
        onClick={() => removeSectionItem(sectionId, item.id)}
      >
        <Trash2 className="size-4" />
      </Button>
      <div className="space-y-2">
         <Label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Edit Content</Label>
         <Textarea 
           value={typeof item.content === "string" ? item.content : (item.content.text as string || item.content.description as string || "")} 
           onChange={(e) => handleUpdate({ text: e.target.value })} 
           placeholder="Type your content here..."
           className="min-h-[100px] bg-black/20 border-white/5 rounded-xl text-sm leading-relaxed"
         />
         {Object.keys(item.content).length > 1 && !item.content.text && !item.content.description && (
           <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-500/60 font-medium">
              <AlertCircle className="size-3" />
              Complex data detected. Editing as plain text.
           </div>
         )}
      </div>
    </div>
  );
}
