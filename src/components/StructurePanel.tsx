"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Play,
  Plus,
  X,
} from "lucide-react";
import {
  EVIDENCE_COPY,
  MODALITY_COPY,
  MODALITY_ORDER,
  drillsFor,
  screenDrills,
  youtubeEmbedUrl,
  youtubeSearchUrl,
  youtubeWatchUrl,
  type Drill,
  type Media,
  type Structure,
} from "@/data";
import { mediaFor, type CuratedMedia } from "@/data/media";
import { referencesFor } from "@/data/references";
import { LAYER_NAMES } from "@/anatomy/types";
import { useAtlas } from "@/store/atlas";
import { Chip, useHydrated } from "./ui";
import { cn } from "@/lib/cn";

type Tab = "about" | "fix" | "referral" | "watch" | "clinical";

/** Which kind of demonstration fits each modality. */
const PURPOSE_FOR: Record<string, CuratedMedia["purpose"]> = {
  stretch: "stretch",
  release: "release",
  activate: "strengthen",
  mobilise: "mobility",
  "nerve-glide": "nerve-glide",
  integrate: "strengthen",
};

export function StructurePanel({
  structure,
  fallbackLabel,
  fallbackLayer,
}: {
  structure?: Structure;
  fallbackLabel: string;
  fallbackLayer: number;
}) {
  const [tab, setTab] = useState<Tab>("about");
  const [video, setVideo] = useState<Media | null>(null);
  const hydrated = useHydrated();

  const depth = useAtlas((s) => s.depth);
  const safety = useAtlas((s) => s.safety);
  const session = useAtlas((s) => s.session);
  const add = useAtlas((s) => s.addToSession);
  const remove = useAtlas((s) => s.removeFromSession);

  const id = structure?.id ?? "";
  const inSession = hydrated && session.some((i) => i.structureId === id);

  const drills = useMemo(() => (id ? drillsFor(id) : []), [id]);
  const clips = useMemo(() => (id ? mediaFor(id) : []), [id]);
  const { allowed, withheld } = useMemo(
    () => screenDrills(drills, safety),
    [drills, safety],
  );

  if (!structure) {
    return (
      <div className="p-5 sm:p-6">
        <h1 className="text-2xl font-semibold">{fallbackLabel}</h1>
        <Chip className="mt-2">{LAYER_NAMES[fallbackLayer as 0]}</Chip>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          This structure is on the map, but its written guidance is not finished
          yet. Rather than show you filler, Atlas would rather tell you plainly
          that it is not ready.
        </p>
      </div>
    );
  }

  const s = structure;
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "about", label: "What it is", show: true },
    { id: "fix", label: "Fix it", show: allowed.length > 0 },
    { id: "referral", label: "Referral", show: (s.triggerPoints?.length ?? 0) > 0 },
    {
      id: "watch",
      label: clips.length ? `Watch · ${clips.length}` : "Watch",
      show: clips.length > 0,
    },
    { id: "clinical", label: "Clinical", show: true },
  ];

  return (
    <div className="flex flex-col">
      {/* ---- header ---- */}
      <div className="border-b border-rule px-5 pb-3 pt-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold leading-tight">{s.name}</h1>
            {s.latin && (
              <p className="mt-0.5 font-mono text-xs italic text-ink-3">
                {s.latin}
              </p>
            )}
          </div>
          <button
            onClick={() => (inSession ? remove(s.id) : add(s.id, "center"))}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              inSession
                ? "border-ok/50 bg-ok/10 text-ok"
                : "border-accent/50 text-accent hover:bg-accent/10",
            )}
          >
            {inSession ? <Check size={13} /> : <Plus size={13} />}
            {inSession ? "In session" : "Add"}
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Chip>{LAYER_NAMES[s.layer]}</Chip>
          {s.tendsToBe === "tight" && <Chip tone="warn">Usually tight</Chip>}
          {s.tendsToBe === "weak" && <Chip tone="accent">Usually weak</Chip>}
          {s.aka?.slice(0, 2).map((a) => <Chip key={a}>“{a}”</Chip>)}
        </div>

        <div className="-mb-3 mt-3 flex gap-1 overflow-x-auto">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-2.5 pb-2.5 pt-1 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-3 hover:text-ink-2",
                )}
              >
                {t.label}
              </button>
            ))}
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {tab === "about" && (
          <div className="space-y-5">
            <p className="text-[15px] leading-relaxed">{s.plain}</p>

            <Block title="What it feels like">{s.feels}</Block>
            <Block title="Find it on yourself">{s.palpation}</Block>

            {s.angryBecause.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold">Why it gets angry</h2>
                <ul className="mt-2 space-y-1.5">
                  {s.angryBecause.map((a) => (
                    <li
                      key={a}
                      className="flex gap-2 text-sm leading-relaxed text-ink-2"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-rule-2" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {s.realCulprit && (
              <div className="rounded-card border border-accent/30 bg-accent/8 p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                  <Lightbulb size={14} /> The thing most people miss
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  {s.realCulprit}
                </p>
              </div>
            )}

            {s.ergonomics && s.ergonomics.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold">Fix the cause</h2>
                <ul className="mt-2 space-y-1.5">
                  {s.ergonomics.map((e) => (
                    <li
                      key={e}
                      className="flex gap-2 text-sm leading-relaxed text-ink-2"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-rule-2" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {depth === "clinical" && <ClinicalBlock s={s} />}
          </div>
        )}

        {tab === "fix" && (
          <div className="space-y-6">
            {MODALITY_ORDER.map((m) => {
              const group = allowed.filter((d) => d.modality === m);
              if (!group.length) return null;
              return (
                <section key={m}>
                  <h2 className="text-sm font-semibold">
                    {MODALITY_COPY[m].label}
                  </h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-3">
                    {MODALITY_COPY[m].why}
                  </p>
                  <div className="mt-2.5 space-y-2">
                    {group.map((d) => (
                      <DrillCard
                        key={d.id}
                        drill={d}
                        structureName={s.name}
                        fallback={clips.find(
                          (c) => c.purpose === PURPOSE_FOR[d.modality],
                        )}
                        onPlay={setVideo}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {withheld.length > 0 && (
              <section className="rounded-card border border-warn/35 bg-warn/8 p-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-warn">
                  <AlertTriangle size={14} /> Held back for you
                </p>
                <ul className="mt-2 space-y-2">
                  {withheld.map((w) => (
                    <li key={w.drill.id} className="text-xs leading-relaxed">
                      <span className="font-medium">{w.drill.name}</span>
                      <span className="block text-ink-2">{w.reason}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {tab === "referral" && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-ink-2">
              Muscles refer pain to places that are not the muscle. These are the
              documented patterns for {s.name.toLowerCase()} — if the description
              matches where you actually feel it, this is worth pursuing.
            </p>
            {s.triggerPoints?.map((tp) => (
              <div
                key={tp.label}
                className="rounded-card border border-rule bg-bg-2 p-4"
              >
                <p className="text-sm font-semibold">{tp.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                  <span className="font-medium text-ink">Felt at: </span>
                  {tp.refersTo}
                </p>
                {tp.note && (
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-3">
                    {tp.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "watch" && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-ink-2">
              Demonstrations for {s.name.toLowerCase()}, each deep-linked to the
              second the demonstration begins so you skip the intro. Every one was
              checked against YouTube before it shipped.
            </p>
            <ul className="space-y-2">
              {clips.map((c) => (
                <li key={c.youtubeId}>
                  <button
                    onClick={() => setVideo(c)}
                    className="flex w-full items-start gap-3 rounded-card border border-rule bg-bg-2 p-3 text-left transition-colors hover:border-rule-2"
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                      <Play size={12} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug">
                        {c.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-3">
                        {c.channel}
                        {c.credibility ? ` · ${c.credibility}` : ""}
                        {c.start
                          ? ` · from ${Math.floor(c.start / 60)}:${String(c.start % 60).padStart(2, "0")}`
                          : ""}
                      </span>
                    </span>
                    <Chip className="shrink-0">{c.purpose}</Chip>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "clinical" && <ClinicalBlock s={s} expanded />}

        {s.redFlags && s.redFlags.length > 0 && (
          <section className="mt-6 rounded-card border border-danger/40 bg-danger/8 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-danger">
              <AlertTriangle size={14} /> Stop and get seen if
            </p>
            <ul className="mt-2 space-y-1.5">
              {s.redFlags.map((r) => (
                <li key={r} className="text-sm leading-relaxed text-ink-2">
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {video && <VideoModal media={video} onClose={() => setVideo(null)} />}
    </div>
  );
}

/* ---- pieces --------------------------------------------------------------- */

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

function ClinicalBlock({ s, expanded }: { s: Structure; expanded?: boolean }) {
  const refs = referencesFor(s.id);
  const c = s.clinical;
  const rows: [string, string | undefined][] = [
    ["Origin", c.origin],
    ["Insertion", c.insertion],
    ["Actions", c.actions?.join(" · ")],
    ["Innervation", c.innervation],
    ["Nerve roots", c.roots?.join(", ")],
    ["Antagonists", s.antagonists?.join(", ")],
    ["Synergists", s.synergists?.join(", ")],
    ["Fascial lines", s.fascialLines?.join(", ")],
  ];
  return (
    <div className={cn(!expanded && "border-t border-rule pt-4")}>
      <h2 className="text-sm font-semibold">Clinical</h2>
      <dl className="mt-2 space-y-2">
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-2">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
      </dl>

      {refs.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
            References
          </p>
          <ul className="mt-1.5 space-y-1">
            {refs.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-1 text-xs leading-relaxed text-ink-2 hover:text-ink"
                >
                  {r.title}
                  <span className="text-ink-3">· {r.publisher}</span>
                  <ExternalLink size={10} className="shrink-0 text-ink-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function DrillCard({
  drill,
  structureName,
  fallback,
  onPlay,
}: {
  drill: Drill;
  structureName: string;
  fallback?: CuratedMedia;
  onPlay: (m: Media) => void;
}) {
  const [open, setOpen] = useState(false);
  const media = drill.media?.[0] ?? fallback;

  return (
    <div className="overflow-hidden rounded-card border border-rule bg-bg-2">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{drill.name}</span>
          <span className="mt-0.5 block text-xs text-ink-3">
            {drill.holdSeconds
              ? `${drill.holdSeconds}s hold`
              : (drill.reps ?? "")}
            {drill.perSide ? " · each side" : ""}
            {drill.equipment[0] !== "none"
              ? ` · ${drill.equipment.join(", ")}`
              : " · no equipment"}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={cn(
            "shrink-0 text-ink-3 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-rule px-3.5 py-3">
          <ol className="space-y-1.5">
            {drill.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="mt-0.5 font-mono text-[10px] text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink-2">{step}</span>
              </li>
            ))}
          </ol>

          {drill.cues && drill.cues.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                Cues
              </p>
              <ul className="mt-1 space-y-1">
                {drill.cues.map((c) => (
                  <li key={c} className="text-xs leading-relaxed text-ink-2">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drill.mistakes && drill.mistakes.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                Common mistakes
              </p>
              <ul className="mt-1 space-y-1">
                {drill.mistakes.map((c) => (
                  <li key={c} className="text-xs leading-relaxed text-ink-2">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drill.contraindications?.map((c) => (
            <p key={c} className="text-xs leading-relaxed text-warn">
              {c}
            </p>
          ))}

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {media ? (
              <button
                onClick={() => onPlay(media)}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink"
              >
                <Play size={12} /> Watch the demo
              </button>
            ) : (
              <a
                href={youtubeSearchUrl(`${drill.name} ${structureName} physical therapy`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1.5 text-xs font-medium text-ink-2 hover:text-ink"
              >
                Find a demo <ExternalLink size={11} />
              </a>
            )}
            {drill.evidence && (
              <span
                title={EVIDENCE_COPY[drill.evidence]}
                className="cursor-help"
              >
                <Chip
                  tone={
                    drill.evidence === "strong"
                      ? "ok"
                      : drill.evidence === "traditional"
                        ? "warn"
                        : "neutral"
                  }
                >
                  {drill.evidence} evidence
                </Chip>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoModal({
  media,
  onClose,
}: {
  media: Media;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={media.title}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-card bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-rule px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{media.title}</p>
            <p className="truncate text-xs text-ink-3">{media.channel}</p>
          </div>
          <a
            href={youtubeWatchUrl(media.youtubeId, media.start)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-ink-3 underline underline-offset-2 hover:text-ink"
          >
            Open on YouTube
          </a>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="shrink-0 rounded-full p-1 text-ink-3 hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={youtubeEmbedUrl(media.youtubeId, media.start)}
            title={media.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
