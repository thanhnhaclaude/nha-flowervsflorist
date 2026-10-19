"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { addresses, customers, db, subscribers } from "@/lib/db";
import { checkPassword, createCustomerSession, destroyCustomerSession, hashPassword, requireCustomer } from "@/lib/auth";
import { addressSchema, fieldErrors, loginSchema, registerSchema } from "@/lib/schemas";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type FormState = { message?: string; errors?: Record<string, string>; ok?: boolean } | undefined;

const safeNext = (n: FormDataEntryValue | null) => {
  const s = String(n ?? "");
  return s.startsWith("/") && !s.startsWith("//") ? s : "/account";
};

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 10, 15 * 60_000)) return { message: "Too many attempts. Please wait 15 minutes." };
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const [c] = await db.select().from(customers).where(eq(customers.email, parsed.data.email)).limit(1);
  if (!c || !(await checkPassword(parsed.data.password, c.passwordHash))) return { message: "Incorrect email or password." };
  await createCustomerSession(c.id, c.email);
  redirect(safeNext(formData.get("next")));
}

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`register:${ip}`, 5, 60 * 60_000)) return { message: "Too many sign-ups from this connection. Please try later." };
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    marketing: formData.get("marketing") === "on",
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const { name, email, password, marketing } = parsed.data;
  const [exists] = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, email)).limit(1);
  if (exists) return { errors: { email: "An account with this email already exists. Try signing in." } };
  const [res] = await db.insert(customers).values({ name, email, passwordHash: await hashPassword(password), marketingOptIn: Boolean(marketing) });
  if (marketing) await db.insert(subscribers).ignore().values({ email, source: "register" });
  await createCustomerSession(res.insertId, email);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await destroyCustomerSession();
  redirect("/");
}

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const s = await requireCustomer();
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 30);
  if (name.length < 2) return { errors: { name: "Enter your name" } };
  await db.update(customers).set({ name, phone: phone || null }).where(eq(customers.id, s.id));
  return { ok: true, message: "Profile saved." };
}

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const s = await requireCustomer();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  if (next.length < 8) return { errors: { password: "Use at least 8 characters" } };
  const [c] = await db.select().from(customers).where(eq(customers.id, s.id)).limit(1);
  if (!c || !(await checkPassword(current, c.passwordHash))) return { errors: { current: "Current password is incorrect" } };
  await db.update(customers).set({ passwordHash: await hashPassword(next) }).where(eq(customers.id, s.id));
  return { ok: true, message: "Password updated." };
}

export async function saveAddress(_: FormState, formData: FormData): Promise<FormState> {
  const s = await requireCustomer();
  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const d = parsed.data;
  await db.insert(addresses).values({ ...d, customerId: s.id, label: d.label ?? "", company: d.company || null, apt: d.apt || null });
  revalidatePath("/account");
  return { ok: true, message: "Address saved." };
}

export async function deleteAddress(formData: FormData) {
  const s = await requireCustomer();
  const id = Number(formData.get("id"));
  if (id) await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, s.id)));
  redirect("/account?tab=addresses");
}
