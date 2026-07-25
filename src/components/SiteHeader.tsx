"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useHydrated, useTheme } from "./ui";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/triage/", label: "Triage" },
  { href: "/routines/", label: "Routines" },
  { href: "/journal/", label: "Journal" },
  { href: "/desk/", label: "Desk" },
  { href: "/evidence/", label: "Evidence" },
];

/** Header for the full-width pages that sit outside the map shell. */
export function SiteHeader() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink"
          aria-label="Back to the map"
        >
          <ArrowLeft size={15} />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Atlas
          </span>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-2.5 py-1 text-sm text-ink-2 transition-colors hover:bg-bg-2 hover:text-ink",
                pathname.startsWith(n.href) && "bg-bg-2 text-ink",
              )}
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 rounded-full border border-rule p-1.5 text-ink-2 hover:text-ink"
          >
            {hydrated && theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
