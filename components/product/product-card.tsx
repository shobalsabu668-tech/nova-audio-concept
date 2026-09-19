"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { defaultVariant, finishes, type Finish, type Product } from "@/lib/catalogue";
import { cn, formatMoney } from "@/lib/format";
import { renderSrc } from "@/lib/renders";
import { useCart } from "@/components/cart/cart-context";
import { Swatches } from "./swatches";
import { Plus } from "@/components/ui/icons";

/**
 * PRODUCT CARD — the render changes with the chosen finish, a second angle
 * shows on hover, and "Add" puts exactly that finish in the bag.
 */
export function ProductCard({ product, priority = false, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" }: { product: Product; priority?: boolean; sizes?: string }) {
  const { add, setOpen } = useCart();
  const [finish, setFinish] = useState<Finish>(defaultVariant(product).finish);
  const variant = product.variants.find((v) => v.finish === finish) ?? defaultVariant(product);
  const href = `/products/${product.handle}?finish=${finish}`;
  const isNew = product.tags.includes("new");

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden" aria-labelledby={`card-${product.handle}`}>
      <Link href={href} className="relative block aspect-[4/5] bg-bone-2/60" tabIndex={-1} aria-hidden="true">
        <Image
          src={renderSrc(product, finish, 0)}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-[9%] transition-all duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] group-hover:opacity-0"
        />
        <Image
          src={renderSrc(product, finish, 1)}
          alt=""
          fill
          sizes={sizes}
          className="object-contain p-[9%] opacity-0 transition-all duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03] group-hover:opacity-100"
        />
        {isNew ? <span className="t-eyebrow absolute left-4 top-4 rounded-full bg-paper px-2.5 py-1 !text-graphite">New</span> : null}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id={`card-${product.handle}`} className="text-[1.1rem] font-[640] tracking-[-0.01em]">
              <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                {product.title}
              </Link>
            </h3>
            <p className="mt-1 text-[0.9rem] text-graphite-soft">{product.tagline}</p>
          </div>
          <p className="t-price shrink-0">{formatMoney(variant.price)}</p>
        </div>

        <div className="relative z-10 mt-auto flex items-center justify-between gap-3">
          <Swatches variants={product.variants} value={finish} onChange={setFinish} size="sm" showName={false} label={`${product.title} finish`} />
          <button
            type="button"
            disabled={!variant.availableForSale}
            onClick={() => {
              add(variant.id);
              setOpen(true);
            }}
            className={cn("btn min-h-10 px-4 text-[0.88rem]", variant.availableForSale ? "btn-dark" : "")}
          >
            {variant.availableForSale ? (
              <>
                <Plus size={14} /> Add<span className="sr-only"> {product.title} in {finishes[finish].name} to bag</span>
              </>
            ) : (
              <>
                Sold out<span className="sr-only"> in {finishes[finish].name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
