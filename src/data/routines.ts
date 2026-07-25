import type { Routine } from "./types";

/**
 * Named sessions for the moments people actually reach for this: mid-afternoon
 * at a desk, first thing in the morning, after lifting, before bed, or in the
 * three minutes they genuinely have.
 */
export const ROUTINES: Routine[] = [
  {
    id: "desk-reset",
    name: "Desk reset",
    forWho:
      "The 3pm one. Neck gripping, shoulders creeping up, that spot between the shoulder blades starting to burn.",
    minutes: 5,
    drills: ["chin-tuck", "upper-trap-stretch", "doorway-pec", "wall-angel"],
    note: "Do this at the hour rather than saving it up. Frequency beats duration for desk-driven tension by a long way.",
  },
  {
    id: "morning-spine",
    name: "Morning spine",
    forWho:
      "Waking up stiff. Discs are at their most swollen first thing, so this stays gentle and deliberately avoids deep end-range bending.",
    minutes: 8,
    drills: ["cat-cow", "open-book", "glute-bridge", "bird-dog"],
    note: "If your back is genuinely painful in the first hour of the day, keep it small and stop well short of anything sharp.",
  },
  {
    id: "post-lift",
    name: "Post-lift decompression",
    forWho:
      "After deadlifts, squats or a heavy pulling session, when everything from your calves to your lats has shortened.",
    minutes: 12,
    drills: [
      "foam-roll-thoracic",
      "child-pose-lat",
      "ql-side-bend",
      "hip-flexor-half-kneel",
      "figure-four",
      "calf-wall-stretch",
    ],
  },
  {
    id: "pre-sleep",
    name: "Pre-sleep wind-down",
    forWho:
      "Getting the nervous system down a gear so you are not carrying the day into the mattress.",
    minutes: 8,
    drills: ["cat-cow", "figure-four", "child-pose-lat", "hip-flexor-half-kneel"],
    note: "Breathe out longer than you breathe in throughout. That, more than the stretching, is what settles things at night.",
  },
  {
    id: "sciatica-calm",
    name: "Sciatica calm-down",
    forWho:
      "Symptoms travelling down the back of one leg. Deliberately gentle — gliding the nerve rather than stretching it.",
    minutes: 6,
    drills: ["sciatic-glide", "figure-four", "glute-bridge"],
    note: "Nothing here should increase the symptoms in your leg, during or after. If it does, stop and get assessed. Numbness in the saddle area or any change in bladder or bowel control is a hospital-now situation.",
  },
  {
    id: "three-minute",
    name: "The three minutes you actually have",
    forWho:
      "Between meetings, in an airport, in the kitchen while the kettle boils. Not a compromise — a genuinely useful three minutes.",
    minutes: 3,
    drills: ["chin-tuck", "upper-trap-stretch", "ql-side-bend"],
  },
  {
    id: "dead-butt",
    name: "Wake up the glutes",
    forWho:
      "Sitting all day and feeling it in the low back. This is the one to do if you can't feel your glutes working during a bridge.",
    minutes: 8,
    drills: ["glute-bridge", "clamshell", "side-plank", "bird-dog", "hip-flexor-half-kneel"],
  },
];

export const ROUTINE_BY_ID = new Map(ROUTINES.map((r) => [r.id, r]));
