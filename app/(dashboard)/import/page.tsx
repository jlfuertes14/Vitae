"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useResumeStore } from "@/lib/store/resume-store";
import { TEMPLATES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "complete">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("__current__");
  const { templateId, setTemplate, setContent } = useResumeStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleStartImport = async () => {
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setStatus("uploading");
    setProgress(20);

    const templateToUse =
      selectedTemplateId === "__current__" ? templateId : selectedTemplateId;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("templateId", templateToUse);

    try {
      setStatus("parsing");
      setProgress(60);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Import failed");
      }

      if (data?.resumeContent) {
        setContent(data.resumeContent);
        if (selectedTemplateId !== "__current__") {
          setTemplate(templateToUse);
        }
      }

      setProgress(100);
      setStatus("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      setStatus("idle");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
          <UploadCloud className="size-3.5" />
          Smart Import
        </div>

        <div className="mt-6">
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Convert your old resume to <span className="vitae-gradient-text italic">Elite</span> standards.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
            Upload your current PDF or Word resume. Our AI will extract the data and reformat it into an 
            ATS-optimized, Harvard-standard template instantly.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <Card className="lg:col-span-2 bg-white/[0.04] border-white/10 shadow-2xl backdrop-blur-xl rounded-[28px] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="size-5 text-white/40" />
              Upload Source File
            </CardTitle>
            <CardDescription className="text-white/40">
              Supported formats: PDF, DOCX, TXT (Max 5MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                Target template
              </label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/[0.04] text-white/80">
                  <SelectValue placeholder="Use current template" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectItem value="__current__">
                    Use current template ({TEMPLATES.find((t) => t.id === templateId)?.name || "Current"})
                  </SelectItem>
                  {TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-white/35">
                If you skip this, we convert for the current template and you can switch later.
              </p>
            </div>

            <div 
              className={cn(
                "group relative h-64 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center transition-all duration-300",
                file ? "bg-white/[0.06] border-white/20" : "bg-transparent hover:bg-white/[0.02] hover:border-white/20"
              )}
            >
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
              />
              
              {file ? (
                <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                  <div className="size-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl mb-4">
                    <FileText className="size-8 text-black" />
                  </div>
                  <div className="text-lg font-medium text-white mb-1">{file.name}</div>
                  <div className="text-sm text-white/40 mb-6">{(file.size / 1024).toFixed(1)} KB</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/40 hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setStatus("idle");
                      setProgress(0);
                      setError(null);
                    }}
                  >
                    Change file
                  </Button>
                </div>
              ) : (
                <>
                  <div className="size-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-8 text-white/20" />
                  </div>
                  <div className="text-lg font-medium text-white/60 mb-1">Drop your resume here</div>
                  <div className="text-sm text-white/30">or click to browse files</div>
                </>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            )}

            {status !== "idle" && !error && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-white">
                      {status === "uploading" && "Uploading file..."}
                      {status === "parsing" && "AI Parsing & Reformatting..."}
                      {status === "complete" && "Conversion Complete!"}
                    </div>
                    <div className="text-xs text-white/30">
                      {status === "parsing" && "Extracting experience and skills using Llama 4..."}
                    </div>
                  </div>
                  <div className="text-sm font-mono text-white/60">{progress}%</div>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" indicatorClassName="bg-white" />
              </div>
            )}

            {status === "complete" ? (
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="size-6 text-black" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Success</div>
                    <div className="text-sm text-white/70">Your resume has been converted to Harvard standard.</div>
                  </div>
                </div>
                <Link href="/resumes/new-imported">
                  <Button className="bg-white text-black hover:bg-white/90 rounded-xl gap-2">
                    Open Workspace
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Button 
                disabled={!file || isUploading}
                onClick={handleStartImport}
                className="w-full h-14 bg-white text-black hover:bg-white/90 text-lg font-semibold rounded-2xl shadow-xl transition-all hover:scale-[1.01]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5 mr-2" />
                    Convert to Elite Template
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Benefits Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/[0.04] border-white/10 shadow-2xl backdrop-blur-xl rounded-[28px]">
            <CardHeader>
              <CardTitle className="text-base text-white">Why Convert?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="size-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white">ATS Optimization</div>
                  <p className="text-xs text-white/40 leading-relaxed">We strip away heavy formatting that chokes applicant tracking systems.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-4 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white">Harvard Standard</div>
                  <p className="text-xs text-white/40 leading-relaxed">Your content is mapped to the exact hierarchy preferred by top-tier recruiters.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/[0.08] to-transparent border-white/10 shadow-2xl backdrop-blur-xl rounded-[28px] overflow-hidden">
            <div className="p-6">
              <div className="size-10 rounded-xl bg-white flex items-center justify-center mb-4">
                <AlertCircle className="size-6 text-black" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pro Tip</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Importing works best with standard layouts. If your resume has many images or tables, our AI might take a moment longer to clean the data.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
