import type { Layer, Pt, View } from "@/anatomy/types";

/**
 * How well supported a claim or drill is. Atlas shows this on everything,
 * because a lot of what this genre repeats as fact is tradition, not evidence.
 */
export type EvidenceGrade = "strong" | "moderate" | "emerging" | "traditional";

export const EVIDENCE_COPY: Record<EvidenceGrade, string> = {
  strong: "Well supported by controlled trials or clinical guidelines.",
  moderate: "Reasonable supporting evidence, though not conclusive.",
  emerging: "Promising but the research is early or mixed.",
  traditional:
    "Widely taught and often helpful in practice, but not well tested. Judge it by how you respond.",
};

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Equipment =
  | "none"
  | "wall"
  | "chair"
  | "towel"
  | "band"
  | "foam-roller"
  | "ball"
  | "mat"
  | "doorway"
  | "bar"
  | "massage-gun";

/**
 * Order matters: a generated routine runs in exactly this sequence, because
 * mobilising a stiff joint before stretching, and activating a sleepy muscle
 * before asking it to work, is what makes the difference between a routine that
 * helps and a list of stretches.
 */
export type Modality =
  | "mobilise"
  | "release"
  | "activate"
  | "stretch"
  | "nerve-glide"
  | "integrate";

export const MODALITY_ORDER: Modality[] = [
  "mobilise",
  "release",
  "activate",
  "stretch",
  "nerve-glide",
  "integrate",
];

export const MODALITY_COPY: Record<Modality, { label: string; why: string }> = {
  mobilise: {
    label: "Mobilise",
    why: "Free the joint first — a stiff segment will not let the muscle around it let go.",
  },
  release: {
    label: "Release",
    why: "Take the edge off the tender spot so the stretch that follows is tolerable.",
  },
  activate: {
    label: "Activate",
    why: "Wake up the muscle that has been asleep. Tight and weak almost always travel together.",
  },
  stretch: {
    label: "Stretch",
    why: "Now lengthen it, once the joint moves and the antagonist is switched on.",
  },
  "nerve-glide": {
    label: "Nerve glide",
    why: "Slide the nerve, do not stretch it. Gentle and short — pushing into symptoms makes this worse.",
  },
  integrate: {
    label: "Integrate",
    why: "Load the new range so your body keeps it.",
  },
};

/** A verified YouTube demonstration, deep-linked to where the demo starts. */
export interface Media {
  youtubeId: string;
  title: string;
  channel: string;
  /** Seconds into the video where the demonstration actually begins. */
  start?: number;
  note?: string;
}

export interface Drill {
  id: string;
  name: string;
  modality: Modality;
  /** Detailed enough that the video is optional, not required. */
  steps: string[];
  holdSeconds?: number;
  reps?: string;
  perSide?: boolean;
  cues?: string[];
  mistakes?: string[];
  difficulty: Difficulty;
  equipment: Equipment[];
  contraindications?: string[];
  evidence?: EvidenceGrade;
  media?: Media[];
  /** Structure ids this drill addresses — drives dedup in routine building. */
  targets: string[];
  /** Seconds this occupies in a routine, including set-up and both sides. */
  seconds: number;
}

export interface TriggerPoint {
  label: string;
  /** Position in the shared 600x1400 viewBox, on the viewer's left. */
  at: Pt;
  /** Where the pain is actually felt. */
  refersTo: string;
  /** Region ids lit on the map when this pattern is shown. */
  regions: string[];
  note?: string;
}

export interface SourceRef {
  title: string;
  url: string;
  publisher?: string;
}

export interface Structure {
  id: string;
  name: string;
  latin?: string;
  aka?: string[];
  view: View;
  layer: Layer;
  /** One or two sentences, zero jargon. This field is the product. */
  plain: string;
  /** What it feels like when it is angry, in the words people actually use. */
  feels: string;
  /** How to find it on yourself right now, sitting in a chair. */
  palpation: string;
  angryBecause: string[];
  /** The most useful sentence in the app: where the problem often really is. */
  realCulprit?: string;
  tendsToBe?: "tight" | "weak" | "both";
  clinical: {
    origin?: string;
    insertion?: string;
    actions?: string[];
    innervation?: string;
    roots?: string[];
  };
  antagonists?: string[];
  synergists?: string[];
  fascialLines?: string[];
  triggerPoints?: TriggerPoint[];
  drills: string[];
  ergonomics?: string[];
  redFlags?: string[];
  sources?: SourceRef[];
}

export interface Condition {
  id: string;
  name: string;
  aka?: string[];
  plain: string;
  hallmarks: string[];
  worseWith: string[];
  betterWith: string[];
  structures: string[];
  protocol: string[];
  avoid: string[];
  seeSomeoneIf: string[];
  timeline?: string;
  evidence?: EvidenceGrade;
  drills: string[];
}

export interface Routine {
  id: string;
  name: string;
  forWho: string;
  minutes: number;
  drills: string[];
  note?: string;
}

export interface RedFlag {
  id: string;
  symptom: string;
  plain: string;
  urgency: "emergency" | "same-day" | "within-days" | "monitor";
  /** The literal sentence shown in the UI — calm, specific, actionable. */
  copy: string;
}
