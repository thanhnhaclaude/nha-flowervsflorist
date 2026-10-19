import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth";
import { pageMeta } from "@/lib/seo";
import { RegisterForm } from "../forms";

export const metadata = pageMeta({ title: "Create an Account", description: "Create your FlowerVsFlorist account.", path: "/account/register", noindex: true });

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/account" } = await searchParams;
  if (await getCustomerSession()) redirect("/account");
  return (
    <div className="bg-blush">
      <div className="container-x flex justify-center py-12 md:py-20">
        <div className="card w-full max-w-md p-6 md:p-8">
          <h1 className="mb-1 text-3xl font-bold text-plum-700">Create your account</h1>
          <p className="mb-6 text-muted">Save addresses, keep a wishlist and track every order.</p>
          <RegisterForm next={next} />
        </div>
      </div>
    </div>
  );
}
