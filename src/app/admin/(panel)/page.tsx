import Link from "next/link";
import { and, count, desc, eq, gte, sql, sum } from "drizzle-orm";
import { db, messages, orders, reviews, subscribers } from "@/lib/db";
import { todayET, addDays } from "@/lib/delivery";
import { formatDate, usd } from "@/lib/format";
import { paymentsEnabled } from "@/lib/payments";
import { smtpConfigured } from "@/lib/mailer";
import { AdminHeader, Badge, Panel } from "./ui";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const today = todayET();
  const [[rev], [todayCount], [pendingReviews], [newMsgs], [subs], upcoming, recent] = await Promise.all([
    db.select({ total: sum(orders.total), n: count() }).from(orders).where(and(eq(orders.paymentStatus, "paid"), gte(orders.createdAt, sql`NOW() - INTERVAL 30 DAY`))),
    db.select({ n: count() }).from(orders).where(and(eq(orders.deliveryDate, today), sql`${orders.status} NOT IN ('cancelled','refunded','pending_payment')`)),
    db.select({ n: count() }).from(reviews).where(eq(reviews.approved, false)),
    db.select({ n: count() }).from(messages).where(eq(messages.handled, false)),
    db.select({ n: count() }).from(subscribers).where(eq(subscribers.unsubscribed, false)),
    db
      .select()
      .from(orders)
      .where(and(gte(orders.deliveryDate, today), sql`${orders.deliveryDate} <= ${addDays(today, 2)}`, sql`${orders.status} IN ('received','processing','out_for_delivery')`))
      .orderBy(orders.deliveryDate)
      .limit(20),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
  ]);

  const stats = [
    { label: "Revenue (30 days, paid)", value: usd(Number(rev.total ?? 0)), sub: `${rev.n} paid orders` },
    { label: "Deliveries today", value: String(todayCount.n), href: "/admin/orders?date=today" },
    { label: "Reviews to approve", value: String(pendingReviews.n), href: "/admin/reviews" },
    { label: "New messages", value: String(newMsgs.n), href: "/admin/messages" },
    { label: "Subscribers", value: String(subs.n), href: "/admin/subscribers" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      {(!paymentsEnabled() || !smtpConfigured()) && (
        <Panel className="mb-6 border-l-4 border-gold p-4 text-sm">
          <strong>Setup:</strong> {!paymentsEnabled() && "Stripe is not configured — orders are taken as “pay later” requests. "}
          {!smtpConfigured() && "SMTP is not configured — emails are not being sent."} See the deployment guide.
        </Panel>
      )}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => {
          const body = (
            <Panel className="h-full p-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{s.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-plum-700">{s.value}</p>
              {s.sub && <p className="text-sm text-muted">{s.sub}</p>}
            </Panel>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block hover:opacity-90">
              {body}
            </Link>
          ) : (
            <div key={s.label}>{body}</div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="p-5">
          <h2 className="mb-3 font-display text-xl font-bold text-plum-700">Upcoming deliveries (next 3 days)</h2>
          {upcoming.length === 0 ? (
            <p className="text-muted">Nothing scheduled.</p>
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-rose-600">
                    <span>
                      <strong>{formatDate(o.deliveryDate, { weekday: "short", month: "short", day: "numeric" })}</strong> · {o.recipientName}, {o.city} {o.state}
                    </span>
                    <Badge value={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="p-5">
          <h2 className="mb-3 font-display text-xl font-bold text-plum-700">Latest orders</h2>
          {recent.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-rose-600">
                    <span>
                      <strong>{o.code}</strong> · {o.senderName}
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge value={o.paymentStatus} />
                      <strong>{usd(o.total)}</strong>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
