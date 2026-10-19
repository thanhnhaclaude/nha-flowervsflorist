import { NextResponse, after } from "next/server";
import { randomBytes, randomInt } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { coupons, db, orderItems, orders } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import { findCoupon } from "@/lib/coupons";
import { earliestDate, isValidDeliveryDate } from "@/lib/delivery";
import { formatDate, img } from "@/lib/format";
import { sendOrderEmails } from "@/lib/mailer";
import { paymentsEnabled, stripe } from "@/lib/payments";
import { addOnOf, computeTotals, isSizeKey, sizeOf, unitPrice } from "@/lib/pricing";
import { getProductsByIds } from "@/lib/queries";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { checkoutSchema, fieldErrors } from "@/lib/schemas";
import { site } from "@/lib/site";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const orderCode = () => `FVF-${Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;

/** Absolute base URL for Stripe redirects: the configured site URL, or the local dev origin. */
function baseUrl(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && (origin === site.url || /^http:\/\/localhost:\d+$/.test(origin))) return origin;
  return site.url;
}

export async function POST(req: Request) {
  if (!rateLimit(`checkout:${clientIp(req)}`, 12, 10 * 60_000)) {
    return NextResponse.json({ message: "Too many attempts. Please wait a few minutes or call us to order." }, { status: 429 });
  }
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const input = parsed.data;
  if (input.website) return NextResponse.json({ message: "OK" }, { status: 200 });

  // Re-price everything on the server from the database.
  const found = await getProductsByIds([...new Set(input.items.map((i) => i.productId))]);
  const byId = new Map(found.map((p) => [p.id, p]));
  const lines = input.items.flatMap((i) => {
    const p = byId.get(i.productId);
    if (!p) return [];
    const size = p.hasSizes && isSizeKey(i.size) ? i.size : "standard";
    const unit = unitPrice(p, size, i.addOns);
    return [{ p, size, addOns: i.addOns, qty: i.qty, unit, lineTotal: unit * i.qty }];
  });
  if (lines.length !== input.items.length) {
    return NextResponse.json({ message: "Some items in your cart are no longer available. Please review your cart.", errors: { items: "unavailable" } }, { status: 409 });
  }

  const allNextDay = lines.every((l) => l.p.nextDay);
  if (!isValidDeliveryDate(input.deliveryDate, allNextDay)) {
    return NextResponse.json(
      { message: "Please choose another delivery date.", errors: { deliveryDate: `Choose a Tuesday–Saturday delivery date on or after ${formatDate(earliestDate(allNextDay), { weekday: "long", month: "long", day: "numeric" })}.` } },
      { status: 422 },
    );
  }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  let coupon = null;
  if (input.couponCode) {
    const res = await findCoupon(input.couponCode, subtotal);
    if (!res.ok) return NextResponse.json({ message: res.message, errors: { couponCode: res.message } }, { status: 422 });
    coupon = res.coupon;
  }
  const totals = computeTotals(subtotal, { coupon });
  const session = await getCustomerSession();
  const online = paymentsEnabled();

  const code = orderCode();
  const accessToken = randomBytes(18).toString("base64url");
  const [res] = await db.insert(orders).values({
    code,
    accessToken,
    customerId: session?.id ?? null,
    status: online ? "pending_payment" : "received",
    paymentStatus: "unpaid",
    senderName: input.senderName,
    senderEmail: input.senderEmail,
    senderPhone: input.senderPhone,
    recipientName: input.recipientName,
    recipientPhone: input.recipientPhone,
    company: input.company || null,
    addressType: input.addressType,
    street: input.street,
    apt: input.apt || null,
    city: input.city,
    state: input.state,
    zip: input.zip,
    deliveryDate: input.deliveryDate,
    deliveryWindow: input.deliveryWindow,
    cardMessage: input.cardMessage || null,
    cardSignature: input.cardSignature || null,
    instructions: input.instructions || null,
    ...totals,
    couponCode: coupon?.code ?? null,
  });
  const orderId = res.insertId;
  await db.insert(orderItems).values(
    lines.map((l) => ({
      orderId,
      productId: l.p.id,
      slug: l.p.slug,
      name: l.p.name,
      image: l.p.images[0] ?? null,
      size: l.size,
      sizeLabel: l.p.hasSizes ? sizeOf(l.size).label : "One size",
      addOns: l.addOns.map((k) => ({ key: k, label: addOnOf(k)!.label, price: addOnOf(k)!.price })),
      unitPrice: l.unit,
      quantity: l.qty,
      lineTotal: l.lineTotal,
    })),
  );

  if (!online) {
    if (coupon) await db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, coupon.id));
    after(() => sendOrderEmails(orderId));
    return NextResponse.json({ redirect: `/order/${code}?t=${accessToken}&new=1` }, { status: 201 });
  }

  const base = baseUrl(req);
  try {
    const s = stripe();
    const discounts = totals.discount > 0 ? [{ coupon: (await s.coupons.create({ amount_off: totals.discount, currency: "usd", duration: "once", name: coupon?.code ?? "Discount" })).id }] : undefined;
    const fee = (name: string, amount: number) => ({ quantity: 1, price_data: { currency: "usd", unit_amount: amount, product_data: { name } } });
    const checkout = await s.checkout.sessions.create({
      mode: "payment",
      client_reference_id: code,
      customer_email: input.senderEmail,
      metadata: { orderCode: code, deliveryDate: input.deliveryDate },
      payment_intent_data: { description: `${site.name} order ${code}`, metadata: { orderCode: code } },
      line_items: [
        ...lines.map((l) => ({
          quantity: l.qty,
          price_data: {
            currency: "usd",
            unit_amount: l.unit,
            product_data: {
              name: `${l.p.name}${l.p.hasSizes ? ` — ${sizeOf(l.size).label}` : ""}`,
              description: l.addOns.length ? `Includes: ${l.addOns.map((k) => addOnOf(k)!.label).join(", ")}` : l.p.short.slice(0, 200) || undefined,
              images: base.startsWith("https://") && l.p.images[0] ? [`${base}${img(l.p.images[0])}`] : undefined,
            },
          },
        })),
        ...(totals.deliveryFee ? [fee("Overnight shipping", totals.deliveryFee)] : []),
      ],
      discounts,
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === "true" },
      success_url: `${base}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout?canceled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });
    await db.update(orders).set({ stripeSessionId: checkout.id }).where(eq(orders.id, orderId));
    return NextResponse.json({ redirect: checkout.url }, { status: 201 });
  } catch (e) {
    console.error("[checkout] Stripe session failed:", (e as Error).message);
    await db.update(orders).set({ status: "cancelled", adminNote: "Stripe session could not be created" }).where(eq(orders.id, orderId));
    return NextResponse.json({ message: "Our payment page is temporarily unavailable. Please try again in a minute or call us to order." }, { status: 502 });
  }
}
