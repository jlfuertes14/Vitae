import { prisma } from "@/lib/prisma";
import { DEFAULT_WORKSPACE_SETTINGS } from "@/lib/settings";

export type NotificationKind =
  | "SYSTEM"
  | "RESUME_IMPORT"
  | "RESUME_EXPORT"
  | "RESUME_UPDATE";

interface CreateNotificationInput {
  supabaseId: string;
  title: string;
  body?: string;
  link?: string;
  type?: NotificationKind;
}

export async function createNotification({
  supabaseId,
  title,
  body,
  link,
  type = "SYSTEM",
}: CreateNotificationInput) {
  try {
    const settings = await prisma.workspaceSettings.findUnique({
      where: { supabaseId },
      select: { notifications: true },
    });

    const notificationPrefs = {
      ...DEFAULT_WORKSPACE_SETTINGS.notifications,
      ...(settings?.notifications as Record<string, boolean> | undefined),
    };

    const isEnabled = (() => {
      switch (type) {
        case "RESUME_IMPORT":
          return notificationPrefs.importComplete;
        case "RESUME_EXPORT":
          return notificationPrefs.exportReady;
        case "RESUME_UPDATE":
          return notificationPrefs.aiUpdates;
        case "SYSTEM":
        default:
          return notificationPrefs.productNews;
      }
    })();

    if (!isEnabled) {
      return null;
    }

    return await prisma.notification.create({
      data: {
        supabaseId,
        title,
        body: body || null,
        link: link || null,
        type: type as any,
      },
    });
  } catch (error) {
    console.error("[NOTIFICATION_CREATE_ERROR]", error);
    return null;
  }
}
