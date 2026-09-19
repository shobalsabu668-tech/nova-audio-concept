import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About",
  description: "NØVA designs speakers in Bengaluru: fewer parts, one material, and sound that doesn't need you to sit in the right place.",
  alternates: { canonical: "/about" },
};

const principles = [
  { title: "One material", body: "Every body is machined from a single piece of aluminium. It lasts, it recycles, and it doesn't need decoration." },
  { title: "No sweet spot", body: "Omnidirectional drivers mean the sound is right wherever you are, not only on the sofa." },
  { title: "Nothing to learn", body: "No app required, no pairing rituals. Hold the top for three seconds; that's the manual." },
  { title: "Built to be repaired", body: "Batteries and drivers are replaceable, and every part is available for eight years after a product is discontinued." },
];

export default function AboutPage() {
  return (
    <main id="main" className="flex-1">
      <section className="shell grid gap-10 pb-16 pt-12 md:pt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="t-eyebrow">About NØVA</p>
          <h1 className="t-display mt-5">Why do good speakers look like equipment?</h1>
        </div>
        <p className="t-lead self-end lg:col-span-4 lg:col-start-9">
          NØVA was started in {site.city} to answer that question. Every product since has been the same answer, refined: fewer
          parts, one material, and sound that fills a room without asking you to sit in the right place.
        </p>
      </section>

      <section aria-label="The range, together" className="shell">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-paper md:aspect-[21/9]">
          <div className="absolute inset-x-[6%] bottom-[10%] top-[14%] flex items-end justify-between gap-[2%]">
            {[
              ["nova-stand-graphite-0", 0.9],
              ["nova-one-bone-0", 0.62],
              ["nova-arc-graphite-0", 0.34],
              ["nova-orb-ember-0", 0.34],
              ["nova-mini-ion-0", 0.26],
              ["nova-sub-bone-0", 0.52],
            ].map(([src, h]) => (
              <div key={src as string} className="relative flex-1" style={{ height: `${(h as number) * 100}%` }}>
                <Image src={`/renders/${src}.webp`} alt="" fill sizes="16vw" className="object-contain object-bottom" />
              </div>
            ))}
          </div>
          <p className="t-mono absolute left-6 top-6 text-graphite-soft">The NØVA range · rendered from the same 3D models as every page</p>
        </div>
      </section>

      <section aria-labelledby="principles" className="section">
        <div className="shell">
          <h2 id="principles" className="t-h2 max-w-[18ch]">
            Four things we won&rsquo;t compromise on.
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} className="card p-8" data-reveal style={{ "--d": i } as React.CSSProperties}>
                <p className="t-mono text-graphite-soft">0{i + 1}</p>
                <h3 className="t-h3 mt-8">{p.title}</h3>
                <p className="t-body mt-3 max-w-md">{p.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/shop" className="btn btn-dark mt-12">
            Shop the range <Arrow size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
