import { eq } from "drizzle-orm";
import { addresses, customers, db } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth";
import { paymentsEnabled } from "@/lib/payments";
import { pageMeta } from "@/lib/seo";
import { CheckoutForm } from "./checkout-form";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Secure Checkout", description: "Complete your flower order.", path: "/checkout", noindex: true });

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const session = await getCustomerSession();
  let prefill: Parameters<typeof CheckoutForm>[0]["prefill"] = { addresses: [] };
  if (session) {
    const [[c], saved] = await Promise.all([
      db.select().from(customers).where(eq(customers.id, session.id)).limit(1),
      db.select().from(addresses).where(eq(addresses.customerId, session.id)),
    ]);
    if (c) prefill = { name: c.name, email: c.email, phone: c.phone, addresses: saved };
  }
  const { canceled } = await searchParams;
  return (
    <div className="bg-blush">
      <div className="container-x py-8 md:py-12">
        <h1 className="mb-6 text-3xl font-bold text-plum-700 md:text-4xl">Secure Checkout</h1>
        <CheckoutForm prefill={prefill} canceled={canceled === "1"} online={paymentsEnabled()} />
      </div>
    </div>
  );
}
