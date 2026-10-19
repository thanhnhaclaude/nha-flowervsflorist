import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHero, TrustBar } from "@/components/ui";
import { states } from "@/data/states";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Flower Delivery by State – Next-Day Flowers Across the USA",
  description: "Next-day flower delivery across the continental U.S. Choose a state to send fresh flowers, shipped overnight with tracking.",
  path: "/flower-delivery",
});

export default function FlowerDeliveryIndex() {
  return (
    <>
      <PageHero eyebrow="Nationwide delivery" title="Flower Delivery Across the USA" text="Carefully packed and shipped overnight for next-day delivery. Choose a state to get started." />
      <div className="container-x pb-20">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {states.map((s) => (
            <li key={s.code}>
              <Link href={`/flower-delivery/${s.slug}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 font-bold hover:border-plum-200 hover:bg-blush hover:text-plum-700">
                <MapPin className="h-4 w-4 shrink-0 text-rose-600" /> {s.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <TrustBar />
        </div>
      </div>
    </>
  );
}
