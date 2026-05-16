import type { Metadata } from "next";
import { Inter, Geist_Mono, EB_Garamond, Readex_Pro } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vitae — Build your resume now using AI",
    template: "%s | Vitae",
  },
  description:
    "Create elite, ATS-optimized resumes with AI. Harvard-style templates trusted by professionals. 100% free.",
  keywords: [
    "resume builder",
    "AI resume",
    "Harvard resume",
    "ATS resume",
    "free resume builder",
    "professional resume",
    "career",
  ],
  authors: [{ name: "Vitae" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vitae",
    title: "Vitae — Harvard-Style Resumes Powered by AI",
    description:
      "Create elite, ATS-optimized resumes with AI. Harvard-style templates trusted by professionals. 100% free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitae — Harvard-Style Resumes Powered by AI",
    description:
      "Create elite, ATS-optimized resumes with AI. 100% free.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${garamond.variable} ${readexPro.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
