import "server-only";
import { cache } from "react";
import { and, asc, avg, count, desc, eq, inArray, lte } from "drizzle-orm";
import { db, posts, products, reviews, type Post, type Product } from "./db";
import { memo } from "./memo";

export type ProductWithRating = Product & { rating: number | null; reviewCount: number };

/** Approved-review averages for all products, keyed by product id. */
const ratingMap = cache(async () => {
  const rows = await memo("catalog:ratings", () => db
    .select({ productId: reviews.productId, avg: avg(reviews.rating), n: count() })
    .from(reviews)
    .where(eq(reviews.approved, true))
    .groupBy(reviews.productId));
  return new Map(rows.map((r) => [r.productId, { rating: r.avg ? Number(r.avg) : null, reviewCount: r.n }]));
});

/** All active products (the catalog is small, so filtering happens in memory). */
export const getProducts = cache(async (): Promise<ProductWithRating[]> => {
  const [rows, ratings] = await Promise.all([
    memo("catalog:products", () => db.select().from(products).where(eq(products.active, true)).orderBy(asc(products.sortOrder), asc(products.id))),
    ratingMap(),
  ]);
  return rows.map((p) => ({ ...p, ...(ratings.get(p.id) ?? { rating: null, reviewCount: 0 }) }));
});

export const getProduct = cache(async (slug: string) => (await getProducts()).find((p) => p.slug === slug) ?? null);

export async function getProductsByIds(ids: number[]) {
  if (!ids.length) return [];
  return db.select().from(products).where(and(inArray(products.id, ids), eq(products.active, true)));
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "newest";

export function sortProducts<T extends Product>(list: T[], sort: SortKey) {
  const l = [...list];
  switch (sort) {
    case "price-asc":
      return l.sort((a, b) => a.price - b.price);
    case "price-desc":
      return l.sort((a, b) => b.price - a.price);
    case "name":
      return l.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return l.sort((a, b) => b.id - a.id);
    default:
      return l.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || a.sortOrder - b.sortOrder);
  }
}

export async function getCategoryProducts(slug: string) {
  const all = await getProducts();
  if (slug === "best-sellers") return all.filter((p) => p.bestSeller || p.categories.includes(slug));
  if (slug === "next-day-flower-delivery") return all.filter((p) => p.nextDay);
  if (slug === "flowers-under-50") return all.filter((p) => p.price < 5000);
  return all.filter((p) => p.categories.includes(slug));
}

export async function getRelated(product: Product, n = 4) {
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, score: p.categories.filter((c) => product.categories.includes(c)).length + (p.bestSeller ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.p);
}

export async function searchProducts(q: string) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const all = await getProducts();
  return all.filter((p) => {
    const hay = `${p.name} ${p.short} ${p.description} ${p.categories.join(" ")} ${p.colors.join(" ")}`.toLowerCase();
    return terms.every((t) => hay.includes(t.replace(/s$/, "")));
  });
}

export const getProductReviews = (productId: number) =>
  db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.approved, true)))
    .orderBy(desc(reviews.createdAt))
    .limit(30);

// ───────────── Blog ─────────────

export const getPosts = cache(
  async (): Promise<Post[]> =>
    memo("catalog:posts", () => db.select().from(posts).where(and(eq(posts.status, "published"), lte(posts.publishedAt, new Date()))).orderBy(desc(posts.publishedAt))),
);

export const getPost = cache(async (slug: string) => (await getPosts()).find((p) => p.slug === slug) ?? null);
