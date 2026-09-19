import type { Finish, Product } from "./catalogue";

/** Rendered product shots in public/renders (see scripts/render-products.mjs). */
export const ANGLE_COUNT = 3;

export function renderSrc(product: Pick<Product, "handle">, finish: Finish, angle = 0): string {
  return `/renders/${product.handle}-${finish}-${angle}.webp`;
}

export const angleLabels = ["Three-quarter view", "From behind", "From above"];
