"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Truck } from "lucide-react";
import { useCart } from "./cart/cart-context";
import { useWishlist } from "./wishlist-context";
import { img, usd } from "@/lib/format";

import type { CardProduct } from "@/lib/cards";

export type { CardProduct };

export function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex text-gold" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={className} fill={rating >= i - 0.25 ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export function ProductCard({ product, priority = false }: { product: CardProduct; priority?: boolean }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);
  const [first, second] = product.images;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-petal">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <Image
            src={img(first)}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw"
            className={`object-cover transition-[transform,opacity] duration-500 group-hover:scale-[1.04] ${second ? "group-hover:opacity-0" : ""}`}
          />
          {second && (
            <Image src={img(second)} alt="" fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 30vw, 50vw" className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-wide text-white">{product.badge}</span>}
          {product.sameDay && (
            <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-wide text-leaf">
              <Truck className="h-3 w-3" /> Same-day
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => wishlist.toggle(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-plum-600 shadow-sm transition-transform hover:scale-110"
        >
          <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          onClick={() =>
            add({ productId: product.id, slug: product.slug, name: product.name, image: first, price: product.price, hasSizes: product.hasSizes, sameDay: product.sameDay, size: "standard", addOns: [] })
          }
          className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-plum-600 py-3 text-sm font-extrabold text-white opacity-0 transition-all duration-300 hover:bg-plum-700 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:block"
        >
          Quick Add — {usd(product.price)}
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <h3 className="font-sans text-[0.98rem] font-bold leading-snug text-ink">
          <Link href={`/product/${product.slug}`} className="hover:text-rose-600">
            {product.name}
          </Link>
        </h3>
        {product.reviewCount > 0 && product.rating && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <Stars rating={product.rating} className="h-3.5 w-3.5" />
            <span>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </p>
        )}
        <p className="mt-1.5 flex items-baseline gap-2">
          {product.hasSizes && <span className="text-xs font-semibold text-muted">From</span>}
          <span className="text-lg font-extrabold text-plum-700">{usd(product.price)}</span>
          {product.compareAt && product.compareAt > product.price && <span className="text-sm text-muted line-through">{usd(product.compareAt)}</span>}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: CardProduct[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

