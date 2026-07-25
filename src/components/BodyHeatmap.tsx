"use client";

import { ARM_L, ARM_R, HEAD, NECK, SILHOUETTE, smooth } from "@/anatomy";
import { regionInstances } from "@/anatomy/regions";
import { cn } from "@/lib/cn";

/**
 * The user's own body, painted with their own logged pain. Regions with no data
 * stay blank rather than being drawn as "no pain" — an absence of logging is not
 * the same as an absence of symptoms, and pretending otherwise would flatter the
 * chart.
 */
export function BodyHeatmap({
  intensities,
  selected,
  onSelect,
  className,
}: {
  /** regionId → mean intensity 0-10 */
  intensities: Record<string, number>;
  selected?: string | null;
  onSelect?: (regionId: string) => void;
  className?: string;
}) {
  const regions = regionInstances();
  const ink = "color-mix(in oklab, var(--ink) 16%, transparent)";

  return (
    <svg
      viewBox="0 0 600 1400"
      className={cn("h-full w-full select-none", className)}
      role="img"
      aria-label="Your logged pain, shown on a body diagram"
    >
      <g>
        <path d={smooth(ARM_L)} fill="var(--bg-2)" stroke={ink} strokeWidth={1} />
        <path d={smooth(ARM_R)} fill="var(--bg-2)" stroke={ink} strokeWidth={1} />
        <path
          d={smooth(SILHOUETTE)}
          fill="var(--bg-2)"
          stroke={ink}
          strokeWidth={1.1}
        />
        <path d={smooth(NECK)} fill="var(--bg-2)" stroke={ink} strokeWidth={1} />
        <path d={smooth(HEAD)} fill="var(--bg-2)" stroke={ink} strokeWidth={1.1} />
      </g>

      {regions.map((r) => {
        const v = intensities[r.region.id];
        const has = typeof v === "number" && v >= 0;
        const isSel = selected === r.region.id;
        return (
          <path
            key={r.key}
            d={smooth(r.outline, true, 0.4)}
            fill={has ? "var(--heat)" : "transparent"}
            fillOpacity={has ? 0.12 + (v / 10) * 0.66 : 0}
            stroke={isSel ? "var(--accent)" : ink}
            strokeWidth={isSel ? 2.4 : 0.8}
            strokeDasharray={has || isSel ? undefined : "4 4"}
            style={{ cursor: onSelect ? "pointer" : undefined }}
            onClick={() => onSelect?.(r.region.id)}
          >
            <title>
              {r.region.label}
              {has ? ` — average ${v.toFixed(1)} / 10` : " — nothing logged"}
            </title>
          </path>
        );
      })}
    </svg>
  );
}
