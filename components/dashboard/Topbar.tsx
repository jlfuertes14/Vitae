"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  user?: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

const PAGE_META: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Control Room", title: "Elite Career Dashboard" },
  "/resumes": { eyebrow: "Workspace", title: "Resume Library" },
  "/templates": { eyebrow: "Design", title: "Template Gallery" },
  "/cover-letters": { eyebrow: "Writing", title: "Cover Letter Studio" },
  "/job-match": { eyebrow: "Analysis", title: "Job Match Engine" },
  "/ai-assistant": { eyebrow: "Intelligence", title: "AI Assistant" },
  "/settings": { eyebrow: "Preferences", title: "Workspace Settings" },
};

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const meta =
    PAGE_META[pathname] ||
    (pathname.startsWith("/resumes/")
      ? { eyebrow: "Editor", title: "Resume Builder" }
      : { eyebrow: "Workspace", title: "Vitae" });

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/35 backdrop-blur-xl">
      <div className="flex flex-col gap-5 px-4 py-5 md:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
              {meta.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {meta.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white"
            >
              <Bell className="size-4" />
            </Button>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 pr-4">
              <Avatar className="size-10 border border-white/10">
                <AvatarImage
                  src={user?.avatarUrl || undefined}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-white text-xs font-semibold text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white/45">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/45 md:w-[340px]">
            <Search className="size-4 shrink-0" />
            <span>Search resumes, templates, or AI tools</span>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
            <Sparkles className="size-4" />
            <span>Consistent aesthetic layer synced with marketing and auth</span>
          </div>
        </div>
      </div>
    </header>
  );
}
