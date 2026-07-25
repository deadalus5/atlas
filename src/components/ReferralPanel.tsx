"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Radio } from "lucide-react";
import { LAYER_NAMES, type Layer } from "@/anatomy/types";
import { useAtlas } from "@/store/atlas";
import { Chip } from "./ui";

export interface Candidate {
  id: string;
  name: string;
  layer: Layer;
  refersTo: string;
  tpLabel: string;
  realCulprit?: string;
  note?: string;
}

export function ReferralPanel({
  regionLabel,
  candidates,
}: {
  regionId: string;
  regionLabel: string;
  candidates: Candidate[];
}) {
  const setMode = useAtlas((s) => s.setMode);

  // On a phone the drawer sits below the map; bring it into view on selection.
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [regionLabel]);

  return (
    <div className="p-5 sm:p-6">
      <div ref={top} className="scroll-mt-2" />
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-heat">
        <Radio size={12} /> Referred pain
      </p>
      <h1 className="mt-2 text-2xl font-semibold leading-tight">
        Pain at the {regionLabel.toLowerCase()}
      </h1>

      {candidates.length === 0 ? (
        <>
          <p className="mt-3 text-pretty leading-relaxed text-ink-2">
            No documented referral patterns land here yet in the Atlas corpus.
            That usually means the source is local — the structure right under
            the spot. Switch back to{" "}
            <button
              onClick={() => setMode("explore")}
              className="underline underline-offset-2"
            >
              “What is this?”
            </button>{" "}
            and click the same place.
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 text-pretty leading-relaxed text-ink-2">
            {candidates.length} muscle{candidates.length > 1 ? "s are" : " is"}{" "}
            known to send pain here — and{" "}
            {candidates.length > 1 ? "several sit" : "it may sit"} some distance
            away. They are lit up on the map, at whatever depth they live.
          </p>

          <ul className="mt-5 space-y-3">
            {candidates.map((c) => (
              <li
                key={`${c.id}-${c.tpLabel}`}
                className="rounded-card border border-rule bg-bg-2 p-4"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <Chip className="mt-1">{LAYER_NAMES[c.layer]}</Chip>
                  </div>
                  <Link
                    href={`/m/${c.id}/`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/50 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10"
                  >
                    Open <ArrowRight size={12} />
                  </Link>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {c.refersTo}
                </p>
                {c.note && (
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-3">
                    {c.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-ink-3">
        Referral patterns are a starting point, not a verdict. The test that
        matters is whether pressing the suspect reproduces the pain you actually
        came here about — if it does, you have found your thread.
      </p>
    </div>
  );
}
