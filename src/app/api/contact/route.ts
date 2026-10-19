import { NextResponse, after } from "next/server";
import { db, messages } from "@/lib/db";
import { contactSchema, fieldErrors } from "@/lib/schemas";
import { sendContactEmail } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 30 * 60_000)) {
    return NextResponse.json({ message: "Too many messages. Please call us instead." }, { status: 429 });
  }
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) }, { status: 422 });
  const { website, ...m } = parsed.data;
  if (website) return NextResponse.json({ ok: true });
  await db.insert(messages).values({ ...m, phone: m.phone || null, orderCode: m.orderCode || null });
  after(() => sendContactEmail(m));
  return NextResponse.json({ ok: true }, { status: 201 });
}
