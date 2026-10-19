/**
 * Pricing rules shared by the browser (cart preview) and the server (authoritative totals at checkout).
 * All amounts in cents.
 */
import { addOns, commerce, type AddOnKey } from "./site";

export const SIZES = [
  { key: "standard", label: "Standard", extra: 0, note: "As shown" },
  { key: "deluxe", label: "Deluxe", extra: 1500, note: "More stems, fuller look" },
  { key: "premium", label: "Premium", extra: 3000, note: "Our most lavish design + upgraded vase" },
] as const;
export type SizeKey = (typeof SIZES)[number]["key"];

export const isSizeKey = (s: string): s is SizeKey => SIZES.some((x) => x.key === s);
export const sizeOf = (key: string) => SIZES.find((s) => s.key === key) ?? SIZES[0];
export const addOnOf = (key: string) => addOns.find((a) => a.key === key);

export type PriceableProduct = { price: number; hasSizes: boolean };

export function unitPrice(product: PriceableProduct, size: string, extras: readonly string[]) {
  const sizeExtra = product.hasSizes ? sizeOf(size).extra : 0;
  const addOnTotal = extras.reduce((sum, k) => sum + (addOnOf(k)?.price ?? 0), 0);
  return product.price + sizeExtra + addOnTotal;
}

export type CouponLike = { type: "percent" | "fixed" | "free_delivery"; value: number; minSubtotal: number };

export function computeTotals(subtotal: number, opts: { sameDay: boolean; coupon?: CouponLike | null }) {
  let deliveryFee = subtotal >= commerce.freeDeliveryThreshold ? 0 : commerce.deliveryFee;
  const sameDayFee = opts.sameDay ? commerce.sameDayFee : 0;
  let discount = 0;
  const c = opts.coupon;
  if (c && subtotal >= c.minSubtotal) {
    if (c.type === "percent") discount = Math.round((subtotal * Math.min(c.value, 100)) / 100);
    else if (c.type === "fixed") discount = Math.min(c.value, subtotal);
    else if (c.type === "free_delivery") deliveryFee = 0;
  }
  const total = Math.max(0, subtotal - discount + deliveryFee + sameDayFee);
  return { subtotal, deliveryFee, sameDayFee, discount, total };
}

export type { AddOnKey };
