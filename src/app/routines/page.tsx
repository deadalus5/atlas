"use client";

import { useState } from "react";
import { Clock, Play } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { RoutinePlayer } from "@/components/RoutinePlayer";
import { MODALITY_COPY, DRILL_BY_ID, type Drill } from "@/data";
import { ROUTINES } from "@/data/routines";
import { useAtlas } from "@/store/atlas";

export default function RoutinesPage() {
  const [active, setActive] = useState<Drill[] | null>(null);
  const logCompletion = useAtlas((s) => s.logCompletion);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          Ready-made
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Routines</h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-2">
          If you would rather not build your own, start with one of these. Each
          one is ordered the same way a session should be — joints freed first,
          then release, then the muscles that need waking, then the stretch.
        </p>

        <div className="mt-7 space-y-4">
          {ROUTINES.map((r) => {
            const drills = r.drills
              .map((d) => DRILL_BY_ID.get(d))
              .filter((d): d is Drill => Boolean(d));
            return (
              <article
                key={r.id}
                className="rounded-card border border-rule bg-surface p-5"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-lg font-semibold">{r.name}</h2>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-3">
                    <Clock size={12} /> {r.minutes} min · {drills.length} moves
                  </span>
                </div>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-ink-2">
                  {r.forWho}
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {drills.map((d) => (
                    <li
                      key={d.id}
                      className="rounded-full border border-rule px-2.5 py-0.5 text-[11px] text-ink-2"
                    >
                      <span className="text-ink-3">
                        {MODALITY_COPY[d.modality].label}
                      </span>{" "}
                      {d.name}
                    </li>
                  ))}
                </ul>

                {r.note && (
                  <p className="mt-3 border-l-2 border-rule-2 pl-3 text-xs leading-relaxed text-ink-3">
                    {r.note}
                  </p>
                )}

                <button
                  onClick={() => setActive(drills)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                >
                  <Play size={14} /> Start
                </button>
              </article>
            );
          })}
        </div>
      </main>

      {active && (
        <RoutinePlayer
          drills={active}
          onClose={() => setActive(null)}
          onComplete={() =>
            logCompletion(
              [...new Set(active.flatMap((d) => d.targets))],
              Math.round(active.reduce((a, d) => a + d.seconds, 0) / 60),
            )
          }
        />
      )}
    </>
  );
}
