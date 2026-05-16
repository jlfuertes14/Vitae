"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  MessageSquare, 
  Target, 
  Send, 
  Copy, 
  Download,
  Loader2,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/store/resume-store";

export function CoverLetterGenerator() {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<"document" | "email">("document");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "startup">("professional");
  
  const { content } = useResumeStore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          jobDescription,
          format,
          tone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate cover letter");
      }

      if (data.result) {
        setGeneratedLetter(data.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Cover Letter for ${tone} role`,
          content: generatedLetter,
          tone: tone.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Failed to save cover letter");
      }

      // Refresh to update the library view
      router.refresh();
      setGeneratedLetter("");
      setJobDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save cover letter");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      {/* Generator Controls */}
      <div className="lg:col-span-2 space-y-8">
         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <Target className="size-5 text-white/60" />
               </div>
               <h3 className="text-xl font-bold text-white tracking-tight">Role Details</h3>
            </div>
            
            <div className="relative">
              <Textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or role requirements here..."
                className="h-[350px] lg:h-[400px] resize-none rounded-[28px] border-white/10 bg-black/20 px-6 py-5 text-white placeholder:text-white/20 focus-visible:ring-emerald-500/20 custom-scrollbar overflow-y-auto"
              />
              <div className="absolute bottom-4 right-6 text-[10px] font-mono text-white/10 uppercase tracking-widest">
                {jobDescription.length} characters
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <Sparkles className="size-5 text-white/60" />
               </div>
               <h3 className="text-xl font-bold text-white tracking-tight">Style & Tone</h3>
            </div>
            
            <div className="space-y-4">
               <div className="flex bg-white/[0.05] p-1 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => setFormat("document")}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                      format === "document" ? "bg-white text-black shadow-xl" : "text-white/40"
                    )}
                  >
                    Formal Document
                  </button>
                  <button 
                    onClick={() => setFormat("email")}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                      format === "email" ? "bg-white text-black shadow-xl" : "text-white/40"
                    )}
                  >
                    Direct Email
                  </button>
               </div>

               <div className="grid grid-cols-3 gap-2">
                  {["professional", "enthusiastic", "startup"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t as any)}
                      className={cn(
                        "py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                        tone === t 
                          ? "bg-white/10 border-white/20 text-white" 
                          : "bg-transparent border-white/5 text-white/20 hover:border-white/10"
                      )}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {error && (
           <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
             {error}
           </div>
         )}

         <Button 
          onClick={handleGenerate}
          disabled={isGenerating || !jobDescription}
          className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-2xl text-lg font-bold shadow-2xl transition-all active:scale-[0.98]"
         >
           {isGenerating ? (
             <>
               <Loader2 className="size-5 animate-spin mr-2" />
               Drafting Narrative...
             </>
           ) : (
             <>
               <Send className="size-5 mr-2" />
               Generate Draft
             </>
           )}
         </Button>
      </div>

      {/* Output Workspace */}
      <div className="lg:col-span-3 lg:sticky lg:top-8">
         <div className="relative h-[600px] lg:h-[calc(100vh-200px)] rounded-[40px] border border-white/10 bg-white/[0.04] p-1 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[#050505] rounded-[38px] flex flex-col">
               <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="size-3 rounded-full bg-red-500/20" />
                     <div className="size-3 rounded-full bg-amber-500/20" />
                     <div className="size-3 rounded-full bg-emerald-500/20" />
                     <span className="ml-2 text-xs font-mono text-white/20 uppercase tracking-widest">
                       {format === "document" ? "draft_v1.pdf" : "application_email.txt"}
                     </span>
                  </div>
                  {generatedLetter && (
                    <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-500">
                       <Button variant="ghost" size="sm" className="text-white/40 hover:text-white rounded-lg gap-2">
                          <Copy className="size-3.5" />
                          Copy
                       </Button>
                       <Button variant="ghost" size="sm" className="text-white/40 hover:text-white rounded-lg gap-2" onClick={handleSave} disabled={isSaving}>
                          {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                          Save to Workspace
                       </Button>
                       <Button variant="ghost" size="sm" className="text-white/40 hover:text-white rounded-lg gap-2">
                          <Download className="size-3.5" />
                          Export
                       </Button>
                    </div>
                  )}
               </div>

               <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                  {generatedLetter ? (
                    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                       <div className="h-0.5 w-12 bg-white/20 mb-8" />
                       <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-white/80 tracking-wide italic">
                         {generatedLetter}
                       </pre>
                       <div className="h-0.5 w-12 bg-white/20 mt-12" />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center px-12">
                       <div className="size-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                          <MessageSquare className="size-8 text-white/10" />
                       </div>
                       <h4 className="text-xl font-bold text-white/40 mb-3 tracking-tight">Your draft will land here</h4>
                       <p className="text-sm text-white/20 max-w-xs leading-relaxed">
                         Provide a job description on the left to see how AI transforms your 
                         resume into a compelling career story.
                       </p>
                    </div>
                  )}
               </div>

               {isGenerating && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in duration-300">
                     <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                           <Loader2 className="size-12 text-white animate-spin" />
                           <Sparkles className="size-4 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-[0.4em] animate-pulse">Analyzing Fit...</div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
