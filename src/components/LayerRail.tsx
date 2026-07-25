"use client";

import { LAYER_BLURB, LAYER_NAMES, type Layer } from "@/anatomy/types";
import { useAtlas } from "@/store/atlas";
import { cn } from "@/lib/cn";

const LAYERS: Layer[] = [0, 1, 2, 3];

/**
 * The depth peel. Layers above the active one are not removed from the drawing,
 * they fade to ghost outlines — so you never lose your bearings while digging.
 */
export function LayerRail() {
  const layer = useAtlas((s) => s.layer);
  const setLayer = useAtlas((s) => s.setLayer);

  return (
    <div className="flex shrink-0 gap-2 border-rule px-2 py-2 lg:w-44 lg:flex-col lg:border-r lg:px-3 lg:py-4">
      <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 lg:block">
        Depth
      </p>

      <div
        role="radiogroup"
        aria-label="Anatomical depth layer"
        className="flex flex-1 gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            setLayer(Math.min(3, layer + 1) as Layer);
          }
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            setLayer(Math.max(0, layer - 1) as Layer);
          }
        }}
      >
        {LAYERS.map((l) => {
          const active = l === layer;
          return (
            <button
              key={l}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setLayer(l)}
              className={cn(
                "group relative shrink-0 rounded-lg border px-3 py-2 text-left transition-colors lg:w-full",
                active
                  ? "border-accent/50 bg-accent/10"
                  : "border-rule hover:border-rule-2 hover:bg-bg-2",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block size-2 shrink-0 rounded-full",
                    active ? "bg-accent" : "bg-rule-2",
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap text-[13px] font-medium",
                    active ? "text-ink" : "text-ink-2",
                  )}
                >
                  {LAYER_NAMES[l]}
                </span>
              </span>
              <span className="mt-1 hidden text-[11px] leading-snug text-ink-3 lg:block">
                {LAYER_BLURB[l]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="hidden text-[11px] leading-snug text-ink-3 lg:block">
        Click the same spot at different depths — you will get a different
        structure each time.
      </p>
    </div>
  );
}
