"use client";

import { useResumeStore } from "@/lib/store/resume-store";
import { TEMPLATES } from "@/lib/constants";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Palette } from "lucide-react";

export function TemplateSelector() {
  const { templateId, setTemplate } = useResumeStore();

  return (
    <div className="flex items-center gap-2">
      <Palette className="size-4 text-muted-foreground" />
      <Select value={templateId} onValueChange={setTemplate}>
        <SelectTrigger className="w-[180px] h-8 text-[11px] font-medium bg-white/[0.03] border-white/10 rounded-lg">
          <SelectValue placeholder="Change Template" />
        </SelectTrigger>
        <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
          {TEMPLATES.map((t) => (
            <SelectItem key={t.id} value={t.id} className="text-[11px]">
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
