import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

export const ADMIN_COOKIE = "fvf_admin";
export const CUSTOMER_COOKIE = "fvf_session";
const ADMIN_MAX_AGE = 60 * 60 * 12;
const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const s = env("AUTH_SECRET");
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV !== "production") return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret");
    throw new Error("AUTH_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(s);
}

async function sign(payload: Record<string, unknown>, maxAge: number) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${maxAge}s`).sign(secret());
}

async function verify(token: string | undefined) {
  if (!token) return null;
  try {
    return (await jwtVerify(token, secret())).payload;
  } catch {
    return null;
  }
}

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

// ───────────── Admin ─────────────

/** ADMIN_PASSWORD_HASH is base64 of a bcrypt hash ("$" breaks .env files); a raw bcrypt hash also works. */
function adminHash() {
  const raw = env("ADMIN_PASSWORD_HASH");
  if (!raw) return null;
  return raw.startsWith("$2") ? raw : Buffer.from(raw, "base64").toString("utf8");
}

export async function verifyAdmin(username: string, password: string) {
  const hash = adminHash();
  if (!hash) return false;
  const ok = await bcrypt.compare(password, hash);
  return ok && username === (env("ADMIN_USERNAME") || "admin");
}

export async function createAdminSession(username: string) {
  (await cookies()).set(ADMIN_COOKIE, await sign({ sub: username, role: "admin" }, ADMIN_MAX_AGE), cookieOpts(ADMIN_MAX_AGE));
}

export async function destroyAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function getAdmin() {
  const p = await verify((await cookies()).get(ADMIN_COOKIE)?.value);
  return p?.role === "admin" ? { username: String(p.sub) } : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

// ───────────── Customers ─────────────

export const hashPassword = (pw: string) => bcrypt.hash(pw, 11);
export const checkPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

/** Readable by the browser so cached pages can show the signed-in header; holds no identity. */
const SIGNED_IN_FLAG = "fvf_in";

export async function createCustomerSession(id: number, email: string) {
  const jar = await cookies();
  jar.set(CUSTOMER_COOKIE, await sign({ sub: String(id), email, role: "customer" }, CUSTOMER_MAX_AGE), cookieOpts(CUSTOMER_MAX_AGE));
  jar.set(SIGNED_IN_FLAG, "1", { ...cookieOpts(CUSTOMER_MAX_AGE), httpOnly: false });
}

export async function destroyCustomerSession() {
  const jar = await cookies();
  jar.delete(CUSTOMER_COOKIE);
  jar.delete(SIGNED_IN_FLAG);
}

export async function getCustomerSession() {
  const p = await verify((await cookies()).get(CUSTOMER_COOKIE)?.value);
  return p?.role === "customer" ? { id: Number(p.sub), email: String(p.email) } : null;
}

export async function requireCustomer(next = "/account") {
  const s = await getCustomerSession();
  if (!s) redirect(`/account/login?next=${encodeURIComponent(next)}`);
  return s;
}
