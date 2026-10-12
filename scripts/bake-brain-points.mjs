#!/usr/bin/env node
/**
 * Bakes a GLB mesh into the quantized point clouds the hero renders.
 *
 *   node scripts/bake-brain-points.mjs public/models/brain.glb
 *
 * Why bake instead of loading the GLB in the browser: the page only ever
 * needs positions, never triangles, materials or UVs. Sampling at build
 * time means the client skips GLTFLoader (~30 KB of JS), skips mesh parsing
 * on the main thread, and downloads an asset a fraction of the mesh's size.
 *
 * Output format (little-endian):
 *   magic   "BPC2"     4 bytes
 *   count   uint32     number of points
 *   coords  int16 * 3 * count, each coord = round(v * 32767), v in [-1, 1]
 *   shell   uint8 * count, 255 on the surface down to ~0 deep inside
 *
 * Points are area-weighted across the mesh surface, with a share pulled
 * inward to fill the volume, then shuffled so any prefix of the file is a
 * well-distributed subset.
 *
 * The shell byte matters: with additive blending a purely surface-sampled
 * cloud piles up along the silhouette and leaves the middle dark, so it
 * reads as a hollow ball. Interior points fill that in, but at full
 * brightness they smear the sulci. Shipping the distinction lets the
 * shader draw interior points smaller and dimmer — mass without mush.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import zlib from "node:zlib";

/* --- Tunables ---------------------------------------------------------- */

const OUTPUTS = [
  { file: "brain-points.bin", count: 60000 },
  { file: "brain-points-mobile.bin", count: 12000 },
];

/** Share of points pulled inside the hull so the cloud reads as a solid. */
const INTERIOR_RATIO = 0.34;

/**
 * Orientation fix applied after loading, in degrees, as XYZ Euler.
 * Generated meshes rarely land in the axis convention the scene wants
 * (+x right, +y up, +z toward the viewer / frontal pole). Adjust these
 * and re-run with --preview until the projections look right.
 */
const ROTATE_DEG = { x: 0, y: 0, z: 0 };

/* --- Deterministic PRNG ------------------------------------------------ */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* --- Minimal GLB / glTF reader ----------------------------------------- */

const COMPONENT_TYPES = {
  5120: { array: Int8Array, size: 1 },
  5121: { array: Uint8Array, size: 1 },
  5122: { array: Int16Array, size: 2 },
  5123: { array: Uint16Array, size: 2 },
  5125: { array: Uint32Array, size: 4 },
  5126: { array: Float32Array, size: 4 },
};

const TYPE_COMPONENTS = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT4: 16,
};

function parseGlb(buffer) {
  const view = new DataView(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );

  if (view.getUint32(0, true) !== 0x46546c67) {
    throw new Error("Not a GLB file (bad magic). Expected a binary .glb.");
  }

  const total = view.getUint32(8, true);
  let offset = 12;
  let json = null;
  let bin = null;

  while (offset < total) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    const start = offset + 8;

    if (chunkType === 0x4e4f534a) {
      json = JSON.parse(
        buffer.subarray(start, start + chunkLength).toString("utf8"),
      );
    } else if (chunkType === 0x004e4942) {
      bin = buffer.subarray(start, start + chunkLength);
    }

    offset = start + chunkLength + ((4 - (chunkLength % 4)) % 4);
  }

  if (!json) throw new Error("GLB has no JSON chunk.");
  return { json, bin };
}

function readAccessor(gltf, bin, index) {
  const accessor = gltf.accessors[index];
  const comp = COMPONENT_TYPES[accessor.componentType];
  const numComponents = TYPE_COMPONENTS[accessor.type];

  if (!comp) {
    throw new Error(`Unsupported componentType ${accessor.componentType}`);
  }

  const out = new Float64Array(accessor.count * numComponents);

  if (accessor.bufferView === undefined) return out; // all zeroes, per spec

  const bufferView = gltf.bufferViews[accessor.bufferView];
  if (bufferView.buffer !== 0) {
    throw new Error("External buffers are not supported; export a self-contained GLB.");
  }

  const base =
    (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0) + bin.byteOffset;
  const elementSize = comp.size * numComponents;
  const stride = bufferView.byteStride || elementSize;
  const raw = new DataView(bin.buffer);

  const readers = {
    5120: (o) => raw.getInt8(o),
    5121: (o) => raw.getUint8(o),
    5122: (o) => raw.getInt16(o, true),
    5123: (o) => raw.getUint16(o, true),
    5125: (o) => raw.getUint32(o, true),
    5126: (o) => raw.getFloat32(o, true),
  };
  const read = readers[accessor.componentType];

  for (let i = 0; i < accessor.count; i++) {
    for (let c = 0; c < numComponents; c++) {
      out[i * numComponents + c] = read(base + i * stride + c * comp.size);
    }
  }

  return out;
}

/* --- Matrix helpers ---------------------------------------------------- */

function identity() {
  // prettier-ignore
  return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
}

/** Column-major 4x4 multiply, matching the glTF convention. */
function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = sum;
    }
  }
  return out;
}

function fromTRS(t = [0, 0, 0], r = [0, 0, 0, 1], s = [1, 1, 1]) {
  const [x, y, z, w] = r;
  const x2 = x + x,
    y2 = y + y,
    z2 = z + z;
  const xx = x * x2,
    xy = x * y2,
    xz = x * z2;
  const yy = y * y2,
    yz = y * z2,
    zz = z * z2;
  const wx = w * x2,
    wy = w * y2,
    wz = w * z2;

  // prettier-ignore
  return [
    (1 - (yy + zz)) * s[0], (xy + wz) * s[0],       (xz - wy) * s[0],       0,
    (xy - wz) * s[1],       (1 - (xx + zz)) * s[1], (yz + wx) * s[1],       0,
    (xz + wy) * s[2],       (yz - wx) * s[2],       (1 - (xx + yy)) * s[2], 0,
    t[0],                   t[1],                   t[2],                   1,
  ];
}

function transformPoint(m, x, y, z) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

function rotationMatrix({ x, y, z }) {
  const rad = (d) => (d * Math.PI) / 180;
  const [cx, sx] = [Math.cos(rad(x)), Math.sin(rad(x))];
  const [cy, sy] = [Math.cos(rad(y)), Math.sin(rad(y))];
  const [cz, sz] = [Math.cos(rad(z)), Math.sin(rad(z))];

  // prettier-ignore
  const rx = [1,0,0,0, 0,cx,sx,0, 0,-sx,cx,0, 0,0,0,1];
  // prettier-ignore
  const ry = [cy,0,-sy,0, 0,1,0,0, sy,0,cy,0, 0,0,0,1];
  // prettier-ignore
  const rz = [cz,sz,0,0, -sz,cz,0,0, 0,0,1,0, 0,0,0,1];

  return multiply(rz, multiply(ry, rx));
}

/* --- Mesh collection --------------------------------------------------- */

/** Walks the scene graph and returns world-space triangles as a flat array. */
function collectTriangles(gltf, bin) {
  const positions = [];
  const indices = [];
  let vertexBase = 0;

  const visit = (nodeIndex, parentMatrix) => {
    const node = gltf.nodes[nodeIndex];
    const local = node.matrix
      ? node.matrix.slice()
      : fromTRS(node.translation, node.rotation, node.scale);
    const world = multiply(parentMatrix, local);

    if (node.mesh !== undefined) {
      for (const primitive of gltf.meshes[node.mesh].primitives) {
        // mode 4 is TRIANGLES; it is the default when absent.
        if (primitive.mode !== undefined && primitive.mode !== 4) continue;
        if (primitive.attributes?.POSITION === undefined) continue;

        const pos = readAccessor(gltf, bin, primitive.attributes.POSITION);
        const count = pos.length / 3;

        for (let i = 0; i < count; i++) {
          const [x, y, z] = transformPoint(
            world,
            pos[i * 3],
            pos[i * 3 + 1],
            pos[i * 3 + 2],
          );
          positions.push(x, y, z);
        }

        if (primitive.indices !== undefined) {
          const idx = readAccessor(gltf, bin, primitive.indices);
          for (let i = 0; i < idx.length; i++) indices.push(vertexBase + idx[i]);
        } else {
          for (let i = 0; i < count; i++) indices.push(vertexBase + i);
        }

        vertexBase += count;
      }
    }

    for (const child of node.children ?? []) visit(child, world);
  };

  const scene = gltf.scenes?.[gltf.scene ?? 0];
  const roots = scene?.nodes ?? gltf.nodes.map((_, i) => i);
  for (const root of roots) visit(root, identity());

  return { positions: Float64Array.from(positions), indices };
}

/* --- Sampling ---------------------------------------------------------- */

function samplePoints(positions, indices, count, rand) {
  const triangleCount = Math.floor(indices.length / 3);
  if (triangleCount === 0) throw new Error("Mesh contains no triangles.");

  // Area-weighted cumulative distribution over triangles.
  const cumulative = new Float64Array(triangleCount);
  let running = 0;

  for (let t = 0; t < triangleCount; t++) {
    const a = indices[t * 3] * 3;
    const b = indices[t * 3 + 1] * 3;
    const c = indices[t * 3 + 2] * 3;

    const abx = positions[b] - positions[a];
    const aby = positions[b + 1] - positions[a + 1];
    const abz = positions[b + 2] - positions[a + 2];
    const acx = positions[c] - positions[a];
    const acy = positions[c + 1] - positions[a + 1];
    const acz = positions[c + 2] - positions[a + 2];

    const cx = aby * acz - abz * acy;
    const cy = abz * acx - abx * acz;
    const cz = abx * acy - aby * acx;

    running += 0.5 * Math.hypot(cx, cy, cz);
    cumulative[t] = running;
  }

  const totalArea = running;
  const out = new Float64Array(count * 3);
  const shell = new Uint8Array(count);

  // Centroid, used as the pull target for interior points.
  let gx = 0,
    gy = 0,
    gz = 0;
  const vertexCount = positions.length / 3;
  for (let i = 0; i < vertexCount; i++) {
    gx += positions[i * 3];
    gy += positions[i * 3 + 1];
    gz += positions[i * 3 + 2];
  }
  gx /= vertexCount;
  gy /= vertexCount;
  gz /= vertexCount;

  for (let i = 0; i < count; i++) {
    // Binary search the CDF for an area-weighted triangle pick.
    const target = rand() * totalArea;
    let lo = 0;
    let hi = triangleCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }

    const a = indices[lo * 3] * 3;
    const b = indices[lo * 3 + 1] * 3;
    const c = indices[lo * 3 + 2] * 3;

    // Uniform barycentric sample within the triangle.
    let u = rand();
    let v = rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;

    let x = positions[a] * w + positions[b] * u + positions[c] * v;
    let y = positions[a + 1] * w + positions[b + 1] * u + positions[c + 1] * v;
    let z = positions[a + 2] * w + positions[b + 2] * u + positions[c + 2] * v;

    if (rand() < INTERIOR_RATIO) {
      const k = 0.35 + rand() * 0.55;
      x = gx + (x - gx) * k;
      y = gy + (y - gy) * k;
      z = gz + (z - gz) * k;
      // k near 1 is just under the surface; k near 0.35 is deep inside.
      shell[i] = Math.round(Math.max(0, Math.min(1, (k - 0.35) / 0.55)) * 255);
    } else {
      shell[i] = 255;
    }

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }

  return { points: out, shell };
}

/** Centers on the bounding box and scales the longest axis to fit [-1, 1]. */
function normalize(points) {
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  for (let i = 0; i < points.length; i += 3) {
    minX = Math.min(minX, points[i]);
    maxX = Math.max(maxX, points[i]);
    minY = Math.min(minY, points[i + 1]);
    maxY = Math.max(maxY, points[i + 1]);
    minZ = Math.min(minZ, points[i + 2]);
    maxZ = Math.max(maxZ, points[i + 2]);
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const half = Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 2;
  const scale = half > 0 ? 1 / half : 1;

  for (let i = 0; i < points.length; i += 3) {
    points[i] = (points[i] - cx) * scale;
    points[i + 1] = (points[i + 1] - cy) * scale;
    points[i + 2] = (points[i + 2] - cz) * scale;
  }

  return points;
}

function shuffle(points, shell, rand) {
  const n = points.length / 3;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    for (let c = 0; c < 3; c++) {
      const tmp = points[i * 3 + c];
      points[i * 3 + c] = points[j * 3 + c];
      points[j * 3 + c] = tmp;
    }
    const tmpShell = shell[i];
    shell[i] = shell[j];
    shell[j] = tmpShell;
  }
}

function encode(points, shell) {
  const count = points.length / 3;
  const buffer = Buffer.alloc(8 + count * 6 + count);
  buffer.write("BPC2", 0, "ascii");
  buffer.writeUInt32LE(count, 4);

  for (let i = 0; i < count * 3; i++) {
    const clamped = Math.max(-1, Math.min(1, points[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 8 + i * 2);
  }

  Buffer.from(shell.buffer, shell.byteOffset, count).copy(
    buffer,
    8 + count * 6,
  );

  return buffer;
}

/* --- Preview renderer -------------------------------------------------- */

function encodePng(width, height, rgb) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0;
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }

  const chunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([length, body, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Orthographic splat of the cloud down one axis, for eyeballing shape. */
function renderPreview(points, drop, size = 420) {
  const rgb = Buffer.alloc(size * size * 3);
  for (let i = 0; i < rgb.length; i += 3) {
    rgb[i] = 7;
    rgb[i + 1] = 11;
    rgb[i + 2] = 31;
  }

  const axes = { x: [2, 1], y: [0, 2], z: [0, 1] }[drop];

  for (let i = 0; i < points.length; i += 3) {
    const u = points[i + axes[0]];
    const v = points[i + axes[1]];
    const depth = points[i + { x: 0, y: 1, z: 2 }[drop]];

    const px = Math.round(((u + 1.15) / 2.3) * size);
    const py = Math.round(((1.15 - v) / 2.3) * size);
    if (px < 0 || py < 0 || px >= size || py >= size) continue;

    const t = Math.max(0, Math.min(1, (depth + 1) / 2));
    const o = (py * size + px) * 3;
    rgb[o] = Math.min(255, rgb[o] + 40 + t * 150);
    rgb[o + 1] = Math.min(255, rgb[o + 1] + 60 + t * 120);
    rgb[o + 2] = Math.min(255, rgb[o + 2] + 90 + t * 110);
  }

  return encodePng(size, size, rgb);
}

/* --- Splash silhouette -------------------------------------------------- */

/**
 * Writes a small, static SVG of the cloud at the hero's resting angle, used
 * by the loading screen. One <img> and no JavaScript, so it paints with the
 * first frame, and it is regenerated here so swapping the model keeps the
 * splash and the hero showing the same brain.
 */
function writeSplashSvg(points, shell, outPath, sampleCount = 2400) {
  const YAW = -1.48;
  const PITCH = -0.2;
  const total = Math.min(sampleCount, points.length / 3);

  // Circles are bucketed by colour, radius and opacity so those attributes
  // live once on a <g> instead of on every element. Keeps the file around
  // 10 KB gzipped, which matters for something on the critical path.
  const buckets = new Map();

  for (let i = 0; i < total; i++) {
    const x0 = points[i * 3];
    const y0 = points[i * 3 + 1];
    const z0 = points[i * 3 + 2];

    const y1 = y0 * Math.cos(PITCH) - z0 * Math.sin(PITCH);
    const z1 = y0 * Math.sin(PITCH) + z0 * Math.cos(PITCH);
    const x2 = x0 * Math.cos(YAW) + z1 * Math.sin(YAW);
    const z2 = -x0 * Math.sin(YAW) + z1 * Math.cos(YAW);

    const depth = Math.max(0, Math.min(1, (z2 + 1) / 2));
    const s = shell[i] / 255;

    const cx = (150 + x2 * 128).toFixed(1);
    const cy = (150 - y1 * 128).toFixed(1);
    const color =
      depth > 0.62 ? "#F5F7FF" : depth > 0.34 ? "#A78BFA" : "#3B82F6";

    // Quantize radius and opacity into a few tiers to keep bucket count low.
    const r = (
      Math.round((0.85 + depth * 1.05) * (0.65 + 0.35 * s) * 4) / 4 || 0.5
    ).toFixed(2);
    const opacity = (
      Math.round((0.38 + depth * 0.62) * (0.5 + 0.5 * s) * 5) / 5 || 0.2
    ).toFixed(2);

    // fill and opacity hoist onto the <g>; r stays per-circle because it
    // is a geometry attribute and does not inherit in SVG 1.1.
    const key = `${color}|${opacity}`;
    const circle = `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(circle);
    else buckets.set(key, [circle]);
  }

  const groups = [...buckets.entries()].map(([key, circles]) => {
    const [color, opacity] = key.split("|");
    return `<g fill="${color}" opacity="${opacity}">${circles.join("")}</g>`;
  });

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">` +
    groups.join("") +
    `</svg>`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, svg);
  return svg.length;
}

/* --- Main -------------------------------------------------------------- */

function main() {
  const args = process.argv.slice(2);
  const input = args.find((a) => !a.startsWith("--")) ?? "public/models/brain.glb";
  const previewDir = args.includes("--preview")
    ? (args[args.indexOf("--preview") + 1] ?? ".preview")
    : null;

  if (!fs.existsSync(input)) {
    console.error(`Mesh not found: ${input}`);
    console.error("Pass a path to a .glb, or see README.md for how to swap the model.");
    process.exit(1);
  }

  console.log(`Reading ${input}`);
  const { json: gltf, bin } = parseGlb(fs.readFileSync(input));
  const { positions, indices } = collectTriangles(gltf, bin);
  console.log(
    `  ${positions.length / 3} vertices, ${indices.length / 3} triangles`,
  );

  const rotation = rotationMatrix(ROTATE_DEG);
  if (ROTATE_DEG.x || ROTATE_DEG.y || ROTATE_DEG.z) {
    for (let i = 0; i < positions.length; i += 3) {
      const [x, y, z] = transformPoint(
        rotation,
        positions[i],
        positions[i + 1],
        positions[i + 2],
      );
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
    }
    console.log(`  rotated by ${JSON.stringify(ROTATE_DEG)}`);
  }

  const outDir = path.join(process.cwd(), "public", "models");
  fs.mkdirSync(outDir, { recursive: true });

  for (const { file, count } of OUTPUTS) {
    const rand = mulberry32(0x5eed);
    const { points, shell } = samplePoints(positions, indices, count, rand);
    normalize(points);
    shuffle(points, shell, rand);

    const encoded = encode(points, shell);
    fs.writeFileSync(path.join(outDir, file), encoded);
    console.log(
      `  wrote public/models/${file} — ${count} points, ${(encoded.length / 1024).toFixed(0)} KB`,
    );

    if (count === OUTPUTS[0].count) {
      const splashPath = path.join(
        process.cwd(),
        "public",
        "brand",
        "brain-splash.svg",
      );
      const bytes = writeSplashSvg(points, shell, splashPath);
      console.log(
        `  wrote public/brand/brain-splash.svg — ${(bytes / 1024).toFixed(0)} KB`,
      );
    }

    if (previewDir && count === OUTPUTS[0].count) {
      fs.mkdirSync(previewDir, { recursive: true });
      for (const axis of ["x", "y", "z"]) {
        fs.writeFileSync(
          path.join(previewDir, `brain-${axis}.png`),
          renderPreview(points, axis),
        );
      }
      console.log(`  wrote preview projections to ${previewDir}/`);
    }
  }
}

main();
