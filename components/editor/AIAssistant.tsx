"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, Activity, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useResumeStore } from "@/lib/store/resume-store";
import { AIScoreResult } from "@/lib/types";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [score, setScore] = useState<AIScoreResult | null>(null);
  const { content } = useResumeStore();

  const handleScoreResume = async () => {
    setIsScoring(true);
    try {
      const response = await fetch("/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent: content }),
      });
      
      const data = await response.json();
      if (data.result) {
        setScore(data.result);
      }
    } catch (error) {
      console.error("Failed to score resume:", error);
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger 
        render={
          <Button variant="outline" size="sm" className="gap-2 h-8 bg-vitae-emerald/10 text-vitae-emerald hover:bg-vitae-emerald/20 hover:text-vitae-emerald border-vitae-emerald/20">
            <Sparkles className="size-3.5" />
            AI Assistant
          </Button>
        } 
      />
      
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-vitae-emerald" />
            Vitae AI Assistant
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Action Area */}
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <h3 className="font-semibold mb-2">ATS Scoring Engine</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze your resume against industry standards and ATS parsing rules to get an objective score and actionable feedback.
            </p>
            <Button 
              className="w-full gap-2" 
              onClick={handleScoreResume}
              disabled={isScoring}
            >
              {isScoring ? (
                <>
                  <Activity className="size-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="size-4" />
                  Run Full ATS Audit
                </>
              )}
            </Button>
          </div>

          {/* Results Area */}
          {score && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between p-4 bg-background border rounded-xl shadow-sm">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Overall ATS Score</h4>
                  <div className="text-3xl font-bold mt-1 text-vitae-emerald">{score.overall}/100</div>
                </div>
                <div className="size-16 rounded-full border-4 border-vitae-emerald flex items-center justify-center bg-vitae-emerald/10">
                  <span className="font-bold text-vitae-emerald">{score.overall}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard title="ATS Compatibility" value={score.atsCompatibility} />
                <MetricCard title="Keyword Match" value={score.keywordMatch} />
                <MetricCard title="Readability" value={score.readability} />
                <MetricCard title="Formatting" value={score.formatting} />
              </div>

              {score.suggestions && score.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <CheckCircle2 className="size-4 text-primary" />
                    Actionable Feedback
                  </h4>
                  <ul className="space-y-2">
                    {score.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-sm p-3 bg-muted/50 rounded-lg border">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {score.missingSkills && score.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <AlertCircle className="size-4 text-destructive" />
                    Missing Critical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {score.missingSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  const isGood = value >= 80;
  const isWarning = value >= 60 && value < 80;
  
  return (
    <div className="p-3 border rounded-xl bg-card">
      <div className="text-xs font-medium text-muted-foreground mb-1 truncate">{title}</div>
      <div className={`text-xl font-bold ${isGood ? "text-green-600" : isWarning ? "text-yellow-600" : "text-destructive"}`}>
        {value}/100
      </div>
    </div>
  );
}
