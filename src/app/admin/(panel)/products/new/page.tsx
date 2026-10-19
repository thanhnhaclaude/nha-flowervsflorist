import Link from "next/link";
import { categories } from "@/data/categories";
import { AdminHeader } from "../../ui";
import { ProductForm } from "../product-form";

export const metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-block text-sm font-bold text-plum-600 hover:underline">← All products</Link>
      <AdminHeader title="New product" />
      <ProductForm categories={categories.map(({ slug, name, group }) => ({ slug, name, group }))} />
    </>
  );
}
