"use client";

import { useEffect } from "react";
import { useAtlas } from "@/store/atlas";

/**
 * The store persists to localStorage with skipHydration, because these pages are
 * prerendered at build time where localStorage does not exist. This rehydrates
 * it once on the client. It lives in the root layout so that every route — not
 * just the map shell — sees the user's saved session and journal.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useAtlas.persist.rehydrate();
  }, []);
  return null;
}
