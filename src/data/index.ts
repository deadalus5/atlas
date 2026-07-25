import { SHAPES_BY_VIEW } from "@/anatomy";
import type { SafetyProfile } from "@/store/atlas";
import { DRILL_BY_ID, DRILLS } from "./drills";
import { STRUCTURE_BY_ID, STRUCTURES } from "./structures";
import { MODALITY_ORDER, type Drill, type Structure } from "./types";

export * from "./types";
export { DRILLS, DRILL_BY_ID } from "./drills";
export { STRUCTURES, STRUCTURE_BY_ID } from "./structures";

/** Every id that can be clicked on the map, whether or not prose exists yet. */
export function allStructureIds(): string[] {
  const ids = new Set<string>();
  for (const view of Object.values(SHAPES_BY_VIEW)) {
    for (const s of view) ids.add(s.id);
  }
  for (const s of STRUCTURES) ids.add(s.id);
  return [...ids];
}

export const getStructure = (id: string): Structure | undefined =>
  STRUCTURE_BY_ID.get(id);

export function drillsFor(structureId: string): Drill[] {
  const s = STRUCTURE_BY_ID.get(structureId);
  if (s) {
    const listed = s.drills
      .map((d) => DRILL_BY_ID.get(d))
      .filter((d): d is Drill => Boolean(d));
    if (listed.length) return listed;
  }
  return DRILLS.filter((d) => d.targets.includes(structureId));
}

/* ---------------------------------------------------------------------------
   Safety gating
   Drills are withheld — never silently, always with the reason shown — when the
   user has declared a context that makes them a poor idea.
--------------------------------------------------------------------------- */

interface Risk {
  spinalFlexion?: boolean;
  spinalExtension?: boolean;
  prone?: boolean;
  endRangeStretch?: boolean;
  loadedRotation?: boolean;
}

const RISKS: Record<string, Risk> = {
  "foam-roll-thoracic": { spinalExtension: true },
  "child-pose-lat": { spinalFlexion: true, endRangeStretch: true },
  "cat-cow": { spinalFlexion: true },
  "prone-y-raise": { prone: true },
  "open-book": { loadedRotation: true },
  "figure-four": { endRangeStretch: true },
  "hip-flexor-half-kneel": { endRangeStretch: true },
  "upper-trap-stretch": { endRangeStretch: true },
  "levator-scap-stretch": { endRangeStretch: true },
  "doorway-pec": { endRangeStretch: true },
};

export interface Withheld {
  drill: Drill;
  reason: string;
}

export function screenDrills(
  drills: Drill[],
  safety: SafetyProfile,
): { allowed: Drill[]; withheld: Withheld[] } {
  const allowed: Drill[] = [];
  const withheld: Withheld[] = [];

  for (const d of drills) {
    const r = RISKS[d.id] ?? {};
    let reason = "";

    if (safety.osteoporosis && (r.spinalFlexion || r.spinalExtension)) {
      reason =
        "Held back because you told us about osteoporosis — loaded spinal bending carries a fracture risk, and this needs to be chosen with a clinician.";
    } else if (safety.pregnant && r.prone) {
      reason = "Held back because lying face down is not practical in pregnancy.";
    } else if (safety.pregnant && r.endRangeStretch) {
      reason =
        "Held back during pregnancy — increased ligament laxity makes end-range stretching easy to overshoot.";
    } else if (safety.hypermobile && r.endRangeStretch) {
      reason =
        "Held back because you told us about hypermobility. Hypermobile joints usually need strengthening through range rather than more stretch.";
    } else if (safety.legSymptoms && r.spinalFlexion) {
      reason =
        "Held back while you have symptoms travelling down the leg — repeated end-range forward bending can wind those up.";
    } else if (safety.recentSurgery) {
      reason = "";
    }

    if (reason) withheld.push({ drill: d, reason });
    else allowed.push(d);
  }

  return { allowed, withheld };
}

/* ---------------------------------------------------------------------------
   Routine building
--------------------------------------------------------------------------- */

export interface BuiltRoutine {
  steps: Drill[];
  seconds: number;
  covered: string[];
  uncovered: string[];
  withheld: Withheld[];
}

/**
 * Assembles a session from whatever the user selected. The ordering is the
 * important part: mobilise the joint, release the tender spot, activate the
 * weak partner, then stretch, then integrate. Doing it in the order the user
 * happened to click would produce a worse session.
 */
export function buildRoutine(
  structureIds: string[],
  minutes: number,
  safety: SafetyProfile,
): BuiltRoutine {
  const wanted = new Set(structureIds);
  const budget = minutes * 60;

  const candidateMap = new Map<string, Drill>();
  for (const id of structureIds) {
    for (const d of drillsFor(id)) candidateMap.set(d.id, d);
  }

  const { allowed, withheld } = screenDrills(
    [...candidateMap.values()],
    safety,
  );

  // How many of the user's selections each drill addresses.
  const coverage = (d: Drill) =>
    d.targets.filter((t) => wanted.has(t)).length;

  const pool = [...allowed].sort((a, b) => {
    const c = coverage(b) - coverage(a);
    if (c) return c;
    return (
      MODALITY_ORDER.indexOf(a.modality) - MODALITY_ORDER.indexOf(b.modality)
    );
  });

  const chosen: Drill[] = [];
  const covered = new Set<string>();
  let seconds = 0;

  // First pass: guarantee every selected structure gets at least one drill,
  // even on a tight budget — breadth beats depth when someone has five minutes.
  for (const id of structureIds) {
    if (covered.has(id)) continue;
    const best = pool.find(
      (d) => !chosen.includes(d) && d.targets.includes(id),
    );
    if (best && seconds + best.seconds <= budget) {
      chosen.push(best);
      seconds += best.seconds;
      best.targets.forEach((t) => wanted.has(t) && covered.add(t));
    }
  }

  // Second pass: spend whatever is left on the highest-coverage drills.
  for (const d of pool) {
    if (chosen.includes(d)) continue;
    if (seconds + d.seconds > budget) continue;
    chosen.push(d);
    seconds += d.seconds;
    d.targets.forEach((t) => wanted.has(t) && covered.add(t));
  }

  chosen.sort(
    (a, b) =>
      MODALITY_ORDER.indexOf(a.modality) - MODALITY_ORDER.indexOf(b.modality),
  );

  return {
    steps: chosen,
    seconds,
    covered: [...covered],
    uncovered: structureIds.filter((id) => !covered.has(id)),
    withheld,
  };
}

/* ---------------------------------------------------------------------------
   Media helpers
--------------------------------------------------------------------------- */

/**
 * Fallback when no curated video exists: a precise YouTube search rather than a
 * dead end. Also used as the "watch on YouTube" escape hatch when an embed is
 * refused at runtime.
 */
export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function youtubeEmbedUrl(id: string, start?: number): string {
  const s = start ? `&start=${Math.floor(start)}` : "";
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${s}`;
}

export function youtubeWatchUrl(id: string, start?: number): string {
  const s = start ? `&t=${Math.floor(start)}s` : "";
  return `https://www.youtube.com/watch?v=${id}${s}`;
}

export const fmtDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
};
