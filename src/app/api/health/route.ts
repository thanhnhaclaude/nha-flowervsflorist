import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { db, posts, products } from "@/lib/db";
import { dbConnection } from "@/lib/db/config";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Deployment health check: database connection, row counts and which env vars are set.
 * Returns only true/false and error codes — never secrets or values.
 */
export async function GET() {
  const envSet = Object.fromEntries(
    [
      "DATABASE_URL", "DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "NEXT_PUBLIC_SITE_URL", "AUTH_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD_HASH",
      "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SHOP_EMAIL", "UPLOAD_DIR",
    ].map((k) => [k, Boolean(env(k))]),
  );
  let dbConfig: Record<string, unknown>;
  try {
    const c = dbConnection();
    dbConfig = c.mode === "parts" ? { mode: "DB_HOST/DB_USER/DB_PASSWORD/DB_NAME", host: `${c.host}:${c.port}` } : { mode: "DATABASE_URL" };
  } catch (e) {
    dbConfig = { error: (e as Error).message };
  }
  let database: Record<string, unknown>;
  try {
    const [[p], [b]] = await Promise.all([db.select({ n: count() }).from(products), db.select({ n: count() }).from(posts)]);
    database = { status: "ok", products: p.n, posts: b.n };
  } catch (e) {
    const err = e as { code?: string; cause?: { code?: string } };
    database = { status: "error", code: err.cause?.code ?? err.code ?? "UNKNOWN" };
  }
  return NextResponse.json(
    { node: process.version, stripeMode: env("STRIPE_SECRET_KEY")?.startsWith("sk_live") ? "live" : env("STRIPE_SECRET_KEY") ? "test" : "off", env: envSet, dbConfig, database },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
