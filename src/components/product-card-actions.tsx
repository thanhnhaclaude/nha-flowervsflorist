"use client";

import { Heart } from "lucide-react";
import { useCart } from "./cart/cart-context";
import { useWishlist } from "./wishlist-context";
import { usd } from "@/lib/format";
import type { CardProduct } from "@/lib/cards";

/** Small client islands for product cards, so the card itself renders on the server. */
export function WishlistButton({ id, name }: { id: number; name: string }) {
  const wishlist = useWishlist();
  const saved = wishlist.has(id);
  return (
    <button
      type="button"
      onClick={() => wishlist.toggle(id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-plum-600 shadow-sm transition-transform hover:scale-110"
    >
      <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

export function QuickAdd({ product }: { product: CardProduct }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() =>
        add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.price, hasSizes: product.hasSizes, nextDay: product.nextDay, size: "standard", addOns: [] })
      }
      className="absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-plum-600 py-3 text-sm font-extrabold text-white opacity-0 transition-all duration-300 hover:bg-plum-700 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:block"
    >
      Quick Add — {usd(product.price)}
    </button>
  );
}
