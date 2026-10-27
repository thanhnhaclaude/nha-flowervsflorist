"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSignedIn } from "./use-signed-in";

/**
 * Wishlist of product ids. Guests keep it in localStorage; signed-in customers also sync it to their
 * account (local items are merged into the account on first load after sign-in).
 */
type WishlistContext = { ids: number[]; has: (id: number) => boolean; toggle: (id: number) => void };
const Ctx = createContext<WishlistContext | null>(null);
const KEY = "fvf_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const signedIn = useSignedIn();
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    let local: number[] = [];
    try {
      local = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage once on mount
    setIds(local);
    if (!signedIn) return;
    fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merge: local }) })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ids: number[] } | null) => d && setIds(d.ids))
      .catch(() => {});
  }, [signedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const toggle = useCallback(
    (id: number) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      if (signedIn) fetch("/api/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toggle: id }) }).catch(() => {});
    },
    [signedIn],
  );

  const value = useMemo(() => ({ ids, has: (id: number) => ids.includes(id), toggle }), [ids, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return c;
}
