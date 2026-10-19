"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductGrid, type CardProduct } from "@/components/product-card";
import { useWishlist } from "@/components/wishlist-context";

export function WishlistGrid({ products }: { products: CardProduct[] }) {
  const { ids } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));
  if (!saved.length)
    return (
      <div className="mx-auto max-w-lg rounded-[var(--radius-card)] bg-blush p-10 text-center">
        <Heart className="mx-auto h-10 w-10 text-rose-600" />
        <p className="mt-3 font-display text-2xl font-bold text-plum-700">Your wishlist is empty</p>
        <Link href="/best-sellers" className="btn btn-primary mt-5">
          Discover Best Sellers
        </Link>
      </div>
    );
  return (
    <>
      <h2 className="sr-only">Saved products</h2>
      <ProductGrid products={saved} />
    </>
  );
}
