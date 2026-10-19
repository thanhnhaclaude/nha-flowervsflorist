import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { Search } from "lucide-react";
import { db, orders } from "@/lib/db";
import { PageHero } from "@/components/ui";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Track Your Flower Order", description: "Check the delivery status of your FlowerVsFlorist order with your order number and email.", path: "/track-order" });

async function track(formData: FormData) {
  "use server";
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const [o] = code && email ? await db.select({ code: orders.code, t: orders.accessToken }).from(orders).where(and(eq(orders.code, code), eq(orders.senderEmail, email))).limit(1) : [];
  if (!o) redirect("/track-order?error=1");
  redirect(`/order/${o.code}?t=${o.t}`);
}

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Order status" title="Track Your Order" text="Enter your order number (e.g. FVF-AB12CD) and the email you used at checkout." />
      <div className="container-x max-w-lg pb-20">
        <form action={track} className="card space-y-4 p-6 md:p-8">
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 font-semibold text-rose-700">We couldn&apos;t find an order with those details. Please check and try again.</p>}
          <div>
            <label className="label" htmlFor="code">Order number</label>
            <input id="code" name="code" required className="field uppercase" placeholder="FVF-XXXXXX" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <button className="btn btn-primary w-full"><Search className="h-5 w-5" /> Track Order</button>
          <p className="text-center text-sm text-muted">Need help? Call <a className="font-bold text-plum-700" href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p>
        </form>
      </div>
    </>
  );
}
