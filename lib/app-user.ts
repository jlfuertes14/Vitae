import type { User as SupabaseUser } from "@supabase/supabase-js";

import { getUserAvatarUrl } from "@/lib/avatar";
import { prisma } from "@/lib/prisma";

const getUserName = (user: SupabaseUser) => {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  if (fullName) {
    return fullName;
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "User";
};

const getUserEmail = (user: SupabaseUser) => {
  return user.email?.trim() || `${user.id}@users.vitae.local`;
};

export async function ensureAppUser(user: SupabaseUser) {
  return prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {
      email: getUserEmail(user),
      name: getUserName(user),
      avatarUrl: getUserAvatarUrl(user.user_metadata),
    },
    create: {
      supabaseId: user.id,
      email: getUserEmail(user),
      name: getUserName(user),
      avatarUrl: getUserAvatarUrl(user.user_metadata),
    },
  });
}
