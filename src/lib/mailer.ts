import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { eq } from "drizzle-orm";
import { db, orderItems, orders, type Order, type OrderItem } from "./db";
import { formatDate, usd } from "./format";
import { addressLine, site } from "./site";
import { carrierLabel, trackingUrl } from "./tracking";
import { env } from "@/lib/env";

/**
 * Email over SMTP (Hostinger: smtp.hostinger.com, port 465). If SMTP_HOST/SMTP_USER/SMTP_PASS are
 * missing, emails are skipped (logged) so ordering never breaks.
 */
let transporter: Transporter | null | undefined;

function getTransporter() {
  if (transporter !== undefined) return transporter;
  const [SMTP_HOST, SMTP_USER, SMTP_PASS] = [env("SMTP_HOST"), env("SMTP_USER"), env("SMTP_PASS")];
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    transporter = null;
    return null;
  }
  const port = Number(env("SMTP_PORT") ?? 465);
  transporter = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  return transporter;
}

export const smtpConfigured = () => Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
const shopEmail = () => env("SHOP_EMAIL") || site.email;
const fromAddress = () => env("MAIL_FROM") || `"${site.name}" <${env("SMTP_USER") || site.email}>`;

export async function sendMail(to: string | null | undefined, subject: string, html: string, replyTo?: string) {
  const t = getTransporter();
  if (!to) return;
  if (!t) {
    console.info(`[mail skipped: SMTP not configured] to=${to} subject="${subject}"`);
    return;
  }
  try {
    await t.sendMail({ from: fromAddress(), to, subject, html, replyTo });
  } catch (e) {
    console.error("[mail] send failed:", subject, (e as Error).message);
  }
}

export const esc = (s: string | null | undefined) =>
  (s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Branded email shell (table layout + inline styles for email clients). */
export function layout(title: string, inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#fdf2f6;font-family:Arial,Helvetica,sans-serif;color:#2a1520">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#7a1f5c;padding:20px 28px;color:#fff;font-size:22px;font-weight:bold;font-family:Georgia,serif">${site.name}</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:22px;color:#7a1f5c;font-family:Georgia,serif">${title}</h1>
${inner}
</td></tr>
<tr><td style="padding:18px 28px;background:#faf5f7;font-size:12px;color:#6b5560;line-height:1.6">
${site.name} · ${site.phoneDisplay} · <a href="mailto:${site.email}" style="color:#7a1f5c">${site.email}</a><br>
Operated by ${site.company.displayName} · ${addressLine}
</td></tr></table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="background:#d0103d;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">${label}</a></p>`;

export const orderLink = (o: Pick<Order, "code" | "accessToken">) => `${site.url}/order/${o.code}?t=${o.accessToken}`;

function orderSummary(order: Order, items: OrderItem[]) {
  const rows = items
    .map(
      (it) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f1e6eb">${esc(it.name)} <span style="color:#6b5560">(${esc(it.sizeLabel)})</span> × ${it.quantity}${
        it.addOns.length ? `<br><span style="font-size:12px;color:#6b5560">+ ${it.addOns.map((a) => esc(a.label)).join(", ")}</span>` : ""
      }</td><td style="padding:8px 0;border-bottom:1px solid #f1e6eb;text-align:right">${usd(it.lineTotal)}</td></tr>`,
    )
    .join("");
  const money: [string, number][] = [
    ["Subtotal", order.subtotal],
    ["Shipping", order.deliveryFee],
    ...(order.sameDayFee ? ([["Same-day priority", order.sameDayFee]] as [string, number][]) : []),
    ...(order.discount ? ([[`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`, -order.discount]] as [string, number][]) : []),
    ...(order.tax ? ([["Tax", order.tax]] as [string, number][]) : []),
  ];
  return `<table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px">${rows}
${money.map(([k, v]) => `<tr><td style="padding:4px 0;color:#6b5560">${k}</td><td style="text-align:right">${v < 0 ? "−" + usd(-v) : v === 0 && k === "Shipping" ? "FREE" : usd(v)}</td></tr>`).join("")}
<tr><td style="padding:8px 0;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold">${usd(order.total)}</td></tr></table>
<table role="presentation" width="100%" style="margin-top:18px;font-size:14px;line-height:1.5">
<tr><td style="color:#6b5560;width:120px;vertical-align:top">Deliver to</td><td>${esc(order.recipientName)}${order.company ? `, ${esc(order.company)}` : ""}<br>${esc(order.street)}${order.apt ? `, ${esc(order.apt)}` : ""}<br>${esc(order.city)}, ${esc(order.state)} ${esc(order.zip)}</td></tr>
<tr><td style="color:#6b5560;vertical-align:top">Delivery date</td><td>${formatDate(order.deliveryDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · by end of day (overnight shipping)</td></tr>
${order.cardMessage ? `<tr><td style="color:#6b5560;vertical-align:top">Card message</td><td style="white-space:pre-line">${esc(order.cardMessage)}${order.cardSignature ? `<br>— ${esc(order.cardSignature)}` : ""}</td></tr>` : ""}
</table>`;
}

async function loadOrder(orderId: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

/** Confirmation to the customer + new-order alert to the shop. */
export async function sendOrderEmails(orderId: number) {
  const data = await loadOrder(orderId);
  if (!data) return;
  const { order, items } = data;
  const paid = order.paymentStatus === "paid";
  await Promise.all([
    sendMail(
      order.senderEmail,
      `Order confirmed: ${order.code} — ${site.name}`,
      layout(
        `Thank you, ${esc(order.senderName.split(" ")[0])}!`,
        `<p style="line-height:1.6">We've received your order <b>${order.code}</b>${paid ? " and your payment" : ""}. We'll carefully pack it and ship it overnight to arrive on the date below. You'll get another email with tracking as soon as it ships.</p>
${orderSummary(order, items)}${button(orderLink(order), "Track your order")}
<p style="font-size:13px;color:#6b5560">Questions? Reply to this email or call ${site.phoneDisplay}.</p>`,
      ),
      shopEmail(),
    ),
    sendMail(
      shopEmail(),
      `[New order${paid ? " · PAID" : " · UNPAID"}] ${order.code} — ${usd(order.total)} — deliver ${order.deliveryDate}`,
      layout(
        `New order ${order.code}`,
        `<p>From <b>${esc(order.senderName)}</b> · ${esc(order.senderEmail)} · ${esc(order.senderPhone)}<br>Recipient phone: ${esc(order.recipientPhone)} · Address type: ${esc(order.addressType)}</p>
${order.instructions ? `<p><b>Instructions:</b> ${esc(order.instructions)}</p>` : ""}
${orderSummary(order, items)}${button(`${site.url}/admin/orders/${order.id}`, "Open in admin")}`,
      ),
      order.senderEmail,
    ),
  ]);
}

const statusCopy: Record<string, [string, string]> = {
  processing: ["Your flowers are being prepared", "Your bouquet is being prepared and packed for overnight shipping."],
  out_for_delivery: ["Your flowers have shipped!", "Your order is on its way by overnight shipping and will arrive on the scheduled delivery date."],
  delivered: ["Your flowers were delivered", "Your order has been delivered. Thank you for choosing us—we'd love to hear what you think!"],
  cancelled: ["Your order was cancelled", "Your order has been cancelled. If you were charged, a refund has been issued to your original payment method."],
  refunded: ["Your refund has been issued", "A refund has been issued to your original payment method. It may take 5–10 business days to appear."],
};

export async function sendStatusEmail(orderId: number) {
  const data = await loadOrder(orderId);
  if (!data) return;
  const copy = statusCopy[data.order.status];
  if (!copy) return;
  const { order } = data;
  const track = order.status === "out_for_delivery" ? trackingUrl(order.trackingCarrier, order.trackingNumber) : null;
  await sendMail(
    order.senderEmail,
    `${copy[0]} — order ${order.code}`,
    layout(copy[0], `<p style="line-height:1.6">${copy[1]}</p><p>Order <b>${order.code}</b> for ${esc(order.recipientName)}, ${esc(order.city)}, ${esc(order.state)}.</p>${
      track ? button(track, `Track with ${carrierLabel(order.trackingCarrier)}`) : ""
    }${button(orderLink(order), "View order")}`),
  );
}

export async function sendWelcomeEmail(email: string) {
  await sendMail(
    email,
    `Welcome to ${site.name} — here's 10% off`,
    layout(
      "Welcome to the bloom club!",
      `<p style="line-height:1.6">Thanks for subscribing. Enjoy <b>10% off</b> your first order with code:</p>
<p style="font-size:26px;font-weight:bold;letter-spacing:3px;color:#d0103d;margin:8px 0 0">WELCOME10</p>
${button(`${site.url}/best-sellers`, "Shop best sellers")}
<p style="font-size:12px;color:#6b5560">You can unsubscribe anytime by replying "unsubscribe".</p>`,
    ),
  );
}

export async function sendContactEmail(m: { name: string; email: string; phone?: string | null; topic: string; orderCode?: string | null; body: string }) {
  await sendMail(
    shopEmail(),
    `[Contact] ${m.topic} — ${m.name}`,
    layout(`New message: ${esc(m.topic)}`, `<p><b>${esc(m.name)}</b> · ${esc(m.email)}${m.phone ? ` · ${esc(m.phone)}` : ""}${m.orderCode ? `<br>Order: ${esc(m.orderCode)}` : ""}</p><p style="white-space:pre-line;line-height:1.6">${esc(m.body)}</p>`),
    m.email,
  );
}
