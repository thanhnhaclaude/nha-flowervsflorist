"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCart } from "./cart-context";
import { addOnOf, sizeOf } from "@/lib/pricing";
import { img, usd } from "@/lib/format";
import { commerce } from "@/lib/site";

export function QtyStepper({ qty, onChange, label }: { qty: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-blush" onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-7 text-center font-bold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-blush" onClick={() => onChange(qty + 1)} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function FreeDeliveryMeter({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, commerce.freeDeliveryThreshold - subtotal);
  const pct = Math.min(100, (subtotal / commerce.freeDeliveryThreshold) * 100);
  return (
    <div className="rounded-2xl bg-leaf-soft p-3.5">
      <p className="flex items-center gap-2 text-sm font-bold text-leaf">
        <Truck className="h-4 w-4" />
        {left > 0 ? <>You&apos;re {usd(left)} away from FREE delivery</> : <>You&apos;ve unlocked FREE delivery!</>}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free delivery">
        <div className="h-full rounded-full bg-leaf transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { lines, drawerOpen, setDrawerOpen, setQty, remove, subtotal, lineTotal, count } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <button className="absolute inset-0 bg-plum-900/50" onClick={() => setDrawerOpen(false)} aria-label="Close cart" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-lift animate-slide-in">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="cart-title" className="font-display text-2xl font-bold text-plum-700">
            Your Cart <span className="text-base font-sans font-semibold text-muted">({count})</span>
          </h2>
          <button className="grid h-11 w-11 place-items-center rounded-full hover:bg-blush" onClick={() => setDrawerOpen(false)} aria-label="Close cart" autoFocus>
            <X className="h-6 w-6" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-petal text-plum-600">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <p className="font-display text-xl font-bold">Your cart is empty</p>
            <p className="text-muted">Fresh flowers are just a click away.</p>
            <Link href="/best-sellers" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>
              Shop Best Sellers
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <FreeDeliveryMeter subtotal={subtotal} />
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3 border-b border-line pb-4">
                  <Link href={`/product/${l.slug}`} onClick={() => setDrawerOpen(false)} className="shrink-0">
                    <Image src={img(l.image)} alt={l.name} width={88} height={110} className="h-[110px] w-[88px] rounded-xl object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <Link href={`/product/${l.slug}`} onClick={() => setDrawerOpen(false)} className="font-bold leading-snug hover:text-rose-600">
                        {l.name}
                      </Link>
                      <button onClick={() => remove(l.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-blush hover:text-danger" aria-label={`Remove ${l.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {l.hasSizes && <p className="text-sm text-muted">{sizeOf(l.size).label}</p>}
                    {l.addOns.length > 0 && <p className="text-xs text-muted">+ {l.addOns.map((k) => addOnOf(k)?.label).join(", ")}</p>}
                    <div className="mt-2 flex items-center justify-between">
                      <QtyStepper qty={l.qty} onChange={(n) => setQty(l.id, n)} label={l.name} />
                      <span className="font-extrabold">{usd(lineTotal(l))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line bg-blush px-5 py-4">
              <div className="flex justify-between text-lg font-extrabold">
                <span>Subtotal</span>
                <span>{usd(subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-muted">Delivery date, fees & promo codes at checkout.</p>
              <Link href="/checkout" className="btn btn-primary mt-4 w-full" onClick={() => setDrawerOpen(false)}>
                Secure Checkout
              </Link>
              <button className="mt-2 w-full py-2 text-sm font-bold text-plum-600 hover:underline" onClick={() => setDrawerOpen(false)}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
