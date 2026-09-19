"use client";

import Link from "next/link";
import { useState } from "react";
import { getProduct, finishes, type Finish } from "@/lib/catalogue";
import { formatMoney } from "@/lib/format";
import { site } from "@/lib/site";
import { ProductViewer } from "@/components/three/product-viewer";
import { Swatches } from "@/components/product/swatches";
import { Arrow } from "@/components/ui/icons";

/**
 * HERO — the flagship, live. Changing the finish here changes the real-time
 * model beside it; the rendered still is the first paint and the fallback.
 */
export function Hero() {
  const one = getProduct("nova-one")!;
  const [finish, setFinish] = useState<Finish>("graphite");
  const variant = one.variants.find((v) => v.finish === finish)!;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="shell grid min-h-[calc(100svh-var(--header-h)-var(--bar-h))] items-center gap-6 py-10 lg:grid-cols-12 lg:py-0">
        <div className="relative z-10 lg:col-span-5">
          <p className="t-eyebrow rise flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" /> Designed in {site.city}
          </p>
          <h1 id="hero-title" className="t-display rise mt-5 !text-[clamp(3rem,6.4vw,6.75rem)]" style={{ "--d": 1 } as React.CSSProperties}>
            Quiet objects. Enormous sound.
          </h1>
          <p className="t-lead rise mt-6 max-w-md" style={{ "--d": 2 } as React.CSSProperties}>
            NØVA ONE fills a room from anywhere in it: 360° sound in a single piece of machined aluminium.
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-5" style={{ "--d": 3 } as React.CSSProperties}>
            <Swatches variants={one.variants} value={finish} onChange={setFinish} label="NØVA ONE finish" />
          </div>

          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": 4 } as React.CSSProperties}>
            <Link href={`/products/nova-one?finish=${finish}`} className="btn btn-primary">
              Shop NØVA ONE · {formatMoney(variant.price)}
            </Link>
            <Link href="/shop" className="btn btn-ghost">
              Explore the range <Arrow size={15} />
            </Link>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {finishes[finish].name}.
          </p>
        </div>

        <div className="relative -mx-[var(--gutter)] aspect-square lg:col-span-7 lg:mx-0 lg:aspect-auto lg:h-[min(86svh,54rem)]">
          <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,#fff_0%,rgb(255_255_255/0.4)_55%,transparent_100%)]" />
          <ProductViewer product={one} finish={finish} eager priority className="absolute inset-0" sizes="(min-width: 1024px) 58vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
