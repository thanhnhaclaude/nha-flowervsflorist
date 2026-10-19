import Image from "next/image";
import { Check, CircleCheck, Clock, Package, Truck } from "lucide-react";
import type { Order, OrderItem } from "@/lib/db";
import { formatDate, img, usd } from "@/lib/format";
import { deliveryWindows, site } from "@/lib/site";

const STEPS = [
  { key: "received", label: "Order received", icon: Check },
  { key: "processing", label: "Being arranged", icon: Package },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CircleCheck },
];

export const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  received: "Order received",
  processing: "Being arranged",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderView({ order, items }: { order: Order; items: OrderItem[] }) {
  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const window = deliveryWindows.find((w) => w.value === order.deliveryWindow)?.label;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <section className="card p-5 md:p-7" aria-label="Order progress">
          {order.status === "cancelled" || order.status === "refunded" || order.status === "pending_payment" ? (
            <p className="flex items-center gap-2 font-bold text-plum-700">
              <Clock className="h-5 w-5" /> {STATUS_LABEL[order.status]}
              {order.status === "pending_payment" && <span className="font-normal text-muted">— if you completed payment, this updates within a minute.</span>}
            </p>
          ) : (
            <ol className="grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => {
                const done = i <= stepIndex;
                return (
                  <li key={s.key} className="flex flex-col items-center text-center">
                    <span className={`grid h-12 w-12 place-items-center rounded-full ${done ? "bg-leaf text-white" : "bg-blush text-muted"}`}>
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className={`mt-2 text-xs font-bold md:text-sm ${done ? "text-ink" : "text-muted"}`}>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="card p-5 md:p-7">
          <h2 className="font-display text-2xl font-bold text-plum-700">Items</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map((it) => (
              <li key={it.id} className="flex gap-4 py-4">
                {it.image && <Image src={img(it.image)} alt="" width={72} height={90} className="h-[90px] w-[72px] rounded-xl object-cover" />}
                <div className="flex-1">
                  <p className="font-bold">{it.name}</p>
                  <p className="text-sm text-muted">
                    {it.sizeLabel} · Qty {it.quantity}
                  </p>
                  {it.addOns.length > 0 && <p className="text-xs text-muted">+ {it.addOns.map((a) => a.label).join(", ")}</p>}
                </div>
                <p className="font-extrabold">{usd(it.lineTotal)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="card p-5 md:p-6">
          <h2 className="font-display text-xl font-bold text-plum-700">Delivery</h2>
          <p className="mt-2 font-bold">{formatDate(order.deliveryDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
          <p className="text-sm text-muted">{window}</p>
          <address className="mt-3 not-italic leading-relaxed">
            {order.recipientName}
            {order.company && (
              <>
                <br />
                {order.company}
              </>
            )}
            <br />
            {order.street}
            {order.apt ? `, ${order.apt}` : ""}
            <br />
            {order.city}, {order.state} {order.zip}
          </address>
          {order.cardMessage && (
            <div className="mt-4 rounded-xl bg-blush p-3 text-sm">
              <p className="font-bold text-plum-700">Card message</p>
              <p className="whitespace-pre-line">{order.cardMessage}</p>
              {order.cardSignature && <p className="mt-1">— {order.cardSignature}</p>}
            </div>
          )}
        </section>
        <section className="card p-5 md:p-6">
          <dl className="space-y-2 text-[0.95rem]">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{usd(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{order.deliveryFee ? usd(order.deliveryFee) : "FREE"}</dd></div>
            {order.sameDayFee > 0 && <div className="flex justify-between"><dt className="text-muted">Same-day priority</dt><dd>{usd(order.sameDayFee)}</dd></div>}
            {order.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount {order.couponCode && `(${order.couponCode})`}</dt><dd>−{usd(order.discount)}</dd></div>}
            {order.tax > 0 && <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>{usd(order.tax)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{usd(order.total)}</dd></div>
            <p className="pt-1 text-sm">
              Payment: <strong className={order.paymentStatus === "paid" ? "text-leaf" : "text-plum-700"}>{order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Not yet paid"}</strong>
            </p>
          </dl>
        </section>
        <p className="text-sm text-muted">
          Questions about this order? Call <a href={`tel:${site.phone}`} className="font-bold text-plum-700">{site.phoneDisplay}</a> or email{" "}
          <a href={`mailto:${site.email}`} className="font-bold text-plum-700">{site.email}</a> with your order number.
        </p>
      </aside>
    </div>
  );
}
