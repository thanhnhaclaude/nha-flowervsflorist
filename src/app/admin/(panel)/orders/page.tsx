import Link from "next/link";
import { and, desc, eq, like, or, type SQL } from "drizzle-orm";
import { db, orders, ORDER_STATUSES } from "@/lib/db";
import { todayET } from "@/lib/delivery";
import { formatDate, usd } from "@/lib/format";
import { STATUS_LABEL } from "@/components/order-view";
import { AdminHeader, Badge, Table } from "../ui";

export const metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; date?: string }> }) {
  const { status, q, date } = await searchParams;
  const where: SQL[] = [];
  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) where.push(eq(orders.status, status as (typeof ORDER_STATUSES)[number]));
  if (date === "today") where.push(eq(orders.deliveryDate, todayET()));
  if (q) {
    const term = `%${q.trim()}%`;
    where.push(or(like(orders.code, term), like(orders.senderName, term), like(orders.senderEmail, term), like(orders.recipientName, term), like(orders.zip, term))!);
  }
  const rows = await db
    .select()
    .from(orders)
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(200);

  const chip = (on: boolean) => `rounded-full px-3 py-1.5 text-sm font-bold ${on ? "bg-plum-600 text-white" : "bg-white text-ink hover:bg-petal"}`;

  return (
    <>
      <AdminHeader title="Orders">
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Code, name, email, ZIP…" className="field !min-h-10 !py-2" aria-label="Search orders" />
          <button className="btn btn-plum btn-sm">Search</button>
        </form>
      </AdminHeader>
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/orders" className={chip(!status && !date)}>All</Link>
        <Link href="/admin/orders?date=today" className={chip(date === "today")}>Delivering today</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={chip(status === s)}>
            {STATUS_LABEL[s]}
          </Link>
        ))}
      </div>
      <Table head={["Order", "Placed", "Customer", "Recipient", "Delivery", "Status", "Payment", "Total"]}>
        {rows.map((o) => (
          <tr key={o.id} className="hover:bg-blush/60">
            <td className="px-4 py-3">
              <Link href={`/admin/orders/${o.id}`} className="font-extrabold text-plum-700 hover:underline">
                {o.code}
              </Link>
            </td>
            <td className="px-4 py-3 text-muted">{formatDate(o.createdAt, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</td>
            <td className="px-4 py-3">{o.senderName}</td>
            <td className="px-4 py-3">
              {o.recipientName}
              <span className="block text-xs text-muted">
                {o.city}, {o.state} {o.zip}
              </span>
            </td>
            <td className="px-4 py-3 font-semibold">{formatDate(o.deliveryDate, { weekday: "short", month: "short", day: "numeric" })}</td>
            <td className="px-4 py-3"><Badge value={o.status} label={STATUS_LABEL[o.status]} /></td>
            <td className="px-4 py-3"><Badge value={o.paymentStatus} /></td>
            <td className="px-4 py-3 font-extrabold">{usd(o.total)}</td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-10 text-center text-muted">
              No orders found.
            </td>
          </tr>
        )}
      </Table>
    </>
  );
}
