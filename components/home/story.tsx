import Image from "next/image";
import Link from "next/link";
import { Arrow, Return, Shield, Truck } from "@/components/ui/icons";

const promises = [
  { icon: Truck, title: "Free delivery", body: "Across India on orders over ₹5,000." },
  { icon: Return, title: "30-day returns", body: "Collected from your door, refunded in full." },
  { icon: Shield, title: "Two-year warranty", body: "Repair or replace, no receipt needed." },
];

/** STORY + PROMISES — who makes NØVA, and what buying from them is like. */
export function Story() {
  return (
    <>
      <section aria-labelledby="story-title" className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-graphite lg:col-span-6">
            <div className="absolute inset-0 grid grid-cols-3 items-end gap-2 p-[8%]">
              {["nova-mini-bone-0", "nova-orb-ember-0", "nova-dock-graphite-0"].map((src, i) => (
                <div key={src} className="relative" style={{ aspectRatio: "4 / 5", transform: `translateY(${[0, -18, 8][i]}%)` }}>
                  <Image src={`/renders/${src}.webp`} alt="" fill sizes="(min-width: 1024px) 15vw, 30vw" className="object-contain" />
                </div>
              ))}
            </div>
            <p className="t-mono absolute left-6 top-6 text-bone/70">Studio · Bengaluru</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="t-eyebrow" data-reveal>
              About NØVA
            </p>
            <h2 id="story-title" className="t-h2 mt-3" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
              Designed in Bengaluru, by people who listen closely.
            </h2>
            <p className="t-lead mt-6" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
              NØVA started with one question: why do good speakers look like equipment? Every product since has been an
              answer: fewer parts, one material, and sound that doesn&rsquo;t need you to sit in the right place.
            </p>
            <Link href="/about" className="btn btn-ghost mt-8">
              Our story <Arrow size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Our promises" className="border-y border-graphite/10 bg-paper">
        <ul className="shell grid divide-graphite/10 sm:grid-cols-3 sm:divide-x">
          {promises.map((p) => (
            <li key={p.title} className="flex items-start gap-4 py-8 sm:px-8 sm:first:pl-0">
              <p.icon size={24} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-[620]">{p.title}</p>
                <p className="text-[0.92rem] text-graphite-soft">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
