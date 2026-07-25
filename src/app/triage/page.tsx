"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Search } from "lucide-react";
import { REGION_BY_ID } from "@/anatomy/regions";
import { SiteHeader } from "@/components/SiteHeader";
import { Chip } from "@/components/ui";
import { getStructure } from "@/data";
import { DIRECTION_COPY, RED_FLAGS, triage } from "@/data/triage";
import { useAtlas } from "@/store/atlas";
import { cn } from "@/lib/cn";

const EXAMPLES = [
  "Burning between my shoulder blades by mid-afternoon, worse at my laptop",
  "Deep ache in my left buttock that shoots down the back of my leg when I sit",
  "Low back is worse standing and walking, better when I lean on a trolley",
  "Stiff neck and a headache creeping up behind my eye",
];

const URGENCY_TONE = {
  emergency: "danger",
  "same-day": "danger",
  "within-days": "warn",
  monitor: "warn",
} as const;

export default function TriagePage() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const setSafety = useAtlas((s) => s.setSafety);
  const addToSession = useAtlas((s) => s.addToSession);

  const result = useMemo(() => triage(text), [text]);
  const show = submitted && text.trim().length > 3;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          Describe it your way
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          What does it actually feel like?
        </h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-2">
          Write it how you would say it to a friend. Where it is, what makes it
          worse, whether anything travels. This runs entirely in your browser on
          a fixed set of rules — nothing is sent anywhere, and you can see below
          exactly what it matched on.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="e.g. deep ache in my left buttock, worse after driving, sometimes tingles down the back of my thigh"
          className="mt-5 w-full resize-none rounded-card border border-rule bg-surface px-4 py-3 leading-relaxed outline-none placeholder:text-ink-3 focus:border-accent"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {EXAMPLES.map((e) => (
            <button
              key={e}
              onClick={() => {
                setText(e);
                setSubmitted(true);
              }}
              className="rounded-full border border-rule px-2.5 py-1 text-left text-[11px] text-ink-3 hover:text-ink"
            >
              {e}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSubmitted(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 font-medium text-accent-ink"
        >
          <Search size={15} /> Work out where to start
        </button>

        {show && (
          <div className="mt-8 space-y-6">
            {/* ---- red flags always first ---- */}
            {result.flags.length > 0 && (
              <section className="rounded-card border-2 border-danger bg-danger/10 p-5">
                <p className="flex items-center gap-2 font-semibold text-danger">
                  <AlertTriangle size={17} /> Read this before anything else
                </p>
                <ul className="mt-3 space-y-3">
                  {result.flags.map((f) => (
                    <li key={f.id}>
                      <Chip tone={URGENCY_TONE[f.urgency]}>
                        {f.urgency.replace("-", " ")}
                      </Chip>
                      <p className="mt-1.5 text-sm leading-relaxed">{f.copy}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-ink-2">
                  Atlas flagged this from the words you used. It cannot examine
                  you, so it errs toward caution — but these are the specific
                  patterns that are worth taking seriously rather than stretching.
                </p>
              </section>
            )}

            {/* ---- directional preference ---- */}
            {result.direction && (
              <section className="rounded-card border border-accent/30 bg-accent/8 p-5">
                <h2 className="text-sm font-semibold text-accent">
                  {DIRECTION_COPY[result.direction].label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  {DIRECTION_COPY[result.direction].body}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-3">
                  <strong>Go easy on:</strong>{" "}
                  {DIRECTION_COPY[result.direction].avoid}
                </p>
              </section>
            )}

            {/* ---- where to look ---- */}
            {result.regions.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold">Where to look on the map</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.regions.map((r) => (
                    <Link
                      key={r}
                      href={`/hurts/${r}/`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-sm text-ink-2 hover:border-heat hover:text-heat"
                    >
                      {REGION_BY_ID.get(r)?.label ?? r}
                      <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ---- candidate structures ---- */}
            {result.structures.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold">
                  Structures worth reading first
                </h2>
                <ul className="mt-2 space-y-2">
                  {result.structures.map((id) => {
                    const s = getStructure(id);
                    if (!s) return null;
                    return (
                      <li
                        key={id}
                        className="rounded-card border border-rule bg-surface p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">{s.name}</p>
                            <p className="mt-1 text-sm leading-relaxed text-ink-2">
                              {s.feels}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col gap-1.5">
                            <Link
                              href={`/m/${id}/`}
                              className="rounded-full border border-accent/50 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10"
                            >
                              Open
                            </Link>
                            <button
                              onClick={() => addToSession(id, "center")}
                              className="rounded-full border border-rule px-2.5 py-1 text-xs text-ink-2 hover:text-ink"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href="/session/"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                >
                  Build a routine from these <ArrowRight size={14} />
                </Link>
              </section>
            )}

            {result.legSymptoms && (
              <button
                onClick={() => setSafety({ legSymptoms: true })}
                className="rounded-card border border-warn/40 bg-warn/8 p-4 text-left"
              >
                <p className="text-sm font-semibold text-warn">
                  You mentioned symptoms travelling down the leg
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  Tap here to tell Atlas, and it will keep repeated end-range
                  forward bending out of your routines until you say otherwise.
                </p>
              </button>
            )}

            {result.flags.length === 0 &&
              result.regions.length === 0 &&
              result.structures.length === 0 && (
                <section className="rounded-card border border-rule bg-bg-2 p-5">
                  <p className="text-sm leading-relaxed text-ink-2">
                    Nothing in that matched a rule Atlas knows. Try naming the
                    body part plainly — “low back”, “between my shoulder blades”,
                    “outer hip”, “down my leg” — or just{" "}
                    <Link href="/" className="underline underline-offset-2">
                      point at it on the map
                    </Link>
                    , which is usually faster anyway.
                  </p>
                </section>
              )}

            {result.matched.length > 0 && (
              <details className="text-xs text-ink-3">
                <summary className="cursor-pointer">
                  What this matched on ({result.matched.length} rules)
                </summary>
                <ul className="mt-2 space-y-0.5 font-mono">
                  {result.matched.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* ---- the full red-flag list, always available ---- */}
        <section className="mt-12 border-t border-rule pt-6">
          <h2 className="text-lg font-semibold">
            When to stop self-treating and get seen
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Most back and neck pain is mechanical and settles. These are the
            specific patterns that are not, and they are worth knowing whether or
            not you use anything else here.
          </p>
          <ul className="mt-4 space-y-3">
            {RED_FLAGS.map((f) => (
              <li
                key={f.id}
                className={cn(
                  "rounded-card border p-4",
                  f.urgency === "emergency"
                    ? "border-danger/50 bg-danger/8"
                    : "border-rule bg-surface",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{f.symptom}</p>
                  <Chip tone={URGENCY_TONE[f.urgency]}>
                    {f.urgency.replace("-", " ")}
                  </Chip>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  {f.plain}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{f.copy}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
