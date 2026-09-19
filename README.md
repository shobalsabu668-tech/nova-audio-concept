# NØVA — audio storefront (concept website)

> **A self-initiated concept by [Shobal Sabu](https://github.com/shobalsabu668-tech).**
> NØVA is a fictional audio brand. It isn't a real company or client work, and nothing on the site is for sale.

NØVA is a complete, working storefront for an imaginary speaker brand designed in Bengaluru. Every product is
modelled in real-time 3D, and every product image on the site is rendered from those same models. There is no photo
shoot and there are no stock images.

## What's in it

| Area | What was built |
| --- | --- |
| **3D products in code** | Seven products turned on a virtual lathe in Three.js / React Three Fiber, with procedural perforated grilles, physically based finishes and a studio lit by code-built softboxes. No 3D files are downloaded. |
| **Rendered product photography** | `npm run renders` photographs the models from three angles in every finish (57 transparent WebP shots) through a hidden `/studio` page. |
| **Configurator** | Finishes ease between materials on the live model. Drag or use the buttons to turn it, and numbered hotspots explain each detail. The finish is kept in the URL (`?finish=bone`), so a link shares the exact configuration. |
| **Shopify-shaped catalogue** | Products → options → variants, with money as `{ amount, currencyCode }`, mirroring the Storefront API. Swap `lib/catalogue.ts` for API calls to run it on a real Shopify store. |
| **Cart** | One reducer shared by product cards, product pages, the bag drawer, the bag page and checkout. It enforces stock limits, shows free-delivery progress, remembers the bag between visits, and announces changes to screen readers. |
| **Checkout** | One page with inline validation that focuses the first problem. It handles Indian addresses and PIN codes, gives delivery dates from the PIN, and offers UPI / card / COD choices. It never asks for payment details. |
| **Discovery** | Filters by use and room size, URL-synced sorting, keyboard search (press `/` or Ctrl/⌘ K), and a room-size advisor. |
| **Performance** | The rendered still is the first paint and the fallback. On desktops the 3D loads at idle; on phones only when someone taps "View in 3D". Lighthouse (local, simulated mobile): performance 88–90, accessibility 100, best practices 100, CLS ≈ 0. Desktop performance: 99. |
| **Accessibility** | axe-core reports 0 violations on every page at 1440 px and 390 px. Dialogs trap and return focus, swatches are a native radio group, and the search is a proper combobox. |
| **Honesty** | Concept banner on every page. Reviews are labelled as sample content. Structured data describes a *CreativeWork*, not a Store or Product. Pages are `noindex`. |

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Three.js + React Three Fiber + drei · sharp · Playwright (render pipeline)

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

To regenerate the product images after changing a model or finish:

```bash
npm run dev          # in one terminal
npm run renders      # in another (uses Chrome; set CHROME_PATH if it isn't in the default location)
```

No environment variables are required. `.env.example` lists two optional ones.

## Structure

```text
app/                 home, shop, products/[handle], cart, checkout, about, support, concept, studio (render stage)
components/
  three/             geometry (lathe profiles), product model, studio lights, viewer, studio scene
  product/           card, swatches, stock note, delivery check, product detail
  cart/              cart context (reducer), drawer, bag page, quantity stepper
  checkout/          one-page checkout
  shop/              filterable listing
  home/              home-page sections
lib/
  catalogue.ts       products & variants (Storefront-API-shaped)
  delivery.ts        PIN-code delivery estimates
  reviews.ts         sample reviews (labelled)
scripts/
  render-products.mjs  3D → WebP product photography
```

## What is simulated

- NØVA, its products, prices, specifications and stock are fictional.
- Reviews are sample content, labelled wherever they appear.
- Nothing can be bought. The bag lives in the browser, and checkout details never leave the page.
- Delivery dates come from a simple PIN-zone table, not a courier.

---

Designed and built by **Shobal Sabu**, a creative web developer in Bengaluru. Available for freelance projects:
[shobalsabu668@gmail.com](mailto:shobalsabu668@gmail.com)
