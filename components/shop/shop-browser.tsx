"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { defaultVariant, finishes, products, type Finish, type Product } from "@/lib/catalogue";
import { cn, plural } from "@/lib/format";
import { ProductCard } from "@/components/product/product-card";
import { Close } from "@/components/ui/icons";

type Filters = { type: string | null; use: string | null; room: string | null; finish: Finish | null; sort: string };

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
];

const groups: { key: keyof Omit<Filters, "sort">; label: string; options: { value: string; label: string }[] }[] = [
  { key: "type", label: "Type", options: [{ value: "speaker", label: "Speakers" }, { value: "accessory", label: "Accessories" }] },
  { key: "use", label: "Use", options: [{ value: "home", label: "At home" }, { value: "portable", label: "On the move" }] },
  {
    key: "room",
    label: "Room size",
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  { key: "finish", label: "Finish", options: (Object.keys(finishes) as Finish[]).map((f) => ({ value: f, label: finishes[f].name })) },
];

/** Update the URL in place (Next syncs useSearchParams) and tell the header. */
function go(url: string) {
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event("nova:url"));
}

function apply(list: Product[], f: Filters): Product[] {
  const out = list.filter(
    (p) =>
      (!f.type || p.productType.toLowerCase() === f.type) &&
      (!f.use || p.tags.includes(f.use as "home" | "portable")) &&
      (!f.room || p.room === f.room) &&
      (!f.finish || p.variants.some((v) => v.finish === f.finish)),
  );
  const price = (p: Product) => defaultVariant(p).price.amount;
  if (f.sort === "price-asc") out.sort((a, b) => price(a) - price(b));
  if (f.sort === "price-desc") out.sort((a, b) => price(b) - price(a));
  if (f.sort === "newest") out.sort((a, b) => b.released.localeCompare(a.released));
  return out;
}

/**
 * SHOP — filters by what people ask ("for a small room", "to take out"),
 * not by internal catalogue structure. Everything lives in the URL.
 */
export function ShopBrowser() {
  const params = useSearchParams();
  return <ShopView search={params.toString()} />;
}

/** The listing for a given query string. Rendered statically with "" (the full range) so first paint never shifts. */
export function ShopView({ search }: { search: string }) {
  const params = new URLSearchParams(search);
  const pathname = "/shop";
  const f: Filters = {
    type: params.get("type"),
    use: params.get("use"),
    room: params.get("room"),
    finish: params.get("finish") as Finish | null,
    sort: params.get("sort") ?? "featured",
  };
  const results = useMemo(() => apply(products, f), [f.type, f.use, f.room, f.finish, f.sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const active = groups.flatMap((g) => (f[g.key] ? [{ key: g.key, label: g.options.find((o) => o.value === f[g.key])?.label ?? "" }] : []));

  const set = (key: keyof Filters, value: string | null) => {
    const q = new URLSearchParams(params.toString());
    if (value && !(key === "sort" && value === "featured")) q.set(key, value);
    else q.delete(key);
    const s = q.toString();
    go(s ? `${pathname}?${s}` : pathname);
  };

  const heading = f.type === "speaker" ? "Speakers" : f.type === "accessory" ? "Accessories" : "The range";

  return (
    <div className="shell pb-[var(--section)]">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 pt-10 md:pt-16">
        <div>
          <p className="t-eyebrow">Shop</p>
          <h1 className="t-h2 mt-3">{heading}</h1>
        </div>
        <label className="flex items-center gap-3 text-[0.92rem]">
          <span className="text-graphite-soft">Sort by</span>
          <select value={f.sort} onChange={(e) => set("sort", e.target.value)} className="field-input min-h-11 w-auto cursor-pointer rounded-full py-2 pr-8">
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar [mask-image:linear-gradient(90deg,#000_85%,transparent)] lg:flex-col lg:gap-8 lg:overflow-visible lg:[mask-image:none]">
            {groups.map((g) => (
              <fieldset key={g.key} className="shrink-0">
                <legend className="t-eyebrow mb-3">{g.label}</legend>
                <div className="flex gap-2 lg:flex-wrap">
                  {g.options.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={f[g.key] === o.value}
                      onClick={() => set(g.key, f[g.key] === o.value ? null : o.value)}
                      className="chip shrink-0"
                    >
                      {g.key === "finish" ? (
                        <span aria-hidden="true" className="size-3.5 rounded-full border border-graphite/20" style={{ background: finishes[o.value as Finish].swatch }} />
                      ) : null}
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <h2 className="sr-only">Products</h2>
          <div className="mb-6 flex min-h-10 flex-wrap items-center gap-2">
            <p className="mr-2 text-[0.92rem] text-graphite-soft" aria-live="polite">
              {plural(results.length, "product")}
            </p>
            {active.map((a) => (
              <button key={a.key} type="button" onClick={() => set(a.key, null)} className="chip !min-h-8 bg-paper !px-3 text-[0.85rem]">
                {a.label} <Close size={12} />
                <span className="sr-only">remove filter</span>
              </button>
            ))}
            {active.length > 1 ? (
              <button
                type="button"
                onClick={() => go(f.sort !== "featured" ? `${pathname}?sort=${f.sort}` : pathname)}
                className="text-[0.85rem] underline underline-offset-4"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {results.length ? (
            <ul className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3")}>
              {results.map((p, i) => (
                <li key={p.handle} className="page-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <ProductCard product={p} priority={i < 3} sizes="(min-width: 1280px) 26vw, (min-width: 640px) 40vw, 90vw" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card grid place-items-center gap-4 p-16 text-center">
              <p className="text-graphite-soft">Nothing matches all of those filters.</p>
              <button type="button" onClick={() => go(pathname)} className="btn btn-dark">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
