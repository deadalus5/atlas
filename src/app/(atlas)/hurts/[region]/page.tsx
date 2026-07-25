import type { Metadata } from "next";
import { POSTERIOR_REGIONS, REGION_BY_ID } from "@/anatomy/regions";
import { ReferralPanel } from "@/components/ReferralPanel";
import { structuresReferringTo } from "@/data";

export function generateStaticParams() {
  return POSTERIOR_REGIONS.map((r) => ({ region: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const r = REGION_BY_ID.get(region);
  const label = r?.label ?? "That spot";
  return {
    title: `Pain at the ${label.toLowerCase()}`,
    description: `Which muscles refer pain to the ${label.toLowerCase()}, and what to do about each of them.`,
  };
}

export default async function HurtsPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const r = REGION_BY_ID.get(region);
  const candidates = structuresReferringTo(region);

  return (
    <ReferralPanel
      regionId={region}
      regionLabel={r?.label ?? region}
      candidates={candidates.map((c) => ({
        id: c.structure.id,
        name: c.structure.name,
        layer: c.structure.layer,
        refersTo: c.triggerPoint.refersTo,
        tpLabel: c.triggerPoint.label,
        realCulprit: c.structure.realCulprit,
        note: c.triggerPoint.note,
      }))}
    />
  );
}
