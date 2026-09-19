"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { finishes } from "@/lib/catalogue";
import { formatMoney, cn } from "@/lib/format";
import { renderSrc } from "@/lib/renders";
import { site } from "@/lib/site";
import { useCart } from "./cart-context";
import { Qty } from "./qty";
import { Arrow, Close } from "@/components/ui/icons";

/**
 * BAG DRAWER — opens on add, and confirms exactly what was added (finish
 * and quantity) without leaving the page. Focus is trapped while open and
 * returned to whatever opened it.
 */
export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, subtotal, shipping, count, notice, maxFor } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const toFree = Math.max(0, site.freeShippingOver - subtotal);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div data-chrome className="fixed inset-0 z-[90]">
      <div className="page-in absolute inset-0 bg-graphite/35 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md animate-[slide-in_500ms_var(--ease-out)] flex-col bg-paper shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-graphite/10 px-6 py-5">
          <h2 id="bag-title" className="text-[1.15rem] font-[640]">
            Your bag <span className="t-price text-graphite-soft">({count})</span>
          </h2>
          <button type="button" data-autofocus onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-graphite/5" aria-label="Close bag">
            <Close size={18} />
          </button>
        </div>

        {count > 0 ? (
          <div className="border-b border-graphite/10 px-6 py-4">
            <p className="text-[0.88rem]">
              {toFree > 0 ? (
                <>
                  <span className="t-price">{formatMoney(toFree)}</span> away from free delivery
                </>
              ) : (
                "Free delivery across India is unlocked."
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bone-2" aria-hidden="true">
              <div className="h-full rounded-full bg-ion-deep transition-[width] duration-700" style={{ width: `${Math.min(100, (subtotal / site.freeShippingOver) * 100)}%` }} />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length ? (
            <ul className="divide-y divide-graphite/10">
              {lines.map((l) => {
                const fresh = notice?.variantId === l.variantId;
                const label = `${l.product.title}, ${finishes[l.variant.finish].name}`;
                return (
                  <li key={l.variantId} className={cn("flex gap-4 py-5 transition-colors", fresh && "animate-[page-in_600ms_var(--ease-out)]")}>
                    <Link href={`/products/${l.product.handle}?finish=${l.variant.finish}`} onClick={() => setOpen(false)} className="relative size-24 shrink-0 rounded-2xl bg-bone" tabIndex={-1} aria-hidden="true">
                      <Image src={renderSrc(l.product, l.variant.finish)} alt="" fill sizes="96px" className="object-contain p-2" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/products/${l.product.handle}?finish=${l.variant.finish}`} onClick={() => setOpen(false)} className="font-[620] hover:underline">
                            {l.product.title}
                          </Link>
                          <p className="mt-0.5 flex items-center gap-2 text-[0.88rem] text-graphite-soft">
                            <span className="size-3 rounded-full border border-graphite/20" style={{ background: finishes[l.variant.finish].swatch }} aria-hidden="true" />
                            {finishes[l.variant.finish].name}
                          </p>
                        </div>
                        <p className="t-price">{formatMoney(l.total)}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Qty size="sm" value={l.qty} max={maxFor(l.variantId)} onChange={(n) => setQty(l.variantId, n)} label={label} />
                        <button type="button" onClick={() => remove(l.variantId)} className="text-[0.85rem] text-graphite-soft underline underline-offset-4 hover:text-graphite">
                          Remove <span className="sr-only">{label}</span>
                        </button>
                      </div>
                      {fresh ? <p className="mt-2 text-[0.82rem] text-ok">Just added</p> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid h-full place-content-center gap-4 text-center">
              <p className="text-graphite-soft">Your bag is empty.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-dark mx-auto">
                Browse the range
              </Link>
            </div>
          )}
        </div>

        {lines.length ? (
          <div className="border-t border-graphite/10 px-6 py-5">
            <dl className="space-y-1.5 text-[0.95rem]">
              <div className="flex justify-between">
                <dt className="text-graphite-soft">Subtotal</dt>
                <dd className="t-price">{formatMoney(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-graphite-soft">Delivery</dt>
                <dd className="t-price">{shipping ? formatMoney(shipping) : "Free"}</dd>
              </div>
            </dl>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-ghost">
                View bag
              </Link>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary">
                Checkout <Arrow size={15} />
              </Link>
            </div>
            <p className="mt-3 text-center text-[0.78rem] text-graphite-soft">Prices include GST. A concept store: nothing will be charged.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
