/**
 * Procedural brain point cloud.
 *
 * Two jobs:
 *  1. Render instantly on first paint, before the baked point cloud
 *     (sampled from the real brain mesh) has finished downloading.
 *  2. Act as the fallback if that download fails.
 *
 * The shape is an anatomically-proportioned ellipsoid pair — wider and
 * taller at the back, tapered at the frontal pole, flattened underneath,
 * with a longitudinal fissure down the midline and ridged noise standing
 * in for sulci and gyri. It is not a scan, but at point-cloud density it
 * reads as a brain at a glance, which is all the hero needs from it.
 *
 * Output matches the baked format: xyz triples in a roughly unit-radius
 * space, plus a shell value per point (1 on the surface, lower inside), so
 * the two clouds are visually interchangeable.
 */

export type PointCloud = {
  positions: Float32Array;
  /** 1 on the surface, approaching 0 deep inside the volume. */
  shell: Float32Array;
};

/** Small deterministic PRNG so the cloud is identical on every load. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --- Compact 3D value noise ------------------------------------------- */

const PERM = new Uint8Array(512);
{
  const rand = mulberry32(1337);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

function hash3(x: number, y: number, z: number): number {
  return PERM[(PERM[(PERM[x & 255] + y) & 255] + z) & 255] / 255;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smoothstep(x - xi);
  const yf = smoothstep(y - yi);
  const zf = smoothstep(z - zi);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const c000 = hash3(xi, yi, zi);
  const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);
  const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);
  const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1);
  const c111 = hash3(xi + 1, yi + 1, zi + 1);

  return lerp(
    lerp(lerp(c000, c100, xf), lerp(c010, c110, xf), yf),
    lerp(lerp(c001, c101, xf), lerp(c011, c111, xf), yf),
    zf,
  );
}

function fbm(x: number, y: number, z: number, octaves: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * freq, y * freq, z * freq) * amp;
    freq *= 2.07;
    amp *= 0.5;
  }
  return sum;
}

/* --- Brain surface ----------------------------------------------------- */

/**
 * Maps a unit-sphere direction onto the brain surface.
 * Axes: +x right, +y up, +z toward the front (frontal lobe).
 */
function brainSurface(
  ux: number,
  uy: number,
  uz: number,
  out: [number, number, number],
): void {
  // Base cerebrum proportions (anterior-posterior is the long axis).
  let x = ux * 0.8;
  let y = uy * 0.64;
  let z = uz * 1.0;

  // Taper toward the frontal pole so the front is narrower than the back.
  const frontal = Math.max(0, z);
  const taper = 1 - 0.3 * frontal * frontal;
  x *= taper;
  y *= taper;

  // Occipital pole is slightly pinched as well.
  const occipital = Math.max(0, -z);
  const pinch = 1 - 0.16 * occipital * occipital * occipital;
  x *= pinch;
  y *= pinch;

  // Flatten the underside and widen it into the temporal lobes.
  if (y < 0) {
    const d = -y / 0.64;
    y *= 1 - 0.3 * d;
    x *= 1 + 0.17 * d * (1 - 0.55 * frontal);
  }

  // Longitudinal fissure: a deep midline groove across the dorsal surface,
  // fading out at the poles so the hemispheres stay joined.
  const midline = Math.exp(-(x * x) / 0.011);
  const dorsal = Math.max(0, Math.min(1, (y + 0.1) / 0.5));
  const alongAxis = 1 - 0.55 * Math.min(1, z * z * z * z);
  const fissure = midline * dorsal * alongAxis;

  // Sulci and gyri: ridged noise folded into bands along the surface.
  const n = fbm(ux * 2.9 + 11, uy * 2.9 + 7, uz * 2.9 + 3, 4);
  const bands = Math.abs(Math.sin(n * Math.PI * 5.2));
  const fine = fbm(ux * 9 + 2, uy * 9 + 5, uz * 9 + 9, 2) - 0.5;
  const folds = bands * 0.052 + fine * 0.022;

  // Lateral (Sylvian) fissure: a diagonal groove on each side.
  const sylvian =
    Math.exp(-Math.pow((y + 0.1 + 0.22 * z) / 0.1, 2)) *
    Math.min(1, Math.abs(x) / 0.35);

  const shrink = 1 - folds - fissure * 0.3 - sylvian * 0.05;

  out[0] = x * shrink;
  out[1] = y * shrink;
  out[2] = z * shrink;
}

/**
 * Builds a procedural brain point cloud.
 *
 * @param count  number of points to generate
 */
export function generateProceduralBrain(count: number): PointCloud {
  const positions = new Float32Array(count * 3);
  const shell = new Float32Array(count);
  const rand = mulberry32(20260512);
  const p: [number, number, number] = [0, 0, 0];

  // Golden-angle spiral gives an even spread over the sphere before the
  // surface map distorts it into the brain shape.
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const uy = 1 - 2 * t;
    const r = Math.sqrt(Math.max(0, 1 - uy * uy));
    const theta = golden * i;
    const ux = Math.cos(theta) * r;
    const uz = Math.sin(theta) * r;

    brainSurface(ux, uy, uz, p);

    // A third of the points sit inside the volume so overlapping glow
    // reads as mass rather than a hollow shell.
    const interior = rand() < 0.34;
    const k = interior ? 0.35 + rand() * 0.55 : 1 + (rand() - 0.5) * 0.012;

    const o = i * 3;
    positions[o] = p[0] * k;
    positions[o + 1] = p[1] * k;
    positions[o + 2] = p[2] * k;
    shell[i] = interior ? Math.max(0, Math.min(1, (k - 0.35) / 0.55)) : 1;
  }

  return { positions, shell };
}
