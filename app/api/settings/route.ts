import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_WORKSPACE_SETTINGS, WorkspaceSettingsPayload } from "@/lib/settings";

const normalizeSettings = (
  settings: Partial<WorkspaceSettingsPayload> | null
): WorkspaceSettingsPayload => {
  return {
    notifications: {
      ...DEFAULT_WORKSPACE_SETTINGS.notifications,
      ...(settings?.notifications || {}),
    },
    exports: {
      ...DEFAULT_WORKSPACE_SETTINGS.exports,
      ...(settings?.exports || {}),
    },
    editor: {
      ...DEFAULT_WORKSPACE_SETTINGS.editor,
      ...(settings?.editor || {}),
    },
  };
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

    const record = await prisma.workspaceSettings.findUnique({
      where: { supabaseId: user.id },
    });

    const settings = normalizeSettings(
      record
        ? {
            notifications: record.notifications as any,
            exports: record.exports as any,
            editor: record.editor as any,
          }
        : null
    );

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[SETTINGS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await req.json()) as { settings?: WorkspaceSettingsPayload };
    if (!payload?.settings) {
      return NextResponse.json(
        { error: "Settings payload is required" },
        { status: 400 }
      );
    }

    const normalized = normalizeSettings(payload.settings);

    const updated = await prisma.workspaceSettings.upsert({
      where: { supabaseId: user.id },
      update: {
        notifications: normalized.notifications as any,
        exports: normalized.exports as any,
        editor: normalized.editor as any,
      },
      create: {
        supabaseId: user.id,
        notifications: normalized.notifications as any,
        exports: normalized.exports as any,
        editor: normalized.editor as any,
      },
    });

    return NextResponse.json({
      settings: {
        notifications: updated.notifications,
        exports: updated.exports,
        editor: updated.editor,
      },
    });
  } catch (error) {
    console.error("[SETTINGS_PUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
