import type { Metadata } from "next";
import { faqs, policies } from "@/lib/support";
import { site } from "@/lib/site";
import { Faq } from "@/components/ui/faq";

export const metadata: Metadata = {
  title: "Support",
  description: "Delivery, returns, warranty and answers to common questions about NØVA speakers.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <main id="main" className="flex-1">
      <section className="shell pb-10 pt-12 md:pt-20">
        <p className="t-eyebrow">Support</p>
        <h1 className="t-h2 mt-4 max-w-[16ch]">Straight answers, before and after you buy.</h1>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
          {policies.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="chip">
              {p.title}
            </a>
          ))}
          <a href="#faq" className="chip">
            FAQ
          </a>
        </nav>
      </section>

      <div className="shell grid gap-4 pb-12 md:grid-cols-3">
        {policies.map((p) => (
          <section key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="card scroll-mt-24 p-7">
            <h2 id={`${p.id}-title`} className="t-h3">
              {p.title}
            </h2>
            <div className="mt-4 space-y-3">
              {p.body.map((b) => (
                <p key={b} className="t-body">
                  {b}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section id="faq" aria-labelledby="faq-title" className="section scroll-mt-24 bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="t-h2">
              FAQ
            </h2>
            <p className="t-body mt-4">
              Still stuck? Write to{" "}
              <a href={`mailto:${site.email}`} className="link">
                {site.email}
              </a>
              . (It&rsquo;s a concept, so nobody will reply.)
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
