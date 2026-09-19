/**
 * PRODUCT RENDERS
 * ────────────────────────────────────────────────────────────────────────────
 * Photographs every product × finish × angle from the /studio page (the same
 * 3D models the site uses) with a transparent background, then writes WebP
 * files to public/renders/<handle>-<finish>-<angle>.webp.
 *
 *   1. npm run dev   (or build + start)
 *   2. npm run renders            → uses http://localhost:3000
 *      npm run renders -- http://localhost:3300
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const out = path.join(root, "public", "renders");
await fs.mkdir(out, { recursive: true });

// Mirrors lib/catalogue.ts (kept here so the script has no TS dependency).
const catalogue = [
  { handle: "nova-one", model: "one", finishes: ["graphite", "bone", "ember"] },
  { handle: "nova-mini", model: "mini", finishes: ["graphite", "bone", "ember", "ion"] },
  { handle: "nova-arc", model: "arc", finishes: ["graphite", "bone", "ember"] },
  { handle: "nova-orb", model: "orb", finishes: ["bone", "graphite", "ember"] },
  { handle: "nova-sub", model: "sub", finishes: ["graphite", "bone"] },
  { handle: "nova-dock", model: "dock", finishes: ["graphite", "bone"] },
  { handle: "nova-stand", model: "stand", finishes: ["graphite", "bone"] },
];
const angles = [0, 1, 2];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=d3d11", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 800, height: 1000 }, deviceScaleFactor: 1.5 });

let n = 0;
for (const p of catalogue) {
  for (const finish of p.finishes) {
    for (const a of angles) {
      await page.goto(`${base}/studio?m=${p.model}&f=${finish}&a=${a}`, { waitUntil: "networkidle" });
      await page.addStyleTag({ content: "[data-chrome],nextjs-portal{display:none!important} html,body{background:transparent!important}" });
      await page.waitForFunction(() => window.__renderReady === true, null, { timeout: 30000 });
      const png = await page.locator("#stage canvas").screenshot({ omitBackground: true });
      const file = path.join(out, `${p.handle}-${finish}-${a}.webp`);
      // Trim to the object (and its shadow), then pad proportionally so every
      // product sits in its frame the same way.
      const trimmed = await sharp(png).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
      const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.1);
      await sharp(trimmed.data)
        .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .resize({ width: 900, height: 1100, fit: "inside" })
        .webp({ quality: 86, alphaQuality: 90 })
        .toFile(file);
      n++;
      process.stdout.write(`\r${n} renders`);
    }
  }
}
await browser.close();
console.log(`\nWrote ${n} files to public/renders/`);
