"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { computeTotals, unitPrice } from "@/lib/pricing";
import { commerce } from "@/lib/site";

export type CartLine = {
  id: string; // productId + size + add-ons
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number; // base price (Standard)
  hasSizes: boolean;
  nextDay: boolean;
  size: string;
  addOns: string[];
  qty: number;
};

type CartContext = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  allNextDay: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "id" | "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  lineTotal: (l: CartLine) => number;
  estimate: { deliveryFee: number; toFreeDelivery: number };
};

const Ctx = createContext<CartContext | null>(null);
const KEY = "fvf_cart_v2";

const lineId = (l: Pick<CartLine, "productId" | "size" | "addOns">) => `${l.productId}:${l.size}:${[...l.addOns].sort().join(",")}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage once on mount
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback<CartContext["add"]>((line, qty = 1) => {
    const id = lineId(line);
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(20, l.qty + qty) } : l));
      return [...prev, { ...line, id, qty }];
    });
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(20, qty) } : l))));
  }, []);
  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContext>(() => {
    const lineTotal = (l: CartLine) => unitPrice(l, l.size, l.addOns) * l.qty;
    const subtotal = lines.reduce((s, l) => s + lineTotal(l), 0);
    const { deliveryFee } = computeTotals(subtotal);
    return {
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      allNextDay: lines.length > 0 && lines.every((l) => l.nextDay),
      drawerOpen,
      setDrawerOpen,
      add,
      setQty,
      remove,
      clear,
      lineTotal,
      estimate: { deliveryFee, toFreeDelivery: Math.max(0, commerce.freeDeliveryThreshold - subtotal) },
    };
  }, [lines, ready, drawerOpen, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
