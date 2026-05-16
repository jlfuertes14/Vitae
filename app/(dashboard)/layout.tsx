import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChatAssistant } from "@/components/editor/ChatAssistant";
import { getUserAvatarUrl } from "@/lib/avatar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dashboardUser = user
    ? {
        name:
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "User",
        email: user.email || "user@vitae.app",
        avatarUrl: getUserAvatarUrl(user.user_metadata),
      }
    : {
        name: "User",
        email: "user@vitae.app",
        avatarUrl: null,
      };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white dark">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_30%),linear-gradient(180deg,#0a0a0a_0%,#050505_100%)]" />
        <div className="absolute top-0 left-1/3 h-[420px] w-[420px] rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute right-[-80px] bottom-[-120px] h-[360px] w-[360px] rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar user={dashboardUser} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <ChatAssistant />
    </div>
  );
}
