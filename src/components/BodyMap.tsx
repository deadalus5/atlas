"use client";

import { useMemo } from "react";
import {
  ARM_L,
  ARM_R,
  HEAD,
  NECK,
  SHAPES_BY_VIEW,
  SILHOUETTE,
  fibreLines,
  instancesFor,
  pathFor,
  smooth,
} from "@/anatomy";
import type { Instance, Layer, Shape, View } from "@/anatomy/types";
import { cn } from "@/lib/cn";

const INK = "color-mix(in oklab, var(--ink) 48%, transparent)";
const INK_SOFT = "color-mix(in oklab, var(--ink) 20%, transparent)";

/** Deterministic per-structure jitter so neighbouring muscles read apart. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function fillFor(shape: Shape): string {
  switch (shape.tissue) {
    case "bone":
      return "var(--bone)";
    case "tendon":
      return "color-mix(in oklab, var(--bone) 74%, white)";
    case "fascia":
      return "var(--fascia)";
    case "ligament":
      return "color-mix(in oklab, var(--fascia) 68%, white)";
    case "nerve":
      return "var(--nerve)";
    case "joint":
      return "var(--accent-2)";
    default: {
      const base =
        shape.layer === 0
          ? "var(--muscle-lo)"
          : shape.layer === 1
            ? "var(--muscle)"
            : "var(--muscle-hi)";
      // Nudge each belly a few percent toward a warmer or cooler neighbour tone
      // so that adjacent muscles never read as one continuous slab.
      const h = hash(shape.id);
      const amount = 78 + (h % 16);
      const toward = h & 1 ? "#78302a" : "#e0a894";
      return `color-mix(in oklab, ${base} ${amount}%, ${toward})`;
    }
  }
}

export interface BodyMapProps {
  view: View;
  layer: Layer;
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (id: string, side: string) => void;
  onHover?: (id: string | null) => void;
  className?: string;
  /** Optional crop, as [x, y, width, height] in the shared 600x1400 space. */
  zoom?: [number, number, number, number];
}

export function BodyMap({
  view,
  layer,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  className,
  zoom,
}: BodyMapProps) {
  const all = useMemo(() => instancesFor(SHAPES_BY_VIEW[view]), [view]);

  const byLayer = useMemo(() => {
    const m: Record<number, Instance[]> = { 0: [], 1: [], 2: [], 3: [] };
    for (const i of all) m[i.shape.layer].push(i);
    for (const k of Object.keys(m)) {
      m[+k].sort((a, b) => (a.shape.z ?? 0) - (b.shape.z ?? 0));
    }
    return m;
  }, [all]);

  const active = byLayer[layer] ?? [];
  const deeper = useMemo(
    () =>
      ([0, 1, 2, 3] as Layer[])
        .filter((l) => l > layer)
        .flatMap((l) => byLayer[l] ?? []),
    [byLayer, layer],
  );
  const peeled = useMemo(
    () =>
      ([0, 1, 2, 3] as Layer[])
        .filter((l) => l < layer)
        .flatMap((l) => byLayer[l] ?? []),
    [byLayer, layer],
  );

  // Hit targets are painted last, ordered so the highest-priority structure
  // ends up on top and wins an ambiguous click.
  const hits = useMemo(
    () => [...active].sort((a, b) => (a.shape.priority ?? 0) - (b.shape.priority ?? 0)),
    [active],
  );

  return (
    <svg
      viewBox={zoom ? zoom.join(" ") : "0 0 600 1400"}
      className={cn("h-full w-full select-none", className)}
      role="group"
      aria-label={`${view} view of the human body, ${["superficial", "intermediate", "deep", "skeletal"][layer]} layer`}
      onPointerLeave={() => onHover?.(null)}
    >
      <defs>
        {/* One reusable form-shading gradient; objectBoundingBox units mean every
            shape gets its own light-from-upper-left falloff for free. */}
        <linearGradient id="atlas-shade" x1="0.15" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#3a1d16" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="atlas-shade-bone" x1="0.15" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#4a3a22" stopOpacity="0.16" />
        </linearGradient>
        {active
          .filter((i) => i.shape.fibres && i.shape.fibres.kind !== "none")
          .map((i) => (
            <clipPath key={i.key} id={`clip-${i.key}`}>
              <path d={pathFor(i)} />
            </clipPath>
          ))}
      </defs>

      {/* ---- body ground ------------------------------------------------ */}
      <g id="body-base">
        <path
          d={smooth(ARM_L)}
          fill="var(--bg-2)"
          stroke={INK_SOFT}
          strokeWidth={1.1}
        />
        <path
          d={smooth(ARM_R)}
          fill="var(--bg-2)"
          stroke={INK_SOFT}
          strokeWidth={1.1}
        />
        <path
          d={smooth(SILHOUETTE)}
          fill="var(--bg-2)"
          stroke={INK_SOFT}
          strokeWidth={1.2}
        />
        <path
          d={smooth(NECK)}
          fill="var(--bg-2)"
          stroke={INK_SOFT}
          strokeWidth={1.1}
        />
        <path
          d={smooth(HEAD)}
          fill="var(--bg-2)"
          stroke={INK_SOFT}
          strokeWidth={1.2}
        />
      </g>

      {/* ---- layers still covered, hinted underneath -------------------- */}
      <g id="deeper" opacity={0.28}>
        {deeper.map((i) => (
          <path key={i.key} d={pathFor(i)} fill={fillFor(i.shape)} />
        ))}
      </g>

      {/* ---- the active layer ------------------------------------------- */}
      <g id="active">
        {active.map((i) => {
          const isSel = selectedId === i.shape.id;
          const isHov = hoveredId === i.shape.id;
          const d = pathFor(i);
          const isBone = i.shape.tissue === "bone";
          return (
            <g
              key={i.key}
              style={{
                filter: isSel
                  ? "saturate(1.3) brightness(1.07)"
                  : isHov
                    ? "brightness(1.05)"
                    : undefined,
                transition: "opacity 140ms ease",
              }}
              opacity={isSel ? 1 : isHov ? 0.98 : 0.93}
            >
              <path d={d} fill={fillFor(i.shape)} />
              {i.shape.fibres && i.shape.fibres.kind !== "none" && (
                <g clipPath={`url(#clip-${i.key})`} pointerEvents="none">
                  {fibreLines(i).map((line, n) => (
                    <path
                      key={n}
                      d={line}
                      stroke={INK_SOFT}
                      strokeWidth={n % 2 ? 0.7 : 1}
                      opacity={n % 2 ? 0.65 : 1}
                      fill="none"
                    />
                  ))}
                </g>
              )}
              {/* Form shading over the fibres, outline last so it stays crisp. */}
              <path
                d={d}
                fill={`url(#atlas-shade${isBone ? "-bone" : ""})`}
                pointerEvents="none"
              />
              <path
                d={d}
                fill="none"
                stroke={INK}
                strokeWidth={isSel ? 2.4 : 1.15}
                strokeLinejoin="round"
                pointerEvents="none"
                style={{ transition: "stroke-width 140ms ease" }}
              />
            </g>
          );
        })}
      </g>

      {/* ---- layers already peeled away, kept as ghost outlines --------- */}
      <g id="peeled" pointerEvents="none">
        {peeled.map((i) => (
          <path
            key={i.key}
            d={pathFor(i)}
            fill="none"
            stroke={INK_SOFT}
            strokeWidth={0.8}
            strokeDasharray="3 4"
            opacity={0.55}
          />
        ))}
      </g>

      {/* ---- invisible hit targets -------------------------------------- */}
      <g id="hits">
        {hits.map((i) => (
          <path
            key={i.key}
            d={pathFor(i)}
            fill="transparent"
            stroke="transparent"
            strokeWidth={(i.shape.hitPad ?? 0) * 2}
            style={{ cursor: "pointer" }}
            onPointerEnter={() => onHover?.(i.shape.id)}
            onClick={() => onSelect?.(i.shape.id, i.side)}
          >
            <title>{i.shape.label}</title>
          </path>
        ))}
      </g>
    </svg>
  );
}
