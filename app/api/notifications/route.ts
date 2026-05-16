import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 8;

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get("limit") || DEFAULT_LIMIT);
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 50)
      : DEFAULT_LIMIT;

    const notifications = await prisma.notification.findMany({
      where: { supabaseId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { supabaseId: user.id, readAt: null },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const id = typeof payload?.id === "string" ? payload.id : null;
    const markAll = Boolean(payload?.all);

    if (!id && !markAll) {
      return NextResponse.json(
        { error: "Notification id or all flag is required" },
        { status: 400 }
      );
    }

    if (markAll) {
      await prisma.notification.updateMany({
        where: { supabaseId: user.id, readAt: null },
        data: { readAt: new Date() },
      });
    } else if (id) {
      await prisma.notification.updateMany({
        where: { id, supabaseId: user.id },
        data: { readAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
