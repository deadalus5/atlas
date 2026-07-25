"use client";

import { useState } from "react";
import { BodyMap } from "@/components/BodyMap";
import { LAYER_NAMES, type Layer } from "@/anatomy/types";

/**
 * Development-only view: all four depth layers side by side, so the anatomy can
 * be checked against a reference at a glance. Not linked from the app.
 */
export default function DevAnatomy() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="paper-grain min-h-screen p-6">
      <div className="mb-4 flex items-baseline gap-4">
        <h1 className="text-2xl font-semibold">Anatomy check · posterior</h1>
        <p className="font-mono text-xs text-ink-2">
          {hovered ?? selected ?? "—"}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {([0, 1, 2, 3] as Layer[]).map((l) => (
          <figure
            key={l}
            className="rounded-card border border-rule bg-surface p-2"
          >
            <figcaption className="mb-1 font-mono text-[10px] uppercase tracking-wider text-ink-3">
              {l} · {LAYER_NAMES[l]}
            </figcaption>
            <div className="h-[74vh]" data-layer={l}>
              <BodyMap
                view="posterior"
                layer={l}
                hoveredId={hovered}
                selectedId={selected}
                onHover={setHovered}
                onSelect={(id) => setSelected(id)}
              />
            </div>
          </figure>
        ))}
      </div>
    </main>
  );
}
