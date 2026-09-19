import Link from "next/link";
import { products } from "@/lib/catalogue";
import { ProductCard } from "@/components/product/product-card";
import { Arrow } from "@/components/ui/icons";

/** THE RANGE — five speakers, one design language. */
export function Range() {
  const speakers = products.filter((p) => p.productType === "Speaker");
  return (
    <section aria-labelledby="range-title" className="section bg-paper">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-eyebrow" data-reveal>
              The range
            </p>
            <h2 id="range-title" className="t-h2 mt-3 max-w-[16ch]" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
              Five speakers. One way of building them.
            </h2>
          </div>
          <Link href="/shop" className="btn btn-ghost" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            Shop all <Arrow size={15} />
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((p, i) => (
            <li key={p.handle} className={i === 0 ? "lg:row-span-1" : ""} data-reveal style={{ "--d": i } as React.CSSProperties}>
              <ProductCard product={p} />
            </li>
          ))}
          <li data-reveal style={{ "--d": 5 } as React.CSSProperties}>
            <Link href="/shop?type=accessory" className="card group flex h-full min-h-72 flex-col justify-between bg-graphite p-7 text-bone">
              <p className="t-eyebrow !text-bone/70">Accessories</p>
              <div>
                <p className="t-h3">DOCK and STAND</p>
                <p className="mt-2 text-bone/75">Put MINI on your desk and ONE at ear height.</p>
                <p className="mt-6 inline-flex items-center gap-2 font-[600]">
                  Shop accessories <Arrow size={15} className="transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
