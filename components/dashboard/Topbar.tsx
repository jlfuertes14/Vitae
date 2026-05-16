"use client";

import { Bell, LogOut, Search, Settings, Sparkles, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "@/app/actions/auth";
import { TEMPLATES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TopbarProps {
  user?: {
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
  type: string;
}

interface SearchItem {
  id: string;
  label: string;
  href: string;
  category: string;
  description: string;
  keywords: string[];
}

const PAGE_META: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Control Room", title: "Elite Career Dashboard" },
  "/resumes": { eyebrow: "Workspace", title: "Resume Library" },
  "/templates": { eyebrow: "Design", title: "Template Gallery" },
  "/cover-letters": { eyebrow: "Writing", title: "Cover Letter Studio" },
  "/job-match": { eyebrow: "Analysis", title: "Job Match Engine" },
  "/ai-assistant": { eyebrow: "Intelligence", title: "AI Assistant" },
  "/notifications": { eyebrow: "Alerts", title: "Notification Center" },
  "/settings": { eyebrow: "Preferences", title: "Workspace Settings" },
  "/profile": { eyebrow: "Account", title: "Your Profile" },
};

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    category: "Workspace",
    description: "Open your career dashboard and activity overview.",
    keywords: ["home", "overview", "control room"],
  },
  {
    id: "resumes",
    label: "Resumes",
    href: "/resumes",
    category: "Workspace",
    description: "Browse saved resume drafts and versions.",
    keywords: ["cv", "resume library", "editor"],
  },
  {
    id: "templates",
    label: "Templates",
    href: "/templates",
    category: "Design",
    description: "Explore ATS-friendly resume templates.",
    keywords: ["gallery", "layouts", "designs"],
  },
  {
    id: "import",
    label: "Import",
    href: "/import",
    category: "Tools",
    description: "Upload an existing resume and convert it.",
    keywords: ["upload", "parse", "convert"],
  },
  {
    id: "cover-letters",
    label: "Cover Letters",
    href: "/cover-letters",
    category: "Writing",
    description: "Generate and manage cover letter drafts.",
    keywords: ["letters", "writing", "applications"],
  },
  {
    id: "job-match",
    label: "Job Match",
    href: "/job-match",
    category: "Analysis",
    description: "Compare your resume against a target role.",
    keywords: ["score", "analysis", "ats", "fit"],
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    category: "Alerts",
    description: "Review imports, exports, and workspace updates.",
    keywords: ["alerts", "updates", "activity"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    category: "Preferences",
    description: "Manage workspace preferences and notification rules.",
    keywords: ["preferences", "configuration", "options"],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    category: "Account",
    description: "Update your account profile and avatar.",
    keywords: ["account", "user", "avatar"],
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    href: "/ai-assistant",
    category: "AI Tools",
    description: "Open the AI assistant workspace.",
    keywords: ["chat", "assistant", "rewrite", "ai"],
  },
  ...TEMPLATES.map((template) => ({
    id: `template-${template.id}`,
    label: template.name,
    href: "/templates",
    category: "Template",
    description: template.description,
    keywords: [template.category, template.id, "template", "resume"],
  })),
];

const formatNotificationTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [workspaceItems, setWorkspaceItems] = useState<SearchItem[]>([]);
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

  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
      setUnreadCount(typeof data?.unreadCount === "number" ? data.unreadCount : 0);
    } catch (error) {
      console.error("[NOTIFICATIONS_FETCH_ERROR]", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (unreadCount === 0) return;
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!response.ok) return;
      setNotifications((prev) =>
        prev.map((item) =>
          item.readAt ? item : { ...item, readAt: new Date().toISOString() }
        )
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("[NOTIFICATIONS_MARK_ALL_ERROR]", error);
    }
  }, [unreadCount]);

  const markRead = useCallback(async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) return;
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id && !item.readAt
            ? { ...item, readAt: new Date().toISOString() }
            : item
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("[NOTIFICATIONS_MARK_ONE_ERROR]", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setSearchTerm("");
    setSearchFocused(false);
    setActiveSearchIndex(0);
  }, [pathname]);

  useEffect(() => {
    async function fetchWorkspaceItems() {
      try {
        const response = await fetch("/api/workspace/items");
        if (response.ok) {
          const data = await response.json();
          if (data.items) {
            setWorkspaceItems(data.items);
          }
        }
      } catch (error) {
        console.error("Failed to fetch workspace items", error);
      }
    }
    fetchWorkspaceItems();
  }, []);

  const filteredSearchResults = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const allSearchItems = [...SEARCH_ITEMS, ...workspaceItems];

    if (!normalizedQuery) {
      return allSearchItems.slice(0, 6);
    }

    return allSearchItems.filter((item) => {
      const haystack = [
        item.label,
        item.category,
        item.description,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    }).slice(0, 8);
  }, [searchTerm, workspaceItems]);

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [searchTerm]);

  const handleSearchNavigate = useCallback(
    (href: string) => {
      setSearchFocused(false);
      setSearchTerm("");
      setActiveSearchIndex(0);
      router.push(href);
    },
    [router]
  );

  const showSearchResults = searchFocused;

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
            <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
              <DropdownMenuTrigger
                type="button"
                aria-label="Notifications"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative size-10 rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 border-white/10 bg-[#0f0f0f] text-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-white/60">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {loadingNotifications ? (
                    <DropdownMenuItem
                      disabled
                      className="cursor-default text-white/50"
                    >
                      Loading notifications...
                    </DropdownMenuItem>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start gap-1 rounded-lg px-3 py-2 text-white/80 hover:bg-white/5"
                        onClick={() => {
                          if (notification.link) {
                            router.push(notification.link);
                          }
                          if (!notification.readAt) {
                            markRead(notification.id);
                          }
                        }}
                      >
                        <div className="flex w-full items-center gap-2">
                          {!notification.readAt && (
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                          )}
                          <span className="text-sm font-medium text-white">
                            {notification.title}
                          </span>
                        </div>
                        {notification.body && (
                          <span className="text-xs text-white/50">
                            {notification.body}
                          </span>
                        )}
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem
                      disabled
                      className="cursor-default text-white/50"
                    >
                      You&apos;re all caught up
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    disabled={unreadCount === 0}
                    className="cursor-pointer text-white/80 hover:bg-white/5"
                    onClick={markAllRead}
                  >
                    Mark all as read
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-white/80 hover:bg-white/5"
                    onClick={() => router.push("/notifications")}
                  >
                    <Bell className="size-4" />
                    View all notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-white/80 hover:bg-white/5"
                    onClick={() => router.push("/settings")}
                  >
                    <Settings className="size-4" />
                    Notification settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                aria-label="Account menu"
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 pr-4 text-left"
              >
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
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-[#0f0f0f] text-white"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-white/60">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-white/80 hover:bg-white/5"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-white/80 hover:bg-white/5"
                    onClick={() => router.push("/settings")}
                  >
                    <Settings className="size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={async () => {
                      await signOut();
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-[340px]">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/45 transition focus-within:border-white/20 focus-within:bg-white/[0.06]">
              <Search className="size-4 shrink-0 text-white/45" />
              <Input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => {
                    setSearchFocused(false);
                  }, 120);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (filteredSearchResults.length > 0) {
                      setActiveSearchIndex((prev) =>
                        Math.min(prev + 1, filteredSearchResults.length - 1)
                      );
                    }
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveSearchIndex((prev) => Math.max(prev - 1, 0));
                  }

                  if (e.key === "Enter") {
                    const selected = filteredSearchResults[activeSearchIndex];
                    if (selected) {
                      e.preventDefault();
                      handleSearchNavigate(selected.href);
                    }
                  }

                  if (e.key === "Escape") {
                    setSearchFocused(false);
                  }
                }}
                placeholder="Search resumes, templates, or AI tools"
                className="h-auto border-0 bg-transparent px-0 py-0 text-sm text-white placeholder:text-white/35 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>

            {showSearchResults && (
              <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 overflow-hidden rounded-[24px] border border-white/10 bg-[#0f0f0f]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                {filteredSearchResults.length > 0 ? (
                  <div className="p-2">
                    {filteredSearchResults.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSearchNavigate(item.href)}
                        className={cn(
                          "flex w-full flex-col items-start gap-1 rounded-2xl px-4 py-3 text-left transition",
                          index === activeSearchIndex
                            ? "bg-white/[0.08]"
                            : "hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="text-sm font-medium text-white">
                            {item.label}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-xs leading-5 text-white/45">
                          {item.description}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-5 text-sm text-white/45">
                    No results found for &quot;{searchTerm.trim()}&quot;.
                  </div>
                )}
              </div>
            )}
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
