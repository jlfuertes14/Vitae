"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, BellRing, Check, RefreshCcw, Sliders } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_WORKSPACE_SETTINGS, WorkspaceSettingsPayload } from "@/lib/settings";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
  type: string;
}

const formatNotificationTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [settings, setSettings] = useState<WorkspaceSettingsPayload>(
    DEFAULT_WORKSPACE_SETTINGS
  );
  const [settingsStatus, setSettingsStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
      setUnreadCount(typeof data?.unreadCount === "number" ? data.unreadCount : 0);
    } catch (error) {
      console.error("[NOTIFICATIONS_FETCH_ERROR]", error);
    } finally {
      setLoading(false);
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
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) return;
        const data = await response.json();
        if (data?.settings) {
          setSettings({
            ...DEFAULT_WORKSPACE_SETTINGS,
            ...data.settings,
          });
        }
      } catch (error) {
        console.error("[NOTIFICATION_SETTINGS_LOAD_ERROR]", error);
      }
    };

    loadSettings();
  }, []);

  const filteredNotifications = useMemo(() => {
    let items = notifications;
    if (filter === "unread") {
      items = items.filter((item) => !item.readAt);
    }
    if (typeFilter !== "all") {
      items = items.filter((item) => item.type === typeFilter);
    }
    return items;
  }, [filter, notifications, typeFilter]);

  const typeOptions = useMemo(() => {
    const types = new Set(notifications.map((item) => item.type));
    return ["all", ...Array.from(types).sort()];
  }, [notifications]);

  const handleSettingsChange = (
    key: keyof WorkspaceSettingsPayload["notifications"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
    setSettingsStatus("saving");
  };

  useEffect(() => {
    if (settingsStatus !== "saving") return;

    const persist = async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings }),
        });
        if (!response.ok) {
          throw new Error("Failed to save settings");
        }
        setSettingsStatus("saved");
        setTimeout(() => setSettingsStatus("idle"), 1500);
      } catch (error) {
        console.error("[NOTIFICATION_SETTINGS_SAVE_ERROR]", error);
        setSettingsStatus("error");
        setTimeout(() => setSettingsStatus("idle"), 2000);
      }
    };

    persist();
  }, [settings, settingsStatus]);

  return (
    <div className="relative space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/50">
              <Bell className="size-3.5" />
              Notification stream
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Stay on top of every resume milestone.
            </h2>
            <p className="max-w-xl text-sm text-white/55">
              Import completions, export updates, and workspace alerts land here.
              Filter what matters and clear the noise when you are done.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08]"
              onClick={fetchNotifications}
            >
              <RefreshCcw className="size-4" />
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-emerald-400/90 text-black hover:bg-emerald-400"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <Check className="size-4" />
              Mark all read
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as "all" | "unread")}
          className="space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList variant="line" className="bg-transparent text-white/60">
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value ?? "all")}
              >
                <SelectTrigger className="h-9 w-[220px] border-white/10 bg-white/[0.03] text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0f0f0f] text-white">
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All types" : type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all">
            <NotificationList
              loading={loading}
              notifications={filteredNotifications}
              onItemClick={(item) => {
                if (item.link) {
                  router.push(item.link);
                }
                if (!item.readAt) {
                  markRead(item.id);
                }
              }}
            />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationList
              loading={loading}
              notifications={filteredNotifications}
              onItemClick={(item) => {
                if (item.link) {
                  router.push(item.link);
                }
                if (!item.readAt) {
                  markRead(item.id);
                }
              }}
            />
          </TabsContent>
        </Tabs>

        <Card className="h-fit border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Notification settings</CardTitle>
            <CardDescription className="text-white/55">
              Control which actions produce new alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
              <Sliders className="size-3.5" />
              Preferences
            </div>
            <ToggleRow
              label="Import completion"
              description="Notify when a resume import finishes."
              checked={settings.notifications.importComplete}
              onToggle={() => handleSettingsChange("importComplete")}
            />
            <ToggleRow
              label="Export ready"
              description="Alert once an export is ready."
              checked={settings.notifications.exportReady}
              onToggle={() => handleSettingsChange("exportReady")}
            />
            <ToggleRow
              label="AI enhancements"
              description="Send a note when AI updates a resume."
              checked={settings.notifications.aiUpdates}
              onToggle={() => handleSettingsChange("aiUpdates")}
            />
            <ToggleRow
              label="Product news"
              description="Occasional product announcements."
              checked={settings.notifications.productNews}
              onToggle={() => handleSettingsChange("productNews")}
            />

            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
              <BellRing className="size-3.5" />
              {settingsStatus === "saving"
                ? "Saving"
                : settingsStatus === "saved"
                ? "Saved"
                : settingsStatus === "error"
                ? "Save failed"
                : "Synced"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationList({
  loading,
  notifications,
  onItemClick,
}: {
  loading: boolean;
  notifications: NotificationItem[];
  onItemClick: (item: NotificationItem) => void;
}) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/45">
        You are all caught up. Generate a new resume or export a PDF to see alerts.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {notifications.map((notification) => (
        <button
          key={notification.id}
          type="button"
          onClick={() => onItemClick(notification)}
          className={cn(
            "group flex h-full flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:bg-white/[0.08]",
            !notification.readAt && "shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!notification.readAt && (
                <span className="size-2 rounded-full bg-emerald-400" />
              )}
              <span className="text-xs uppercase tracking-[0.25em] text-white/45">
                {notification.type.replace(/_/g, " ")}
              </span>
            </div>
            <span className="text-[11px] text-white/35">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-white">
              {notification.title}
            </h3>
            {notification.body && (
              <p className="text-sm text-white/60">{notification.body}</p>
            )}
          </div>
          <div className="mt-auto text-xs text-white/40">
            {notification.link ? "Open details" : "No linked action"}
          </div>
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/50">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={cn(
          "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold transition",
          checked
            ? "border-emerald-400/60 bg-emerald-400/90 text-black"
            : "border-white/10 text-white/50 hover:border-white/30"
        )}
      >
        {checked ? "On" : "Off"}
      </button>
    </div>
  );
}
