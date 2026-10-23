/**
 * Creates/updates the tables and inserts the starting catalog, blog posts and welcome coupons when the
 * database is empty. Safe to run on every start.
 *
 * Migrations are embedded in code (src/lib/db/migrations.ts, generated from drizzle/*.sql) instead of
 * being read from disk, because hosts like Hostinger run the app from a different working directory.
 */
import { count, sql } from "drizzle-orm";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { MIGRATIONS } from "./migrations";
import { seedProducts } from "../../data/products";
import { seedPosts } from "../../data/posts";
import * as schema from "./schema";

type Db = MySql2Database<typeof schema>;

/** MySQL errors meaning "already done" — safe to skip when re-running a statement. */
const ALREADY_APPLIED = new Set(["ER_TABLE_EXISTS_ERROR", "ER_DUP_FIELDNAME", "ER_DUP_KEYNAME", "ER_MULTIPLE_PRI_KEY"]);

async function rows<T>(db: Db, query: ReturnType<typeof sql>) {
  const res = (await db.execute(query)) as unknown as [T[], unknown];
  return res[0];
}

async function runMigrations(db: Db, log: (msg: string) => void) {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS __fvf_migrations (tag varchar(100) NOT NULL PRIMARY KEY, applied_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
  let applied = new Set((await rows<{ tag: string }>(db, sql`SELECT tag FROM __fvf_migrations`)).map((r) => r.tag));

  // Databases set up by an earlier version (drizzle's own migrator / imported SQL backup) record their
  // migrations in __drizzle_migrations, in order: mark that many as already applied.
  if (applied.size === 0) {
    const legacy = await rows<{ n: number }>(db, sql`SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '__drizzle_migrations'`);
    if (Number(legacy[0]?.n) > 0) {
      const [{ n }] = await rows<{ n: number }>(db, sql`SELECT COUNT(*) AS n FROM __drizzle_migrations`);
      for (const m of MIGRATIONS.slice(0, Number(n))) await db.execute(sql`INSERT IGNORE INTO __fvf_migrations (tag) VALUES (${m.tag})`);
      applied = new Set(MIGRATIONS.slice(0, Number(n)).map((m) => m.tag));
    }
  }

  for (const m of MIGRATIONS) {
    if (applied.has(m.tag)) continue;
    for (const statement of m.statements) {
      try {
        await db.execute(sql.raw(statement));
      } catch (e) {
        const code = (e as { code?: string; cause?: { code?: string } }).cause?.code ?? (e as { code?: string }).code;
        if (!code || !ALREADY_APPLIED.has(code)) throw e;
      }
    }
    await db.execute(sql`INSERT IGNORE INTO __fvf_migrations (tag) VALUES (${m.tag})`);
    log(`[setup] applied migration ${m.tag}`);
  }
}

export async function setupDatabase(db: Db, log: (msg: string) => void = console.log) {
  await runMigrations(db, log);

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
        nextDay: p.nextDay ?? true,
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
