import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Heart, LogOut, MapPin, Package, Trash2, User } from "lucide-react";
import { addresses, customers, db, orders } from "@/lib/db";
import { requireCustomer } from "@/lib/auth";
import { formatDate, usd } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { STATUS_LABEL } from "@/components/order-view";
import { deleteAddress, logout } from "./actions";
import { AddressForm, PasswordForm, ProfileForm } from "./forms";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "My Account", description: "Your orders, addresses and profile.", path: "/account", noindex: true });

const TABS = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "profile", label: "Profile", icon: User },
];

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await requireCustomer("/account");
  const tab = (await searchParams).tab ?? "orders";
  const [[me], myOrders, myAddresses] = await Promise.all([
    db.select().from(customers).where(eq(customers.id, session.id)).limit(1),
    db.select().from(orders).where(eq(orders.customerId, session.id)).orderBy(desc(orders.createdAt)).limit(50),
    db.select().from(addresses).where(eq(addresses.customerId, session.id)),
  ]);
  if (!me) return null;

  return (
    <div className="bg-blush">
      <div className="container-x py-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">My account</p>
            <h1 className="mt-1 text-4xl font-bold text-plum-700">Hello, {me.name.split(" ")[0]}!</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/wishlist" className="btn btn-outline btn-sm">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
            <form action={logout}>
              <button className="btn btn-sm border-2 border-line bg-white">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Account sections" className="mb-6 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <Link key={t.key} href={`/account?tab=${t.key}`} aria-current={tab === t.key ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-bold ${tab === t.key ? "bg-plum-600 text-white" : "bg-white text-ink hover:bg-petal"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </Link>
          ))}
        </nav>

        {tab === "orders" && (
          <section className="card overflow-hidden">
            {myOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-display text-2xl font-bold text-plum-700">No orders yet</p>
                <Link href="/best-sellers" className="btn btn-primary mt-5">
                  Send Your First Bouquet
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {myOrders.map((o) => (
                  <li key={o.id}>
                    <Link href={`/order/${o.code}`} className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-blush">
                      <span>
                        <span className="block font-extrabold">{o.code}</span>
                        <span className="text-sm text-muted">
                          To {o.recipientName} · {o.city}, {o.state} · {formatDate(o.deliveryDate)}
                        </span>
                      </span>
                      <span className="flex items-center gap-4">
                        <span className="rounded-full bg-petal px-3 py-1 text-xs font-extrabold text-plum-700">{STATUS_LABEL[o.status]}</span>
                        <span className="font-extrabold">{usd(o.total)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "addresses" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-3">
              {myAddresses.length === 0 && <p className="card p-6 text-muted">No saved addresses yet. Add one to speed up checkout.</p>}
              {myAddresses.map((a) => (
                <div key={a.id} className="card flex justify-between gap-4 p-5">
                  <address className="not-italic">
                    {a.label && <span className="block text-sm font-extrabold uppercase tracking-wider text-rose-600">{a.label}</span>}
                    <span className="font-bold">{a.recipientName}</span> · {a.recipientPhone}
                    <br />
                    {a.street}
                    {a.apt ? `, ${a.apt}` : ""}, {a.city}, {a.state} {a.zip}
                  </address>
                  <form action={deleteAddress}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-blush hover:text-danger" aria-label={`Delete address for ${a.recipientName}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}
            </section>
            <section className="card p-6">
              <h2 className="mb-4 font-display text-2xl font-bold text-plum-700">Add an address</h2>
              <AddressForm />
            </section>
          </div>
        )}

        {tab === "profile" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card p-6">
              <h2 className="mb-1 font-display text-2xl font-bold text-plum-700">Profile</h2>
              <p className="mb-4 text-sm text-muted">{me.email}</p>
              <ProfileForm name={me.name} phone={me.phone} />
            </section>
            <section className="card p-6">
              <h2 className="mb-4 font-display text-2xl font-bold text-plum-700">Change password</h2>
              <PasswordForm />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
