"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/format";
import { useCart } from "@/components/cart/cart-context";
import { Bag, Close, Search } from "@/components/ui/icons";
import { SearchDialog } from "./search-dialog";

/**
 * HEADER — sticky, calm. The bag shows a live count that pops when
 * something is added; search opens with the button, "/" or Ctrl/⌘ K.
 */
export function Header() {
  const pathname = usePathname();
  const { count, setOpen, notice } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [pop, setPop] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!notice?.variantId) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 500);
    return () => clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearch(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Read the ?type= filter on the client (keeps the header out of Suspense,
  // so it's in the static HTML), and follow in-page URL changes on /shop.
  const [type, setType] = useState<string | null>(null);
  useEffect(() => {
    setMenu(false);
    const read = () => setType(new URLSearchParams(window.location.search).get("type"));
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("nova:url", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("nova:url", read);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const trigger = menuBtn.current;
    document.documentElement.style.overflow = "hidden";
    const items = () => Array.from(menuPanel.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key !== "Tab") return;
      const list = items();
      if (e.shiftKey && document.activeElement === list[0]) {
        e.preventDefault();
        list[list.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === list[list.length - 1]) {
        e.preventDefault();
        list[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [menu]);

  const active = (href: string) => {
    const [path, query] = href.split("?");
    if (path !== pathname) return false;
    if (query) return query === `type=${type}`;
    return path !== "/shop" || !type;
  };

  return (
    <header data-chrome className={cn("sticky top-0 z-50 transition-colors duration-300", scrolled ? "border-b border-graphite/10 bg-bone/85 backdrop-blur-lg" : "border-b border-transparent bg-bone")}>
      <div className="shell flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="text-[1.25rem] font-[760] tracking-[-0.02em] [font-stretch:120%]" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>

        <nav aria-label="Main" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={active(n.href) ? "page" : undefined}
                  className="rounded-full px-3.5 py-2 text-[0.92rem] font-[520] transition-colors hover:bg-graphite/5 aria-[current=page]:bg-graphite aria-[current=page]:text-bone"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearch(true)}
            className="flex h-11 items-center gap-2 rounded-full px-3 text-[0.9rem] text-graphite-soft transition-colors hover:bg-graphite/5 hover:text-graphite"
            aria-label="Search products"
            aria-keyshortcuts="/ Control+K Meta+K"
          >
            <Search size={19} />
            <span className="hidden xl:inline">Search</span>
            <kbd className="t-mono hidden rounded border border-graphite/15 px-1.5 py-0.5 xl:inline">/</kbd>
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-graphite/5"
            aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <Bag size={21} />
            {count > 0 ? (
              <span
                className={cn(
                  "t-price absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-ion-deep px-1 text-[0.68rem] leading-5 text-white",
                  pop && "animate-[pop_500ms_var(--ease-out)]",
                )}
                aria-hidden="true"
              >
                {count}
              </span>
            ) : null}
          </button>
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            aria-controls="nova-menu"
            className="ml-1 h-11 rounded-full px-3 text-[0.92rem] font-[560] lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {menu ? (
        <div id="nova-menu" ref={menuPanel} role="dialog" aria-modal="true" aria-label="Menu" className="page-in fixed inset-0 z-[70] flex flex-col bg-bone">
          <div className="shell flex h-[var(--header-h)] items-center justify-between">
            <span className="text-[1.25rem] font-[760] tracking-[-0.02em] [font-stretch:120%]">{site.name}</span>
            <button type="button" onClick={() => setMenu(false)} className="grid size-11 place-items-center rounded-full hover:bg-graphite/5" aria-label="Close menu">
              <Close />
            </button>
          </div>
          <nav aria-label="Menu" className="shell mt-8">
            <ul className="space-y-1">
              {[{ href: "/", label: "Home" }, ...nav].map((n, i) => (
                <li key={n.href} className="rise" style={{ "--d": i } as React.CSSProperties}>
                  <Link href={n.href} className="t-h2 block py-2" onClick={() => setMenu(false)}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}

      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </header>
  );
}
