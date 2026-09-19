/**
 * SITE — the fictional brand, and the real person who built it.
 * NØVA does not exist; contact details use the reserved `.example` domain.
 */

export const site = {
  name: "NØVA",
  plainName: "NOVA",
  tagline: "Quiet objects. Enormous sound.",
  description:
    "NØVA is a concept storefront for a fictional audio brand designed in Bengaluru: speakers modelled in real-time 3D, a configurator, and a calm, predictable path from browsing to checkout.",
  email: "hello@nova-audio.example",
  city: "Bengaluru",
  freeShippingOver: 5000,
};

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?type=speaker", label: "Speakers" },
  { href: "/shop?type=accessory", label: "Accessories" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export const author = {
  name: "Shobal Sabu",
  role: "Creative web developer",
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://github.com/shobalsabu668-tech",
  caseStudy: process.env.NEXT_PUBLIC_PORTFOLIO_URL
    ? `${process.env.NEXT_PUBLIC_PORTFOLIO_URL.replace(/\/$/, "")}/work/nova`
    : "https://github.com/shobalsabu668-tech",
  repo: "https://github.com/shobalsabu668-tech/nova-audio-concept",
};

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
