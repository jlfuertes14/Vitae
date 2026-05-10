"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function signOut() {
  const supabase = await createClient();
  
  // Clear mock auth cookie if it exists
  const cookieStore = await cookies();
  cookieStore.delete("sb-mock-token");
  
  await supabase.auth.signOut();
  redirect("/");
}
