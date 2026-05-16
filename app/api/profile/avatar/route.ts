import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getUploadedAvatarPreviewUrl } from "@/lib/avatar";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const getFileExtension = (file: File) => {
  const mimeExtension = file.type.split("/")[1];
  if (mimeExtension) {
    return mimeExtension === "jpeg" ? "jpg" : mimeExtension;
  }

  const nameExtension = file.name.split(".").pop()?.trim().toLowerCase();
  return nameExtension || "jpg";
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const avatarPath =
      typeof user.user_metadata?.avatar_path === "string"
        ? user.user_metadata.avatar_path
        : "";

    if (!avatarPath) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin.storage.from(AVATAR_BUCKET).download(avatarPath);

    if (error || !data) {
      console.error("[AVATAR_GET_ERROR]", error);
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    const arrayBuffer = await data.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": data.type || "application/octet-stream",
        "Cache-Control": "private, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[AVATAR_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to load avatar" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" && user.id === "mock-user-id") {
      return NextResponse.json(
        { error: "Avatar uploads are unavailable while mock auth is enabled." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Avatar file is required." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use a PNG, JPG, WEBP, or GIF image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_AVATAR_SIZE) {
      return NextResponse.json(
        { error: "Avatar must be smaller than 4MB." },
        { status: 400 }
      );
    }

    const extension = getFileExtension(file);
    const nextAvatarPath = `profiles/${user.id}/avatar.${extension}`;
    const previousAvatarPath =
      typeof user.user_metadata?.avatar_path === "string"
        ? user.user_metadata.avatar_path
        : "";

    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from(AVATAR_BUCKET)
      .upload(nextAvatarPath, await file.arrayBuffer(), {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("[AVATAR_UPLOAD_ERROR]", uploadError);
      return NextResponse.json(
        { error: "Failed to upload avatar." },
        { status: 500 }
      );
    }

    if (previousAvatarPath && previousAvatarPath !== nextAvatarPath) {
      const { error: removeError } = await admin.storage
        .from(AVATAR_BUCKET)
        .remove([previousAvatarPath]);

      if (removeError) {
        console.error("[AVATAR_REMOVE_OLD_ERROR]", removeError);
      }
    }

    const avatarVersion = Date.now();
    const { error: metadataError } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        avatar_path: nextAvatarPath,
        avatar_url: null,
        avatar_version: avatarVersion,
      },
    });

    if (metadataError) {
      console.error("[AVATAR_METADATA_ERROR]", metadataError);
      return NextResponse.json(
        { error: "Failed to update avatar metadata." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      avatarUrl: getUploadedAvatarPreviewUrl(avatarVersion),
      avatarVersion,
    });
  } catch (error) {
    console.error("[AVATAR_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
