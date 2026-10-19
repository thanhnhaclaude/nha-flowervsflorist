"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { db, products } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export type ProductFormState = { errors?: Record<string, string>; message?: string } | undefined;

const dollars = (v: FormDataEntryValue | null) => {
  const n = Math.round(parseFloat(String(v ?? "").replace(/[$,]/g, "")) * 100);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

export async function saveProduct(_: ProductFormState, fd: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const name = String(fd.get("name") ?? "").trim();
  const slug = slugify(String(fd.get("slug") || name));
  const price = dollars(fd.get("price"));
  const compareRaw = String(fd.get("compareAt") ?? "").trim();
  const compareAt = compareRaw ? dollars(compareRaw) : null;
  const images = lines(fd.get("images"));
  const categories = fd.getAll("categories").map(String);
  const errors: Record<string, string> = {};
  if (name.length < 3) errors.name = "Enter a product name";
  if (!slug) errors.slug = "Enter a URL slug";
  if (!Number.isFinite(price) || price < 100) errors.price = "Enter a price of at least $1.00";
  if (compareAt !== null && !Number.isFinite(compareAt)) errors.compareAt = "Enter a valid price or leave blank";
  if (!images.length) errors.images = "Add at least one image";
  if (!categories.length) errors.categories = "Choose at least one category";
  const [dupe] = await db.select({ id: products.id }).from(products).where(id ? and(eq(products.slug, slug), ne(products.id, id)) : eq(products.slug, slug)).limit(1);
  if (dupe) errors.slug = "Another product already uses this slug";
  if (Object.keys(errors).length) return { errors, message: "Please fix the highlighted fields." };

  const data = {
    name,
    slug,
    price,
    compareAt,
    short: String(fd.get("short") ?? "").trim().slice(0, 300),
    description: String(fd.get("description") ?? "").trim(),
    includes: lines(fd.get("includes")),
    categories,
    colors: fd.getAll("colors").map(String),
    images,
    sameDay: fd.get("sameDay") === "on",
    bestSeller: fd.get("bestSeller") === "on",
    featured: fd.get("featured") === "on",
    hasSizes: fd.get("hasSizes") === "on",
    active: fd.get("active") === "on",
    badge: String(fd.get("badge") ?? "").trim().slice(0, 40) || null,
    sortOrder: Number(fd.get("sortOrder")) || 0,
  };
  let productId = id;
  if (id) await db.update(products).set(data).where(eq(products.id, id));
  else productId = (await db.insert(products).values(data))[0].insertId;
  revalidatePath("/", "layout");
  redirect(`/admin/products/${productId}?saved=1`);
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  // Soft delete keeps past orders and links intact.
  if (id) await db.update(products).set({ active: false }).where(eq(products.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/products");
}
