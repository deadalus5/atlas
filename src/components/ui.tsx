"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/* ---- segmented control ---------------------------------------------------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  ariaLabel,
}: {
  options: { value: T; label: string; title?: string; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex rounded-full border border-rule bg-surface p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            disabled={o.disabled}
            title={o.title}
            onClick={() => !o.disabled && onChange(o.value)}
            className={cn(
              "rounded-full font-medium transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              active
                ? "bg-accent text-accent-ink"
                : "text-ink-2 hover:text-ink disabled:opacity-40 disabled:hover:text-ink-2",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---- chip ---------------------------------------------------------------- */

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warn" | "danger" | "ok";
  className?: string;
}) {
  const tones = {
    neutral: "border-rule text-ink-2",
    accent: "border-accent/40 text-accent bg-accent/8",
    warn: "border-warn/40 text-warn bg-warn/8",
    danger: "border-danger/40 text-danger bg-danger/8",
    ok: "border-ok/40 text-ok bg-ok/8",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---- theme --------------------------------------------------------------- */

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("atlas.theme") as Theme | null;
    const t: Theme =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setThemeState(t);
  }, []);

  const setTheme = (t: Theme) => {
    localStorage.setItem("atlas.theme", t);
    const el = document.documentElement;
    el.classList.toggle("dark", t === "dark");
    el.classList.toggle("light", t !== "dark");
    setThemeState(t);
  };

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}

/* ---- hydration guard ------------------------------------------------------ */

/**
 * The store is persisted to localStorage, which does not exist when these pages
 * are prerendered at build time. Components that read persisted state wait for
 * this before trusting it.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
