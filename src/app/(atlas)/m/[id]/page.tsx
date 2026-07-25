import type { Metadata } from "next";
import { SHAPES_BY_VIEW } from "@/anatomy";
import { StructurePanel } from "@/components/StructurePanel";
import { allStructureIds, getStructure } from "@/data";

export function generateStaticParams() {
  return allStructureIds().map((id) => ({ id }));
}

/** Anatomy-only fallback for structures whose prose is not written yet. */
function shapeFor(id: string) {
  for (const shapes of Object.values(SHAPES_BY_VIEW)) {
    const hit = shapes.find((s) => s.id === id);
    if (hit) return hit;
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = getStructure(id);
  const label = s?.name ?? shapeFor(id)?.label ?? "Structure";
  const description =
    s?.plain ??
    `${label} on the Atlas interactive anatomical map of the back, neck and hips.`;
  return {
    title: label,
    description,
    openGraph: { title: `${label} · Atlas`, description },
  };
}

export default async function StructurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const structure = getStructure(id);
  const shape = shapeFor(id);

  return (
    <StructurePanel
      structure={structure}
      fallbackLabel={shape?.label ?? id}
      fallbackLayer={shape?.layer ?? 0}
    />
  );
}
