/**
 * Canonical proportions for the body map.
 *
 * The figure is drawn to the classical eight-head canon inside a 600x1400
 * viewBox: vertex at y=40, sole at y=1360, so one head unit is 165px. Every
 * anatomical landmark below is derived from that grid, which is what keeps the
 * posterior and anterior views registered against each other — and lets the
 * dermatome bands, referral heat blobs and fascial lines all share one
 * coordinate space.
 */

export const VIEW_W = 600;
export const VIEW_H = 1400;
export const MID = 300;

/** One head unit. */
export const H = 165;
export const VERTEX = 40;

/** y of the n-th head division, n = 0 at the vertex. */
export const head = (n: number) => VERTEX + n * H;

export const Y = {
  vertex: 40,
  skullWidest: 112,
  occiput: 196,
  chin: head(1), // 205
  c1: 214,
  c7: 264, // the bump at the base of the neck
  acromion: 292,
  scapulaSpine: 316,
  t1: 268,
  t5: 352,
  t7: 386,
  scapulaInferiorAngle: 402,
  t12: 478,
  waist: 515,
  navel: head(3), // 535
  iliacCrest: 550,
  psis: 592,
  sacrumBase: 596,
  coccyx: 700,
  trochanter: 664,
  crotch: head(4), // 700
  glutealFold: 730,
  midThigh: head(5), // 865
  knee: 1004,
  calfBelly: 1090,
  achilles: 1250,
  ankle: 1292,
  sole: 1360,
} as const;

/** Half-widths from the midline. */
export const W = {
  skull: 76,
  neck: 42,
  acromion: 150,
  chest: 124,
  waist: 95,
  iliacCrest: 112,
  hip: 126,
  knee: 46,
  calf: 33,
  ankle: 24,
} as const;

/** Left-side (viewer's left) key points, mirrored at render time. */
export const L = {
  acromion: [150, Y.acromion],
  shoulderJoint: [154, 302],
  scapulaSuperiorMedial: [252, 296],
  scapulaSpineMedial: [246, 320],
  scapulaInferiorAngle: [238, Y.scapulaInferiorAngle],
  scapulaLateral: [186, 344],
  axilla: [172, 356],
  iliacCrestLateral: [186, Y.iliacCrest],
  psis: [282, Y.psis],
  trochanter: [178, Y.trochanter],
  ischialTuberosity: [244, 722],
  kneeCentre: [222, Y.knee],
  fibularHead: [196, 1018],
  calfCentre: [228, Y.calfBelly],
  heel: [230, 1344],
} as const;

/**
 * Spinous process positions down the midline, used to anchor every muscle that
 * originates from the spine and to place the vertebral column in layer 3.
 */
export const SPINE: { id: string; y: number }[] = [
  { id: "C1", y: 214 },
  { id: "C2", y: 224 },
  { id: "C3", y: 234 },
  { id: "C4", y: 243 },
  { id: "C5", y: 251 },
  { id: "C6", y: 258 },
  { id: "C7", y: 266 },
  { id: "T1", y: 276 },
  { id: "T2", y: 290 },
  { id: "T3", y: 304 },
  { id: "T4", y: 320 },
  { id: "T5", y: 336 },
  { id: "T6", y: 353 },
  { id: "T7", y: 370 },
  { id: "T8", y: 387 },
  { id: "T9", y: 404 },
  { id: "T10", y: 421 },
  { id: "T11", y: 439 },
  { id: "T12", y: 458 },
  { id: "L1", y: 478 },
  { id: "L2", y: 498 },
  { id: "L3", y: 518 },
  { id: "L4", y: 538 },
  { id: "L5", y: 558 },
  { id: "S1", y: 578 },
  { id: "S2", y: 596 },
  { id: "S3", y: 614 },
  { id: "S4", y: 632 },
  { id: "S5", y: 650 },
];

export const spineY = (id: string): number =>
  SPINE.find((s) => s.id === id)?.y ?? Y.t7;
