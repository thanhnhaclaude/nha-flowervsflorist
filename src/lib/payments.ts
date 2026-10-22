import "server-only";
import Stripe from "stripe";
import { and, eq, sql } from "drizzle-orm";
import { coupons, db, orders } from "./db";
import { sendOrderEmails } from "./mailer";
import { env } from "@/lib/env";

let client: Stripe | null = null;

export const paymentsEnabled = () => Boolean(env("STRIPE_SECRET_KEY"));

export function stripe() {
  if (!client) {
    const key = env("STRIPE_SECRET_KEY");
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key);
  }
  return client;
}

/**
 * Marks an order paid from a completed Checkout Session (webhook or success page, whichever runs first).
 * Idempotent: only the first call flips the status and sends the confirmation emails.
 */
export async function markPaidFromSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;
  const code = session.metadata?.orderCode || session.client_reference_id;
  if (!code) return null;
  const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  const [res] = await db
    .update(orders)
    .set({
      paymentStatus: "paid",
      status: "received",
      paidAt: new Date(),
      stripePaymentIntent: pi ?? null,
      tax: session.total_details?.amount_tax ?? 0,
      total: session.amount_total ?? sql`${orders.total}`,
    })
    .where(and(eq(orders.code, code), eq(orders.paymentStatus, "unpaid")));

  const [order] = await db.select().from(orders).where(eq(orders.code, code)).limit(1);
  if (order && res.affectedRows > 0) {
    if (order.couponCode) await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.code, order.couponCode));
    await sendOrderEmails(order.id);
  }
  return order ?? null;
}
