import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { db, orders } from "@/lib/db";
import { markPaidFromSession, stripe } from "@/lib/payments";
import { env } from "@/lib/env";

/**
 * Stripe webhook: https://flowervsflorist.com/api/stripe/webhook
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired, charge.refunded
 */
export async function POST(req: Request) {
  const secret = env("STRIPE_WEBHOOK_SECRET");
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature || !env("STRIPE_SECRET_KEY")) return NextResponse.json({ message: "Webhook not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch (e) {
    console.error("[stripe] invalid webhook signature:", (e as Error).message);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markPaidFromSession(event.data.object);
      break;
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const code = event.data.object.metadata?.orderCode || event.data.object.client_reference_id;
      if (code)
        await db
          .update(orders)
          .set({ status: "cancelled", paymentStatus: event.type === "checkout.session.expired" ? "unpaid" : "failed", adminNote: "Checkout not completed" })
          .where(and(eq(orders.code, code), eq(orders.paymentStatus, "unpaid")));
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (pi && charge.refunded) await db.update(orders).set({ status: "refunded", paymentStatus: "refunded" }).where(eq(orders.stripePaymentIntent, pi));
      break;
    }
  }
  return NextResponse.json({ received: true });
}
