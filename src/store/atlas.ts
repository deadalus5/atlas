"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Layer, View } from "@/anatomy/types";

export type Mode = "explore" | "referral";
export type Depth = "plain" | "clinical";

export interface SessionItem {
  structureId: string;
  side: "left" | "right" | "center";
  addedAt: number;
}

export interface JournalEntry {
  id: string;
  /** ISO date, day resolution. */
  date: string;
  structureId: string;
  intensity: number; // 0-10
  note?: string;
  tags?: string[];
  routineId?: string;
}

/** Declared context that gates which drills are safe to offer. */
export interface SafetyProfile {
  pregnant: boolean;
  osteoporosis: boolean;
  hypermobile: boolean;
  legSymptoms: boolean;
  recentSurgery: boolean;
}

export const EMPTY_SAFETY: SafetyProfile = {
  pregnant: false,
  osteoporosis: false,
  hypermobile: false,
  legSymptoms: false,
  recentSurgery: false,
};

interface AtlasState {
  view: View;
  layer: Layer;
  mode: Mode;
  depth: Depth;
  voiceCues: boolean;
  minutesBudget: number;
  safety: SafetyProfile;
  acknowledgedRedFlags: boolean;
  session: SessionItem[];
  journal: JournalEntry[];
  pinned: string[];

  setView: (v: View) => void;
  setLayer: (l: Layer) => void;
  setMode: (m: Mode) => void;
  setDepth: (d: Depth) => void;
  toggleDepth: () => void;
  setVoiceCues: (v: boolean) => void;
  setMinutes: (m: number) => void;
  setSafety: (p: Partial<SafetyProfile>) => void;
  acknowledgeRedFlags: () => void;

  addToSession: (structureId: string, side: SessionItem["side"]) => void;
  removeFromSession: (structureId: string) => void;
  clearSession: () => void;
  inSession: (structureId: string) => boolean;

  logPain: (e: Omit<JournalEntry, "id">) => void;
  removeJournal: (id: string) => void;
  clearJournal: () => void;

  togglePin: (id: string) => void;

  exportJSON: () => string;
  importJSON: (raw: string) => boolean;
}

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useAtlas = create<AtlasState>()(
  persist(
    (set, get) => ({
      view: "posterior",
      layer: 0,
      mode: "explore",
      depth: "plain",
      voiceCues: true,
      minutesBudget: 10,
      safety: EMPTY_SAFETY,
      acknowledgedRedFlags: false,
      session: [],
      journal: [],
      pinned: [],

      setView: (view) => set({ view }),
      setLayer: (layer) => set({ layer }),
      setMode: (mode) => set({ mode }),
      setDepth: (depth) => set({ depth }),
      toggleDepth: () =>
        set((s) => ({ depth: s.depth === "plain" ? "clinical" : "plain" })),
      setVoiceCues: (voiceCues) => set({ voiceCues }),
      setMinutes: (minutesBudget) => set({ minutesBudget }),
      setSafety: (p) => set((s) => ({ safety: { ...s.safety, ...p } })),
      acknowledgeRedFlags: () => set({ acknowledgedRedFlags: true }),

      addToSession: (structureId, side) =>
        set((s) =>
          s.session.some((i) => i.structureId === structureId)
            ? s
            : {
                session: [
                  ...s.session,
                  { structureId, side, addedAt: Date.now() },
                ],
              },
        ),
      removeFromSession: (structureId) =>
        set((s) => ({
          session: s.session.filter((i) => i.structureId !== structureId),
        })),
      clearSession: () => set({ session: [] }),
      inSession: (structureId) =>
        get().session.some((i) => i.structureId === structureId),

      logPain: (e) =>
        set((s) => ({ journal: [{ ...e, id: uid() }, ...s.journal] })),
      removeJournal: (id) =>
        set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),
      clearJournal: () => set({ journal: [] }),

      togglePin: (id) =>
        set((s) => ({
          pinned: s.pinned.includes(id)
            ? s.pinned.filter((p) => p !== id)
            : [...s.pinned, id],
        })),

      exportJSON: () => {
        const s = get();
        return JSON.stringify(
          {
            atlas: 1,
            exportedAt: new Date().toISOString(),
            journal: s.journal,
            pinned: s.pinned,
            session: s.session,
            safety: s.safety,
            prefs: {
              view: s.view,
              layer: s.layer,
              depth: s.depth,
              voiceCues: s.voiceCues,
              minutesBudget: s.minutesBudget,
            },
          },
          null,
          2,
        );
      },

      importJSON: (raw) => {
        try {
          const d = JSON.parse(raw);
          if (!d || typeof d !== "object") return false;
          set((s) => ({
            journal: Array.isArray(d.journal) ? d.journal : s.journal,
            pinned: Array.isArray(d.pinned) ? d.pinned : s.pinned,
            session: Array.isArray(d.session) ? d.session : s.session,
            safety: d.safety ? { ...EMPTY_SAFETY, ...d.safety } : s.safety,
          }));
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "atlas.state",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Static export prerenders on the server, where localStorage does not
      // exist; rehydrate explicitly on the client to avoid a markup mismatch.
      skipHydration: true,
    },
  ),
);
