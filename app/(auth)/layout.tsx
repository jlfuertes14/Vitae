"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/shared/Logo";

function VitaeMark({ size = "size-8" }: { size?: string }) {
  return (
    <div className={`relative ${size}`}>
      <svg viewBox="0 0 32 32" fill="none" className="size-full">
        <path
          d="M16 4L28 16L24 16L16 8L8 16L4 16L16 4Z"
          className="fill-white"
        />
        <path
          d="M16 14L24 22L20 22L16 18L12 22L8 22L16 14Z"
          className="fill-white/60"
        />
        <rect
          x="10"
          y="24"
          width="12"
          height="2.5"
          rx="1.25"
          className="fill-white/30"
        />
      </svg>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullscreenAuth = pathname === "/login" || pathname === "/signup";

  if (isFullscreenAuth) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/option3.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/56" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_38%)]" />
        </div>

        <div className="absolute top-6 left-6 z-20 sm:top-8 sm:left-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white/90 transition hover:text-white"
          >
            <VitaeMark />
            <span className="text-[1.35rem] font-semibold tracking-tight">Vitae</span>
          </Link>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-[460px] rounded-[28px] border border-white/12 bg-black/45 p-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[height,padding,transform,opacity] duration-300 sm:p-8">
            {children}
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="relative hidden items-center justify-center overflow-hidden bg-vitae-midnight p-12 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-vitae-midnight via-vitae-charcoal to-vitae-midnight" />
        <div className="absolute top-1/4 left-1/3 size-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-[300px] rounded-full bg-vitae-emerald/5 blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative size-16">
              <svg viewBox="0 0 32 32" fill="none" className="size-full">
                <path d="M16 4L28 16L24 16L16 8L8 16L4 16L16 4Z" fill="oklch(0.65 0.18 250)" />
                <path d="M16 14L24 22L20 22L16 18L12 22L8 22L16 14Z" fill="oklch(0.65 0.18 250 / 0.6)" />
                <rect x="10" y="24" width="12" height="2.5" rx="1.25" fill="oklch(0.65 0.18 250 / 0.3)" />
              </svg>
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white font-heading">
            Harvard-style resumes <br />
            <span className="vitae-gradient-text">powered by AI.</span>
          </h2>
          <p className="text-base leading-relaxed text-vitae-silver">
            Create elite, ATS-optimized resumes that get interviews. Trusted by
            professionals worldwide. 100% free.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
