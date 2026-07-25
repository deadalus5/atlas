"use client";

import { useMemo, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { REGION_BY_ID } from "@/anatomy/regions";
import { BodyHeatmap } from "@/components/BodyHeatmap";
import { SiteHeader } from "@/components/SiteHeader";
import { useHydrated } from "@/components/ui";
import { useAtlas } from "@/store/atlas";
import { cn } from "@/lib/cn";

const WINDOWS = [
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 3650, label: "All time" },
];

const today = () => new Date().toISOString().slice(0, 10);

export default function JournalPage() {
  const hydrated = useHydrated();
  const journal = useAtlas((s) => s.journal);
  const completions = useAtlas((s) => s.completions);
  const logPain = useAtlas((s) => s.logPain);
  const clearJournal = useAtlas((s) => s.clearJournal);
  const exportJSON = useAtlas((s) => s.exportJSON);
  const importJSON = useAtlas((s) => s.importJSON);

  const [region, setRegion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [days, setDays] = useState(30);

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }, [days]);

  const inWindow = useMemo(
    () => journal.filter((j) => j.date >= cutoff),
    [journal, cutoff],
  );

  const intensities = useMemo(() => {
    const sums: Record<string, { total: number; n: number }> = {};
    for (const j of inWindow) {
      sums[j.regionId] ??= { total: 0, n: 0 };
      sums[j.regionId].total += j.intensity;
      sums[j.regionId].n += 1;
    }
    return Object.fromEntries(
      Object.entries(sums).map(([k, v]) => [k, v.total / v.n]),
    );
  }, [inWindow]);

  /**
   * Compares average logged pain on days following a completed session against
   * days that did not. Stated as an observation, never as proof — with this
   * little data it cannot be anything more.
   */
  const effect = useMemo(() => {
    if (inWindow.length < 6 || completions.length < 3) return null;
    const activeDates = new Set(completions.map((c) => c.date));
    const after: number[] = [];
    const other: number[] = [];
    for (const j of inWindow) {
      const prev = new Date(j.date);
      prev.setDate(prev.getDate() - 1);
      const key = prev.toISOString().slice(0, 10);
      (activeDates.has(key) || activeDates.has(j.date) ? after : other).push(
        j.intensity,
      );
    }
    if (after.length < 3 || other.length < 3) return null;
    const mean = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
    return { after: mean(after), other: mean(other), n: after.length };
  }, [inWindow, completions]);

  const sorted = useMemo(
    () =>
      Object.entries(intensities).sort((a, b) => b[1] - a[1]),
    [intensities],
  );

  if (!hydrated) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-10" />
      </>
    );
  }

  const save = () => {
    if (!region) return;
    logPain({
      date: today(),
      regionId: region,
      intensity,
      note: note.trim() || undefined,
    });
    setNote("");
  };

  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-journal-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (file: File) => {
    const ok = importJSON(await file.text());
    if (!ok) alert("That file could not be read as an Atlas export.");
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          Private to this device
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Journal</h1>
        <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink-2">
          Two taps a day is enough. Over a few weeks the pattern tells you more
          than any single day ever could — which areas are actually improving,
          and which one keeps coming back.
        </p>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,20rem)_1fr]">
          {/* ---- heatmap ---- */}
          <div>
            <div className="flex gap-1.5">
              {WINDOWS.map((w) => (
                <button
                  key={w.days}
                  onClick={() => setDays(w.days)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    days === w.days
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-rule text-ink-2",
                  )}
                >
                  {w.label}
                </button>
              ))}
            </div>
            <div className="mt-3 h-[26rem] rounded-card border border-rule bg-surface p-2">
              <BodyHeatmap
                intensities={intensities}
                selected={region}
                onSelect={setRegion}
              />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-3">
              Tap a region to log it. Areas you have never logged stay blank —
              no data is not the same as no pain.
            </p>
          </div>

          {/* ---- logging + readout ---- */}
          <div>
            <section className="rounded-card border border-rule bg-surface p-5">
              <h2 className="text-sm font-semibold">
                {region
                  ? `How is the ${REGION_BY_ID.get(region)?.label.toLowerCase()} today?`
                  : "Pick an area on the diagram"}
              </h2>

              {region && (
                <>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="mt-4 w-full accent-[var(--heat)]"
                    aria-label="Pain intensity from 0 to 10"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-ink-3">
                    <span>0 · nothing</span>
                    <span className="text-base font-semibold text-ink">
                      {intensity}
                    </span>
                    <span>10 · worst</span>
                  </div>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Anything worth remembering? Long drive, bad night, new chair…"
                    className="mt-3 w-full rounded-lg border border-rule bg-bg-2 px-3 py-2 text-sm outline-none placeholder:text-ink-3 focus:border-accent"
                  />
                  <button
                    onClick={save}
                    className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                  >
                    Log it
                  </button>
                </>
              )}
            </section>

            {sorted.length > 0 && (
              <section className="mt-5">
                <h2 className="text-sm font-semibold">
                  Worst areas, last {days === 3650 ? "of all time" : `${days} days`}
                </h2>
                <ul className="mt-2 space-y-1.5">
                  {sorted.map(([id, v]) => (
                    <li key={id} className="flex items-center gap-3">
                      <span className="w-52 shrink-0 truncate text-sm text-ink-2">
                        {REGION_BY_ID.get(id)?.label ?? id}
                      </span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-bg-2">
                        <span
                          className="block h-full rounded-full bg-heat"
                          style={{ width: `${(v / 10) * 100}%` }}
                        />
                      </span>
                      <span className="w-8 shrink-0 text-right font-mono text-xs text-ink-3">
                        {v.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {effect && (
              <section className="mt-5 rounded-card border border-accent/30 bg-accent/8 p-4">
                <h2 className="text-sm font-semibold text-accent">
                  What your own data suggests
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  On days around a completed session you logged an average of{" "}
                  <strong>{effect.after.toFixed(1)}</strong>, against{" "}
                  <strong>{effect.other.toFixed(1)}</strong> otherwise. That is
                  an observation from {effect.n} entries, not proof — plenty else
                  differs between those days. But it is your data, not a
                  stranger&rsquo;s.
                </p>
              </section>
            )}

            <section className="mt-5 flex flex-wrap items-center gap-2 border-t border-rule pt-4">
              <button
                onClick={doExport}
                className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-xs text-ink-2 hover:text-ink"
              >
                <Download size={13} /> Export
              </button>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-xs text-ink-2 hover:text-ink">
                <Upload size={13} /> Import
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void doImport(f);
                  }}
                />
              </label>
              <button
                onClick={() => {
                  if (confirm("Delete every journal entry on this device?"))
                    clearJournal();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 px-3 py-1.5 text-xs text-danger"
              >
                <Trash2 size={13} /> Delete everything
              </button>
              <p className="w-full text-xs leading-relaxed text-ink-3">
                {journal.length} {journal.length === 1 ? "entry" : "entries"} ·{" "}
                {completions.length} completed{" "}
                {completions.length === 1 ? "session" : "sessions"}. All of it
                lives in this browser and has never been sent anywhere.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
