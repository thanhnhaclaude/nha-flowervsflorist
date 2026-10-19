import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { coupons, db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate, usd } from "@/lib/format";
import { AdminHeader, Badge, Panel, Table } from "../ui";

export const metadata = { title: "Coupons" };

async function createCoupon(fd: FormData) {
  "use server";
  await requireAdmin();
  const code = String(fd.get("code") ?? "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const type = String(fd.get("type")) as "percent" | "fixed" | "free_delivery";
  const raw = parseFloat(String(fd.get("value") ?? "0")) || 0;
  const value = type === "fixed" ? Math.round(raw * 100) : Math.round(raw);
  const minSubtotal = Math.round((parseFloat(String(fd.get("minSubtotal") ?? "0")) || 0) * 100);
  const maxUses = Number(fd.get("maxUses")) || null;
  const endsAt = fd.get("endsAt") ? new Date(`${fd.get("endsAt")}T23:59:59`) : null;
  if (!code || !["percent", "fixed", "free_delivery"].includes(type) || (type === "percent" && (value < 1 || value > 100))) redirect("/admin/coupons?error=1");
  const [dupe] = await db.select({ id: coupons.id }).from(coupons).where(eq(coupons.code, code)).limit(1);
  if (dupe) redirect("/admin/coupons?error=dupe");
  await db.insert(coupons).values({ code, type, value, minSubtotal, maxUses, endsAt, description: String(fd.get("description") ?? "").slice(0, 200) });
  redirect("/admin/coupons");
}

async function toggleCoupon(fd: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(fd.get("id"));
  const [c] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  if (c) await db.update(coupons).set({ active: !c.active }).where(eq(coupons.id, id));
  redirect("/admin/coupons");
}

const describe = (c: { type: string; value: number }) => (c.type === "percent" ? `${c.value}% off` : c.type === "fixed" ? `${usd(c.value)} off` : "Free delivery");

export default async function CouponsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const rows = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  const { error } = await searchParams;
  return (
    <>
      <AdminHeader title="Coupons" />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Table head={["Code", "Discount", "Minimum", "Used", "Expires", "Status", ""]}>
          {rows.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <strong className="font-mono">{c.code}</strong>
                <span className="block text-xs text-muted">{c.description}</span>
              </td>
              <td className="px-4 py-3">{describe(c)}</td>
              <td className="px-4 py-3">{c.minSubtotal ? usd(c.minSubtotal) : "—"}</td>
              <td className="px-4 py-3">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
              <td className="px-4 py-3">{c.endsAt ? formatDate(c.endsAt) : "Never"}</td>
              <td className="px-4 py-3">{c.active ? <Badge value="paid" label="active" /> : <Badge value="cancelled" label="off" />}</td>
              <td className="px-4 py-3">
                <form action={toggleCoupon}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-sm font-bold text-plum-600 underline">{c.active ? "Disable" : "Enable"}</button>
                </form>
              </td>
            </tr>
          ))}
        </Table>
        <Panel className="h-fit p-5">
          <h2 className="mb-4 font-display text-xl font-bold text-plum-700">New coupon</h2>
          {error && <p className="mb-3 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error === "dupe" ? "That code already exists." : "Check the code and value."}</p>}
          <form action={createCoupon} className="space-y-3">
            <div><label className="label" htmlFor="code">Code</label><input id="code" name="code" required className="field uppercase" placeholder="SPRING20" /></div>
            <div>
              <label className="label" htmlFor="type">Type</label>
              <select id="type" name="type" className="field">
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed $ off</option>
                <option value="free_delivery">Free delivery</option>
              </select>
            </div>
            <div><label className="label" htmlFor="value">Value (% or $)</label><input id="value" name="value" inputMode="decimal" className="field" defaultValue="10" /></div>
            <div><label className="label" htmlFor="minSubtotal">Minimum subtotal ($)</label><input id="minSubtotal" name="minSubtotal" inputMode="decimal" className="field" defaultValue="0" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label" htmlFor="maxUses">Max uses</label><input id="maxUses" name="maxUses" type="number" min={1} className="field" placeholder="∞" /></div>
              <div><label className="label" htmlFor="endsAt">Expires</label><input id="endsAt" name="endsAt" type="date" className="field" /></div>
            </div>
            <div><label className="label" htmlFor="description">Description</label><input id="description" name="description" className="field" /></div>
            <button className="btn btn-primary w-full">Create coupon</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
