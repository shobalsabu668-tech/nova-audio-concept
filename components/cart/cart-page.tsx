"use client";

import Image from "next/image";
import Link from "next/link";
import { finishes, products, defaultVariant } from "@/lib/catalogue";
import { formatMoney } from "@/lib/format";
import { renderSrc } from "@/lib/renders";
import { site } from "@/lib/site";
import { useCart } from "./cart-context";
import { Qty } from "./qty";
import { Arrow, Plus } from "@/components/ui/icons";

export function CartPage() {
  const { lines, subtotal, shipping, total, count, setQty, remove, maxFor, add, ready } = useCart();
  const inBag = new Set(lines.map((l) => l.product.handle));
  const suggestions = lines
    .flatMap((l) => l.product.pairsWith)
    .filter((h, i, all) => !inBag.has(h) && all.indexOf(h) === i)
    .map((h) => products.find((p) => p.handle === h)!)
    .slice(0, 2);

  return (
    <div className="shell pb-[var(--section)] pt-10 md:pt-16">
      <h1 className="t-h2">Your bag</h1>
      {!ready ? (
        <div className="mt-10 h-64 animate-pulse rounded-[22px] bg-paper" aria-busy="true" />
      ) : lines.length === 0 ? (
        <div className="card mt-10 grid place-items-center gap-5 p-16 text-center">
          <p className="t-lead">Your bag is empty.</p>
          <Link href="/shop" className="btn btn-dark">
            Browse the range
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <ul className="divide-y divide-graphite/10 border-y border-graphite/10">
              {lines.map((l) => {
                const label = `${l.product.title}, ${finishes[l.variant.finish].name}`;
                return (
                  <li key={l.variantId} className="flex gap-5 py-6">
                    <Link href={`/products/${l.product.handle}?finish=${l.variant.finish}`} className="relative size-28 shrink-0 rounded-2xl bg-paper sm:size-36" tabIndex={-1} aria-hidden="true">
                      <Image src={renderSrc(l.product, l.variant.finish)} alt="" fill sizes="144px" className="object-contain p-3" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link href={`/products/${l.product.handle}?finish=${l.variant.finish}`} className="text-[1.1rem] font-[640] hover:underline">
                            {l.product.title}
                          </Link>
                          <p className="text-[0.9rem] text-graphite-soft">
                            {finishes[l.variant.finish].name} · {formatMoney(l.variant.price)} each
                          </p>
                        </div>
                        <p className="t-price text-[1.1rem]">{formatMoney(l.total)}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-5 pt-4">
                        <Qty value={l.qty} max={maxFor(l.variantId)} onChange={(n) => setQty(l.variantId, n)} label={label} />
                        <button type="button" onClick={() => remove(l.variantId)} className="text-[0.88rem] text-graphite-soft underline underline-offset-4 hover:text-graphite">
                          Remove <span className="sr-only">{label}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {suggestions.length ? (
              <section aria-labelledby="pairs" className="mt-12">
                <h2 id="pairs" className="t-h3">
                  Goes with what&rsquo;s in your bag
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {suggestions.map((p) => {
                    const v = defaultVariant(p);
                    return (
                      <li key={p.handle} className="card flex items-center gap-4 p-4">
                        <span className="relative size-20 shrink-0">
                          <Image src={renderSrc(p, v.finish)} alt="" fill sizes="80px" className="object-contain" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <Link href={`/products/${p.handle}`} className="block font-[620] hover:underline">
                            {p.title}
                          </Link>
                          <span className="t-price block text-[0.9rem] text-graphite-soft">{formatMoney(v.price)}</span>
                        </span>
                        <button type="button" onClick={() => add(v.id)} className="btn btn-ghost min-h-10 px-4 text-[0.88rem]">
                          <Plus size={13} /> Add <span className="sr-only">{p.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
          </div>

          <aside aria-labelledby="summary" className="lg:col-span-4">
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 id="summary" className="text-[1.15rem] font-[640]">
                Summary
              </h2>
              <dl className="mt-5 space-y-2 text-[0.95rem]">
                <div className="flex justify-between">
                  <dt className="text-graphite-soft">
                    Subtotal ({count} {count === 1 ? "item" : "items"})
                  </dt>
                  <dd className="t-price">{formatMoney(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-graphite-soft">Standard delivery</dt>
                  <dd className="t-price">{shipping ? formatMoney(shipping) : "Free"}</dd>
                </div>
                <div className="flex justify-between border-t border-graphite/10 pt-3 text-[1.15rem]">
                  <dt className="font-[620]">Total</dt>
                  <dd className="t-price">{formatMoney(total)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[0.82rem] text-graphite-soft">Prices include GST.</p>
              {shipping ? (
                <p className="mt-4 rounded-xl bg-bone px-4 py-3 text-[0.88rem]">
                  Add <span className="t-price">{formatMoney(site.freeShippingOver - subtotal)}</span> more for free delivery.
                </p>
              ) : null}
              <Link href="/checkout" className="btn btn-primary mt-6 w-full">
                Checkout <Arrow size={15} />
              </Link>
              <p className="mt-3 text-center text-[0.8rem] text-graphite-soft">A concept store: nothing will be charged.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
