"use client";

import { useState } from "react";
import { FormPane } from "./FormPane";
import { PreviewPane } from "./PreviewPane";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Sparkles, Layout, Eye } from "lucide-react";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/resume-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { AIAssistant } from "./AIAssistant";
import { TemplateSelector } from "./TemplateSelector";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditorLayoutProps {
  resumeId: string;
}

export function EditorLayout({ resumeId }: EditorLayoutProps) {
  const { isSaving, isDirty, lastSavedAt } = useResumeStore();
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  
  // Initialize auto-save hook
  useAutoSave(resumeId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Editor Topbar */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-sm">Untitled Resume</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              {isSaving
                ? "Saving..."
                : isDirty
                ? "Unsaved changes"
                : lastSavedAt
                ? `Saved at ${lastSavedAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "All changes saved"}
            </span>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden flex-1 justify-center px-4">
          <Tabs value={mobileView} onValueChange={(v) => setMobileView(v as "edit" | "preview")}>
            <TabsList className="h-8 p-0.5">
              <TabsTrigger value="edit" className="h-7 px-3 text-[11px] gap-1.5">
                <Layout className="size-3" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="h-7 px-3 text-[11px] gap-1.5">
                <Eye className="size-3" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block border-r border-border pr-2 mr-2">
            <TemplateSelector />
          </div>
          <div className="hidden sm:block">
            <AIAssistant />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 h-8 px-2 sm:px-3"
            nativeButton={false}
            render={
              <a href={`/api/export/pdf?id=${resumeId}`} target="_blank" rel="noopener noreferrer" download={`resume-${resumeId}.pdf`}>
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </a>
            }
          />
          <Button size="sm" className="gap-2 h-8 px-2 sm:px-3" disabled={!isDirty || isSaving}>
            <Save className="size-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </header>

      {/* Split Pane / Mobile Single Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Forms */}
        <div className={`
          w-full lg:w-[45%] xl:w-[40%] flex flex-col border-r border-border bg-background z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]
          ${mobileView === "preview" ? "hidden lg:flex" : "flex"}
        `}>
          <FormPane />
        </div>

        {/* Right Pane - Live Preview */}
        <div className={`
          flex-1 bg-muted/30 overflow-hidden relative
          ${mobileView === "edit" ? "hidden lg:flex" : "flex"}
        `}>
          <PreviewPane />
        </div>
      </div>
    </div>
  );
}
