"use client";

import { useEffect, useState } from "react";
import { BellRing, Gauge, Palette, Save, Sliders } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_WORKSPACE_SETTINGS, WorkspaceSettingsPayload } from "@/lib/settings";
import { cn } from "@/lib/utils";

type SettingsState = WorkspaceSettingsPayload;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(
    DEFAULT_WORKSPACE_SETTINGS
  );
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);

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
        console.error("[SETTINGS_LOAD_ERROR]", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!response.ok) {
        throw new Error("Failed to save settings");
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("[SETTINGS_SAVE_ERROR]", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_WORKSPACE_SETTINGS);
    setStatus("idle");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/55">
              <Sliders className="size-3.5" />
              Workspace controls
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Tune the experience for your team and resume flow.
            </h2>
            <p className="max-w-xl text-sm text-white/60">
              Your choices are stored locally for now. We can sync them to your
              account once persistence is ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08]"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/90"
              onClick={handleSave}
            >
              <Save className="size-4" />
              Save settings
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Notifications</CardTitle>
            <CardDescription className="text-white/55">
              Decide which events create alerts in your feed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              label="Import completion"
              description="Notify when a resume import finishes."
              checked={settings.notifications.importComplete}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    importComplete: !prev.notifications.importComplete,
                  },
                }))
              }
            />
            <ToggleRow
              label="Export ready"
              description="Alert once a PDF or DOCX export is ready."
              checked={settings.notifications.exportReady}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    exportReady: !prev.notifications.exportReady,
                  },
                }))
              }
            />
            <ToggleRow
              label="AI enhancements"
              description="Send a summary when AI updates your resume."
              checked={settings.notifications.aiUpdates}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    aiUpdates: !prev.notifications.aiUpdates,
                  },
                }))
              }
            />
            <ToggleRow
              label="Product news"
              description="Monthly updates about new templates and features."
              checked={settings.notifications.productNews}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    productNews: !prev.notifications.productNews,
                  },
                }))
              }
            />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Export defaults</CardTitle>
            <CardDescription className="text-white/55">
              Set the baseline for every resume export.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                <Palette className="size-3.5" />
                File format
              </div>
              <Select
                value={settings.exports.format}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    exports: {
                      ...prev.exports,
                      format: value as SettingsState["exports"]["format"],
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full border-white/10 bg-white/[0.03] text-white">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0f0f0f] text-white">
                  <SelectItem value="pdf">PDF (recommended)</SelectItem>
                  <SelectItem value="docx">DOCX</SelectItem>
                  <SelectItem value="txt">Plain text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                <Gauge className="size-3.5" />
                Paper size
              </div>
              <Select
                value={settings.exports.paper}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    exports: {
                      ...prev.exports,
                      paper: value as SettingsState["exports"]["paper"],
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full border-white/10 bg-white/[0.03] text-white">
                  <SelectValue placeholder="Select paper" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0f0f0f] text-white">
                  <SelectItem value="a4">A4 (global)</SelectItem>
                  <SelectItem value="letter">US Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ToggleRow
              label="Include cover sheet"
              description="Add a branded cover page to exports."
              checked={settings.exports.includeCover}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  exports: {
                    ...prev.exports,
                    includeCover: !prev.exports.includeCover,
                  },
                }))
              }
            />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Editor behavior</CardTitle>
            <CardDescription className="text-white/55">
              Configure how the editor behaves by default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              label="Auto-save"
              description="Continuously save resume edits as you type."
              checked={settings.editor.autoSave}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  editor: {
                    ...prev.editor,
                    autoSave: !prev.editor.autoSave,
                  },
                }))
              }
            />
            <ToggleRow
              label="Smart suggestions"
              description="Surface AI suggestions alongside edits."
              checked={settings.editor.smartSuggestions}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  editor: {
                    ...prev.editor,
                    smartSuggestions: !prev.editor.smartSuggestions,
                  },
                }))
              }
            />
            <ToggleRow
              label="Compact sidebar"
              description="Reduce sidebar width for more workspace space."
              checked={settings.editor.compactSidebar}
              onToggle={() =>
                setSettings((prev) => ({
                  ...prev,
                  editor: {
                    ...prev.editor,
                    compactSidebar: !prev.editor.compactSidebar,
                  },
                }))
              }
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
        <BellRing className="size-3.5" />
        {status === "saved"
          ? "Saved"
          : status === "error"
          ? "Save failed"
          : "Local preferences"}
      </div>
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
