import { desc, eq } from "drizzle-orm";
import { db, subscribers } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

/** CSV export of active newsletter subscribers (admin only). */
export async function GET() {
  if (!(await getAdmin())) return new Response("Unauthorized", { status: 401 });
  const rows = await db.select().from(subscribers).where(eq(subscribers.unsubscribed, false)).orderBy(desc(subscribers.createdAt));
  const csv = ["email,source,joined", ...rows.map((r) => `${r.email},${r.source},${new Date(r.createdAt).toISOString()}`)].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="subscribers.csv"' } });
}
