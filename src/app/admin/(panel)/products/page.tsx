import Image from "next/image";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, products } from "@/lib/db";
import { img, usd } from "@/lib/format";
import { AdminHeader, Badge, Table } from "../ui";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
  return (
    <>
      <AdminHeader title={`Products (${rows.length})`} action={{ href: "/admin/products/new", label: "+ New product" }} />
      <Table head={["", "Name", "Price", "Categories", "Flags", "Status"]}>
        {rows.map((p) => (
          <tr key={p.id} className="hover:bg-blush/60">
            <td className="w-16 px-4 py-2">
              {p.images[0] && <Image src={img(p.images[0])} alt="" width={44} height={55} className="h-[55px] w-11 rounded-md object-cover" />}
            </td>
            <td className="px-4 py-2">
              <Link href={`/admin/products/${p.id}`} className="font-extrabold text-plum-700 hover:underline">{p.name}</Link>
              <span className="block text-xs text-muted">/product/{p.slug}</span>
            </td>
            <td className="px-4 py-2 font-bold">{usd(p.price)}</td>
            <td className="max-w-xs px-4 py-2 text-xs text-muted">{p.categories.join(", ")}</td>
            <td className="space-x-1 px-4 py-2">
              {p.sameDay && <Badge value="delivered" label="same-day" />}
              {p.bestSeller && <Badge value="processing" label="best seller" />}
              {p.featured && <Badge value="out_for_delivery" label="featured" />}
            </td>
            <td className="px-4 py-2">{p.active ? <Badge value="paid" label="active" /> : <Badge value="cancelled" label="hidden" />}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
