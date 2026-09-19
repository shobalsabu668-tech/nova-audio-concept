import * as THREE from "three";
import type { ModelId } from "@/lib/catalogue";

/**
 * PRODUCT GEOMETRY — every NØVA product is turned on a virtual lathe from a
 * 2D profile, so the whole range shares one design language and weighs
 * nothing to download. Units: 1 ≈ 100 mm.
 */

/** A cylinder with rounded top and bottom edges, as a lathe profile. */
export function roundedCylinder(r: number, half: number, chamfer: number, steps = 8): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -half)];
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - chamfer + Math.cos(a) * chamfer, -half + chamfer + Math.sin(a) * chamfer));
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(r - chamfer + Math.cos(a) * chamfer, half - chamfer + Math.sin(a) * chamfer));
  }
  pts.push(new THREE.Vector2(0, half));
  return pts;
}

/** ORB: a flattened sphere standing on a small flat foot. */
export function orbProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -0.6), new THREE.Vector2(0.34, -0.6)];
  const cy = 0.02;
  const R = 0.68;
  const start = Math.asin((-0.6 - cy + 0.02) / R);
  const end = Math.asin((0.5 - cy) / R);
  for (let i = 0; i <= 40; i++) {
    const a = start + (i / 40) * (end - start);
    pts.push(new THREE.Vector2(Math.cos(a) * R, cy + Math.sin(a) * R));
  }
  pts.push(new THREE.Vector2(0, 0.5));
  return pts;
}

export type Part = {
  geometry: THREE.BufferGeometry;
  material: "body" | "grille" | "dark" | "glow" | "light";
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export type ModelSpec = {
  parts: Part[];
  /** Height of the object's centre, and how far away the camera sits. */
  frame: { y: number; distance: number; floor: number };
};

/** Framing per model, without building any geometry. */
export const FRAMES: Record<ModelId, ModelSpec["frame"]> = {
  one: { y: 0, distance: 5.4, floor: -0.86 },
  mini: { y: 0, distance: 3.6, floor: -0.43 },
  arc: { y: 0, distance: 6.2, floor: -0.46 },
  orb: { y: 0, distance: 4.4, floor: -0.6 },
  sub: { y: 0, distance: 6, floor: -0.6 },
  dock: { y: 0.05, distance: 3.4, floor: -0.06 },
  stand: { y: 0.8, distance: 6.4, floor: -0.03 },
};

const lathe = (profile: THREE.Vector2[]) => new THREE.LatheGeometry(profile, 128);
const flat = (): [number, number, number] => [-Math.PI / 2, 0, 0];

/** Builds (fresh) geometry for a model. Callers own and must dispose it. */
export function buildModel(model: ModelId): ModelSpec {
  switch (model) {
    case "one":
      return {
        frame: FRAMES.one,
        parts: [
          { geometry: lathe(roundedCylinder(0.62, 0.85, 0.07)), material: "body" },
          { geometry: new THREE.CylinderGeometry(0.624, 0.624, 1.28, 128, 1, true), material: "grille", position: [0, -0.12, 0] },
          { geometry: new THREE.CircleGeometry(0.3, 64), material: "dark", position: [0, 0.851, 0], rotation: flat() },
          { geometry: new THREE.TorusGeometry(0.34, 0.012, 12, 96), material: "glow", position: [0, 0.853, 0], rotation: flat() },
        ],
      };
    case "mini":
      return {
        frame: FRAMES.mini,
        parts: [
          { geometry: lathe(roundedCylinder(0.5, 0.42, 0.1)), material: "body" },
          { geometry: new THREE.CylinderGeometry(0.504, 0.504, 0.5, 128, 1, true), material: "grille", position: [0, -0.06, 0] },
          { geometry: new THREE.TorusGeometry(0.24, 0.01, 12, 96), material: "glow", position: [0, 0.422, 0], rotation: flat() },
          { geometry: new THREE.CylinderGeometry(0.045, 0.045, 0.02, 32), material: "dark", position: [-0.09, 0.425, 0] },
          { geometry: new THREE.CylinderGeometry(0.045, 0.045, 0.02, 32), material: "dark", position: [0.09, 0.425, 0] },
        ],
      };
    case "arc":
      return {
        frame: FRAMES.arc,
        parts: [
          { geometry: lathe(roundedCylinder(0.62, 0.45, 0.08)), material: "body", scale: [1.9, 1, 0.82] },
          { geometry: new THREE.CylinderGeometry(0.624, 0.624, 0.6, 160, 1, true), material: "grille", position: [0, -0.06, 0], scale: [1.9, 1, 0.82] },
          { geometry: new THREE.TorusGeometry(0.4, 0.011, 12, 128), material: "glow", position: [0, 0.452, 0], rotation: flat(), scale: [1.9, 0.82, 1] },
        ],
      };
    case "orb":
      return {
        frame: FRAMES.orb,
        parts: [
          { geometry: lathe(orbProfile()), material: "body" },
          {
            geometry: new THREE.SphereGeometry(0.684, 128, 64, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.4),
            material: "grille",
            position: [0, 0.02, 0],
          },
          { geometry: new THREE.CircleGeometry(0.44, 64), material: "light", position: [0, 0.502, 0], rotation: flat() },
          { geometry: new THREE.TorusGeometry(0.46, 0.012, 12, 96), material: "dark", position: [0, 0.503, 0], rotation: flat() },
        ],
      };
    case "sub":
      return {
        frame: FRAMES.sub,
        parts: [
          { geometry: lathe(roundedCylinder(0.78, 0.6, 0.06)), material: "body" },
          { geometry: new THREE.CylinderGeometry(0.784, 0.784, 0.96, 128, 1, true), material: "grille", position: [0, -0.04, 0] },
          { geometry: new THREE.TorusGeometry(0.2, 0.008, 12, 96), material: "dark", position: [0, 0.601, 0], rotation: flat() },
        ],
      };
    case "dock":
      return {
        frame: FRAMES.dock,
        parts: [
          { geometry: lathe(roundedCylinder(0.55, 0.06, 0.035)), material: "body" },
          { geometry: new THREE.CircleGeometry(0.44, 64), material: "dark", position: [0, 0.061, 0], rotation: flat() },
          { geometry: new THREE.SphereGeometry(0.012, 16, 16), material: "glow", position: [0, 0.03, 0.55] },
        ],
      };
    case "stand":
      return {
        frame: FRAMES.stand,
        parts: [
          { geometry: lathe(roundedCylinder(0.55, 0.03, 0.02)), material: "body" },
          { geometry: new THREE.CylinderGeometry(0.035, 0.035, 1.5, 32), material: "body", position: [0, 0.78, 0] },
          { geometry: lathe(roundedCylinder(0.42, 0.025, 0.015)), material: "body", position: [0, 1.55, 0] },
        ],
      };
  }
}

/** Perforated-grille alpha map: a repeating dot, drawn once on a canvas. */
export function grilleTexture(repeat: [number, number]): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 8;
  return tex;
}

export const GRILLE_REPEAT: Record<ModelId, [number, number]> = {
  one: [64, 22],
  mini: [52, 8],
  arc: [96, 10],
  orb: [70, 16],
  sub: [80, 16],
  dock: [1, 1],
  stand: [1, 1],
};
