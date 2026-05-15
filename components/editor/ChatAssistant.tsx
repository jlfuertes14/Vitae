"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, Loader2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/store/resume-store";
import { ALL_SECTION_TYPES, TEMPLATE_SECTION_CAPABILITIES } from "@/lib/constants";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Resume Assistant. How can I help you today? I can help you rewrite your summary, add new experiences, or optimize your bullet points.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { content, addSection, addSectionItem, updateSectionItem, templateId } = useResumeStore();
  const allowedSections = TEMPLATE_SECTION_CAPABILITIES[templateId] || ALL_SECTION_TYPES;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          resumeContent: content,
          templateId,
          allowedSections,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const fallbackMessage = response.status === 401
          ? "Please sign in to use the AI assistant. If you are testing, set NEXT_PUBLIC_MOCK_AUTH=true and restart the dev server."
          : "Sorry, I couldn't reach the AI service. Please try again in a moment.";
        throw new Error(data?.error || fallbackMessage);
      }

      const replyText = typeof data?.reply === "string"
        ? data.reply
        : (typeof data?.result === "string" ? data.result : "I can help with that. What should we improve first?");

      const patches = Array.isArray(data?.resumePatches)
        ? data.resumePatches
        : data?.resumePatch
        ? [data.resumePatch]
        : [];

      const sectionTitles: Record<string, string> = {
        summary: "Professional Summary",
        experience: "Professional Experience",
        education: "Education",
        skills: "Skills & Expertise",
        projects: "Projects",
        leadership: "Leadership & Activities",
        awards: "Awards",
        certifications: "Certifications",
        languages: "Languages",
        hobbies: "Hobbies",
        custom: "Custom Section",
      };

      const normalizeString = (value: unknown) =>
        typeof value === "string" ? value.trim() : "";

      const normalizeBullets = (value: unknown) =>
        (Array.isArray(value) ? value : [])
          .map((entry) => String(entry || "").trim())
          .filter(Boolean);

      const normalizeSkills = (value: unknown) => {
        const rawSkills = Array.isArray(value) ? value : [];
        const normalized = rawSkills
          .map((entry) => {
            if (typeof entry === "string") {
              return { name: entry.trim(), level: "Very good" };
            }
            if (entry && typeof entry === "object") {
              const name = normalizeString((entry as { name?: string }).name);
              const level = normalizeString((entry as { level?: string }).level) || "Very good";
              return name ? { name, level } : null;
            }
            return null;
          })
          .filter(Boolean) as { name: string; level: string }[];

        return normalized;
      };

      const ensureSectionWithItem = (
        type: string,
        item: { id: string; content: Record<string, unknown> }
      ) => {
        const existing = content.sections.find((section) => section.type === type);
        if (!existing) {
          addSection({
            id: type,
            type: type as any,
            title: sectionTitles[type] || "Section",
            visible: true,
            items: [item],
          });
          return;
        }
        addSectionItem(existing.id, item);
      };

      const applyPatch = (patch: { type?: string; item?: any }) => {
        if (!patch?.type || !patch?.item) return null;
        if (!allowedSections.includes(patch.type)) return null;
        const type = patch.type;
        const rawItem = patch.item;

        if (type === "summary") {
          const text = normalizeString(rawItem.text || rawItem.summary || rawItem.content);
          if (!text) return null;
          const summarySection = content.sections.find((section) => section.type === "summary");
          if (summarySection?.items?.[0]) {
            updateSectionItem(summarySection.id, summarySection.items[0].id, { text });
          } else {
            ensureSectionWithItem("summary", {
              id: `item-${Date.now()}`,
              content: { text },
            });
          }
          return "Summary";
        }

        if (type === "experience") {
          const bullets = normalizeBullets(rawItem.bullets);
          const description = normalizeString(rawItem.description);
          const normalizedItem = {
            company: normalizeString(rawItem.company),
            position: normalizeString(rawItem.position || rawItem.jobTitle),
            location: normalizeString(rawItem.location),
            startDate: normalizeString(rawItem.startDate),
            endDate: normalizeString(rawItem.endDate),
            bullets: bullets.length > 0 ? bullets : description ? [description] : [],
          };

          if (
            normalizedItem.company ||
            normalizedItem.position ||
            normalizedItem.bullets.length > 0
          ) {
            ensureSectionWithItem("experience", {
              id: `item-${Date.now()}`,
              content: normalizedItem,
            });
            return "Experience";
          }
          return null;
        }

        if (type === "education") {
          const bullets = normalizeBullets(rawItem.bullets);
          const normalizedItem = {
            institution: normalizeString(rawItem.institution),
            degree: normalizeString(rawItem.degree),
            field: normalizeString(rawItem.field),
            location: normalizeString(rawItem.location),
            startDate: normalizeString(rawItem.startDate),
            endDate: normalizeString(rawItem.endDate),
            bullets,
          };
          if (
            normalizedItem.institution ||
            normalizedItem.degree ||
            normalizedItem.field
          ) {
            ensureSectionWithItem("education", {
              id: `item-${Date.now()}`,
              content: normalizedItem,
            });
            return "Education";
          }
          return null;
        }

        if (type === "projects" || type === "leadership") {
          const bullets = normalizeBullets(rawItem.bullets);
          const normalizedItem = {
            name: normalizeString(rawItem.name || rawItem.title),
            url: normalizeString(rawItem.url || rawItem.link),
            description: normalizeString(rawItem.description),
            location: normalizeString(rawItem.location),
            startDate: normalizeString(rawItem.startDate),
            endDate: normalizeString(rawItem.endDate),
            bullets,
          };
          if (normalizedItem.name || bullets.length > 0) {
            ensureSectionWithItem(type, {
              id: `item-${Date.now()}`,
              content: normalizedItem,
            });
            return type === "projects" ? "Projects" : "Leadership";
          }
          return null;
        }

        if (type === "skills" || type === "languages") {
          const category = normalizeString(rawItem.category) ||
            (type === "languages" ? "Languages" : "Technical Skills");
          const normalizedSkills = normalizeSkills(rawItem.skills);
          const fallbackName = normalizeString(rawItem.name);
          if (normalizedSkills.length === 0 && fallbackName) {
            normalizedSkills.push({
              name: fallbackName,
              level: normalizeString(rawItem.level) || "Very good",
            });
          }
          if (normalizedSkills.length > 0) {
            ensureSectionWithItem(type, {
              id: `item-${Date.now()}`,
              content: {
                category,
                skills: normalizedSkills,
              },
            });
            return type === "skills" ? "Skills" : "Languages";
          }
          return null;
        }

        if (type === "hobbies") {
          const text = normalizeString(rawItem.text || rawItem.hobbies);
          if (!text) return null;
          ensureSectionWithItem("hobbies", {
            id: `item-${Date.now()}`,
            content: { text },
          });
          return "Hobbies";
        }

        if (type === "awards" || type === "certifications" || type === "custom") {
          const title = normalizeString(rawItem.title || rawItem.name);
          const description = normalizeString(rawItem.description || rawItem.text);
          if (!title && !description) return null;
          ensureSectionWithItem(type, {
            id: `item-${Date.now()}`,
            content: {
              title,
              description,
            },
          });
          return type === "awards"
            ? "Awards"
            : type === "certifications"
            ? "Certifications"
            : "Custom";
        }

        return null;
      };

      const appliedSections = patches
        .map(applyPatch)
        .filter(Boolean) as string[];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: appliedSections.length > 0
          ? `${replyText}\n\nUpdated sections: ${appliedSections.join(", ")}.`
          : replyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, something went wrong while sending your message.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="size-14 rounded-full bg-white text-black shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="size-6 relative z-10" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[380px] h-[520px] flex flex-col shadow-2xl border-white/10 bg-[#0a0a0a] backdrop-blur-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-white flex items-center justify-center">
                <Bot className="size-5 text-black" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">Vitae AI</CardTitle>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8 text-white/40 hover:text-white hover:bg-white/5">
                <Minus className="size-4" />
              </Button>
              <Button 
                onClick={() => setIsOpen(false)}
                variant="ghost" size="icon" className="size-8 text-white/40 hover:text-white hover:bg-white/5"
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === "assistant" ? "bg-white/10" : "bg-white"
                    )}>
                      {msg.role === "assistant" ? (
                        <Bot className="size-4 text-white" />
                      ) : (
                        <User className="size-4 text-black" />
                      )}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-[13px] leading-relaxed",
                      msg.role === "assistant" 
                        ? "bg-white/[0.05] text-white/90 rounded-tl-none border border-white/5" 
                        : "bg-white text-black rounded-tr-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="bg-white/[0.05] p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                      <Loader2 className="size-3 text-white/40 animate-spin" />
                      <span className="text-[11px] text-white/40">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t border-white/10 bg-white/[0.02]">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="w-full flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to help with your resume..."
                className="flex-1 h-10 bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/50"
              />
              <Button 
                type="submit"
                size="icon" 
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 shrink-0 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
