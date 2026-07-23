"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AgriPulseLogo } from "@/components/brand/AgriPulseLogo";

const links = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#contact", label: "Contact" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ap-line/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <AgriPulseLogo href="/" wordmark="AgriPulse" size="md" />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-ap-ink/70 transition hover:text-ap-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full bg-ap-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ap-green-deep sm:inline-flex"
          >
            Admin Login
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-ap-ink/70 hover:bg-ap-bg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ap-line bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ap-ink hover:bg-ap-bg"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-ap-green px-4 py-2.5 text-sm font-semibold text-white"
            >
              Admin Login
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
