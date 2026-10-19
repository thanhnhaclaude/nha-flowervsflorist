import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, posts } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { AdminHeader, Badge, Table } from "../ui";

export const metadata = { title: "Blog posts" };

export default async function PostsPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.publishedAt));
  return (
    <>
      <AdminHeader title="Blog posts" action={{ href: "/admin/posts/new", label: "+ New post" }} />
      <Table head={["Title", "Category", "Date", "Status"]}>
        {rows.map((p) => (
          <tr key={p.id} className="hover:bg-blush/60">
            <td className="px-4 py-3">
              <Link href={`/admin/posts/${p.id}`} className="font-extrabold text-plum-700 hover:underline">
                {p.title}
              </Link>
              <span className="block text-xs text-muted">/blog/{p.slug}</span>
            </td>
            <td className="px-4 py-3">{p.category}</td>
            <td className="px-4 py-3">{formatDate(p.publishedAt)}</td>
            <td className="px-4 py-3">{p.status === "published" ? <Badge value="paid" label="published" /> : <Badge value="unpaid" label="draft" />}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
