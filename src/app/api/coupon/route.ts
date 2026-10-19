import { NextResponse } from "next/server";
import { findCoupon } from "@/lib/coupons";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Checks a promo code against the current subtotal (cents). The server re-checks at checkout. */
export async function POST(req: Request) {
  if (!rateLimit(`coupon:${clientIp(req)}`, 20, 10 * 60_000)) return NextResponse.json({ message: "Too many attempts." }, { status: 429 });
  const { code, subtotal } = (await req.json().catch(() => ({}))) as { code?: string; subtotal?: number };
  const result = await findCoupon(String(code ?? ""), Number(subtotal) || 0);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: 422 });
  const c = result.coupon;
  return NextResponse.json({ code: c.code, type: c.type, value: c.value, minSubtotal: c.minSubtotal, description: c.description });
}
