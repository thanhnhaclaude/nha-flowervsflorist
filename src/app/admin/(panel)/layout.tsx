import Link from "next/link";
import { ExternalLink, Flower2, LayoutDashboard, LogOut, Mail, MessageSquare, Newspaper, Package, Star, Tag, Users } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { destroyAdminSession, requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/products", label: "Products", icon: Flower2 },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/posts", label: "Blog posts", icon: Newspaper },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

async function signOut() {
  "use server";
  await destroyAdminSession();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f7f3f5] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-plum-900 text-plum-100 lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 px-5 py-5">
          <LogoMark className="h-9 w-9" />
          <span className="font-display text-lg font-bold text-white">FvF Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-white/10 hover:text-white">
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden space-y-1 border-t border-white/10 px-3 py-4 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
            <ExternalLink className="h-4 w-4" /> View store
          </Link>
          <form action={signOut}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Sign out ({admin.username})
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
