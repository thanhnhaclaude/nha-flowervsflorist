import { NextResponse, after } from "next/server";
import { eq } from "drizzle-orm";
import { db, subscribers } from "@/lib/db";
import { fieldErrors, newsletterSchema } from "@/lib/schemas";
import { sendWelcomeEmail } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`nl:${clientIp(req)}`, 8, 60 * 60_000)) {
    return NextResponse.json({ message: "Too many attempts. Please try again later." }, { status: 429 });
  }
  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: fieldErrors(parsed.error).email ?? "Enter a valid email address." }, { status: 422 });
  const { email, source } = parsed.data;
  const [existing] = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
  if (existing && !existing.unsubscribed) {
    return NextResponse.json({ message: "You're already subscribed! Use code WELCOME10 for 10% off your first order." });
  }
  if (existing) await db.update(subscribers).set({ unsubscribed: false }).where(eq(subscribers.id, existing.id));
  else await db.insert(subscribers).values({ email, source: source ?? "footer" });
  after(() => sendWelcomeEmail(email));
  return NextResponse.json({ message: "You're in! Use code WELCOME10 for 10% off your first order—we've emailed it to you too." });
}
