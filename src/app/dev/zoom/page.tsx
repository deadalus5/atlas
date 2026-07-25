"use client";

import { useState } from "react";
import { BodyMap } from "@/components/BodyMap";
import { LAYER_NAMES, type Layer } from "@/anatomy/types";

/** Development-only: close crops for checking shape work region by region. */
const CROPS: { name: string; box: [number, number, number, number] }[] = [
  { name: "Neck & shoulders", box: [110, 170, 380, 260] },
  { name: "Upper back", box: [120, 250, 360, 260] },
  { name: "Low back & pelvis", box: [150, 430, 300, 300] },
  { name: "Hip & thigh", box: [140, 560, 320, 340] },
];

export default function DevZoom() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <main className="paper-grain min-h-screen p-5">
      <h1 className="mb-1 text-xl font-semibold">Region check</h1>
      <p className="mb-4 font-mono text-xs text-ink-2">{hovered ?? "—"}</p>
      <div className="space-y-5">
        {CROPS.map((c) => (
          <section key={c.name}>
            <h2 className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ink-3">
              {c.name}
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {([0, 1, 2, 3] as Layer[]).map((l) => (
                <figure
                  key={l}
                  className="rounded-lg border border-rule bg-surface p-1"
                >
                  <figcaption className="px-1 font-mono text-[9px] uppercase text-ink-3">
                    {LAYER_NAMES[l]}
                  </figcaption>
                  <div className="h-52">
                    <BodyMap
                      view="posterior"
                      layer={l}
                      zoom={c.box}
                      hoveredId={hovered}
                      onHover={setHovered}
                    />
                  </div>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
