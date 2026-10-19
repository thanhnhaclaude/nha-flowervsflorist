import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { invalidate } from "@/lib/memo";
import { desc, eq } from "drizzle-orm";
import { db, products, reviews } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { AdminHeader, Badge, Panel } from "../ui";

export const metadata = { title: "Reviews" };

async function moderate(fd: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(fd.get("id"));
  const op = String(fd.get("op"));
  if (op === "approve") await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));
  if (op === "hide") await db.update(reviews).set({ approved: false }).where(eq(reviews.id, id));
  if (op === "delete") await db.delete(reviews).where(eq(reviews.id, id));
  invalidate("catalog:");
  revalidatePath("/", "layout");
  redirect("/admin/reviews");
}

export default async function ReviewsPage() {
  const rows = await db
    .select({ r: reviews, productName: products.name, productSlug: products.slug })
    .from(reviews)
    .leftJoin(products, eq(products.id, reviews.productId))
    .orderBy(reviews.approved, desc(reviews.createdAt))
    .limit(200);
  return (
    <>
      <AdminHeader title="Reviews" />
      <p className="mb-4 text-sm text-muted">Only approved reviews appear on product pages and in Google rich results. Publish genuine customer reviews only.</p>
      <div className="space-y-3">
        {rows.length === 0 && <Panel className="p-8 text-center text-muted">No reviews yet.</Panel>}
        {rows.map(({ r, productName, productSlug }) => (
          <Panel key={r.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p>
                <strong className="text-gold">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </strong>{" "}
                · {r.name}
                {r.email && <span className="text-muted"> ({r.email})</span>} · on{" "}
                <Link href={`/product/${productSlug}`} target="_blank" className="font-bold text-plum-700 underline">
                  {productName}
                </Link>
              </p>
              <span className="flex items-center gap-2 text-sm text-muted">
                {formatDate(r.createdAt)} {r.approved ? <Badge value="paid" label="published" /> : <Badge value="processing" label="pending" />}
              </span>
            </div>
            {r.title && <p className="mt-2 font-extrabold">{r.title}</p>}
            <p className="mt-1 whitespace-pre-line">{r.body}</p>
            <div className="mt-3 flex gap-2">
              {(r.approved ? ["hide", "delete"] : ["approve", "delete"]).map((op) => (
                <form key={op} action={moderate}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="op" value={op} />
                  <button className={`btn btn-sm ${op === "approve" ? "btn-primary" : "border-2 border-line bg-white"}`}>{op[0].toUpperCase() + op.slice(1)}</button>
                </form>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
