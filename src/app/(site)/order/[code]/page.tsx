import Link from "next/link";
import { notFound } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { ClearCart } from "@/components/clear-cart";
import { OrderView, STATUS_LABEL } from "@/components/order-view";
import { getVisibleOrder } from "@/lib/orders";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Your Order", description: "Order details and delivery status.", path: "/order", noindex: true });

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string; new?: string }> };

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ code }, { t, new: isNew }] = await Promise.all([params, searchParams]);
  const data = await getVisibleOrder(code, t);
  if (!data) notFound();
  const { order, items } = data;
  return (
    <div className="bg-blush">
      <div className="container-x py-10 md:py-14">
        {isNew && (
          <div className="mb-8 rounded-[var(--radius-card)] bg-white p-6 text-center shadow-card md:p-10">
            <ClearCart />
            <PartyPopper className="mx-auto h-12 w-12 text-rose-600" />
            <h1 className="mt-3 text-3xl font-bold text-plum-700 md:text-4xl">Thank you! Your order is placed.</h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
              Order <strong className="text-ink">{order.code}</strong> has been received. We&apos;ve emailed a confirmation to {order.senderEmail}.
              {order.paymentStatus !== "paid" && " Our team will call you shortly to confirm payment."}
            </p>
          </div>
        )}
        {!isNew && (
          <div className="mb-6">
            <p className="eyebrow">Order {order.code}</p>
            <h1 className="mt-1 text-3xl font-bold text-plum-700 md:text-4xl">{STATUS_LABEL[order.status] ?? "Your order"}</h1>
          </div>
        )}
        <OrderView order={order} items={items} />
        <p className="mt-8 text-center">
          <Link href="/" className="btn btn-outline">Continue Shopping</Link>
        </p>
      </div>
    </div>
  );
}
