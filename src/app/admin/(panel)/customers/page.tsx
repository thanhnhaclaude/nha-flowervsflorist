import { count, desc, eq } from "drizzle-orm";
import { customers, db, orders } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHeader, Table } from "../ui";

export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  const rows = await db
    .select({ c: customers, orderCount: count(orders.id) })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy(desc(customers.createdAt))
    .limit(500);
  return (
    <>
      <AdminHeader title={`Customers (${rows.length})`} />
      <p className="mb-4 text-sm text-muted">Registered accounts only — guest checkouts appear under Orders.</p>
      <Table head={["Name", "Email", "Phone", "Orders", "Marketing", "Joined"]}>
        {rows.map(({ c, orderCount }) => (
          <tr key={c.id}>
            <td className="px-4 py-3 font-semibold">{c.name}</td>
            <td className="px-4 py-3">
              <a href={`mailto:${c.email}`} className="text-plum-700 underline">
                {c.email}
              </a>
            </td>
            <td className="px-4 py-3">{c.phone ?? "—"}</td>
            <td className="px-4 py-3">{orderCount}</td>
            <td className="px-4 py-3">{c.marketingOptIn ? "Yes" : "No"}</td>
            <td className="px-4 py-3">{formatDate(c.createdAt)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
