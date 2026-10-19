import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, products } from "@/lib/db";
import { categories } from "@/data/categories";
import { AdminHeader } from "../../ui";
import { ProductForm } from "../product-form";
import { deleteProduct } from "../actions";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [product] = await db.select().from(products).where(eq(products.id, Number((await params).id))).limit(1);
  if (!product) notFound();
  const { saved } = await searchParams;
  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-block text-sm font-bold text-plum-600 hover:underline">← All products</Link>
      <AdminHeader title={product.name}>
        <Link href={`/product/${product.slug}`} target="_blank" className="btn btn-sm border-2 border-line bg-white">View in store</Link>
        {product.active && (
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button className="btn btn-sm border-2 border-rose-200 bg-white text-rose-700">Hide product</button>
          </form>
        )}
      </AdminHeader>
      {saved && <p className="mb-4 rounded-xl bg-leaf-soft p-3 text-sm font-bold text-leaf">Saved.</p>}
      <ProductForm product={product} categories={categories.map(({ slug, name, group }) => ({ slug, name, group }))} />
    </>
  );
}
