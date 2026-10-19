import Link from "next/link";
import { Faq, PageHero } from "@/components/ui";
import { usd } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { commerce, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Flower Delivery FAQ – Next-Day Shipping, Fees, Changes & Refunds",
  description: "Answers to common questions about next-day flower delivery, fees, card messages, order changes, substitutions and our satisfaction guarantee.",
  path: "/faq",
});

const groups: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Ordering & Delivery",
    faqs: [
      { q: "What's the cut-off for next-day delivery?", a: "Order Next-Day designs by 2 PM Eastern Time, Monday–Friday. Orders after the cut-off or on weekends ship the next business day. We deliver Tuesday–Saturday." },
      { q: "How much is delivery?", a: `Overnight shipping is ${usd(commerce.deliveryFee)} per order, free on orders of ${usd(commerce.freeDeliveryThreshold)}+. No hidden service fees.` },
      { q: "Can I choose a delivery time?", a: "FedEx and UPS deliver by end of day and can't guarantee a specific time. For an event, choose a delivery date one day early." },
      { q: "How will I know when my flowers ship?", a: "You'll get an email with a FedEx or UPS tracking link as soon as your order ships." },
      { q: "Do you deliver to hospitals and funeral homes?", a: "Many hospitals don't accept carrier deliveries to patient rooms, and carrier timing can't be guaranteed for a service. We recommend sending to the recipient's or family's home." },
      { q: "Can I schedule delivery for a future date?", a: `Yes—up to ${commerce.maxDaysAhead} days in advance. Just pick the date at checkout.` },
    ],
  },
  {
    title: "Products & Card Messages",
    faqs: [
      { q: "Will my bouquet look exactly like the photo?", a: "Each design matches the style, colors and value shown. Seasonal stems or containers may vary slightly, always with equal or greater value." },
      { q: "Is the card message free?", a: "Yes. Every order includes a free personalized card message of up to 300 characters." },
      { q: "What's the difference between Standard, Deluxe and Premium?", a: "Deluxe adds more stems for a fuller look; Premium is our most lavish version with an upgraded vase." },
    ],
  },
  {
    title: "Payments, Changes & Refunds",
    faqs: [
      { q: "What payment methods do you accept?", a: "Visa, Mastercard, American Express, Discover, Apple Pay and Google Pay through Stripe's secure checkout." },
      { q: "Can I change or cancel my order?", a: "Yes, until it ships (by 2 PM ET the business day before delivery). Contact us with your order number." },
      { q: "What if I'm not happy with my flowers?", a: "Contact us within 7 days of delivery and we'll send a free replacement or a refund, per our 100% Satisfaction Guarantee." },
      { q: "How do I use a promo code?", a: "Enter it in the Promo code box at checkout. One code per order." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Help center" title="Frequently Asked Questions" text="Quick answers about delivery, orders and our guarantee." />
      <div className="container-x max-w-4xl space-y-12 pb-20">
        {groups.map((g) => (
          <Faq key={g.title} faqs={g.faqs} title={g.title} />
        ))}
        <p className="rounded-2xl bg-blush p-6 text-center">
          Still have questions? Call <a href={`tel:${site.phone}`} className="font-extrabold text-plum-700">{site.phoneDisplay}</a> or{" "}
          <Link href="/contact" className="font-extrabold text-rose-600 underline">
            send us a message
          </Link>
          .
        </p>
      </div>
    </>
  );
}
