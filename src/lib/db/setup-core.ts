/**
 * Creates/updates the tables (Drizzle migrations in /drizzle) and inserts the starting catalog,
 * blog posts and welcome coupon when the database is empty. Safe to run on every start.
 */
import path from "node:path";
import { count } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { seedProducts } from "../../data/products";
import { seedPosts } from "../../data/posts";
import * as schema from "./schema";

type Db = MySql2Database<typeof schema>;

export async function setupDatabase(db: Db, log: (msg: string) => void = console.log) {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

  const [{ n: productCount }] = await db.select({ n: count() }).from(schema.products);
  if (productCount === 0) {
    await db.insert(schema.products).values(
      seedProducts.map((p, i) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        short: p.short,
        description: p.description,
        includes: p.includes,
        categories: p.categories,
        colors: p.colors,
        images: p.images,
        sameDay: p.sameDay ?? true,
        bestSeller: p.bestSeller ?? false,
        featured: p.featured ?? false,
        hasSizes: p.sizes ?? true,
        badge: p.badge ?? null,
        sortOrder: i,
      })),
    );
    log(`[setup] inserted ${seedProducts.length} products`);
  }

  const [{ n: postCount }] = await db.select({ n: count() }).from(schema.posts);
  if (postCount === 0) {
    await db.insert(schema.posts).values(
      seedPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        cover: p.cover,
        category: p.category,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: new Date(`${p.publishedAt}T14:00:00Z`),
      })),
    );
    log(`[setup] inserted ${seedPosts.length} blog posts`);
  }

  const [{ n: couponCount }] = await db.select({ n: count() }).from(schema.coupons);
  if (couponCount === 0) {
    await db.insert(schema.coupons).values([
      { code: "WELCOME10", description: "10% off your first order (newsletter welcome)", type: "percent", value: 10 },
      { code: "FREEDELIVERY", description: "Free standard delivery on orders $50+", type: "free_delivery", value: 0, minSubtotal: 5000 },
    ]);
    log("[setup] inserted starter coupons");
  }
}
