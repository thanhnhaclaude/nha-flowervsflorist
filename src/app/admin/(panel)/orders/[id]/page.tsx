import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { eq } from "drizzle-orm";
import { ArrowLeft, Printer } from "lucide-react";
import { db, orderItems, orders, ORDER_STATUSES, type OrderStatus } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate, img, usd } from "@/lib/format";
import { orderLink, sendStatusEmail } from "@/lib/mailer";
import { deliveryWindows } from "@/lib/site";
import { STATUS_LABEL } from "@/components/order-view";
import { AdminHeader, Badge, Panel } from "../../ui";

export const metadata = { title: "Order" };

async function updateOrder(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  const adminNote = String(formData.get("adminNote") ?? "").slice(0, 4000);
  const markPaid = formData.get("markPaid") === "on";
  const notify = formData.get("notify") === "on";
  if (!ORDER_STATUSES.includes(status)) return;
  const [before] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!before) return;
  await db
    .update(orders)
    .set({ status, adminNote: adminNote || null, ...(markPaid && before.paymentStatus !== "paid" ? { paymentStatus: "paid", paidAt: new Date() } : {}) })
    .where(eq(orders.id, id));
  if (notify && status !== before.status) after(() => sendStatusEmail(id));
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}?saved=1`);
}

export default async function AdminOrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const id = Number((await params).id);
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const { saved } = await searchParams;
  const window = deliveryWindows.find((w) => w.value === order.deliveryWindow)?.label;

  return (
    <>
      <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-plum-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>
      <AdminHeader title={`Order ${order.code}`}>
        <Badge value={order.status} label={STATUS_LABEL[order.status]} />
        <Badge value={order.paymentStatus} />
        <a href={orderLink(order)} target="_blank" className="btn btn-sm border-2 border-line bg-white">
          Customer view
        </a>
        <span className="hidden items-center gap-1 text-sm text-muted md:inline-flex">
          <Printer className="h-4 w-4" /> Ctrl+P to print a work ticket
        </span>
      </AdminHeader>
      {saved && <p className="mb-4 rounded-xl bg-leaf-soft p-3 text-sm font-bold text-leaf">Saved.</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel className="p-5">
            <h2 className="mb-3 font-display text-xl font-bold text-plum-700">Items</h2>
            <ul className="divide-y divide-line">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4 py-3">
                  {it.image && <Image src={img(it.image)} alt="" width={64} height={80} className="h-20 w-16 rounded-lg object-cover" />}
                  <div className="flex-1">
                    <p className="font-extrabold">{it.name}</p>
                    <p className="text-sm">
                      Size: <strong>{it.sizeLabel}</strong> · Qty: <strong>{it.quantity}</strong> · {usd(it.unitPrice)} each
                    </p>
                    {it.addOns.length > 0 && <p className="text-sm">Add-ons: {it.addOns.map((a) => a.label).join(", ")}</p>}
                  </div>
                  <p className="font-extrabold">{usd(it.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{usd(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Delivery</dt><dd>{usd(order.deliveryFee)}</dd></div>
              <div className="flex justify-between"><dt>Same-day</dt><dd>{usd(order.sameDayFee)}</dd></div>
              <div className="flex justify-between"><dt>Discount {order.couponCode && `(${order.couponCode})`}</dt><dd>−{usd(order.discount)}</dd></div>
              <div className="flex justify-between"><dt>Tax</dt><dd>{usd(order.tax)}</dd></div>
              <div className="flex justify-between text-base font-extrabold"><dt>Total</dt><dd>{usd(order.total)}</dd></div>
            </dl>
          </Panel>

          <div className="grid gap-6 md:grid-cols-2">
            <Panel className="p-5">
              <h2 className="mb-2 font-display text-xl font-bold text-plum-700">Deliver to</h2>
              <p className="text-lg font-extrabold">{formatDate(order.deliveryDate, { weekday: "long", month: "long", day: "numeric" })}</p>
              <p className="mb-3 text-sm text-muted">{window}</p>
              <address className="not-italic leading-relaxed">
                <strong>{order.recipientName}</strong> · <a href={`tel:${order.recipientPhone}`} className="text-plum-700 underline">{order.recipientPhone}</a>
                <br />
                {order.company && (<>{order.company}<br /></>)}
                {order.street}{order.apt ? `, ${order.apt}` : ""}
                <br />
                {order.city}, {order.state} {order.zip}
                <br />
                <span className="text-sm text-muted">Type: {order.addressType.replace("_", " ")}</span>
              </address>
              {order.instructions && <p className="mt-3 rounded-xl bg-gold-soft p-3 text-sm"><strong>Instructions:</strong> {order.instructions}</p>}
            </Panel>
            <Panel className="p-5">
              <h2 className="mb-2 font-display text-xl font-bold text-plum-700">Sender</h2>
              <p>
                <strong>{order.senderName}</strong>
                <br />
                <a href={`mailto:${order.senderEmail}`} className="text-plum-700 underline">{order.senderEmail}</a>
                <br />
                <a href={`tel:${order.senderPhone}`} className="text-plum-700 underline">{order.senderPhone}</a>
              </p>
              <p className="mt-2 text-sm text-muted">Placed {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
              {order.stripePaymentIntent && <p className="mt-1 break-all text-xs text-muted">Stripe: {order.stripePaymentIntent}</p>}
              <h3 className="mt-4 font-sans text-sm font-extrabold uppercase tracking-wider text-plum-700">Card message</h3>
              <p className="whitespace-pre-line rounded-xl bg-blush p-3">{order.cardMessage || "—"}{order.cardSignature && `\n— ${order.cardSignature}`}</p>
            </Panel>
          </div>
        </div>

        <Panel className="h-fit p-5">
          <h2 className="mb-4 font-display text-xl font-bold text-plum-700">Update order</h2>
          <form action={updateOrder} className="space-y-4">
            <input type="hidden" name="id" value={order.id} />
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={order.status} className="field">
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="notify" defaultChecked className="h-5 w-5 accent-rose-600" /> Email the customer about the new status
            </label>
            {order.paymentStatus !== "paid" && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="markPaid" className="h-5 w-5 accent-rose-600" /> Mark as paid (phone / offline payment)
              </label>
            )}
            <div>
              <label className="label" htmlFor="adminNote">Internal note</label>
              <textarea id="adminNote" name="adminNote" rows={4} defaultValue={order.adminNote ?? ""} className="field" />
            </div>
            <button className="btn btn-primary w-full">Save changes</button>
            <p className="text-xs text-muted">Refunds are issued from the Stripe Dashboard; the order switches to “Refunded” automatically.</p>
          </form>
        </Panel>
      </div>
    </>
  );
}
