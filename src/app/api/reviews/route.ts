import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, products, reviews } from "@/lib/db";
import { fieldErrors, reviewSchema } from "@/lib/schemas";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Customer reviews are saved unapproved and published after moderation in /admin/reviews. */
export async function POST(req: Request) {
  if (!rateLimit(`review:${clientIp(req)}`, 5, 60 * 60_000)) {
    return NextResponse.json({ message: "Too many reviews from this connection. Please try again later." }, { status: 429 });
  }
  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please check the form.", errors: fieldErrors(parsed.error) }, { status: 422 });
  const { website, email, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true });
  const [product] = await db.select({ id: products.id }).from(products).where(and(eq(products.id, data.productId), eq(products.active, true))).limit(1);
  if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });
  await db.insert(reviews).values({ ...data, email: email || null, approved: false });
  return NextResponse.json({ ok: true }, { status: 201 });
}
