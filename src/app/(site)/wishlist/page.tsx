import { PageHero } from "@/components/ui";
import { toCard } from "@/lib/cards";
import { getProducts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { WishlistGrid } from "./wishlist-grid";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "My Wishlist", description: "Flowers you've saved for later.", path: "/wishlist", noindex: true });

export default async function WishlistPage() {
  const products = (await getProducts()).map(toCard);
  return (
    <>
      <PageHero eyebrow="Saved for later" title="My Wishlist" text="Tap the heart on any bouquet to save it here." />
      <div className="container-x pb-20">
        <WishlistGrid products={products} />
      </div>
    </>
  );
}
