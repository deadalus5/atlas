import { BodyStage } from "@/components/BodyStage";
import { LayerRail } from "@/components/LayerRail";
import { SessionTray } from "@/components/SessionTray";
import { StoreHydrator, TopBar } from "@/components/TopBar";

/**
 * The map lives in the layout, not the page, so it stays mounted while you
 * browse from structure to structure. Navigating to /m/<id> only swaps the
 * drawer — the SVG never re-renders and never loses its scroll or zoom.
 */
export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col lg:h-[100dvh]">
      <StoreHydrator />
      <TopBar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <LayerRail />
        <BodyStage />
        <aside className="w-full shrink-0 border-t border-rule bg-surface lg:w-[27rem] lg:overflow-y-auto lg:border-l lg:border-t-0 xl:w-[30rem]">
          {children}
        </aside>
      </div>
      <SessionTray />
    </div>
  );
}
