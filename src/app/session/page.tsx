"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, Clock, Play, Sparkles } from "lucide-react";
import { findShape } from "@/anatomy";
import { SiteHeader } from "@/components/SiteHeader";
import { RoutinePlayer } from "@/components/RoutinePlayer";
import { Chip, useHydrated } from "@/components/ui";
import {
  MODALITY_COPY,
  MODALITY_ORDER,
  buildRoutine,
  fmtDuration,
  getStructure,
} from "@/data";
import { useAtlas } from "@/store/atlas";
import { cn } from "@/lib/cn";

const BUDGETS = [3, 5, 10, 20, 30];

const SAFETY_QUESTIONS = [
  { key: "legSymptoms", label: "Pain or tingling down a leg" },
  { key: "pregnant", label: "Pregnant" },
  { key: "osteoporosis", label: "Osteoporosis" },
  { key: "hypermobile", label: "Hypermobile joints" },
] as const;

export default function SessionPage() {
  const hydrated = useHydrated();
  const session = useAtlas((s) => s.session);
  const minutes = useAtlas((s) => s.minutesBudget);
  const setMinutes = useAtlas((s) => s.setMinutes);
  const safety = useAtlas((s) => s.safety);
  const setSafety = useAtlas((s) => s.setSafety);
  const logCompletion = useAtlas((s) => s.logCompletion);
  const [playing, setPlaying] = useState(false);

  const ids = useMemo(() => session.map((s) => s.structureId), [session]);
  const routine = useMemo(
    () => buildRoutine(ids, minutes, safety),
    [ids, minutes, safety],
  );

  const nameOf = (id: string) =>
    getStructure(id)?.name ?? findShape("posterior", id)?.label ?? id;

  if (!hydrated) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10" />
      </>
    );
  }

  if (session.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold">Nothing selected yet</h1>
          <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-ink-2">
            Tap the parts of the map that are giving you trouble and they will
            collect here. Atlas then orders them properly and times you through.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-accent px-5 py-2 font-medium text-accent-ink"
          >
            Open the map
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          Your session
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          {session.length} area{session.length > 1 ? "s" : ""}, ordered properly
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-ink-2">
          Not in the order you tapped them. Joints get freed before muscles get
          stretched, and sleepy muscles get woken before they are asked to work —
          that sequence is most of the difference between a routine that helps
          and a list of stretches.
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {ids.map((id) => (
            <Chip key={id} tone={routine.covered.includes(id) ? "ok" : "warn"}>
              {nameOf(id)}
            </Chip>
          ))}
        </div>

        {/* ---- time budget ---- */}
        <section className="mt-7">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Clock size={14} /> How long have you got?
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {BUDGETS.map((b) => (
              <button
                key={b}
                onClick={() => setMinutes(b)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  b === minutes
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-rule text-ink-2 hover:text-ink",
                )}
              >
                {b} min
              </button>
            ))}
          </div>
        </section>

        {/* ---- safety ---- */}
        <section className="mt-6 rounded-card border border-rule bg-bg-2 p-4">
          <h2 className="text-sm font-semibold">Anything Atlas should know?</h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-3">
            This only ever removes things from your routine, and it always tells
            you what it removed and why. It stays on your device.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SAFETY_QUESTIONS.map((q) => (
              <button
                key={q.key}
                aria-pressed={safety[q.key]}
                onClick={() => setSafety({ [q.key]: !safety[q.key] })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  safety[q.key]
                    ? "border-warn bg-warn/15 text-warn"
                    : "border-rule text-ink-2 hover:text-ink",
                )}
              >
                {q.label}
              </button>
            ))}
          </div>
        </section>

        {/* ---- routine ---- */}
        <section className="mt-7">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-lg font-semibold">
              {routine.steps.length} moves · {fmtDuration(routine.seconds)}
            </h2>
            {routine.uncovered.length > 0 && (
              <p className="text-xs text-warn">
                {routine.uncovered.map(nameOf).join(", ")} did not fit in{" "}
                {minutes} minutes — give it longer to include{" "}
                {routine.uncovered.length > 1 ? "them" : "it"}.
              </p>
            )}
          </div>

          <div className="mt-4 space-y-5">
            {MODALITY_ORDER.map((m) => {
              const group = routine.steps.filter((d) => d.modality === m);
              if (!group.length) return null;
              return (
                <div key={m}>
                  <h3 className="text-sm font-semibold">
                    {MODALITY_COPY[m].label}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-3">
                    {MODALITY_COPY[m].why}
                  </p>
                  <ol className="mt-2 space-y-1.5">
                    {group.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-baseline gap-3 rounded-card border border-rule bg-surface px-3.5 py-2.5"
                      >
                        <span className="flex-1 text-sm font-medium">
                          {d.name}
                        </span>
                        <span className="shrink-0 font-mono text-xs text-ink-3">
                          {d.holdSeconds
                            ? `${d.holdSeconds}s`
                            : (d.reps ?? fmtDuration(d.seconds))}
                          {d.perSide ? " ×2" : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>

          {routine.withheld.length > 0 && (
            <div className="mt-5 rounded-card border border-warn/35 bg-warn/8 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-warn">
                <AlertTriangle size={14} /> Left out on purpose
              </p>
              <ul className="mt-2 space-y-2">
                {routine.withheld.map((w) => (
                  <li key={w.drill.id} className="text-xs leading-relaxed">
                    <span className="font-medium">{w.drill.name}</span>
                    <span className="block text-ink-2">{w.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <button
          onClick={() => setPlaying(true)}
          disabled={routine.steps.length === 0}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-ink disabled:opacity-40 sm:w-auto"
        >
          <Play size={17} /> Start the session
        </button>

        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink-3">
          <Sparkles size={13} className="mt-0.5 shrink-0" />
          The player counts you through each hold, tells you when to switch
          sides, and keeps your screen awake. Space pauses, arrow keys skip.
        </p>
      </main>

      {playing && (
        <RoutinePlayer
          drills={routine.steps}
          onClose={() => setPlaying(false)}
          onComplete={() =>
            logCompletion(routine.covered, Math.round(routine.seconds / 60))
          }
        />
      )}
    </>
  );
}
