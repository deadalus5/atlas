import type { Pt } from "./geom";

export type { Pt };

export type Layer = 0 | 1 | 2 | 3;
export type View = "posterior" | "anterior";
export type Side = "left" | "right" | "center";

export type Tissue =
  | "muscle"
  | "bone"
  | "nerve"
  | "fascia"
  | "ligament"
  | "tendon"
  | "joint";

export const LAYER_NAMES: Record<Layer, string> = {
  0: "Superficial",
  1: "Intermediate",
  2: "Deep",
  3: "Deepest & skeletal",
};

export const LAYER_BLURB: Record<Layer, string> = {
  0: "What you can touch — the muscles directly under the skin.",
  1: "One layer down — mostly the muscles that move your shoulder blade.",
  2: "The spinal engine — erectors, rotators and the deep hip.",
  3: "Bone, ligament, and the muscles that sit against the spine itself.",
};

/** Fibre direction, which is also the direction a muscle wants to be stretched. */
export type Fibres =
  | { kind: "parallel"; angle: number; count?: number }
  | { kind: "fan"; focus: Pt; count?: number }
  | { kind: "ribbed"; spine: Pt[]; count?: number; reach: number }
  /** Two crossing fibre sets — how aponeurotic sheets like the TLF are drawn. */
  | { kind: "crosshatch"; angle: number; count?: number }
  | { kind: "none" };

export interface Shape {
  /** Stable anatomical id; matches the content corpus key. */
  id: string;
  label: string;
  layer: Layer;
  tissue: Tissue;
  /**
   * Outline landmark points. For bilateral structures these are authored on the
   * viewer-left half of the body and mirrored across the midline.
   */
  outline: Pt[];
  bilateral?: boolean;
  fibres?: Fibres;
  /** Draw with straight segments rather than a spline — used for bone. */
  straight?: boolean;
  /** Paint order inside a layer; higher numbers draw on top. */
  z?: number;
  /**
   * Hit-test priority when several structures overlap a click point. Higher
   * wins the primary selection; the rest become disambiguation candidates.
   */
  priority?: number;
  /** Widen the invisible hit area for structures that draw very thin. */
  hitPad?: number;
}

/** A shape resolved to one concrete side of the body, ready to render. */
export interface Instance {
  key: string;
  shape: Shape;
  side: Side;
  outline: Pt[];
}

/**
 * In a posterior view the subject faces away, so the viewer's left is the
 * subject's left. In an anterior view they face you, so it is reversed.
 */
export function sideForView(view: View, viewerSide: "left" | "right"): Side {
  if (view === "posterior") return viewerSide;
  return viewerSide === "left" ? "right" : "left";
}
