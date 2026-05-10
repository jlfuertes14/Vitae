"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, Loader2, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/store/resume-store";

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
  const { content, setHeader, updateSectionItem } = useResumeStore();

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

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Mock AI response for now to show UI working
      // We will wire this to a real API in the next step
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've analyzed your request. I can definitely help with that. Since I'm currently in 'UI mode', I'll wait for the real API to be connected, but you can see how our conversation will flow!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Chat error:", error);
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
