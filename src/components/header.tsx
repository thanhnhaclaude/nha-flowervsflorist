"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, Truck, User, X } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "./cart/cart-context";
import { useWishlist } from "./wishlist-context";
import { mainMenu, type MenuItem } from "@/lib/menu";
import { img } from "@/lib/format";
import { site } from "@/lib/site";

function SearchForm({ id, onDone }: { id: string; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        if (!q.trim()) return;
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        onDone?.();
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search flowers and gifts
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search roses, birthday, sympathy…"
        className="h-12 w-full rounded-full border-2 border-plum-100 bg-blush pl-5 pr-14 text-[0.95rem] placeholder:text-muted focus:border-plum-600 focus:bg-white focus:outline-none"
      />
      <button type="submit" aria-label="Search" className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-plum-600 text-white hover:bg-plum-700">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}

function MegaMenu({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  return (
    <div className="absolute inset-x-0 top-full z-40 border-t border-line bg-white shadow-lift animate-fade-up [animation-duration:0.2s]">
      <div className="container-x grid grid-cols-[1fr_280px] gap-10 py-8">
        <div className="grid grid-cols-3 gap-8">
          {item.groups?.map((g) => (
            <div key={g.title}>
              <p className="eyebrow mb-3">{g.title}</p>
              <ul className="space-y-1">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={onNavigate} className="block rounded-lg py-1.5 font-semibold text-ink hover:text-rose-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {item.feature && (
          <Link href={item.feature.href} onClick={onNavigate} className="group relative block overflow-hidden rounded-2xl">
            <Image src={img(item.feature.image)} alt="" width={280} height={220} className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-plum-900/80 via-plum-900/10 to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 text-white">
              <span className="block font-display text-xl font-bold">{item.feature.title}</span>
              <span className="text-sm text-plum-100">{item.feature.text} →</span>
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

export function Header({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { count, setDrawerOpen } = useCart();
  const wishlist = useWishlist();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menus on navigation
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(null), setMobile(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobile]);

  const enter = (label: string) => {
    clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="border-b border-line">
        <div className="container-x flex h-[68px] items-center gap-2 sm:gap-4 lg:h-20 lg:gap-8">
          <button className="-ml-2 grid h-11 w-11 place-items-center rounded-full hover:bg-blush lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
            <Logo />
          </Link>
          <div className="hidden flex-1 lg:block lg:max-w-xl">
            <SearchForm id="search-desktop" />
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a href={`tel:${site.phone}`} className="mr-2 hidden items-center gap-2 xl:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf-soft text-leaf">
                <Phone className="h-[18px] w-[18px]" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-muted">Order by phone</span>
                <span className="font-extrabold text-ink">{site.phoneDisplay}</span>
              </span>
            </a>
            <Link href={signedIn ? "/account" : "/account/login"} className="grid h-11 w-11 place-items-center rounded-full hover:bg-blush" aria-label={signedIn ? "My account" : "Sign in"}>
              <User className="h-[22px] w-[22px]" />
            </Link>
            <Link href="/wishlist" className="relative hidden h-11 w-11 place-items-center rounded-full hover:bg-blush sm:grid" aria-label={`Wishlist (${wishlist.ids.length})`}>
              <Heart className="h-[22px] w-[22px]" />
              {wishlist.ids.length > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-600" />}
            </Link>
            <button onClick={() => setDrawerOpen(true)} className="relative flex h-11 items-center gap-2 rounded-full bg-plum-600 pl-3.5 pr-4 text-white hover:bg-plum-700" aria-label={`Cart, ${count} items`}>
              <ShoppingBag className="h-5 w-5" />
              <span className="font-extrabold tabular-nums">{count}</span>
            </button>
          </div>
        </div>
        <div className="container-x pb-3 lg:hidden">
          <SearchForm id="search-mobile" />
        </div>
      </div>

      {/* Desktop navigation */}
      <nav aria-label="Main" className="relative hidden border-b border-line lg:block" onMouseLeave={leave}>
        <ul className="container-x flex items-center gap-1">
          {mainMenu.map((item) => (
            <li key={item.label} onMouseEnter={() => (item.groups ? enter(item.label) : setOpen(null))}>
              {item.groups ? (
                <button
                  className={`flex h-12 items-center gap-1 rounded-lg px-3 font-bold transition-colors ${open === item.label ? "text-rose-600" : "text-ink hover:text-rose-600"}`}
                  aria-expanded={open === item.label}
                  onClick={() => setOpen(open === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${open === item.label ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex h-12 items-center gap-1.5 rounded-lg px-3 font-bold transition-colors ${item.highlight ? "text-leaf hover:text-plum-700" : "text-ink hover:text-rose-600"} ${pathname === item.href ? "text-rose-600" : ""}`}
                >
                  {item.highlight && <Truck className="h-4 w-4" />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {mainMenu.map((item) =>
          item.groups && open === item.label ? (
            <div key={item.label} onMouseEnter={() => enter(item.label)}>
              <MegaMenu item={item} onNavigate={() => setOpen(null)} />
            </div>
          ) : null,
        )}
      </nav>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-plum-900/50" aria-label="Close menu" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-lift animate-fade-up [animation-duration:0.25s]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <Logo />
              <button className="grid h-11 w-11 place-items-center rounded-full hover:bg-blush" onClick={() => setMobile(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
              {mainMenu.map((item) => (
                <div key={item.label} className="border-b border-line/70">
                  {item.groups ? (
                    <>
                      <button className="flex min-h-12 w-full items-center justify-between px-3 text-left text-lg font-bold" aria-expanded={mobileGroup === item.label} onClick={() => setMobileGroup(mobileGroup === item.label ? null : item.label)}>
                        {item.label}
                        <ChevronDown className={`h-5 w-5 transition-transform ${mobileGroup === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {mobileGroup === item.label && (
                        <div className="pb-3 pl-3">
                          {item.groups.map((g) => (
                            <div key={g.title} className="mb-2">
                              <p className="eyebrow px-3 py-1">{g.title}</p>
                              {g.links.map((l) => (
                                <Link key={l.href} href={l.href} className="block min-h-11 rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-blush">
                                  {l.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} className={`flex min-h-12 items-center px-3 text-lg font-bold ${item.highlight ? "text-leaf" : ""}`}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="mt-4 space-y-1 px-3 text-[0.95rem] font-semibold">
                <Link href="/track-order" className="block py-2">Track order</Link>
                <Link href="/wishlist" className="block py-2">Wishlist</Link>
                <Link href="/contact" className="block py-2">Contact us</Link>
              </div>
            </nav>
            <a href={`tel:${site.phone}`} className="m-4 btn btn-plum">
              <Phone className="h-5 w-5" /> Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
