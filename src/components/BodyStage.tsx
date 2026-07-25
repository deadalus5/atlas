"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BodyMap } from "./BodyMap";
import { findShape } from "@/anatomy";
import { REGION_BY_ID } from "@/anatomy/regions";
import { structuresReferringTo } from "@/data";
import { useAtlas } from "@/store/atlas";

export function BodyStage() {
  const router = useRouter();
  const pathname = usePathname();
  const view = useAtlas((s) => s.view);
  const layer = useAtlas((s) => s.layer);
  const setLayer = useAtlas((s) => s.setLayer);
  const mode = useAtlas((s) => s.mode);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const selected = useMemo(() => {
    const m = /^\/m\/([^/]+)/.exec(pathname);
    return m ? decodeURIComponent(m[1]) : null;
  }, [pathname]);

  const activeRegion = useMemo(() => {
    const m = /^\/hurts\/([^/]+)/.exec(pathname);
    return m ? decodeURIComponent(m[1]) : null;
  }, [pathname]);

  const litIds = useMemo(
    () =>
      activeRegion
        ? structuresReferringTo(activeRegion).map((c) => c.structure.id)
        : [],
    [activeRegion],
  );

  // Arriving at a structure by link, search or a shared URL should take the map
  // to the depth where that structure actually lives — otherwise you land on a
  // page describing a muscle you cannot see.
  useEffect(() => {
    if (!selected) return;
    const shape = findShape(view, selected);
    if (shape && shape.layer !== layer) setLayer(shape.layer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, view]);

  const hoverLabel =
    mode === "referral" || activeRegion
      ? hoveredRegion && REGION_BY_ID.get(hoveredRegion)?.label
      : hovered && findShape(view, hovered)?.label;

  // A shared /hurts/ link should render referral mode even on a cold load,
  // before any store preference exists.
  const referral = mode === "referral" || Boolean(activeRegion);
  const empty = view === "anterior";

  return (
    <div className="paper-grain relative flex min-h-[52vh] flex-1 items-center justify-center overflow-hidden lg:min-h-0">
      {empty ? (
        <p className="max-w-xs px-6 text-center text-sm text-ink-3">
          The front view is still being drawn. Switch back to{" "}
          <button
            className="underline underline-offset-2"
            onClick={() => useAtlas.getState().setView("posterior")}
          >
            the back
          </button>{" "}
          for now.
        </p>
      ) : (
        <BodyMap
          view={view}
          layer={layer}
          mode={referral ? "referral" : "explore"}
          selectedId={selected}
          hoveredId={hovered}
          litIds={litIds}
          activeRegion={activeRegion}
          onHover={setHovered}
          onRegionHover={setHoveredRegion}
          onSelect={(id) => router.push(`/m/${id}/`)}
          onRegionSelect={(id) => router.push(`/hurts/${id}/`)}
          className="max-h-full"
        />
      )}

      {referral && !activeRegion && !empty && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-heat/40 bg-surface/95 px-3.5 py-1.5 text-xs font-medium text-heat shadow-sm">
          Click where the pain actually is
        </div>
      )}

      {hoverLabel && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-rule bg-surface/95 px-3 py-1 text-xs font-medium text-ink shadow-sm">
          {hoverLabel}
        </div>
      )}
    </div>
  );
}
