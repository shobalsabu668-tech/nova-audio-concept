"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { finishes, type Finish, type Product } from "@/lib/catalogue";
import { angleLabels, ANGLE_COUNT, renderSrc } from "@/lib/renders";
import { cn, formatMoney } from "@/lib/format";
import { reviewsFor } from "@/lib/reviews";
import { useCart } from "@/components/cart/cart-context";
import { Qty } from "@/components/cart/qty";
import { ProductViewer } from "@/components/three/product-viewer";
import { Swatches } from "./swatches";
import { StockNote } from "./stock-note";
import { DeliveryCheck } from "./delivery-check";
import { Stars } from "./stars";
import { Return, Shield, Truck } from "@/components/ui/icons";

/**
 * PRODUCT DETAIL — the configurator and buy box. The chosen finish is in the
 * URL (?finish=), so a link shares the exact configuration, and the 3D
 * model, stills, price, stock and bag button all follow it.
 */
export function ProductDetailFromUrl({ product }: { product: Product }) {
  const initial = useSearchParams().get("finish") as Finish | null;
  return <ProductDetail key={initial ?? "default"} product={product} initial={initial} />;
}

/** Rendered statically with the default finish (initial = null), then from the URL. */
export function ProductDetail({ product, initial }: { product: Product; initial: Finish | null }) {
  const [finish, setFinishState] = useState<Finish>(() => (initial && product.variants.some((v) => v.finish === initial) ? initial : (product.variants.find((v) => v.availableForSale) ?? product.variants[0]).finish));
  const [view, setView] = useState<"3d" | number>("3d");
  const [qty, setQty] = useState(1);
  const { add, setOpen, maxFor } = useCart();
  const buy = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  const variant = product.variants.find((v) => v.finish === finish)!;
  const { average, list } = reviewsFor(product.handle);

  const setFinish = (f: Finish) => {
    setFinishState(f);
    setQty(1);
    const url = new URL(window.location.href);
    url.searchParams.set("finish", f);
    window.history.replaceState(null, "", url);
  };

  useEffect(() => {
    const el = buy.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToBag = () => {
    add(variant.id, qty);
    setOpen(true);
  };

  return (
    <>
      <div className="shell grid gap-10 pb-16 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-10">
        {/* Stage */}
        <div className="lg:col-span-7">
          <div className="card relative aspect-square overflow-hidden bg-bone-2/70 lg:sticky lg:top-24">
            {view === "3d" ? (
              <ProductViewer product={product} finish={finish} withHotspots eager priority className="absolute inset-0" sizes="(min-width: 1024px) 55vw, 100vw" />
            ) : (
              <Image
                key={`${finish}-${view}`}
                src={renderSrc(product, finish, view)}
                alt={`${product.title} in ${finishes[finish].name}, ${angleLabels[view].toLowerCase()}`}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="page-in object-contain p-[8%]"
              />
            )}
          </div>
          <div role="group" aria-label="Views" className="relative mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setView("3d")}
              aria-pressed={view === "3d"}
              className={cn("t-mono grid size-20 shrink-0 place-items-center rounded-2xl border bg-paper transition-colors", view === "3d" ? "border-graphite" : "border-transparent hover:border-graphite/25")}
            >
              3D
            </button>
            {Array.from({ length: ANGLE_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setView(i)}
                aria-pressed={view === i}
                aria-label={angleLabels[i]}
                className={cn("relative size-20 shrink-0 rounded-2xl border bg-paper transition-colors", view === i ? "border-graphite" : "border-transparent hover:border-graphite/25")}
              >
                <Image src={renderSrc(product, finish, i)} alt="" fill sizes="80px" className="object-contain p-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <p className="t-eyebrow">{product.productType === "Speaker" ? "Speaker" : "Accessory"}</p>
            <h1 className="mt-3 text-[clamp(2.4rem,4.4vw,3.6rem)] font-[720] leading-[0.95] tracking-[-0.035em] [font-stretch:115%]">{product.title}</h1>
            <p className="t-lead mt-3">{product.tagline}</p>
            {list.length ? (
              <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-[0.9rem] text-graphite-soft hover:text-graphite">
                <Stars value={average} />
                <span>
                  {average.toFixed(1)} · {list.length} sample reviews
                </span>
              </a>
            ) : null}

            <p className="t-price mt-6 text-[1.7rem]">
              {formatMoney(variant.price)}
              <span className="ml-2 text-[0.85rem] font-[400] text-graphite-soft">incl. GST</span>
            </p>

            <div className="mt-8">
              <Swatches variants={product.variants} value={finish} onChange={setFinish} />
              <p className="mt-2 text-[0.85rem] text-graphite-soft">{finishes[finish].note}</p>
            </div>

            <StockNote variant={variant} className="mt-6" />

            <div ref={buy} className="mt-5 flex items-center gap-3">
              {variant.availableForSale ? (
                <>
                  <Qty value={qty} max={maxFor(variant.id)} onChange={(n) => setQty(Math.max(1, n))} label={product.title} />
                  <button type="button" onClick={addToBag} className="btn btn-primary flex-1">
                    Add to bag · {formatMoney(variant.price.amount * qty)}
                  </button>
                </>
              ) : (
                <button type="button" disabled className="btn flex-1">
                  Sold out in {finishes[finish].name}
                </button>
              )}
            </div>
            {!variant.availableForSale ? (
              <p className="mt-3 text-[0.9rem] text-graphite-soft">
                Available in{" "}
                {product.variants
                  .filter((v) => v.availableForSale)
                  .map((v) => finishes[v.finish].name)
                  .join(" and ")}
                .
              </p>
            ) : null}

            <div className="mt-6">
              <DeliveryCheck />
            </div>

            <ul className="mt-6 grid gap-3 text-[0.9rem]">
              <li className="flex items-center gap-3">
                <Truck size={18} /> Free delivery across India over ₹5,000
              </li>
              <li className="flex items-center gap-3">
                <Return size={18} /> 30-day returns, collected from your door
              </li>
              <li className="flex items-center gap-3">
                <Shield size={18} /> 2-year warranty
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile buy bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-graphite/10 bg-paper/95 p-3 backdrop-blur transition-transform duration-500 lg:hidden",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showBar}
        inert={!showBar}
      >
        <div className="flex items-center gap-3">
          <span className="relative size-12 shrink-0 rounded-xl bg-bone">
            <Image src={renderSrc(product, finish, 0)} alt="" fill sizes="48px" className="object-contain p-1" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.92rem] font-[620]">{product.title}</span>
            <span className="t-price block text-[0.85rem] text-graphite-soft">
              {finishes[finish].name} · {formatMoney(variant.price)}
            </span>
          </span>
          <button type="button" onClick={addToBag} disabled={!variant.availableForSale} className={cn("btn min-h-11 px-5", variant.availableForSale && "btn-primary")}>
            {variant.availableForSale ? "Add to bag" : "Sold out"}
          </button>
        </div>
      </div>
    </>
  );
}
