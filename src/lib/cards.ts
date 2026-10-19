export type CardProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  compareAt: number | null;
  images: string[];
  nextDay: boolean;
  hasSizes: boolean;
  badge: string | null;
  rating: number | null;
  reviewCount: number;
};

/** Strip a DB product down to what product cards need (keeps client payloads small). */
export function toCard(p: CardProduct): CardProduct {
  return { id: p.id, slug: p.slug, name: p.name, price: p.price, compareAt: p.compareAt, images: p.images, nextDay: p.nextDay, hasSizes: p.hasSizes, badge: p.badge, rating: p.rating, reviewCount: p.reviewCount };
}
