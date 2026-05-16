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
    const originalAuth = client.auth;
    const mockUser = {
      id: "mock-user-id",
      email: "test@example.com",
      user_metadata: { full_name: "Test User" },
    };

    return {
      ...client,
      auth: {
        ...originalAuth,
        getUser: async () => {
          const result = await originalAuth.getUser();

          if (result.data.user) {
            return result;
          }

          return {
            data: { user: mockUser },
            error: null,
          };
        },
        getSession: async () => {
          const result = await originalAuth.getSession();

          if (result.data.session) {
            return result;
          }

          return {
            data: { session: { user: { id: mockUser.id } } },
            error: null,
          };
        },
        signOut: async () => {
          const result = await originalAuth.signOut();
          return result.error ? { error: null } : result;
        },
      },
    } as typeof client;
  }

  return client;
}
