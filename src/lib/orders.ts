import "server-only";
import { timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, orderItems, orders } from "./db";
import { getCustomerSession } from "./auth";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Loads an order the visitor may see: correct access token (from emails) or the signed-in owner. */
export async function getVisibleOrder(code: string, token?: string) {
  const [order] = await db.select().from(orders).where(eq(orders.code, code.toUpperCase())).limit(1);
  if (!order) return null;
  let allowed = Boolean(token && same(token, order.accessToken));
  if (!allowed && order.customerId) allowed = (await getCustomerSession())?.id === order.customerId;
  if (!allowed) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}
