import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";
import { LoginForm } from "../forms";

export const metadata = pageMeta({ title: "Sign In", description: "Sign in to your FlowerVsFlorist account.", path: "/account/login", noindex: true });

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/account" } = await searchParams;
  if (await getCustomerSession()) redirect("/account");
  return (
    <div className="bg-blush">
      <div className="container-x flex justify-center py-12 md:py-20">
        <div className="card w-full max-w-md p-6 md:p-8">
          <h1 className="mb-1 text-3xl font-bold text-plum-700">Welcome back</h1>
          <p className="mb-6 text-muted">Sign in to track orders and check out faster.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
