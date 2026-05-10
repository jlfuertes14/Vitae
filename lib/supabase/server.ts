import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored if called from Server Component
          }
        },
      },
    }
  );

  // Mock Bypass Logic
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
    // Always return mock user for testing
    if (true) {
      return {
        ...client,
        auth: {
          ...client.auth,
          getUser: async () => ({
            data: {
              user: {
                id: "mock-user-id",
                email: "test@example.com",
                user_metadata: { full_name: "Test User" },
              },
            },
            error: null,
          }),
          getSession: async () => ({
            data: { session: { user: { id: "mock-user-id" } } },
            error: null,
          }),
          signOut: async () => {
            // Logic to clear mock cookie would go here, but for simplicity:
            return { error: null };
          },
        },
      } as any;
    }
  }

  return client;
}
