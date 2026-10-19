import Link from "next/link";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { markPaidFromSession, paymentsEnabled, stripe } from "@/lib/payments";
import { db, orders } from "@/lib/db";
import { eq } from "drizzle-orm";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Order Confirmed", description: "Thank you for your order.", path: "/order/success", noindex: true });

/** Stripe returns here. Confirms payment directly (webhook may arrive later) and forwards to the order page. */
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  if (!session_id || !paymentsEnabled()) redirect("/");
  let target: string | null = null;
  try {
    const session = await stripe().checkout.sessions.retrieve(session_id);
    const code = session.metadata?.orderCode || session.client_reference_id;
    await markPaidFromSession(session);
    if (code) {
      const [o] = await db.select({ code: orders.code, accessToken: orders.accessToken }).from(orders).where(eq(orders.code, code)).limit(1);
      if (o) target = `/order/${o.code}?t=${o.accessToken}&new=1`;
    }
  } catch (e) {
    console.error("[success] could not verify session:", (e as Error).message);
  }
  if (target) redirect(target);
  return (
    <div className="container-x py-20 text-center">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-plum-600" />
      <h1 className="mt-4 text-3xl font-bold text-plum-700">We&apos;re confirming your payment</h1>
      <p className="mx-auto mt-3 max-w-lg text-muted">
        This can take a moment. You&apos;ll receive a confirmation email shortly. Questions? Call {site.phoneDisplay}.
      </p>
      <Link href="/" className="btn btn-outline mt-6">Back to home</Link>
    </div>
  );
}
