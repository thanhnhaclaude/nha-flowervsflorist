import Link from "next/link";

const messages = [
  { text: "Same-day flower delivery — order by 2 PM recipient's time", href: "/same-day-flower-delivery" },
  { text: "Free delivery on orders $79+", href: "/best-sellers" },
  { text: "Join our newsletter & get 10% off your first order", href: "#newsletter" },
  { text: "100% satisfaction guarantee on every bouquet", href: "/refund-policy" },
];

export function PromoBar() {
  const row = (hidden: boolean) =>
    messages.map((m, i) => (
      <Link key={`${hidden}-${i}`} href={m.href} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-3 px-6 hover:underline">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        {m.text}
      </Link>
    ));
  return (
    <div className="overflow-hidden bg-plum-700 text-[0.8125rem] font-bold text-white">
      <div className="flex w-max animate-marquee py-2.5 hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
