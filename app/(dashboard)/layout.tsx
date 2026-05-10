import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ChatAssistant } from "@/components/editor/ChatAssistant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Fetch user from Supabase session
  const mockUser = {
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
        <Topbar user={mockUser} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <ChatAssistant />
    </div>
  );
}
