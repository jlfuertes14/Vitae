"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  UploadCloud,
  FileText,
  Link as LinkIcon,
  Globe,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/lib/store/resume-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function JobMatchPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobSource, setJobSource] = useState<"text" | "url">("text");
  const [resumeSource, setResumeSource] = useState<"active" | "library" | "upload">("active");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("active");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { content } = useResumeStore();

  const mockLibrary = [
    { id: "res-1", title: "Executive Resume", date: "2 days ago" },
    { id: "res-2", title: "Product Manager CV", date: "1 week ago" },
    { id: "res-3", title: "Technical Architect", date: "1 month ago" },
  ];

  const cleanAIList = (list: string[] | undefined) => {
    if (!list) return [];
    return list.flatMap(item => 
      item.split(",")
          .map(s => s.replace(/^[-•*]\s*/, "").replace(/Missing Skills/gi, "").trim())
          .filter(Boolean)
    );
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null); // Clear previous result
    try {
      let resumeToAnalyze = content;

      // If a custom file was uploaded, parse it first
      if (resumeSource === "upload" && uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        
        const parseRes = await fetch("/api/import", {
          method: "POST",
          body: formData,
        });
        
        const parseData = await parseRes.json();
        if (parseData.resumeContent) {
          resumeToAnalyze = parseData.resumeContent;
        } else {
          throw new Error("Failed to parse uploaded resume");
        }
      }

      const response = await fetch("/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeContent: resumeToAnalyze, 
          jobDescription: jobSource === "text" ? jobDescription : jobUrl 
        }),
      });

      const data = await response.json();
      if (data.result) setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          <Target className="size-3.5" />
          Elite Match Engine
        </div>
        <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl leading-tight">
          Is your resume a <span className="vitae-gradient-text italic">Perfect Match</span>?
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/60 md:text-lg">
          Connect your resume to any job posting. We'll surface critical gaps, keyword opportunities, 
          and positioning shifts needed to pass the ATS and impress the hiring manager.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Step 1: Choose Resume */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <div className="size-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <FileText className="size-5 text-white/60" />
             </div>
             <h3 className="text-xl font-bold text-white tracking-tight">1. Select Resume</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
             {[
               { id: "active", label: "Active", icon: Sparkles },
               { id: "library", label: "Library", icon: FileText },
               { id: "upload", label: "Upload", icon: UploadCloud }
             ].map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => setResumeSource(opt.id as any)}
                 className={cn(
                   "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                   resumeSource === opt.id 
                    ? "bg-white border-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.1)]" 
                    : "bg-white/[0.04] border-white/10 text-white/50 hover:bg-white/[0.08]"
                 )}
               >
                 <opt.icon className="size-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">{opt.label}</span>
               </button>
             ))}
          </div>

          {resumeSource === "active" && (
            <Card className="bg-white/[0.06] border-emerald-500/20 rounded-2xl overflow-hidden border-2">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="size-6 text-emerald-500" />
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">Active Workspace</div>
                      <div className="text-xs text-white/40">The resume you're currently editing</div>
                   </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[9px] tracking-widest">Selected</Badge>
              </CardContent>
            </Card>
          )}

          {resumeSource === "library" && (
            <div className="space-y-3">
               {mockLibrary.map((res) => (
                 <button
                   key={res.id}
                   onClick={() => setSelectedResumeId(res.id)}
                   className={cn(
                     "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                     selectedResumeId === res.id 
                      ? "bg-white/10 border-white/20" 
                      : "bg-white/[0.03] border-white/10 opacity-60 hover:opacity-100"
                   )}
                 >
                   <div className="flex items-center gap-3">
                      <FileText className="size-5 text-white/40" />
                      <div>
                        <div className="text-sm font-bold text-white">{res.title}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest">Edited {res.date}</div>
                      </div>
                   </div>
                   {selectedResumeId === res.id && <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                 </button>
               ))}
            </div>
          )}

          {resumeSource === "upload" && (
            <div 
              onClick={() => document.getElementById("resume-upload-input")?.click()}
              className={cn(
                "relative h-40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group",
                uploadedFile ? "bg-white/[0.06] border-white/20" : "bg-white/[0.02] hover:bg-white/[0.04]"
              )}
            >
               <input
                 id="resume-upload-input"
                 type="file"
                 className="hidden"
                 accept=".pdf,.docx,.txt"
                 onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                     setUploadedFile(file);
                     console.log("File selected for matching:", file.name);
                   }
                 }}
               />
               {uploadedFile ? (
                 <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="size-12 rounded-xl bg-white flex items-center justify-center shadow-xl mb-3">
                       <FileText className="size-6 text-black" />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{uploadedFile.name}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Ready for analysis</div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="mt-3 text-[10px] text-white/30 hover:text-white underline uppercase tracking-widest"
                    >
                      Change File
                    </button>
                 </div>
               ) : (
                 <>
                   <UploadCloud className="size-8 text-white/20 mb-2 group-hover:scale-110 transition-transform" />
                   <div className="text-sm text-white/40">Upload your PDF/DOCX</div>
                 </>
               )}
            </div>
          )}
        </div>

        {/* Step 2: Target Role */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 mb-2">
             <div className="size-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <Target className="size-5 text-white/60" />
             </div>
             <h3 className="text-xl font-bold text-white tracking-tight">2. Target Role</h3>
          </div>

          <div className="flex bg-white/[0.05] p-1 rounded-2xl border border-white/10 mb-6">
             <button
               onClick={() => setJobSource("text")}
               className={cn(
                 "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                 jobSource === "text" ? "bg-white text-black" : "text-white/40 hover:text-white/60"
               )}
             >
               <FileText className="size-4" />
               Job Description
             </button>
             <button
               onClick={() => setJobSource("url")}
               className={cn(
                 "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                 jobSource === "url" ? "bg-white text-black" : "text-white/40 hover:text-white/60"
               )}
             >
               <Globe className="size-4" />
               Job URL
             </button>
          </div>

          {jobSource === "text" ? (
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here. Include requirements and responsibilities for best results."
              className="h-[280px] resize-none rounded-[28px] border-white/10 bg-black/20 px-6 py-5 text-white placeholder:text-white/20 focus-visible:ring-emerald-500/20 overflow-y-auto custom-scrollbar"
            />
          ) : (
            <div className="space-y-4">
               <div className="relative">
                 <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-white/20" />
                 <Input 
                   value={jobUrl}
                   onChange={(e) => setJobUrl(e.target.value)}
                   placeholder="https://linkedin.com/jobs/view/..."
                   className="h-16 pl-14 rounded-2xl bg-black/20 border-white/10 text-white placeholder:text-white/20"
                 />
               </div>
               <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
                  <Globe className="size-5 text-blue-400 shrink-0" />
                  <p className="text-xs text-blue-200/60 leading-relaxed">
                    Our AI will visit the link and extract the core responsibilities and technical requirements automatically.
                  </p>
               </div>
            </div>
          )}

          <Button
            className="h-14 w-full rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-bold shadow-2xl transition-all active:scale-[0.98]"
            onClick={handleAnalyze}
            disabled={isAnalyzing || (jobSource === "text" ? !jobDescription.trim() : !jobUrl.trim())}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Analyzing Role Compatibility...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-5" />
                Match Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
           <div className="rounded-[40px] border border-white/10 bg-white/[0.04] p-1 md:p-2">
              <div className="bg-[#050505] rounded-[36px] overflow-hidden">
                 <div className="p-10 grid md:grid-cols-3 gap-12">
                    {/* Score */}
                    <div className="flex flex-col items-center justify-center text-center space-y-4 border-r border-white/10 pr-12">
                       <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">Match Score</div>
                       <div className="text-8xl font-black vitae-gradient-text leading-none">{result.overall}%</div>
                       <Badge className="bg-emerald-500 text-black border-none font-bold">OPTIMIZED</Badge>
                    </div>

                    {/* Feedback */}
                    <div className="md:col-span-2 space-y-8">
                       <div className="space-y-4">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                             <CheckCircle2 className="size-5 text-emerald-500" />
                             Strengths Detected
                          </h4>
                           <div className="flex flex-wrap gap-2">
                             {cleanAIList(result.strengths).length > 0 ? (
                               cleanAIList(result.strengths).map((s: string) => (
                                 <Badge key={s} variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 py-1.5 px-3 rounded-lg">{s}</Badge>
                               ))
                             ) : (
                               ["Relevant Background", "Core Competencies"].map((s) => (
                                 <Badge key={s} variant="outline" className="bg-white/5 border-white/10 text-white/40 py-1.5 px-3 rounded-lg italic">{s}</Badge>
                               ))
                             )}
                          </div>
                       </div>
 
                       <div className="space-y-4">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                             <AlertCircle className="size-5 text-amber-500" />
                             Critical Gaps
                          </h4>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                             {cleanAIList(result.missingSkills).map((skill: string, i: number) => (
                               <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl transition-colors hover:bg-white/[0.05]">
                                  <div className="size-1.5 rounded-full bg-amber-500" />
                                  <span className="text-xs text-white/70 font-medium truncate">{skill}</span>
                               </div>
                             ))}
                             {cleanAIList(result.missingSkills).length === 0 && (
                               <p className="text-xs text-white/30 italic px-1">No major gaps detected.</p>
                             )}
                          </div>
                       </div>
 
                       <div className="space-y-4">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                             <Sparkles className="size-5 text-blue-400" />
                             Tailoring Suggestions
                          </h4>
                          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                             {cleanAIList(result.suggestions).map((suggestion: string, i: number) => (
                               <div key={i} className="group flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                  <ArrowRight className="size-3.5 text-white/20 mt-0.5 group-hover:translate-x-1 transition-transform" />
                                  <p className="text-[13px] text-white/50 leading-relaxed">{suggestion}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      )}
    </div>
  );
}
