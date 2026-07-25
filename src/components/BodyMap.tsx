"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { regionInstances } from "@/anatomy/regions";
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
  /** "referral" swaps the hit targets from structures to pain regions. */
  mode?: "explore" | "referral";
  /** Structures to flag as suspects, drawn over the top whatever their depth. */
  litIds?: string[];
  activeRegion?: string | null;
  onRegionSelect?: (regionId: string) => void;
  onRegionHover?: (regionId: string | null) => void;
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
  mode = "explore",
  litIds,
  activeRegion,
  onRegionSelect,
  onRegionHover,
}: BodyMapProps) {
  const referral = mode === "referral";
  const litSet = useMemo(() => new Set(litIds ?? []), [litIds]);
  const regions = useMemo(() => regionInstances(), []);
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

  /* Roving focus: one tab stop for the map, arrows to traverse. */
  const [focusIdx, setFocusIdx] = useState(-1);
  const lastAnnounced = useRef<string | null>(null);

  useEffect(() => setFocusIdx(-1), [layer, view, referral]);

  const focused =
    focusIdx < 0
      ? null
      : referral
        ? regions[focusIdx]
        : hits[focusIdx];

  const navPath = focused
    ? referral
      ? smooth((focused as (typeof regions)[number]).outline, true, 0.4)
      : pathFor(focused as Instance)
    : null;

  // Mirror keyboard focus into the same hover channel the pointer uses, so the
  // floating label names whatever is focused.
  useEffect(() => {
    if (!focused) {
      if (lastAnnounced.current !== null) {
        lastAnnounced.current = null;
        if (referral) onRegionHover?.(null);
        else onHover?.(null);
      }
      return;
    }
    const id = referral
      ? (focused as (typeof regions)[number]).region.id
      : (focused as Instance).shape.id;
    if (lastAnnounced.current === id) return;
    lastAnnounced.current = id;
    if (referral) onRegionHover?.(id);
    else onHover?.(id);
  }, [focused, referral, onHover, onRegionHover]);

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

      {/* ---- suspects, drawn over everything regardless of their depth --- */}
      {referral && litSet.size > 0 && (
        <g id="suspects" pointerEvents="none">
          {all
            .filter((i) => litSet.has(i.shape.id))
            .map((i) => (
              <g key={`lit-${i.key}`}>
                <path
                  d={pathFor(i)}
                  fill="var(--heat)"
                  opacity={0.5}
                  style={{ filter: "blur(3px)" }}
                />
                <path
                  d={pathFor(i)}
                  fill="none"
                  stroke="var(--heat)"
                  strokeWidth={2.4}
                  strokeLinejoin="round"
                />
              </g>
            ))}
        </g>
      )}

      {/* ---- keyboard focus ring ---------------------------------------- */}
      {focusIdx >= 0 && navPath && (
        <path
          d={navPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={3}
          strokeDasharray="6 3"
          pointerEvents="none"
        />
      )}

      {/* ---- hit targets: structures, or pain regions in referral mode ---
          One tab stop for the whole map with arrow-key traversal, rather than
          ~180 individual stops. Enter or Space selects what is focused. */}
      <g
        id={referral ? "region-hits" : "hits"}
        tabIndex={0}
        role="group"
        aria-label={
          referral
            ? "Pain regions. Use arrow keys to move between areas, Enter to choose one."
            : "Anatomical structures. Use arrow keys to move between them, Enter to open."
        }
        onFocus={() => setFocusIdx((f) => (f < 0 ? 0 : f))}
        onBlur={() => setFocusIdx(-1)}
        onKeyDown={(e) => {
          const n = referral ? regions.length : hits.length;
          if (!n) return;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            setFocusIdx((f) => (f + 1) % n);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            setFocusIdx((f) => (f - 1 + n) % n);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (focusIdx < 0) return;
            if (referral) onRegionSelect?.(regions[focusIdx].region.id);
            else onSelect?.(hits[focusIdx].shape.id, hits[focusIdx].side);
          }
        }}
      >
        {referral
          ? regions.map((r, n) => {
              const isActive = activeRegion === r.region.id;
              return (
                <path
                  key={r.key}
                  data-region={r.region.id}
                  d={smooth(r.outline, true, 0.4)}
                  fill={isActive ? "var(--heat)" : "var(--ink)"}
                  fillOpacity={isActive ? 0.2 : 0.02}
                  stroke={isActive ? "var(--heat)" : "var(--ink)"}
                  strokeOpacity={isActive ? 0.7 : 0.12}
                  strokeWidth={isActive ? 1.6 : 0.8}
                  strokeDasharray={isActive ? undefined : "4 4"}
                  style={{ cursor: "crosshair", transition: "all 120ms ease" }}
                  onPointerEnter={() => onRegionHover?.(r.region.id)}
                  onPointerDown={() => setFocusIdx(n)}
                  onClick={() => onRegionSelect?.(r.region.id)}
                >
                  <title>{r.region.label}</title>
                </path>
              );
            })
          : hits.map((i, n) => (
              <path
                key={i.key}
                data-structure={i.shape.id}
                d={pathFor(i)}
                fill="transparent"
                stroke="transparent"
                strokeWidth={(i.shape.hitPad ?? 0) * 2}
                style={{ cursor: "pointer" }}
                onPointerEnter={() => onHover?.(i.shape.id)}
                onPointerDown={() => setFocusIdx(n)}
                onClick={() => onSelect?.(i.shape.id, i.side)}
              >
                <title>{i.shape.label}</title>
              </path>
            ))}
      </g>
    </svg>
  );
}
