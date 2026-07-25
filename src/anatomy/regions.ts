import { mirror, type Pt } from "./geom";

/**
 * Pain regions — where a person points when you ask "where does it hurt?".
 *
 * These are deliberately not the same thing as muscles. Referred pain lands in
 * an area, not on an anatomical structure, so the reverse lookup ("it hurts
 * here, what causes that?") needs its own coarse geography sharing the same
 * 600x1400 coordinate space as everything else.
 */
export interface Region {
  id: string;
  label: string;
  /** Authored on the viewer's left where bilateral. */
  outline: Pt[];
  bilateral?: boolean;
}

export const POSTERIOR_REGIONS: Region[] = [
  {
    id: "head-temporal",
    label: "Temple and behind the eye",
    bilateral: true,
    outline: [
      [244, 78],
      [288, 66],
      [296, 132],
      [250, 144],
    ],
  },
  {
    id: "head-occipital",
    label: "Base of the skull",
    outline: [
      [262, 148],
      [338, 148],
      [340, 200],
      [260, 200],
    ],
  },
  {
    id: "neck-posterior",
    label: "Back of the neck",
    outline: [
      [268, 202],
      [332, 202],
      [334, 266],
      [266, 266],
    ],
  },
  {
    id: "neck-lateral",
    label: "Side of the neck",
    bilateral: true,
    outline: [
      [228, 208],
      [266, 202],
      [264, 268],
      [222, 274],
    ],
  },
  {
    id: "shoulder-top",
    label: "Top of the shoulder",
    bilateral: true,
    outline: [
      [148, 276],
      [220, 258],
      [230, 292],
      [156, 308],
    ],
  },
  {
    id: "scapula-medial",
    label: "Between the shoulder blade and the spine",
    bilateral: true,
    outline: [
      [246, 286],
      [292, 282],
      [288, 400],
      [238, 404],
    ],
  },
  {
    id: "scapula-inferior",
    label: "Bottom tip of the shoulder blade",
    bilateral: true,
    outline: [
      [200, 376],
      [250, 390],
      [244, 434],
      [200, 420],
    ],
  },
  {
    id: "mid-back",
    label: "Mid back",
    outline: [
      [250, 400],
      [350, 400],
      [352, 470],
      [248, 470],
    ],
  },
  {
    id: "lumbar",
    label: "Low back",
    outline: [
      [246, 470],
      [354, 470],
      [352, 566],
      [248, 566],
    ],
  },
  {
    id: "si-joint",
    label: "The dimple at the base of the spine",
    bilateral: true,
    outline: [
      [256, 564],
      [294, 564],
      [292, 632],
      [254, 628],
    ],
  },
  {
    id: "glute-upper",
    label: "Upper buttock",
    bilateral: true,
    outline: [
      [186, 566],
      [254, 570],
      [250, 620],
      [184, 616],
    ],
  },
  {
    id: "glute-mid",
    label: "Middle of the buttock",
    bilateral: true,
    outline: [
      [180, 620],
      [252, 624],
      [248, 678],
      [180, 674],
    ],
  },
  {
    id: "glute-deep",
    label: "Deep in the buttock",
    bilateral: true,
    outline: [
      [198, 630],
      [268, 636],
      [262, 706],
      [198, 700],
    ],
  },
  {
    id: "hip-lateral",
    label: "Outer hip",
    bilateral: true,
    outline: [
      [164, 578],
      [200, 582],
      [196, 674],
      [162, 668],
    ],
  },
  {
    id: "arm-posterior",
    label: "Back of the arm",
    bilateral: true,
    outline: [
      [116, 318],
      [178, 304],
      [152, 560],
      [98, 542],
    ],
  },
  {
    id: "thigh-lateral",
    label: "Outer thigh",
    bilateral: true,
    outline: [
      [166, 700],
      [202, 706],
      [198, 900],
      [170, 890],
    ],
  },
  {
    id: "thigh-posterior",
    label: "Back of the thigh",
    bilateral: true,
    outline: [
      [182, 730],
      [256, 730],
      [252, 960],
      [190, 960],
    ],
  },
  {
    id: "calf",
    label: "Calf",
    bilateral: true,
    outline: [
      [194, 1006],
      [262, 1006],
      [258, 1215],
      [200, 1215],
    ],
  },
  {
    id: "foot",
    label: "Heel and sole",
    bilateral: true,
    outline: [
      [220, 1288],
      [292, 1288],
      [290, 1366],
      [224, 1366],
    ],
  },
];

export const REGION_BY_ID = new Map(POSTERIOR_REGIONS.map((r) => [r.id, r]));

export interface RegionInstance {
  key: string;
  region: Region;
  outline: Pt[];
}

export function regionInstances(regions = POSTERIOR_REGIONS): RegionInstance[] {
  const out: RegionInstance[] = [];
  for (const r of regions) {
    if (r.bilateral) {
      out.push({ key: `${r.id}--left`, region: r, outline: r.outline });
      out.push({
        key: `${r.id}--right`,
        region: r,
        outline: mirror(r.outline),
      });
    } else {
      out.push({ key: `${r.id}--centre`, region: r, outline: r.outline });
    }
  }
  return out;
}
