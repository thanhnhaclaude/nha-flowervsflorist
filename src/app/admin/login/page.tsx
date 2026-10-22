import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Lock } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { createAdminSession, getAdmin, verifyAdmin } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign in", robots: { index: false } };

async function signIn(formData: FormData) {
  "use server";
  if (!rateLimit(`admin-login:${clientIp(await headers())}`, 8, 15 * 60_000)) redirect("/admin/login?error=rate");
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!(await verifyAdmin(username, password))) redirect("/admin/login?error=1");
  await createAdminSession(username);
  redirect("/admin");
}

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const configured = Boolean(env("ADMIN_PASSWORD_HASH"));
  return (
    <main className="grid min-h-screen place-items-center bg-plum-900 p-4">
      <form action={signIn} className="w-full max-w-sm rounded-[1.5rem] bg-white p-8 shadow-lift">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <div>
            <h1 className="font-display text-2xl font-bold text-plum-700">Admin</h1>
            <p className="text-sm text-muted">FlowerVsFlorist control panel</p>
          </div>
        </div>
        {!configured && <p className="mb-4 rounded-xl bg-gold-soft p-3 text-sm font-semibold text-plum-800">ADMIN_PASSWORD_HASH is not set. Run `npm run hash-password` and add it to the environment.</p>}
        {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error === "rate" ? "Too many attempts. Wait 15 minutes." : "Incorrect username or password."}</p>}
        <label className="label" htmlFor="username">Username</label>
        <input id="username" name="username" className="field mb-4" autoComplete="username" required defaultValue="admin" />
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="field mb-6" autoComplete="current-password" required />
        <button className="btn btn-plum w-full"><Lock className="h-4 w-4" /> Sign in</button>
      </form>
    </main>
  );
}
