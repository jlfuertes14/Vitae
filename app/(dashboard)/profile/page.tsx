"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Camera, Mail, Sparkles, User } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { getUploadedAvatarPreviewUrl } from "@/lib/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ProfileState {
  fullName: string;
  email: string;
  avatarUrl: string;
  headline: string;
  bio: string;
}

const MAX_AVATAR_SIZE = 4 * 1024 * 1024;

export default function ProfilePage() {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<ProfileState>({
    fullName: "",
    email: "",
    avatarUrl: "",
    headline: "",
    bio: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;

      const metadata = data.user.user_metadata || {};
      setProfile({
        fullName: metadata.full_name || data.user.email?.split("@")[0] || "",
        email: data.user.email || "",
        avatarUrl: metadata.avatar_url || "",
        headline: metadata.headline || "",
        bio: metadata.bio || "",
      });
      setUploadedAvatarUrl(
        typeof metadata.avatar_path === "string" && metadata.avatar_path
          ? getUploadedAvatarPreviewUrl(
              typeof metadata.avatar_version === "string" ||
                typeof metadata.avatar_version === "number"
                ? metadata.avatar_version
                : null
            )
          : null
      );
    };

    loadProfile();
  }, [supabase]);

  const handleChange = (field: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const avatarUrl = profile.avatarUrl.trim();

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.fullName,
        avatar_url: avatarUrl || null,
        headline: profile.headline,
        bio: profile.bio,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  };

  const handleAvatarUpload = async (file: File) => {
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("Avatar must be smaller than 4MB.");
      return;
    }

    setAvatarUploading(true);
    setAvatarError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        avatarUrl?: string;
        error?: string;
      };

      if (!response.ok) {
        setAvatarError(payload.error || "Failed to upload avatar.");
        return;
      }

      setUploadedAvatarUrl(payload.avatarUrl || getUploadedAvatarPreviewUrl(Date.now()));
      setProfile((prev) => ({ ...prev, avatarUrl: "" }));
    } catch (error) {
      console.error("[AVATAR_UPLOAD_ERROR]", error);
      setAvatarError("Failed to upload avatar.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const displayAvatarUrl = profile.avatarUrl.trim() || uploadedAvatarUrl || "";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-6">
        <div className="absolute right-6 top-6 size-28 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/55">
              <Sparkles className="size-3.5" />
              Identity studio
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              Shape the profile that powers your workspace.
            </h2>
            <p className="max-w-xl text-sm text-white/60">
              Update your name, avatar, and personal story. These details will
              appear in dashboards, notifications, and future exports.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Account snapshot</CardTitle>
            <CardDescription className="text-white/55">
              A quick look at how your profile appears across Vitae.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08]">
                {displayAvatarUrl ? (
                  <Image
                    src={displayAvatarUrl}
                    alt={profile.fullName || "User"}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white/70">
                    {profile.fullName ? profile.fullName[0] : "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {profile.fullName || "Your name"}
                </p>
                <p className="text-sm text-white/55">
                  {profile.headline || "Add a headline to describe your role"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
                <Mail className="size-3.5" />
                Contact
              </div>
              <p className="mt-3 text-sm text-white/70">
                {profile.email || "Add your email"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
                <User className="size-3.5" />
                Bio
              </div>
              <p className="mt-3 text-sm text-white/60">
                {profile.bio ||
                  "Share a short bio to personalize future exports and summaries."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-white">Edit profile</CardTitle>
            <CardDescription className="text-white/55">
              These updates sync with your Supabase account metadata.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white/70">Full name</Label>
                  <Input
                    value={profile.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Jane Doe"
                    className="border-white/10 bg-white/[0.03] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Email</Label>
                  <Input
                    value={profile.email}
                    readOnly
                    className="border-white/10 bg-white/[0.02] text-white/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Headline</Label>
                <Input
                  value={profile.headline}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  placeholder="Senior Product Designer | Fintech"
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">External avatar URL</Label>
                <div className="relative">
                  <Input
                    value={profile.avatarUrl}
                    onChange={(e) => handleChange("avatarUrl", e.target.value)}
                    placeholder="https://..."
                    className="border-white/10 bg-white/[0.03] pl-10 text-white"
                  />
                  <Camera className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    className={cn(
                      "cursor-pointer rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08]",
                      avatarUploading && "opacity-60"
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={avatarUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAvatarUpload(file);
                          e.target.value = "";
                        }
                      }}
                    />
                    {avatarUploading ? "Uploading..." : "Upload avatar"}
                  </label>
                  <span className="text-xs text-white/40">
                    Uploads stay private. PNG, JPG, WEBP, or GIF up to 4MB
                  </span>
                </div>
                <p className="text-xs text-white/35">
                  Leave the URL blank to use your private uploaded avatar.
                </p>
                {avatarError ? (
                  <p className="text-xs text-red-200/90">{avatarError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us what makes your career story distinct."
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-white/90"
                  disabled={status === "saving"}
                >
                  {status === "saving" ? "Saving changes..." : "Save profile"}
                </Button>
                <span
                  className={cn(
                    "text-xs uppercase tracking-[0.3em] text-white/40",
                    status === "saved" && "text-emerald-300"
                  )}
                >
                  {status === "saved" ? "Saved" : ""}
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
