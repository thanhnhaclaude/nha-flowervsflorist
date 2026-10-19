import Link from "next/link";
import { Faq, PageHero } from "@/components/ui";
import { usd } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { commerce, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Flower Delivery FAQ – Same-Day, Fees, Changes & Refunds",
  description: "Answers to common questions about same-day flower delivery, fees, card messages, order changes, substitutions and our satisfaction guarantee.",
  path: "/faq",
});

const groups: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Ordering & Delivery",
    faqs: [
      { q: "What's the cut-off for same-day delivery?", a: "Order Same-Day eligible designs by 2 PM in the recipient's time zone Monday–Friday, or by 12 PM on weekends." },
      { q: "How much is delivery?", a: `Standard delivery is ${usd(commerce.deliveryFee)}, free on orders of ${usd(commerce.freeDeliveryThreshold)}+. Same-day priority adds ${usd(commerce.sameDayFee)}.` },
      { q: "Can I choose a delivery time?", a: "You can request a morning, afternoon or evening window. We do our best to honor it, but exact times aren't guaranteed." },
      { q: "Do you deliver to hospitals and funeral homes?", a: "Yes. Include the patient's room number or the funeral service details in the delivery instructions." },
      { q: "Can I schedule delivery for a future date?", a: `Yes—up to ${commerce.maxDaysAhead} days in advance. Just pick the date at checkout.` },
    ],
  },
  {
    title: "Products & Card Messages",
    faqs: [
      { q: "Will my bouquet look exactly like the photo?", a: "Our florists match the style, colors and value shown. Seasonal stems or containers may vary slightly, always with equal or greater value." },
      { q: "Is the card message free?", a: "Yes. Every order includes a free personalized card message of up to 300 characters." },
      { q: "What's the difference between Standard, Deluxe and Premium?", a: "Deluxe adds more stems for a fuller look; Premium is our most lavish version with an upgraded vase." },
    ],
  },
  {
    title: "Payments, Changes & Refunds",
    faqs: [
      { q: "What payment methods do you accept?", a: "Visa, Mastercard, American Express, Discover, Apple Pay and Google Pay through Stripe's secure checkout." },
      { q: "Can I change or cancel my order?", a: "Yes, until 12 PM recipient's time the day before delivery. Contact us with your order number." },
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
