import { desc } from "drizzle-orm";
import { db, subscribers } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHeader, Badge, Table } from "../ui";

export const metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  const rows = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt)).limit(1000);
  return (
    <>
      <AdminHeader title={`Subscribers (${rows.length})`}>
        <a href="/api/admin/subscribers" className="btn btn-primary btn-sm">
          Export CSV
        </a>
      </AdminHeader>
      <Table head={["Email", "Source", "Joined", "Status"]}>
        {rows.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-3 font-semibold">{s.email}</td>
            <td className="px-4 py-3">{s.source}</td>
            <td className="px-4 py-3">{formatDate(s.createdAt)}</td>
            <td className="px-4 py-3">{s.unsubscribed ? <Badge value="cancelled" label="unsubscribed" /> : <Badge value="paid" label="subscribed" />}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
