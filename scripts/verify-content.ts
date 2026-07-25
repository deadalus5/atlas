/**
 * Content integrity gate. Runs in CI before the build.
 *
 * The corpus is hand-written TypeScript across several files, so the compiler
 * catches shape errors but not referential ones: a structure citing a drill that
 * no longer exists, a trigger point referring into a region that was renamed, a
 * video pointing at a muscle nobody drew. Those all fail here instead of
 * shipping as a silently empty panel.
 */
import { SHAPES_BY_VIEW } from "../src/anatomy";
import { POSTERIOR_REGIONS } from "../src/anatomy/regions";
import { DRILLS } from "../src/data/drills";
import { MEDIA } from "../src/data/media";
import { REFERENCES } from "../src/data/references";
import { ROUTINES } from "../src/data/routines";
import { STRUCTURES } from "../src/data/structures";

const errors: string[] = [];
const warnings: string[] = [];

const shapeIds = new Set(
  Object.values(SHAPES_BY_VIEW).flatMap((v) => v.map((s) => s.id)),
);
const structureIds = new Set(STRUCTURES.map((s) => s.id));
const drillIds = new Set(DRILLS.map((d) => d.id));
const regionIds = new Set(POSTERIOR_REGIONS.map((r) => r.id));
const knownIds = new Set([...shapeIds, ...structureIds]);

/* ---- structures ---------------------------------------------------------- */
const seenStructure = new Set<string>();
for (const s of STRUCTURES) {
  const where = `structure "${s.id}"`;
  if (seenStructure.has(s.id)) errors.push(`${where}: duplicate id`);
  seenStructure.add(s.id);

  if (!shapeIds.has(s.id))
    warnings.push(`${where}: has prose but is not drawn on any map`);
  if (!s.plain?.trim()) errors.push(`${where}: missing plain-English description`);
  if (!s.feels?.trim()) errors.push(`${where}: missing "what it feels like"`);
  if (!s.palpation?.trim()) errors.push(`${where}: missing palpation guidance`);
  if (!s.drills?.length) errors.push(`${where}: has no drills`);

  for (const d of s.drills ?? [])
    if (!drillIds.has(d)) errors.push(`${where}: cites unknown drill "${d}"`);

  for (const rel of [...(s.antagonists ?? []), ...(s.synergists ?? [])])
    if (!knownIds.has(rel))
      warnings.push(`${where}: names "${rel}", which has no page yet`);

  for (const tp of s.triggerPoints ?? []) {
    if (!tp.regions?.length)
      errors.push(`${where}: trigger point "${tp.label}" refers nowhere`);
    for (const r of tp.regions ?? [])
      if (!regionIds.has(r))
        errors.push(`${where}: trigger point refers to unknown region "${r}"`);
    const [x, y] = tp.at ?? [];
    if (!(x >= 0 && x <= 600 && y >= 0 && y <= 1400))
      errors.push(`${where}: trigger point "${tp.label}" is outside the viewBox`);
  }
}

/* ---- drills -------------------------------------------------------------- */
for (const d of DRILLS) {
  const where = `drill "${d.id}"`;
  if (!d.steps?.length) errors.push(`${where}: has no steps`);
  if (d.steps.some((s) => !s.trim())) errors.push(`${where}: has an empty step`);
  if (!d.targets?.length) errors.push(`${where}: targets nothing`);
  if (!(d.seconds > 0)) errors.push(`${where}: needs a positive duration`);
  if (!d.equipment?.length) errors.push(`${where}: missing equipment list`);
  for (const t of d.targets ?? [])
    if (!knownIds.has(t)) errors.push(`${where}: targets unknown structure "${t}"`);
}

/* ---- routines ------------------------------------------------------------ */
for (const r of ROUTINES) {
  for (const d of r.drills)
    if (!drillIds.has(d)) errors.push(`routine "${r.id}": cites unknown drill "${d}"`);
  if (!r.drills.length) errors.push(`routine "${r.id}": is empty`);
}

/* ---- media & references -------------------------------------------------- */
for (const m of MEDIA) {
  const where = `video "${m.youtubeId}"`;
  if (!/^[A-Za-z0-9_-]{11}$/.test(m.youtubeId))
    errors.push(`${where}: not a valid YouTube id`);
  if (!m.title?.trim() || !m.channel?.trim())
    errors.push(`${where}: missing the title/channel returned by oEmbed`);
  for (const t of m.targets)
    if (!knownIds.has(t)) errors.push(`${where}: targets unknown structure "${t}"`);
}

for (const r of REFERENCES) {
  if (!/^https?:\/\//.test(r.url)) errors.push(`reference "${r.title}": bad URL`);
  for (const t of r.targets)
    if (!knownIds.has(t))
      warnings.push(`reference "${r.title}": targets undrawn structure "${t}"`);
}

/* ---- coverage report ----------------------------------------------------- */
const drawn = [...shapeIds].length;
const written = [...structureIds].filter((id) => shapeIds.has(id)).length;
const withMedia = new Set(MEDIA.flatMap((m) => m.targets)).size;

console.log(`Atlas content check`);
console.log(`  structures drawn on the map : ${drawn}`);
console.log(`  of those, written up        : ${written}`);
console.log(`  drills                      : ${DRILLS.length}`);
console.log(`  routines                    : ${ROUTINES.length}`);
console.log(`  verified videos             : ${MEDIA.length} covering ${withMedia} structures`);
console.log(`  verified references         : ${REFERENCES.length}`);
console.log(`  pain regions                : ${regionIds.size}`);

if (warnings.length) {
  console.log(`\n${warnings.length} warnings:`);
  for (const w of warnings.slice(0, 25)) console.log(`  - ${w}`);
  if (warnings.length > 25) console.log(`  … and ${warnings.length - 25} more`);
}

if (errors.length) {
  console.error(`\n${errors.length} errors:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log("\nAll cross-references resolve.");
