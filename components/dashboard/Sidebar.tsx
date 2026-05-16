"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Palette,
  Settings,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/resumes", icon: FileText },
  { label: "Templates", href: "/templates", icon: Palette },
  { label: "Import", href: "/import", icon: UploadCloud },
  { label: "Cover Letters", href: "/cover-letters", icon: Mail },
  { label: "Job Match", href: "/job-match", icon: Target },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

const NAV_BOTTOM = [{ label: "Settings", href: "/settings", icon: Settings }];

function VitaeMark({ size = "size-8" }: { size?: string }) {
  return (
    <div className={cn("relative", size)}>
      <svg viewBox="0 0 32 32" fill="none" className="size-full">
        <path
          d="M16 4L28 16L24 16L16 8L8 16L4 16L16 4Z"
          className="fill-white"
        />
        <path
          d="M16 14L24 22L20 22L16 18L12 22L8 22L16 14Z"
          className="fill-white/60"
        />
        <rect
          x="10"
          y="24"
          width="12"
          height="2.5"
          rx="1.25"
          className="fill-white/30"
        />
      </svg>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen hidden shrink-0 overflow-y-auto border-r border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 md:flex md:flex-col",
        collapsed ? "w-[88px]" : "w-[288px]"
      )}
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_65%)]" />

      <div className="relative flex h-24 items-center justify-between px-5">
        <Link
          href="/dashboard"
          className={cn(
            "inline-flex items-center gap-3 text-white transition hover:text-white/85",
            collapsed && "justify-center"
          )}
        >
          <VitaeMark />
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="text-xl font-semibold tracking-tight">Vitae</span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                Workspace
              </span>
            </div>
          ) : null}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-9 rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white",
            collapsed && "absolute top-20 left-1/2 -translate-x-1/2 rotate-180"
          )}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>

      <nav className="relative flex flex-1 flex-col gap-2 px-4 pb-4 pt-6">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                  : "text-white/58 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "size-[18px] shrink-0",
                  isActive ? "text-black" : "text-white/58 group-hover:text-white"
                )}
              />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>

      <div className="relative mt-auto border-t border-white/10 px-4 py-4">
        {!collapsed ? (
          <div className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white/25">
            Account
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          {NAV_BOTTOM.map((item) => {
            const isActive = pathname.startsWith(item.href);

            const link = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-white text-black"
                    : "text-white/58 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <item.icon className="size-[18px] shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}

          <button
            onClick={async () => {
              await signOut();
            }}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/50 transition-all duration-200 hover:bg-red-500/10 hover:text-red-200",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="size-[18px] shrink-0" />
            {!collapsed ? <span>Sign Out</span> : null}
          </button>
        </div>
      </div>
    </aside>
  );
}
