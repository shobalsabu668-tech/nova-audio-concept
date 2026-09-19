"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { defaultVariant, finishes, products } from "@/lib/catalogue";
import { formatMoney, cn } from "@/lib/format";
import { renderSrc } from "@/lib/renders";
import { Close, Search } from "@/components/ui/icons";

/**
 * SEARCH — a combobox over the catalogue. Matches names, taglines, types,
 * finishes and use ("portable", "bedside"…); arrow keys move through
 * results, Enter opens one.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return products.filter((p) => p.productType === "Speaker");
    return products.filter((p) => {
      const hay = [p.title, p.tagline, ...p.description, p.productType, ...p.tags, p.room ?? "", ...p.variants.map((v) => finishes[v.finish].name), ...p.highlights.map((h) => h.title)]
        .join(" ")
        .toLowerCase()
        .replace("ø", "o");
      return terms.every((t) => hay.includes(t.replace("ø", "o")));
    });
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => input.current?.focus());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (handle: string) => {
    onClose();
    setQ("");
    router.push(`/products/${handle}`);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-graphite/40 p-3 pt-[10vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby={`${id}-label`} className="page-in w-full max-w-xl overflow-hidden rounded-[22px] bg-paper shadow-2xl">
        <div className="flex items-center gap-3 border-b border-graphite/10 px-5">
          <Search size={20} className="shrink-0 text-graphite-soft" />
          <label id={`${id}-label`} htmlFor={`${id}-input`} className="sr-only">
            Search products
          </label>
          <input
            ref={input}
            id={`${id}-input`}
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-activedescendant={results[active] ? `${id}-opt-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(results.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active].handle);
              }
            }}
            placeholder="Try “portable”, “bedside” or “bone”"
            className="h-16 w-full bg-transparent text-[1.05rem] outline-none placeholder:text-graphite-soft"
          />
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-graphite/5" aria-label="Close search">
            <Close size={18} />
          </button>
        </div>
        <p className="t-eyebrow px-5 pb-1 pt-4" aria-live="polite">
          {q ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Speakers"}
        </p>
        <ul id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-[55vh] overflow-y-auto p-2">
          {results.map((p, i) => {
            const v = defaultVariant(p);
            return (
              <li
                key={p.handle}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(p.handle)}
                className={cn("flex cursor-pointer items-center gap-4 rounded-2xl p-2.5", i === active && "bg-bone-2")}
              >
                <span className="relative size-14 shrink-0 rounded-xl bg-bone">
                  <Image src={renderSrc(p, v.finish)} alt="" fill sizes="56px" className="object-contain p-1.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-[620]">{p.title}</span>
                  <span className="block truncate text-[0.88rem] text-graphite-soft">{p.tagline}</span>
                </span>
                <span className="t-price shrink-0 text-[0.92rem]">{formatMoney(v.price)}</span>
              </li>
            );
          })}
          {!results.length ? <li className="p-6 text-center text-graphite-soft">Nothing matches “{q}”. Try a finish or a room.</li> : null}
        </ul>
      </div>
    </div>
  );
}
