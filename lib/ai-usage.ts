import { AIAction } from "@prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { ensureAppUser } from "@/lib/app-user";
import { prisma } from "@/lib/prisma";

const DEFAULT_MODEL =
  process.env.OPEN_ROUTER_MODEL?.split(",")[0]?.trim() || "configured-ai";

const estimateTokens = (texts: string[]) => {
  const totalCharacters = texts.reduce(
    (sum, text) => sum + text.trim().length,
    0
  );

  return Math.max(1, Math.ceil(totalCharacters / 4));
};

interface LogAIUsageInput {
  action: AIAction;
  user: SupabaseUser;
  texts: string[];
  model?: string;
}

export async function logAIUsage({
  action,
  user,
  texts,
  model,
}: LogAIUsageInput) {
  try {
    const appUser = await ensureAppUser(user);

    await prisma.aIUsageLog.create({
      data: {
        userId: appUser.id,
        action,
        model: model?.trim() || DEFAULT_MODEL,
        tokens: estimateTokens(texts),
      },
    });
  } catch (error) {
    console.error("[AI_USAGE_LOG_ERROR]", error);
  }
}
