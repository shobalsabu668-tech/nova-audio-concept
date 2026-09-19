import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { defaultVariant, getProduct, products } from "@/lib/catalogue";
import { renderSrc } from "@/lib/renders";
import { formatMoney } from "@/lib/format";
import { reviewsFor, REVIEWS_DISCLAIMER } from "@/lib/reviews";
import { ProductDetail, ProductDetailFromUrl } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product/product-card";
import { Stars } from "@/components/product/stars";
import { Faq } from "@/components/ui/faq";
import { productFaq } from "@/lib/support";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const p = getProduct((await params).handle);
  if (!p) return {};
  const v = defaultVariant(p);
  return {
    title: p.title,
    description: `${p.tagline} ${formatMoney(v.price)}. ${p.description[0]}`,
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: { images: [{ url: renderSrc(p, v.finish, 0) }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const product = getProduct((await params).handle);
  if (!product) notFound();
  const pairs = product.pairsWith.map((h) => getProduct(h)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const others = products.filter((p) => p.handle !== product.handle && !product.pairsWith.includes(p.handle) && p.productType === "Speaker");
  const related = [...pairs, ...others].slice(0, 3);
  const { list, average, distribution } = reviewsFor(product.handle);

  return (
    <main id="main" className="flex-1">
      <nav aria-label="Breadcrumb" className="shell pt-6">
        <ol className="flex items-center gap-2 text-[0.85rem] text-graphite-soft">
          <li>
            <Link href="/shop" className="hover:text-graphite hover:underline">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop?type=${product.productType.toLowerCase()}`} className="hover:text-graphite hover:underline">
              {product.productType === "Speaker" ? "Speakers" : "Accessories"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-graphite">
            {product.title}
          </li>
        </ol>
      </nav>

      <Suspense fallback={<ProductDetail product={product} initial={null} />}>
        <ProductDetailFromUrl product={product} />
      </Suspense>

      <section aria-labelledby="story" className="section bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 id="story" className="t-h2">
              {product.tagline}
            </h2>
          </div>
          <div className="space-y-5 lg:col-span-6 lg:col-start-7">
            {product.description.map((d) => (
              <p key={d} className="t-lead">
                {d}
              </p>
            ))}
          </div>
        </div>
        <ul className="shell mt-16 grid gap-4 md:grid-cols-3">
          {product.highlights.map((h, i) => (
            <li key={h.title} className="rounded-[22px] bg-bone p-7" data-reveal style={{ "--d": i } as React.CSSProperties}>
              <p className="t-mono text-graphite-soft">0{i + 1}</p>
              <h3 className="t-h3 mt-6">{h.title}</h3>
              <p className="t-body mt-3">{h.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="specs" className="section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="specs" className="t-h2">
              Specifications
            </h2>
            <h3 className="t-eyebrow mt-10">In the box</h3>
            <ul className="mt-4 space-y-2">
              {product.inTheBox.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <dl className="divide-y divide-graphite/10 border-y border-graphite/10 lg:col-span-7 lg:col-start-6">
            {product.specs.map((s) => (
              <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 py-4 sm:grid-cols-[12rem_1fr]">
                <dt className="t-eyebrow pt-0.5">{s.label}</dt>
                <dd className="t-mono !text-[0.85rem] text-graphite">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {list.length ? (
        <section id="reviews" aria-labelledby="reviews-title" className="section scroll-mt-24 bg-paper">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <h2 id="reviews-title" className="t-h2">
                What people say
              </h2>
              <p className="mt-4 rounded-xl bg-bone px-4 py-3 text-[0.88rem] text-graphite-soft">{REVIEWS_DISCLAIMER}</p>
              <div className="mt-8 flex items-center gap-4">
                <span className="text-[3rem] font-[680] leading-none tracking-[-0.03em]">{average.toFixed(1)}</span>
                <div>
                  <Stars value={average} size={16} />
                  <p className="mt-1 text-[0.88rem] text-graphite-soft">from {list.length} sample reviews</p>
                </div>
              </div>
              <dl className="mt-6 space-y-2">
                {distribution.map((d) => (
                  <div key={d.stars} className="flex items-center gap-3 text-[0.85rem]">
                    <dt className="w-12 text-graphite-soft">{d.stars} stars</dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bone-2" aria-hidden="true">
                        <span className="block h-full rounded-full bg-graphite" style={{ width: `${(d.count / list.length) * 100}%` }} />
                      </span>
                      <span className="t-price w-4 text-right">{d.count}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className="grid gap-4 lg:col-span-7 lg:col-start-6">
              {list.map((r, i) => (
                <li key={i} className="rounded-[22px] bg-bone p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Stars value={r.rating} />
                    <span className="t-mono text-graphite-soft">{r.finish}</span>
                  </div>
                  <h3 className="mt-4 text-[1.1rem] font-[620]">{r.title}</h3>
                  <p className="t-body mt-2">{r.body}</p>
                  <p className="mt-4 text-[0.85rem] text-graphite-soft">
                    {r.name}, {r.city} · <span className="italic">illustrative</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="pfaq" className="section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <h2 id="pfaq" className="t-h2 lg:col-span-4">
            Questions
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={productFaq(product)} />
          </div>
        </div>
      </section>

      {related.length ? (
        <section aria-labelledby="related" className="section bg-paper">
          <div className="shell">
            <h2 id="related" className="t-h2">
              {pairs.length ? "Pairs well with" : "You might also like"}
            </h2>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.handle}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
      {/* Room for the mobile buy bar at the very end of the page. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </main>
  );
}
