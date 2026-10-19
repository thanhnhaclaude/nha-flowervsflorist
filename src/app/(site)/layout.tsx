import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { WishlistProvider } from "@/components/wishlist-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PromoBar } from "@/components/promo-bar";
import { JsonLd } from "@/components/json-ld";
import { getCustomerSession } from "@/lib/auth";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();
  return (
    <CartProvider>
      <WishlistProvider signedIn={Boolean(session)}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-plum-700 focus:px-5 focus:py-3 focus:text-white">
          Skip to content
        </a>
        <PromoBar />
        <Header signedIn={Boolean(session)} />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </WishlistProvider>
    </CartProvider>
  );
}
