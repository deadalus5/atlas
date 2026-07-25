"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { MODALITY_COPY, type Drill } from "@/data";
import { useAtlas } from "@/store/atlas";
import { cn } from "@/lib/cn";

interface Phase {
  drill: Drill;
  side?: "left" | "right";
  seconds: number;
  label: string;
}

/** Splits a routine into timed phases, giving per-side drills two turns. */
export function toPhases(drills: Drill[]): Phase[] {
  const out: Phase[] = [];
  for (const d of drills) {
    const each = d.holdSeconds ?? Math.round(d.seconds / (d.perSide ? 2 : 1));
    if (d.perSide) {
      out.push({ drill: d, side: "left", seconds: each, label: d.name });
      out.push({ drill: d, side: "right", seconds: each, label: d.name });
    } else {
      out.push({ drill: d, seconds: each, label: d.name });
    }
  }
  return out;
}

export function RoutinePlayer({
  drills,
  onClose,
  onComplete,
}: {
  drills: Drill[];
  onClose: () => void;
  onComplete?: () => void;
}) {
  const phases = useMemo(() => toPhases(drills), [drills]);
  const voiceCues = useAtlas((s) => s.voiceCues);
  const setVoiceCues = useAtlas((s) => s.setVoiceCues);

  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(phases[0]?.seconds ?? 30);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const phase = phases[index];
  const next = phases[index + 1];

  const speak = useCallback(
    (text: string) => {
      if (!voiceCues || typeof window === "undefined") return;
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.02;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch {
        /* speech is a nicety; never let it break the timer */
      }
    },
    [voiceCues],
  );

  /* Keep the screen awake — a stretch timer that sleeps mid-hold is useless. */
  useEffect(() => {
    let cancelled = false;
    const request = async () => {
      try {
        const wl = await navigator.wakeLock?.request("screen");
        if (cancelled) void wl?.release();
        else wakeLock.current = wl ?? null;
      } catch {
        /* unsupported or denied — not worth surfacing */
      }
    };
    void request();
    return () => {
      cancelled = true;
      void wakeLock.current?.release();
      wakeLock.current = null;
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* nothing to cancel */
      }
    };
  }, []);

  /* Announce each new phase. */
  useEffect(() => {
    if (!phase || done) return;
    const side = phase.side ? `, ${phase.side} side` : "";
    speak(`${phase.label}${side}`);
  }, [index, done]); // eslint-disable-line react-hooks/exhaustive-deps

  /* The clock. */
  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setIndex((i) => {
            const n = i + 1;
            if (n >= phases.length) {
              setDone(true);
              setRunning(false);
              return i;
            }
            setRemaining(phases[n].seconds);
            return n;
          });
          return 0;
        }
        if (r <= 4) speak(String(r - 1));
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, done, phases, speak]);

  useEffect(() => {
    if (done) {
      speak("Session complete. Nicely done.");
      onComplete?.();
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (delta: number) => {
    const n = Math.min(phases.length - 1, Math.max(0, index + delta));
    setIndex(n);
    setRemaining(phases[n].seconds);
    setDone(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // re-bound each render so `go` closes over the current index

  const totalSeconds = phases.reduce((a, p) => a + p.seconds, 0);
  const elapsed =
    phases.slice(0, index).reduce((a, p) => a + p.seconds, 0) +
    ((phase?.seconds ?? 0) - remaining);
  const pct = totalSeconds ? Math.min(100, (elapsed / totalSeconds) * 100) : 0;

  if (!phase) return null;

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-bg p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-3">
          Session complete
        </p>
        <h2 className="max-w-md text-balance text-4xl font-semibold">
          That is the work done.
        </h2>
        <p className="max-w-sm text-pretty leading-relaxed text-ink-2">
          Consistency beats intensity here by a wide margin. Two short sessions
          most days will do more than one heroic one on a Sunday.
        </p>
        <button
          onClick={onClose}
          className="rounded-full bg-accent px-5 py-2 font-medium text-accent-ink"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      {/* progress */}
      <div className="h-1 w-full bg-bg-2">
        <div
          className="h-full bg-accent transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-3">
        <span className="font-mono text-xs text-ink-3">
          {index + 1} / {phases.length}
        </span>
        <span className="rounded-full border border-rule px-2 py-0.5 text-[11px] font-medium text-ink-2">
          {MODALITY_COPY[phase.drill.modality].label}
        </span>
        <button
          onClick={() => setVoiceCues(!voiceCues)}
          aria-label={voiceCues ? "Mute spoken cues" : "Unmute spoken cues"}
          className="ml-auto rounded-full border border-rule p-1.5 text-ink-2 hover:text-ink"
        >
          {voiceCues ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <button
          onClick={onClose}
          aria-label="End session"
          className="rounded-full border border-rule p-1.5 text-ink-2 hover:text-ink"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
          {phase.label}
        </h2>

        {phase.side && (
          <p
            className={cn(
              "mt-2 rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wider",
              phase.side === "left"
                ? "bg-accent/15 text-accent"
                : "bg-heat/15 text-heat",
            )}
          >
            {phase.side} side
          </p>
        )}

        <p
          className="mt-6 font-mono text-7xl font-semibold tabular-nums sm:text-8xl"
          aria-live="polite"
        >
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </p>

        <ol className="mt-6 max-w-lg space-y-1.5 text-left">
          {phase.drill.steps.slice(0, 4).map((s, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-0.5 font-mono text-[10px] text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-ink-2">{s}</span>
            </li>
          ))}
        </ol>

        {phase.drill.cues?.[0] && (
          <p className="mt-4 max-w-md text-pretty text-sm italic text-ink-3">
            {phase.drill.cues[0]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 px-4 pb-8 pt-4">
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="rounded-full border border-rule p-3 text-ink-2 hover:text-ink"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pause" : "Resume"}
          className="rounded-full bg-accent p-5 text-accent-ink"
        >
          {running ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="rounded-full border border-rule p-3 text-ink-2 hover:text-ink"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {next && (
        <p className="pb-5 text-center text-xs text-ink-3">
          Next: {next.label}
          {next.side ? ` · ${next.side}` : ""}
        </p>
      )}
    </div>
  );
}
