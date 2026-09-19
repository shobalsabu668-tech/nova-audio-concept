import type { Metadata } from "next";
import { author, site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About this concept",
  description: `NØVA is a self-initiated concept storefront by ${author.name}: what was built, how, and what is simulated.`,
  alternates: { canonical: "/concept" },
};

const built = [
  ["Real-time 3D products", "Every product is modelled in code with Three.js (lathe-turned bodies, procedural grilles, physically based finishes), with no downloaded 3D files."],
  ["Rendered product photography", "A script photographs the same 3D models from three angles in every finish: 57 transparent product shots, all consistent, none from a photo shoot."],
  ["Configurator", "Finishes ease between materials on the live model. The chosen finish is in the URL, so a link shares the exact configuration."],
  ["Shopify-shaped catalogue", "Products, options, variants and money follow the Storefront API's shapes, so the store could connect to a real Shopify backend."],
  ["Cart that never surprises", "One reducer shared by cards, product pages, the drawer, the bag and checkout. Stock limits, free-delivery progress and live announcements for screen readers."],
  ["Checkout", "One page with inline validation, Indian address and PIN handling, delivery dates from the PIN code, and payment choices without collecting any payment details."],
  ["Discovery", "Filters by use and room size (not catalogue structure), URL-synced sorting, a keyboard-driven search (press /), and a room-size advisor."],
  ["Performance & access", "The 3D loads only when needed and only on capable devices, with the rendered still as first paint and fallback. Keyboard and screen-reader support throughout."],
];

const simulated = [
  "NØVA, its products, prices, specifications and stock are fictional.",
  "The reviews are sample content written for the concept, and are labelled as such.",
  "Nothing can be bought. The bag lives in your browser; checkout details never leave the page.",
  "Delivery dates come from a simple table of PIN-code zones, not a courier.",
];

export default function ConceptPage() {
  return (
    <main id="main" className="flex-1">
      <section className="bg-graphite text-bone">
        <div className="shell pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="t-eyebrow !text-bone/60">About this concept</p>
          <h1 className="t-display mt-5 max-w-[14ch]">A store for products that don&rsquo;t exist.</h1>
          <p className="t-lead mt-8 max-w-2xl !text-bone/80">
            {site.name} is a self-initiated concept by {author.name}, a creative web developer in Bengaluru. It shows what a
            premium e-commerce experience can be when the product is interactive rather than photographed, and when the path
            to checkout never surprises you. It is not a real brand and not client work.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={author.caseStudy} className="btn bg-bone text-graphite hover:bg-white">
              Read the case study <ArrowUpRight />
            </a>
            <a href={author.repo} className="btn border border-bone/30 hover:border-bone">
              View the source code <ArrowUpRight />
            </a>
            <a href={author.portfolio} className="btn border border-bone/30 hover:border-bone">
              Work with {author.name.split(" ")[0]} <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="built" className="section">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="built" className="t-h2">
              What was built
            </h2>
            <p className="t-body mt-5">Next.js 15, React 19, TypeScript, Tailwind CSS 4, Three.js with React Three Fiber, and sharp for the image pipeline.</p>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {built.map(([k, v]) => (
              <div key={k} className="card p-6">
                <dt className="font-[640]">{k}</dt>
                <dd className="t-body mt-2 text-[0.95rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="sim" className="section bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 id="sim" className="t-h2 lg:col-span-4">
            What is simulated
          </h2>
          <ul className="space-y-3 lg:col-span-7 lg:col-start-6">
            {simulated.map((s) => (
              <li key={s} className="flex gap-4 border-b border-graphite/10 pb-4 text-[1.05rem]">
                <span aria-hidden="true" className="mt-[0.7em] h-0.5 w-3 shrink-0 rounded bg-ion-deep" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
