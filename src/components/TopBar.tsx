"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useAtlas } from "@/store/atlas";
import { Segmented, useHydrated, useTheme } from "./ui";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/triage/", label: "Triage" },
  { href: "/routines/", label: "Routines" },
  { href: "/journal/", label: "Journal" },
  { href: "/desk/", label: "Desk" },
  { href: "/evidence/", label: "Evidence" },
];

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const view = useAtlas((s) => s.view);
  const setView = useAtlas((s) => s.setView);
  const mode = useAtlas((s) => s.mode);
  const setMode = useAtlas((s) => s.setMode);
  const depth = useAtlas((s) => s.depth);
  const setDepth = useAtlas((s) => s.setDepth);

  return (
    <header className="z-30 shrink-0 border-b border-rule bg-surface/80 backdrop-blur">
      <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight">
            Atlas
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:inline">
            point at what hurts
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Segmented
            ariaLabel="Body view"
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: "posterior", label: "Back" },
              {
                value: "anterior",
                label: "Front",
                title: "Front view",
              },
            ]}
          />
          <Segmented
            ariaLabel="Map mode"
            size="sm"
            value={mode}
            onChange={(m) => { setMode(m); router.push("/"); }}
            options={[
              { value: "explore", label: "What is this?" },
              { value: "referral", label: "It hurts here" },
            ]}
          />
          <Segmented
            ariaLabel="Language depth"
            size="sm"
            value={depth}
            onChange={setDepth}
            options={[
              { value: "plain", label: "Plain" },
              { value: "clinical", label: "Clinical" },
            ]}
          />
        </div>

        <nav className="ml-auto hidden items-center gap-1 lg:ml-3 lg:flex">
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
        </nav>

        <button
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="ml-auto rounded-full border border-rule p-1.5 text-ink-2 transition-colors hover:text-ink lg:ml-1"
        >
          {hydrated && theme === "dark" ? (
            <Sun size={15} />
          ) : (
            <Moon size={15} />
          )}
        </button>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
          className="rounded-full border border-rule p-1.5 text-ink-2 lg:hidden"
        >
          {open ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-rule px-3 py-3 lg:hidden">
          <div className="flex flex-wrap gap-2">
            <Segmented
              ariaLabel="Body view"
              size="sm"
              value={view}
              onChange={setView}
              options={[
                { value: "posterior", label: "Back" },
                { value: "anterior", label: "Front" },
              ]}
            />
            <Segmented
              ariaLabel="Language depth"
              size="sm"
              value={depth}
              onChange={setDepth}
              options={[
                { value: "plain", label: "Plain" },
                { value: "clinical", label: "Clinical" },
              ]}
            />
          </div>
          <Segmented
            ariaLabel="Map mode"
            size="sm"
            className="self-start"
            value={mode}
            onChange={(m) => { setMode(m); router.push("/"); }}
            options={[
              { value: "explore", label: "What is this?" },
              { value: "referral", label: "It hurts here" },
            ]}
          />
          <nav className="flex flex-wrap gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-full border border-rule px-3 py-1 text-sm text-ink-2"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
