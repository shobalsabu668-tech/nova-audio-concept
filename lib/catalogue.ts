/**
 * CATALOGUE
 * ────────────────────────────────────────────────────────────────────────────
 * Shaped like Shopify's Storefront API (product → options → variants, money
 * as { amount, currencyCode }), so the storefront could be pointed at a real
 * Shopify store by replacing this file with API calls. Nothing else in the UI
 * would need to change.
 *
 * NØVA is fictional. Prices, stock and specifications are invented for the
 * concept; nothing can be bought.
 */

export type Finish = "graphite" | "bone" | "ember" | "ion";
export type ModelId = "one" | "mini" | "arc" | "orb" | "sub" | "dock" | "stand";
export type Money = { amount: number; currencyCode: "INR" };

export type Variant = {
  id: string;
  title: string;
  finish: Finish;
  price: Money;
  availableForSale: boolean;
  /** Units left; shown as "Only n left" when low. */
  quantityAvailable: number;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  productType: "Speaker" | "Accessory";
  model: ModelId;
  tagline: string;
  description: string[];
  tags: ("home" | "portable" | "new" | "bestseller")[];
  room: "small" | "medium" | "large" | null;
  options: { name: "Finish"; values: Finish[] }[];
  variants: Variant[];
  highlights: { title: string; body: string }[];
  specs: { label: string; value: string }[];
  inTheBox: string[];
  /** Month the product was released, for "Newest" sorting. */
  released: string;
  /** Other handles that pair with this product. */
  pairsWith: string[];
};

export const finishes: Record<Finish, { name: string; swatch: string; note: string }> = {
  graphite: { name: "Graphite", swatch: "#2b2d31", note: "Anodised aluminium, bead-blasted" },
  bone: { name: "Bone", swatch: "#d8d2c5", note: "Matte ceramic-coated aluminium" },
  ember: { name: "Ember", swatch: "#c4532b", note: "Anodised, deep burnt orange" },
  ion: { name: "Ion", swatch: "#3552d6", note: "Limited finish, electric blue" },
};

const inr = (amount: number): Money => ({ amount, currencyCode: "INR" });

function variants(handle: string, price: number, stock: Partial<Record<Finish, number>>): Variant[] {
  return (Object.keys(stock) as Finish[]).map((finish) => ({
    id: `${handle}-${finish}`,
    title: finishes[finish].name,
    finish,
    price: inr(price),
    availableForSale: (stock[finish] ?? 0) > 0,
    quantityAvailable: stock[finish] ?? 0,
  }));
}

const finishOption = (v: Variant[]) => [{ name: "Finish" as const, values: v.map((x) => x.finish) }];

function product(p: Omit<Product, "options" | "id"> & { id?: string }): Product {
  return { ...p, id: p.id ?? `nova-${p.handle}`, options: finishOption(p.variants) };
}

export const products: Product[] = [
  product({
    handle: "nova-one",
    title: "NØVA ONE",
    productType: "Speaker",
    model: "one",
    tagline: "360° sound for the room you live in.",
    description: [
      "ONE fills a room from anywhere in it. Three tweeters and a down-firing woofer radiate sound evenly in every direction, so there is no wrong place to put it and no sweet spot to sit in.",
      "The body is a single piece of machined aluminium, and the grille is laser-perforated with 11,000 holes. It looks like an object, not a gadget.",
    ],
    tags: ["home", "bestseller"],
    room: "medium",
    variants: variants("nova-one", 29900, { graphite: 42, bone: 18, ember: 3 }),
    highlights: [
      { title: "360° sound", body: "An omnidirectional waveguide spreads sound evenly, so every seat is the best one." },
      { title: "Room tuning", body: "Microphones measure the room once and tune the output to it." },
      { title: "Plays with the range", body: "Pair two ONEs for stereo, or add SUB for the low end." },
    ],
    specs: [
      { label: "Drivers", value: '1 × 4" woofer · 3 × 1" tweeters' },
      { label: "Power", value: "60 W" },
      { label: "Frequency", value: "45 Hz – 20 kHz" },
      { label: "Connectivity", value: "Wi-Fi 6 · Bluetooth 5.3 · USB-C audio" },
      { label: "Power supply", value: "Mains, 100–240 V" },
      { label: "Size", value: "124 × 124 × 170 mm" },
      { label: "Weight", value: "1.9 kg" },
    ],
    inTheBox: ["NØVA ONE", "2 m braided power cable", "Quick-start card"],
    released: "2025-10",
    pairsWith: ["nova-sub", "nova-stand"],
  }),
  product({
    handle: "nova-mini",
    title: "NØVA MINI",
    productType: "Speaker",
    model: "mini",
    tagline: "Pocketable. Waterproof. Twenty hours.",
    description: [
      "MINI takes the ONE's sound and fits it in a jacket pocket. It's waterproof to a metre, survives a drop onto tile, and plays for twenty hours on a charge.",
      "Put it on the dock and it becomes a desk speaker; take it off and it goes wherever you do.",
    ],
    tags: ["portable", "bestseller"],
    room: "small",
    variants: variants("nova-mini", 14900, { graphite: 64, bone: 31, ember: 12, ion: 5 }),
    highlights: [
      { title: "20-hour battery", body: "A full day and a night of music, with USB-C fast charging." },
      { title: "IP67", body: "Dust-tight and waterproof to one metre for thirty minutes." },
      { title: "Party pairing", body: "Link up to eight MINIs to play the same music together." },
    ],
    specs: [
      { label: "Drivers", value: '1 × 2" full-range · passive radiator' },
      { label: "Battery", value: "20 hours · USB-C fast charge" },
      { label: "Protection", value: "IP67" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Size", value: "86 × 86 × 94 mm" },
      { label: "Weight", value: "330 g" },
    ],
    inTheBox: ["NØVA MINI", "USB-C cable", "Quick-start card"],
    released: "2025-06",
    pairsWith: ["nova-dock"],
  }),
  product({
    handle: "nova-arc",
    title: "NØVA ARC",
    productType: "Speaker",
    model: "arc",
    tagline: "Wide stereo from a single speaker.",
    description: [
      "ARC is for big rooms and long evenings. Two woofers and four tweeters, angled across an oval body, throw a stereo image far wider than the speaker itself.",
      "It sits on a sideboard or under a screen, and fills an open-plan space without ever sounding loud.",
    ],
    tags: ["home"],
    room: "large",
    variants: variants("nova-arc", 39900, { graphite: 9, bone: 6, ember: 0 }),
    highlights: [
      { title: "True stereo", body: "Left and right channels from one cabinet, angled for width." },
      { title: "Big-room bass", body: "Twin 4.5-inch woofers reach down to 38 Hz." },
      { title: "Under a screen", body: "Low and wide enough to sit beneath a television." },
    ],
    specs: [
      { label: "Drivers", value: '2 × 4.5" woofers · 4 × 1" tweeters' },
      { label: "Power", value: "120 W" },
      { label: "Frequency", value: "38 Hz – 20 kHz" },
      { label: "Connectivity", value: "Wi-Fi 6 · Bluetooth 5.3 · HDMI eARC" },
      { label: "Size", value: "420 × 180 × 150 mm" },
      { label: "Weight", value: "4.6 kg" },
    ],
    inTheBox: ["NØVA ARC", "Power cable", "HDMI cable", "Quick-start card"],
    released: "2026-02",
    pairsWith: ["nova-sub"],
  }),
  product({
    handle: "nova-orb",
    title: "NØVA ORB",
    productType: "Speaker",
    model: "orb",
    tagline: "A small sphere of sound and light.",
    description: [
      "ORB is a bedside speaker that doubles as a lamp. The top glows with a warm light that dims as you fall asleep, and brightens slowly before your alarm.",
      "Tap the crown to pause. Turn it to change the volume. That's all it asks of you.",
    ],
    tags: ["home", "new"],
    room: "small",
    variants: variants("nova-orb", 19900, { bone: 24, graphite: 20, ember: 8 }),
    highlights: [
      { title: "Sunrise light", body: "A warm glow that fades in before your alarm and out at night." },
      { title: "Touch crown", body: "Tap to play or pause; turn to change the volume." },
      { title: "Quiet by design", body: "A night mode that compresses loud passages so nobody wakes." },
    ],
    specs: [
      { label: "Drivers", value: '1 × 3" full-range' },
      { label: "Light", value: "Warm white, 2,200 – 3,000 K" },
      { label: "Connectivity", value: "Wi-Fi 6 · Bluetooth 5.3" },
      { label: "Power supply", value: "USB-C, 30 W adapter included" },
      { label: "Size", value: "Ø 140 × 132 mm" },
      { label: "Weight", value: "980 g" },
    ],
    inTheBox: ["NØVA ORB", "30 W USB-C adapter", "USB-C cable", "Quick-start card"],
    released: "2026-08",
    pairsWith: [],
  }),
  product({
    handle: "nova-sub",
    title: "NØVA SUB",
    productType: "Speaker",
    model: "sub",
    tagline: "The low end, felt more than heard.",
    description: [
      "SUB adds the bottom octave to a ONE or an ARC. It pairs wirelessly in seconds and tunes itself to the speakers it's paired with.",
      "A down-firing 8-inch driver means it can sit anywhere in the room, even behind the sofa.",
    ],
    tags: ["home"],
    room: "large",
    variants: variants("nova-sub", 34900, { graphite: 14, bone: 7 }),
    highlights: [
      { title: '8" driver', body: "Down-firing, with opposed passive radiators to cancel vibration." },
      { title: "Wireless pairing", body: "Pairs with ONE or ARC and tunes its crossover automatically." },
      { title: "Anywhere placement", body: "Low frequencies aren't directional, so hide it wherever suits." },
    ],
    specs: [
      { label: "Driver", value: '1 × 8" down-firing · 2 passive radiators' },
      { label: "Power", value: "200 W" },
      { label: "Frequency", value: "25 – 120 Hz" },
      { label: "Size", value: "Ø 300 × 250 mm" },
      { label: "Weight", value: "9.1 kg" },
    ],
    inTheBox: ["NØVA SUB", "Power cable", "Quick-start card"],
    released: "2025-10",
    pairsWith: ["nova-one", "nova-arc"],
  }),
  product({
    handle: "nova-dock",
    title: "NØVA DOCK",
    productType: "Accessory",
    model: "dock",
    tagline: "Turns MINI into a desk speaker.",
    description: ["A weighted aluminium dock that charges MINI and holds it at the right height for a desk. Magnetic, so it clicks into place."],
    tags: ["portable"],
    room: null,
    variants: variants("nova-dock", 3900, { graphite: 80, bone: 44 }),
    highlights: [{ title: "Magnetic", body: "MINI clicks into place and starts charging." }],
    specs: [
      { label: "Input", value: "USB-C, 15 W" },
      { label: "Size", value: "Ø 110 × 14 mm" },
      { label: "Weight", value: "260 g" },
    ],
    inTheBox: ["NØVA DOCK", "USB-C cable"],
    released: "2025-06",
    pairsWith: ["nova-mini"],
  }),
  product({
    handle: "nova-stand",
    title: "NØVA STAND",
    productType: "Accessory",
    model: "stand",
    tagline: "Puts ONE at ear height.",
    description: ["A floor stand for ONE, with the power cable routed through the column so nothing shows. Solid steel base, aluminium column."],
    tags: ["home"],
    room: null,
    variants: variants("nova-stand", 7900, { graphite: 26, bone: 11 }),
    highlights: [{ title: "Hidden cable", body: "The power cable runs inside the column." }],
    specs: [
      { label: "Height", value: "740 mm" },
      { label: "Base", value: "Ø 260 mm steel" },
      { label: "Weight", value: "5.2 kg" },
    ],
    inTheBox: ["NØVA STAND", "Cable clips", "Assembly key"],
    released: "2025-10",
    pairsWith: ["nova-one"],
  }),
];

export function getProduct(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getVariant(id: string): { product: Product; variant: Variant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** The first variant that can be bought, else the first. */
export function defaultVariant(p: Product): Variant {
  return p.variants.find((v) => v.availableForSale) ?? p.variants[0];
}

export const LOW_STOCK = 5;
