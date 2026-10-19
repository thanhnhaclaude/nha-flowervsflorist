import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db, products, wishlist } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";

/** Signed-in wishlist sync: { merge: number[] } adds local items, { toggle: id } flips one item. Returns all ids. */
export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ message: "Sign in required" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { merge?: unknown; toggle?: unknown };

  const valid = async (ids: number[]) =>
    ids.length ? (await db.select({ id: products.id }).from(products).where(inArray(products.id, ids))).map((r) => r.id) : [];

  if (Array.isArray(body.merge)) {
    const ids = await valid(body.merge.filter((n): n is number => Number.isInteger(n)).slice(0, 100));
    if (ids.length) await db.insert(wishlist).ignore().values(ids.map((productId) => ({ customerId: session.id, productId })));
  } else if (Number.isInteger(body.toggle)) {
    const id = body.toggle as number;
    const where = and(eq(wishlist.customerId, session.id), eq(wishlist.productId, id));
    const [row] = await db.select().from(wishlist).where(where).limit(1);
    if (row) await db.delete(wishlist).where(where);
    else if ((await valid([id])).length) await db.insert(wishlist).values({ customerId: session.id, productId: id });
  }
  const rows = await db.select({ id: wishlist.productId }).from(wishlist).where(eq(wishlist.customerId, session.id));
  return NextResponse.json({ ids: rows.map((r) => r.id) });
}
