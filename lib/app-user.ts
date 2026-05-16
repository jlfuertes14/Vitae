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
  const email = getUserEmail(user);
  
  return prisma.user.upsert({
    where: { email: email },
    update: {
      supabaseId: user.id, // Link to the latest provider's ID
      name: getUserName(user),
      avatarUrl: getUserAvatarUrl(user.user_metadata),
    },
    create: {
      supabaseId: user.id,
      email: email,
      name: getUserName(user),
      avatarUrl: getUserAvatarUrl(user.user_metadata),
    },
  });
}
