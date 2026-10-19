import "server-only";
import { eq } from "drizzle-orm";
import { coupons, db, type Coupon } from "./db";
import { usd } from "./format";

export async function findCoupon(rawCode: string, subtotal: number): Promise<{ ok: true; coupon: Coupon } | { ok: false; message: string }> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, message: "Enter a promo code." };
  const [c] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  const now = new Date();
  if (!c || !c.active) return { ok: false, message: "That promo code isn't valid." };
  if (c.startsAt && c.startsAt > now) return { ok: false, message: "That promo code isn't active yet." };
  if (c.endsAt && c.endsAt < now) return { ok: false, message: "That promo code has expired." };
  if (c.maxUses != null && c.usedCount >= c.maxUses) return { ok: false, message: "That promo code has reached its limit." };
  if (subtotal < c.minSubtotal) return { ok: false, message: `This code requires a subtotal of ${usd(c.minSubtotal)} or more.` };
  return { ok: true, coupon: c };
}
