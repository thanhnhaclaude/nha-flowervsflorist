"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Heart, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "../cart/cart-context";
import { QtyStepper } from "../cart/cart-drawer";
import { useWishlist } from "../wishlist-context";
import { SIZES, unitPrice } from "@/lib/pricing";
import { addOns } from "@/lib/site";
import { usd } from "@/lib/format";

type P = { id: number; slug: string; name: string; price: number; images: string[]; hasSizes: boolean; nextDay: boolean };

export function PurchasePanel({ product }: { product: P }) {
  const router = useRouter();
  const { add, setDrawerOpen } = useCart();
  const wishlist = useWishlist();
  const [size, setSize] = useState("standard");
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const each = unitPrice(product, size, extras);
  const saved = wishlist.has(product.id);

  const line = () => ({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.price, hasSizes: product.hasSizes, nextDay: product.nextDay, size, addOns: extras });

  return (
    <div>
      {product.hasSizes && (
        <fieldset className="mt-6">
          <legend className="mb-3 text-sm font-extrabold uppercase tracking-wider text-plum-700">Choose a size</legend>
          <div className="grid grid-cols-3 gap-2.5">
            {SIZES.map((s) => {
              const on = size === s.key;
              return (
                <label key={s.key} className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-3 text-center transition-colors ${on ? "border-plum-600 bg-plum-50" : "border-line bg-white hover:border-plum-200"}`}>
                  <input type="radio" name="size" value={s.key} checked={on} onChange={() => setSize(s.key)} className="sr-only" />
                  {on && <Check className="absolute right-2 top-2 h-4 w-4 text-plum-600" aria-hidden="true" />}
                  <span className="font-extrabold">{s.label}</span>
                  <span className="mt-0.5 text-lg font-extrabold text-plum-700">{usd(product.price + s.extra)}</span>
                  <span className="mt-1 text-[0.72rem] leading-tight text-muted">{s.note}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-extrabold uppercase tracking-wider text-plum-700">Make it extra special</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {addOns.map((a) => {
            const on = extras.includes(a.key);
            return (
              <label key={a.key} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm transition-colors ${on ? "border-rose-500 bg-rose-50" : "border-line bg-white hover:border-plum-200"}`}>
                <input type="checkbox" checked={on} onChange={() => setExtras(on ? extras.filter((k) => k !== a.key) : [...extras, a.key])} className="h-5 w-5 accent-rose-600" />
                <span className="flex-1 font-semibold leading-tight">{a.label}</span>
                <span className="font-extrabold text-plum-700">+{usd(a.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-blush p-4">
        <span className="text-sm font-bold text-muted">Total</span>
        <span className="text-2xl font-extrabold text-plum-700" aria-live="polite">
          {usd(each * qty)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QtyStepper qty={qty} onChange={(n) => setQty(Math.max(1, Math.min(20, n)))} label={product.name} />
        <button
          className="btn btn-primary flex-1 text-lg"
          onClick={() => {
            add(line(), qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
        >
          {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
        <button
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-line text-plum-600 hover:border-plum-200 hover:bg-blush"
          onClick={() => wishlist.toggle(product.id)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        className="btn btn-plum mt-3 w-full"
        onClick={() => {
          add(line(), qty);
          setDrawerOpen(false);
          router.push("/checkout");
        }}
      >
        <Zap className="h-5 w-5" /> Buy Now
      </button>
    </div>
  );
}
