import Image from "next/image";
import Link from "next/link";
import { finishes, type Finish } from "@/lib/catalogue";

const shown: Finish[] = ["graphite", "bone", "ember"];

/** FINISHES — the same object, three ways. Each opens ONE in that finish. */
export function FinishesShowcase() {
  return (
    <section aria-labelledby="finishes-title" className="section">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="t-eyebrow" data-reveal>
              Three finishes
            </p>
            <h2 id="finishes-title" className="t-h2 mt-3" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
              One piece of aluminium, finished three ways.
            </h2>
          </div>
          <p className="t-lead self-end lg:col-span-5 lg:col-start-8" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            Every body is machined from a single billet, then bead-blasted, anodised or ceramic-coated by hand. The
            fourth finish, Ion, is made in small batches for MINI.
          </p>
        </div>
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {shown.map((f, i) => (
            <li key={f} data-reveal style={{ "--d": i } as React.CSSProperties}>
              <Link href={`/products/nova-one?finish=${f}`} className="card group block overflow-hidden">
                <div className="relative aspect-[4/5] bg-bone-2/60">
                  <Image src={`/renders/nova-one-${f}-1.webp`} alt={`NØVA ONE in ${finishes[f].name}`} fill sizes="(min-width: 768px) 32vw, 90vw" className="object-contain p-[12%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-2" />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-[640]">{finishes[f].name}</p>
                    <p className="text-[0.88rem] text-graphite-soft">{finishes[f].note}</p>
                  </div>
                  <span aria-hidden="true" className="size-6 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]" style={{ background: finishes[f].swatch }} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
