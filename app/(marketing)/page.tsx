import Link from "next/link";
import { Globe, Briefcase, Plus, ArrowRightIcon, GitBranch } from "lucide-react";

import { FeatureSection } from "@/components/blocks/FeatureSection";
import { CrystalWand } from "@/components/shared/CrystalWand";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/ui/footer";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function LandingPage() {
  const ctaWords = [
    { text: "Build", className: "text-white" },
    { text: "your", className: "text-white" },
    { text: "elite", className: "text-white" },
    { text: "career", className: "text-white" },
    { text: "today.", className: "text-white/60" },
  ];
  const heroStats = [
    { value: "+12k", label: "resumes built" },
    { value: "98%", label: "ats pass rate" },
    { value: "+50", label: "elite templates" },
  ];

  return (
    <div className="min-h-screen w-full bg-black font-['Readex_Pro',_system-ui,_-apple-system,_sans-serif] antialiased">
      <CrystalWand />

      <section className="hero-section relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source
              src="/The_Architect_of_Successmp__The_Architect_of_Success.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <nav className="absolute top-0 right-0 left-0 z-20 hidden items-center justify-between gap-4 px-6 pt-10 md:flex md:px-12">
          <div className="flex items-center gap-4 rounded-full border border-white/10 bg-neutral-900/40 py-3 pr-8 pl-6 shadow-2xl backdrop-blur-2xl transition-all hover:border-white/20">
            <div className="relative size-10">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-full"
              >
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
            <span className="text-base font-semibold tracking-tight text-white">
              Vitae
            </span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-neutral-900/40 px-4 py-3 shadow-2xl backdrop-blur-2xl transition-all hover:border-white/20 md:flex">
            {["platform", "templates", "company", "support"].map((link) => (
              <Link
                key={link}
                href={link === "templates" ? "/templates" : "#"}
                className="rounded-full px-6 py-2 text-base text-neutral-300 transition-all hover:bg-white/5 hover:text-white"
              >
                {link}
              </Link>
            ))}
          </div>

          <Link href="/signup">
            <Button className="rounded-full border border-white/20 bg-neutral-900/60 px-10 py-7 text-base font-medium text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-white hover:text-black">
              get started
            </Button>
          </Link>
        </nav>

        <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-5 md:hidden">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-neutral-900/40 py-2.5 pr-4 pl-3 shadow-2xl backdrop-blur-2xl">
            <div className="relative size-6">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-full"
              >
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
            <span className="text-sm font-semibold tracking-tight text-white">
              Vitae
            </span>
          </div>

          <Link href="/signup">
            <Button className="rounded-full border border-white/20 bg-neutral-900/60 px-5 py-4 text-sm font-medium text-white shadow-2xl backdrop-blur-xl transition-all hover:bg-white hover:text-black">
              get started
            </Button>
          </Link>
        </nav>

        <div className="relative z-10 flex h-full flex-col px-4 pb-6 pt-24 md:hidden">
          <div className="mt-10 space-y-3">
            <h1 className="hero-title text-[21vw] font-medium text-white">
              craft
            </h1>
            <h1 className="hero-title text-right text-[21vw] font-medium text-white">
              your
            </h1>
            <h1 className="hero-title text-[21vw] font-medium text-white">
              future
            </h1>
          </div>

          <div className="mt-auto space-y-4 pointer-events-auto">
            <div className="max-w-[320px] rounded-2xl border border-white/10 bg-black/24 p-3 backdrop-blur-sm">
              <p className="text-sm font-light leading-6 text-white/85">
                elite resumes powered by ai, designed for high-performance careers.
                ats-optimized and free forever.
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/signup" className="flex-1">
                <Button className="h-12 w-full rounded-full bg-white text-sm font-medium text-black transition-all hover:bg-white/90">
                  Start building
                </Button>
              </Link>
              <Link href="/templates" className="flex-1">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-white/20 bg-black/24 text-sm text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                >
                  Templates
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 pointer-events-auto">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-black/24 p-3 backdrop-blur-sm"
              >
                <div className="text-2xl font-medium tracking-tight text-white">
                  {stat.value}
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/65">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black" />
        </div>

        <div className="relative z-10 hidden h-full w-full pointer-events-none md:block">
          <h1 className="hero-title absolute top-[18%] left-4 text-[14vw] font-medium text-white md:top-[18%] md:left-10 md:text-[13vw]">
            craft
          </h1>
          <h1 className="hero-title absolute top-[38%] right-4 text-[14vw] font-medium text-white md:top-[38%] md:right-10 md:text-[13vw]">
            your
          </h1>
          <h1 className="hero-title absolute top-[58%] left-[18%] text-[14vw] font-medium text-white md:top-[58%] md:left-[28%] md:text-[13vw]">
            future
          </h1>

          <div className="pointer-events-auto">
            <p className="absolute top-[46%] left-6 max-w-[280px] text-base font-light leading-snug text-white/80 md:left-10 md:max-w-[320px]">
              elite resumes powered by ai, designed for high-performance careers.
              ats-optimized and free forever.
            </p>
          </div>

          <div className="absolute top-[14%] right-6 md:right-24">
            <div className="flex items-center justify-end gap-3">
              <div className="hidden h-px w-24 rotate-[20deg] bg-white/30 md:block" />
              <span className="text-4xl font-medium tracking-tight text-white md:text-5xl">
                +12k
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-white/60 md:text-sm">
              resumes built
            </p>
          </div>

          <div className="absolute bottom-20 left-6 md:bottom-24 md:left-20">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-medium tracking-tight text-white md:text-5xl">
                98%
              </span>
              <div className="hidden h-px w-24 rotate-[-20deg] bg-white/30 md:block" />
            </div>
            <p className="mt-1 text-xs text-white/60 md:text-sm">
              ats pass rate
            </p>
          </div>

          <div className="absolute right-6 bottom-16 md:right-20 md:bottom-20">
            <div className="flex items-center justify-end gap-3">
              <div className="hidden h-px w-24 rotate-[-20deg] bg-white/30 md:block" />
              <span className="text-4xl font-medium tracking-tight text-white md:text-5xl">
                +50
              </span>
            </div>
            <p className="mt-1 text-right text-xs text-white/60 md:text-sm">
              elite templates
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black" />
        </div>
      </section>

      <FeatureSection />

      <section
        id="cta"
        className="relative overflow-hidden border-t border-white/5 bg-black py-48"
      >
        <div className="relative flex w-full flex-col items-center justify-between gap-y-12 border-y border-white/10 bg-[radial-gradient(35%_80%_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-6 py-24 md:px-12">
          <Plus
            className="absolute top-[-12px] left-[-12px] z-10 size-6 text-white/30"
            strokeWidth={1}
          />
          <Plus
            className="absolute top-[-12px] right-[-12px] z-10 size-6 text-white/30"
            strokeWidth={1}
          />
          <Plus
            className="absolute bottom-[-12px] left-[-12px] z-10 size-6 text-white/30"
            strokeWidth={1}
          />
          <Plus
            className="absolute right-[-12px] bottom-[-12px] z-10 size-6 text-white/30"
            strokeWidth={1}
          />

          <div className="-inset-y-12 pointer-events-none absolute left-0 w-px border-l border-white/10" />
          <div className="-inset-y-12 pointer-events-none absolute right-0 w-px border-r border-white/10" />
          <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-white/10" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <TypewriterEffectSmooth words={ctaWords} className="mb-4" />
            <p className="mb-10 max-w-2xl text-lg text-neutral-400">
              Join thousands of professionals using Vitae to create elite
              resumes. It&apos;s completely free, forever.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="group h-16 rounded-full bg-white px-12 text-lg text-black shadow-2xl transition-all hover:bg-white/90 hover:text-black"
              >
                Get Started
                <ArrowRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer
        id="footer"
        logo={
          <div className="relative size-6">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full"
            >
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
        }
        brandName="Vitae"
        socialLinks={[
          {
            icon: <Globe className="size-5" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Briefcase className="size-5" />,
            href: "https://linkedin.com",
            label: "LinkedIn",
          },
          {
            icon: <GitBranch className="size-5" />,
            href: "https://github.com",
            label: "GitHub",
          },
        ]}
        mainLinks={[
          { href: "#", label: "Platform" },
          { href: "/templates", label: "Templates" },
          { href: "#cta", label: "Pricing" },
          { href: "#footer", label: "Contact" },
        ]}
        legalLinks={[
          { href: "#", label: "Privacy" },
          { href: "#", label: "Terms" },
        ]}
        copyright={{
          text: `© ${new Date().getFullYear()} Vitae`,
          license: "Harvard-style resumes powered by AI.",
        }}
      />
    </div>
  );
}
