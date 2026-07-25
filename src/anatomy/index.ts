import {
  fanStriations,
  mirror,
  parallelStriations,
  poly,
  ribbedStriations,
  smooth,
  type Pt,
} from "./geom";
import { POSTERIOR_SHAPES } from "./posterior";
import type { Fibres, Instance, Layer, Shape, Side, View } from "./types";
import { sideForView } from "./types";

export * from "./geom";
export * from "./landmarks";
export * from "./types";
export { POSTERIOR_SHAPES } from "./posterior";
export { SILHOUETTE, HEAD, NECK, ARM_L, ARM_R } from "./posterior";

const mirrorFibres = (f: Fibres | undefined): Fibres | undefined => {
  if (!f) return f;
  switch (f.kind) {
    case "fan":
      return { ...f, focus: mirror([f.focus])[0] };
    case "ribbed":
      return { ...f, spine: mirror(f.spine) };
    case "parallel":
    case "crosshatch":
      return { ...f, angle: 180 - f.angle };
    default:
      return f;
  }
};

/** Expand authored shapes into concrete left/right/centre instances. */
export function instancesFor(shapes: Shape[]): Instance[] {
  const out: Instance[] = [];
  for (const shape of shapes) {
    if (shape.bilateral) {
      out.push({
        key: `${shape.id}--left`,
        shape,
        side: "left",
        outline: shape.outline,
      });
      out.push({
        key: `${shape.id}--right`,
        shape: { ...shape, fibres: mirrorFibres(shape.fibres) },
        side: "right",
        outline: mirror(shape.outline),
      });
    } else {
      out.push({
        key: `${shape.id}--centre`,
        shape,
        side: "center",
        outline: shape.outline,
      });
    }
  }
  return out;
}

export const pathFor = (inst: Instance): string =>
  inst.shape.straight
    ? poly(inst.outline)
    : smooth(inst.outline, true, inst.shape.tissue === "bone" ? 0.7 : 1);

/** Fibre striation line segments, already resolved for this instance's side. */
export function fibreLines(inst: Instance): string[] {
  const f = inst.shape.fibres;
  if (!f || f.kind === "none") return [];
  switch (f.kind) {
    case "parallel":
      return parallelStriations(inst.outline, f.angle, f.count ?? 8);
    case "fan":
      return fanStriations(inst.outline, f.focus, f.count ?? 9);
    case "ribbed":
      return ribbedStriations(f.spine, f.count ?? 8, f.reach);
    case "crosshatch":
      return [
        ...parallelStriations(inst.outline, f.angle, f.count ?? 6),
        ...parallelStriations(inst.outline, f.angle + 90, f.count ?? 6),
      ];
  }
}

export const SHAPES_BY_VIEW: Record<View, Shape[]> = {
  posterior: POSTERIOR_SHAPES,
  anterior: [],
};

export function shapesIn(view: View, layer: Layer): Shape[] {
  return SHAPES_BY_VIEW[view].filter((s) => s.layer === layer);
}

/** Human-readable side, correct for the view being displayed. */
export function sideLabel(view: View, side: Side): string {
  if (side === "center") return "";
  const anatomical = sideForView(view, side as "left" | "right");
  return anatomical === "left" ? "left" : "right";
}

export function findShape(view: View, id: string): Shape | undefined {
  return SHAPES_BY_VIEW[view].find((s) => s.id === id);
}

export type { Pt };
