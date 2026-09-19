import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { author, site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline} A concept store by ${author.name}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = site.tagline;
const SMALL = `NØVA · DESIGNED IN BENGALURU · CONCEPT BY ${author.name.toUpperCase()}`;

async function loadFont(axes: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@${axes}&text=${encodeURIComponent(text)}`, {
      headers: { "User-Agent": "Mozilla/4.0" },
      signal: AbortSignal.timeout(4000),
    }).then((r) => r.text());
    const url = /src: url\((.+?)\) format\('truetype'\)/.exec(css)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(4000) }).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function render(name: string): Promise<string> {
  const png = await sharp(await readFile(path.join(process.cwd(), "public/renders", `${name}.webp`)))
    .resize({ height: 480 })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

/** Social card: the three finishes of ONE, rendered from the 3D model. */
export default async function OpenGraphImage() {
  const [a, b, c] = await Promise.all(["nova-one-graphite-0", "nova-one-bone-0", "nova-one-ember-0"].map(render));
  const [bold, label] = await Promise.all([loadFont("115,720", TITLE), loadFont("100,500", SMALL)]);
  const branded = Boolean(bold && label);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ece9e2", color: "#1b1c1f", padding: 64, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560 }}>
          <div style={{ fontSize: 16, letterSpacing: 3, color: "#55565a", fontFamily: branded ? "Label" : "sans-serif" }}>{SMALL}</div>
          <div style={{ fontSize: 76, lineHeight: 0.95, letterSpacing: -2.5, fontFamily: branded ? "Bold" : "sans-serif" }}>{TITLE}</div>
        </div>
        <div style={{ position: "absolute", right: 40, bottom: 40, display: "flex", alignItems: "flex-end", gap: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a} height={430} alt="" style={{ marginRight: -40 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b} height={480} alt="" style={{ marginRight: -40 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c} height={430} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: branded
        ? [
            { name: "Bold", data: bold!, weight: 700, style: "normal" },
            { name: "Label", data: label!, weight: 500, style: "normal" },
          ]
        : undefined,
    },
  );
}
