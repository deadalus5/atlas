import type { RedFlag } from "./types";

/**
 * A deterministic rule engine, not a model. It runs entirely in the browser,
 * needs no API key, works offline, and — most importantly — you can read
 * exactly why it said what it said.
 */

export const RED_FLAGS: RedFlag[] = [
  {
    id: "cauda-equina",
    symptom: "Saddle numbness, or loss of bladder or bowel control",
    plain:
      "Numbness in the area that would touch a bicycle seat, difficulty starting or stopping urinating, or loss of control.",
    urgency: "emergency",
    copy: "Go to an emergency department now. Numbness around the groin and inner thighs, or a change in bladder or bowel control alongside back pain, can mean the nerve bundle at the base of the spine is being compressed. It is treatable, and outcomes depend heavily on how fast it is dealt with. Do not wait to see whether it settles.",
  },
  {
    id: "progressive-weakness",
    symptom: "Weakness that is getting worse, or affects both legs",
    plain:
      "A foot that drags or slaps, difficulty getting up from a chair, or weakness spreading rather than settling.",
    urgency: "same-day",
    copy: "Contact a doctor today. Weakness that is progressing, or that affects both legs, needs examining rather than stretching.",
  },
  {
    id: "trauma",
    symptom: "Back pain that started with a significant fall or impact",
    plain: "A fall from height, a car accident, or a heavy direct blow.",
    urgency: "same-day",
    copy: "Get this assessed today, particularly if you are over 50, take steroids, or have thinner bones. A fracture needs ruling out before you start any exercise programme.",
  },
  {
    id: "systemic",
    symptom: "Fever, unexplained weight loss, or a history of cancer",
    plain:
      "Back pain alongside feeling generally unwell, night sweats, weight loss you did not intend, or a previous cancer diagnosis.",
    urgency: "same-day",
    copy: "Please see a doctor promptly. Back pain combined with feeling systemically unwell is one of the few situations where the cause is unlikely to be muscular, and it is worth checking early.",
  },
  {
    id: "night-pain",
    symptom: "Pain that is constant, unrelieved by any position, and wakes you",
    plain:
      "Pain that does not change whatever you do, and reliably wakes you in the small hours.",
    urgency: "within-days",
    copy: "Worth booking an appointment. Mechanical back pain almost always eases in some position; pain that never changes and consistently wakes you is a pattern worth having looked at.",
  },
  {
    id: "myelopathy",
    symptom: "Clumsy hands, or changes in walking and balance",
    plain:
      "Dropping things, difficulty with buttons, or feeling unsteady on your feet, alongside neck pain.",
    urgency: "same-day",
    copy: "Please arrange to be seen promptly. Neck pain together with clumsy hands or an unsteady walk can indicate pressure on the spinal cord itself, which is assessed differently from ordinary neck pain.",
  },
];

interface Rule {
  /** Matched case-insensitively against the free-text description. */
  patterns: RegExp[];
  flagId?: string;
  regionId?: string;
  structureIds?: string[];
  conditionHint?: string;
  /** Directional preference signal. */
  direction?: "extension" | "flexion";
  weight?: number;
}

const RULES: Rule[] = [
  /* --- red flags first, always --- */
  {
    patterns: [
      /saddle/i,
      /groin numb/i,
      /numb.*(bum|bottom|buttock|genital|perineum|inner thigh)/i,
      /(bladder|bowel|inconting|wetting|can'?t (pee|urinate))/i,
      /loss of control/i,
    ],
    flagId: "cauda-equina",
  },
  {
    patterns: [
      /both legs?/i,
      /getting weaker/i,
      /foot ?drop/i,
      /drags?|dragging/i,
      /weakness.*(worse|spreading|progress)/i,
    ],
    flagId: "progressive-weakness",
  },
  {
    patterns: [/fell|fall|car (crash|accident)|impact|collision|rugby tackle/i],
    flagId: "trauma",
  },
  {
    patterns: [/fever|night sweat|weight loss|cancer|tumour|tumor/i],
    flagId: "systemic",
  },
  {
    patterns: [
      /wakes me|wake up in pain|constant.*(pain|ache).*never/i,
      /nothing helps|no position helps/i,
    ],
    flagId: "night-pain",
  },
  {
    patterns: [/clumsy|dropping things|unsteady|balance|buttons/i],
    flagId: "myelopathy",
  },

  /* --- location --- */
  {
    patterns: [/neck|cervical|base of (my )?skull/i],
    regionId: "neck-posterior",
    structureIds: ["trapezius-upper", "levator-scapulae"],
    weight: 2,
  },
  {
    patterns: [/headache|temple|behind (my )?eye/i],
    regionId: "head-temporal",
    structureIds: ["trapezius-upper"],
    weight: 2,
  },
  {
    patterns: [
      /between (my )?(shoulder ?blades|scapulae)/i,
      /knot.*(back|shoulder)/i,
      /upper back/i,
    ],
    regionId: "scapula-medial",
    structureIds: ["rhomboid-major", "levator-scapulae", "trapezius-middle"],
    weight: 3,
  },
  {
    patterns: [/shoulder/i],
    regionId: "shoulder-top",
    structureIds: ["trapezius-upper", "infraspinatus"],
  },
  {
    patterns: [/low(er)? back|lumbar|small of my back|lower spine/i],
    regionId: "lumbar",
    structureIds: ["quadratus-lumborum", "multifidus", "gluteus-medius"],
    weight: 3,
  },
  {
    patterns: [/(hip|pelvis|side of my hip|outer hip)/i],
    regionId: "hip-lateral",
    structureIds: ["gluteus-medius", "quadratus-lumborum"],
    weight: 2,
  },
  {
    patterns: [/(butt|buttock|glute|bum|backside|arse|ass)/i],
    regionId: "glute-deep",
    structureIds: ["piriformis", "gluteus-medius", "gluteus-maximus"],
    weight: 2,
  },
  {
    patterns: [/sciatic|down (my|the) leg|shooting.*leg|leg pain/i],
    regionId: "thigh-posterior",
    structureIds: ["sciatic-nerve", "piriformis", "gluteus-medius"],
    conditionHint: "leg-symptoms",
    weight: 3,
  },
  {
    patterns: [/calf|achilles|heel/i],
    regionId: "calf",
    structureIds: ["gastrocnemius"],
  },
  {
    patterns: [/front of (my )?hip|hip flexor|groin/i],
    structureIds: ["psoas-major"],
    weight: 2,
  },

  /* --- directional preference --- */
  {
    patterns: [
      /worse (when |if )?(i )?sit/i,
      /sitting makes it worse/i,
      /worse.*(driving|desk|car)/i,
      /better.*(stand|walk)/i,
    ],
    direction: "extension",
  },
  {
    patterns: [
      /worse (when |if )?(i )?(stand|walk)/i,
      /better (when |if )?(i )?(sit|lean forward|bend forward)/i,
      /shopping trolley|trolley|supermarket/i,
    ],
    direction: "flexion",
  },
];

export interface TriageResult {
  flags: RedFlag[];
  regions: string[];
  structures: string[];
  direction: "extension" | "flexion" | null;
  legSymptoms: boolean;
  matched: string[];
}

export function triage(text: string): TriageResult {
  const flags: RedFlag[] = [];
  const regionScores = new Map<string, number>();
  const structureScores = new Map<string, number>();
  const matched: string[] = [];
  let direction: TriageResult["direction"] = null;
  let legSymptoms = false;

  for (const rule of RULES) {
    const hit = rule.patterns.find((p) => p.test(text));
    if (!hit) continue;
    matched.push(hit.source);

    if (rule.flagId) {
      const f = RED_FLAGS.find((r) => r.id === rule.flagId);
      if (f && !flags.includes(f)) flags.push(f);
    }
    const w = rule.weight ?? 1;
    if (rule.regionId)
      regionScores.set(rule.regionId, (regionScores.get(rule.regionId) ?? 0) + w);
    for (const s of rule.structureIds ?? [])
      structureScores.set(s, (structureScores.get(s) ?? 0) + w);
    if (rule.direction && !direction) direction = rule.direction;
    if (rule.conditionHint === "leg-symptoms") legSymptoms = true;
  }

  const rank = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);

  // Emergencies outrank everything else on the page.
  flags.sort(
    (a, b) =>
      ["emergency", "same-day", "within-days", "monitor"].indexOf(a.urgency) -
      ["emergency", "same-day", "within-days", "monitor"].indexOf(b.urgency),
  );

  return {
    flags,
    regions: rank(regionScores),
    structures: rank(structureScores).slice(0, 6),
    direction,
    legSymptoms,
    matched,
  };
}

export const DIRECTION_COPY = {
  extension: {
    label: "Your back seems to prefer arching",
    body: "Pain that is worse sitting and better standing or walking usually responds to gentle backward-bending, and gets wound up by repeated forward bending. Start with the extension-based work and go easy on toe-touches and deep forward folds for now.",
    avoid: "Repeated end-range forward bending, long slumped sitting.",
  },
  flexion: {
    label: "Your back seems to prefer bending forward",
    body: "Pain that is worse standing or walking and eases when you sit or lean on a trolley often responds better to flexion-based work. This pattern is common with narrowing of the spinal canal and is worth having confirmed.",
    avoid: "Prolonged standing and repeated backward bending.",
  },
} as const;
