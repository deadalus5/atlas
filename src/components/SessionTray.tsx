"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { findShape } from "@/anatomy";
import { getStructure } from "@/data";
import { useAtlas } from "@/store/atlas";
import { useHydrated } from "./ui";

export function SessionTray() {
  const hydrated = useHydrated();
  const session = useAtlas((s) => s.session);
  const remove = useAtlas((s) => s.removeFromSession);
  const clear = useAtlas((s) => s.clearSession);

  if (!hydrated || session.length === 0) return null;

  const nameOf = (id: string) =>
    getStructure(id)?.name ?? findShape("posterior", id)?.label ?? id;

  return (
    <div className="z-30 shrink-0 border-t border-rule bg-surface px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
          Session
        </span>

        {session.map((i) => (
          <span
            key={i.structureId}
            className="inline-flex items-center gap-1 rounded-full border border-rule bg-bg-2 py-0.5 pl-2.5 pr-1 text-xs"
          >
            {nameOf(i.structureId)}
            <button
              onClick={() => remove(i.structureId)}
              aria-label={`Remove ${nameOf(i.structureId)} from session`}
              className="rounded-full p-0.5 text-ink-3 hover:text-danger"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <button
          onClick={clear}
          className="text-xs text-ink-3 underline underline-offset-2 hover:text-ink"
        >
          clear
        </button>

        <Link
          href="/session/"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          Build routine
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
