"use client";

import { useState, useRef } from "react";
import { Layout, Sparkles, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface FeatureSectionProps {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const FeatureSection = ({
  badge = "Elite Performance",
  heading = "Architected for Your Success",
  description = "Every pixel and every word is optimized to land you at the top of the candidate pile.",
  tabs = [
    {
      value: "ai-writing",
      icon: <Sparkles className="h-auto w-4 shrink-0" />,
      label: "AI Intelligence",
      content: {
        badge: "Next-Gen Writing",
        title: "Your AI Career Architect.",
        description:
          "Our advanced AI doesn't just check grammar—it re-engineers your professional narrative. Transform basic bullet points into high-impact achievement statements that command attention from top-tier recruiters.",
        buttonText: "Start Writing",
        imageSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
        imageAlt: "AI Writing Assistant",
      },
    },
    {
      value: "templates",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Premium Design",
      content: {
        badge: "Architectural Layouts",
        title: "The Harvard Gold Standard.",
        description:
          "First impressions are made in milliseconds. Our templates are built on the exact architectural principles used by top business schools and management consultancies like McKinsey and Goldman Sachs.",
        buttonText: "View Templates",
        imageSrc: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200&auto=format&fit=crop",
        imageAlt: "Professional Resume Templates",
      },
    },
    {
      value: "ats-scoring",
      icon: <Target className="h-auto w-4 shrink-0" />,
      label: "ATS Strategy",
      content: {
        badge: "Precision Scoring",
        title: "Defeat the Algorithm.",
        description:
          "98% of Fortune 500 companies use Applicant Tracking Systems. Our real-time scoring engine audits your resume against industry-specific algorithms to ensure you never get filtered out again.",
        buttonText: "Analyze Resume",
        imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        imageAlt: "ATS Scoring System",
      },
    },
  ],
}: FeatureSectionProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // 1. Scroll-Triggered Animations (Runs only once on scroll)
  useGSAP(
    () => {
      gsap.from(".section-header-badge", {
        y: 30,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".section-header-heading", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".section-header-desc", {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(".section-tabs-list", {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  // 2. Tab Content Animations (Runs every time the active tab changes)
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

      gsap.set(".animate-badge", { opacity: 0, y: -20 });
      gsap.set(".animate-title", { opacity: 0, x: -30 });
      gsap.set(".animate-desc", { opacity: 0, x: -20 });
      gsap.set(".animate-btn", { opacity: 0, scale: 0.9 });
      gsap.set(".animate-img", { opacity: 0, x: 40, scale: 1.05 });

      tl.to(".animate-badge", { opacity: 1, y: 0 }, 0.1)
        .to(".animate-title", { opacity: 1, x: 0 }, 0.2)
        .to(".animate-desc", { opacity: 1, x: 0 }, 0.3)
        .to(".animate-btn", { opacity: 1, scale: 1 }, 0.4)
        .to(".animate-img", { opacity: 1, x: 0, scale: 1 }, 0.2);
    },
    { scope: sectionRef, dependencies: [activeTab] }
  );

  // 3. Crystalline Mouse Tracking Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotlightRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Smoothly animate the spotlight position
    gsap.to(spotlightRef.current, {
      left: x,
      top: y,
      duration: 0.6,
      ease: "power2.out",
    });

    // Subtle 3D Tilt Effect
    const xPct = (x / width - 0.5) * 4; // Max 2deg tilt
    const yPct = (y / height - 0.5) * -4;

    gsap.to(cardRef.current, {
      rotateY: xPct,
      rotateX: yPct,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !spotlightRef.current) return;

    // Reset tilt and fade out spotlight
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.to(spotlightRef.current, {
      opacity: 0,
      duration: 0.8,
    });
  };

  const handleMouseEnter = () => {
    if (!spotlightRef.current) return;
    gsap.to(spotlightRef.current, {
      opacity: 1,
      duration: 0.4,
    });
  };

  return (
    <section ref={sectionRef} className="py-32 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center mb-16">
          <Badge variant="outline" className="section-header-badge border-white/20 text-white/60 bg-white/5 px-4 py-1">
            {badge}
          </Badge>
          <h2 className="section-header-heading max-w-3xl text-4xl font-semibold md:text-6xl tracking-tight">
            {heading}
          </h2>
          <p className="section-header-desc text-neutral-400 text-lg max-w-2xl">{description}</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col items-center"
        >
          <TabsList className="section-tabs-list flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-8 bg-transparent mb-16">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-base font-medium text-neutral-400 transition-all hover:bg-white/10 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-white"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative mx-auto w-full max-w-6xl rounded-3xl bg-neutral-900/50 border border-white/10 p-8 lg:p-16 backdrop-blur-sm overflow-hidden perspective-1000"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Crystalline Spotlight Light */}
            <div
              ref={spotlightRef}
              className="pointer-events-none absolute -inset-px z-30 opacity-0 transition-opacity duration-300"
              style={{
                background: "radial-gradient(600px circle at center, rgba(255,255,255,0.06), transparent 80%)",
                width: "1200px",
                height: "1200px",
                transform: "translate(-50%, -50%)",
              }}
            />

            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 outline-none"
              >
                <div className="flex flex-col gap-6 text-left">
                  <Badge variant="outline" className="animate-badge w-fit bg-white/5 border-white/10 text-white/80">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="animate-title text-3xl font-semibold lg:text-5xl leading-tight">
                    {tab.content.title}
                  </h3>
                  <p className="animate-desc text-neutral-400 text-lg leading-relaxed">
                    {tab.content.description}
                  </p>
                  <Button className="animate-btn mt-4 w-fit rounded-full bg-white text-black hover:bg-white/90 hover:text-black px-8 py-6 text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
                    {tab.content.buttonText}
                  </Button>
                </div>
                <div className="relative group animate-img">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <img
                    src={tab.content.imageSrc}
                    alt={tab.content.imageAlt}
                    className="relative rounded-2xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl w-full h-[400px] object-cover"
                  />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { FeatureSection };
