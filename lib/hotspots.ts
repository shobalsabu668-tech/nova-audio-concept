import type { ModelId } from "./catalogue";

/** Points of interest on each model, in model space. */
export type Hotspot = { id: string; label: string; detail: string; position: [number, number, number] };

export const hotspots: Partial<Record<ModelId, Hotspot[]>> = {
  one: [
    { id: "ring", label: "Status ring", detail: "Glows while playing and pulses when pairing. Dims itself in a dark room.", position: [0.24, 0.88, 0.24] },
    { id: "grille", label: "360° driver array", detail: "Three tweeters around a down-firing woofer: sound radiates evenly in every direction.", position: [0.63, -0.1, 0.05] },
    { id: "body", label: "Machined body", detail: "One piece of aluminium, bead-blasted and anodised. No seams, no screws you can see.", position: [-0.45, 0.62, 0.43] },
  ],
  mini: [
    { id: "buttons", label: "Two buttons", detail: "Play/pause and pairing. Volume is on your phone, where it belongs.", position: [0.09, 0.44, 0.05] },
    { id: "grille", label: "Waterproof grille", detail: "IP67: dust-tight and waterproof to one metre for thirty minutes.", position: [0.5, -0.06, 0.08] },
  ],
  arc: [
    { id: "ring", label: "Status ring", detail: "An oval light that shows input and volume, then fades away.", position: [0.4, 0.46, 0.18] },
    { id: "grille", label: "Angled tweeters", detail: "Four tweeters angled outwards throw a stereo image far wider than the cabinet.", position: [1.15, -0.05, 0.1] },
  ],
  orb: [
    { id: "light", label: "Sunrise light", detail: "A warm glow that fades in before your alarm and out as you fall asleep.", position: [0.1, 0.52, 0.1] },
    { id: "grille", label: "Full-range driver", detail: "One 3-inch driver, tuned for low volumes that still sound full.", position: [0.55, -0.12, 0.3] },
  ],
  sub: [{ id: "grille", label: "Down-firing 8-inch driver", detail: "Fires into the floor, so it can hide behind a sofa and still fill the room.", position: [0.78, -0.2, 0.1] }],
};
