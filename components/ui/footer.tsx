import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FooterProps {
  id?: string;
  logo: ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
}

export function Footer({
  id,
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    <footer
      id={id}
      className="border-t border-white/5 bg-black px-6 py-8 md:px-12 lg:py-10"
    >
      <div className="w-full">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            href="/"
            className="flex items-center gap-x-3"
            aria-label={brandName}
          >
            {logo}
            <span className="text-xl font-bold text-white">{brandName}</span>
          </Link>

          <ul className="flex list-none space-x-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "icon-lg" }),
                    "rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <div className="text-sm leading-6 text-neutral-500">
            <div>{copyright.text}</div>
            {copyright.license ? <div>{copyright.license}</div> : null}
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:mt-0 lg:items-end">
            <nav>
              <ul className="-mx-2 -my-1 flex list-none flex-wrap lg:justify-end">
              {mainLinks.map((link) => (
                <li key={link.label} className="mx-2 my-1 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              </ul>
            </nav>

            <ul className="-mx-3 -my-1 flex list-none flex-wrap lg:justify-end">
              {legalLinks.map((link) => (
                <li key={link.label} className="mx-3 my-1 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-neutral-500 underline-offset-4 hover:text-neutral-300 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
