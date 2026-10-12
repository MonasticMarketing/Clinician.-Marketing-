"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  MathUtils,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

import { generateProceduralBrain, type PointCloud } from "@/lib/brain-geometry";

/**
 * The fixed, full-viewport brain point cloud the whole page scrolls over.
 *
 * Rendering notes:
 *  - Plain three.js rather than react-three-fiber. The scene is one Points
 *    object with one material and never re-renders from React state, so a
 *    reconciler would add bundle weight and a render loop for no benefit.
 *  - All per-point motion (cursor repulsion, drift, depth colouring) happens
 *    in the vertex shader. The CPU only updates a handful of uniforms per
 *    frame, which keeps the main thread free for scrolling.
 *  - A sparse procedural cloud paints on the first frame; the baked cloud
 *    sampled from the real brain mesh fades in when it arrives.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2  uPointer;
  uniform float uPointerForce;
  uniform float uReveal;
  uniform float uDim;

  attribute float aSeed;
  attribute float aShell;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Slow organic drift so the cloud breathes even when idle.
    float t = uTime * 0.32;
    pos += 0.011 * vec3(
      sin(t + aSeed * 18.7),
      cos(t * 1.13 + aSeed * 11.3),
      sin(t * 0.87 + aSeed * 6.1)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Cursor field: points are pushed out of the way near the pointer and
    // drawn very slightly inward in a ring around it, which reads as a lens.
    vec2 delta = mv.xy - uPointer;
    float d = length(delta);
    vec2 dir = d > 1e-4 ? delta / d : vec2(0.0);

    float radius = 0.44;
    float repel = exp(-(d * d) / (radius * radius));
    float ring = exp(-pow((d - radius * 1.7) / (radius * 0.9), 2.0)) * 0.35;
    float jitter = 0.55 + 0.9 * aSeed;
    float push = (repel - ring) * uPointerForce * jitter;

    mv.xy += dir * push * 0.13;
    mv.z += repel * uPointerForce * 0.06;

    gl_Position = projectionMatrix * mv;

    // Depth drives the palette: near points read white, mid violet, far blue.
    float depth = clamp((-mv.z - 2.05) / 2.35, 0.0, 1.0);

    vec3 cNear = vec3(0.961, 0.969, 1.000); // --white
    vec3 cMid  = vec3(0.655, 0.545, 0.980); // --glow
    vec3 cFar  = vec3(0.231, 0.510, 0.965); // --blue

    vec3 color = mix(cNear, cMid, smoothstep(0.0, 0.58, depth));
    color = mix(color, cFar, smoothstep(0.46, 1.0, depth));

    // A touch of violet lift toward the top of the form.
    color += vec3(0.06, 0.0, 0.12) * smoothstep(-0.2, 1.0, pos.y);

    // Points in the cursor's reach brighten toward white.
    vColor = mix(color, vec3(1.0), repel * uPointerForce * 0.45);

    // Interior points are dimmer and smaller: they give the form mass
    // without smearing the sulci on the surface.
    float interior = 0.3 + 0.7 * aShell;

    vAlpha = (0.3 + 0.75 * pow(1.0 - depth, 1.3)) * interior * uReveal * uDim;

    gl_PointSize =
      uSize * uPixelRatio * (0.62 + 0.76 * aSeed) *
      (0.6 + 0.4 * aShell) *
      (1.0 + 0.40 * repel * uPointerForce) *
      (1.0 / max(0.35, -mv.z));
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Round, soft-edged sprite. Cheaper than sampling a texture.
    vec2 offset = gl_PointCoord - 0.5;
    float d2 = dot(offset, offset);
    if (d2 > 0.25) discard;

    float falloff = smoothstep(0.25, 0.0, d2);
    gl_FragColor = vec4(vColor, falloff * vAlpha);
  }
`;

/** Decodes the quantized point cloud written by scripts/bake-brain-points.mjs. */
function decodePointCloud(buffer: ArrayBuffer): PointCloud {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  );

  if (magic !== "BPC2") {
    throw new Error("Unrecognised point cloud format");
  }

  const count = view.getUint32(4, true);
  const expected = 8 + count * 7;
  if (buffer.byteLength < expected) {
    throw new Error("Point cloud is truncated");
  }

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = view.getInt16(8 + i * 2, true) / 32767;
  }

  const shellBase = 8 + count * 6;
  const shell = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    shell[i] = view.getUint8(shellBase + i) / 255;
  }

  return { positions, shell };
}

function buildGeometry({ positions, shell }: PointCloud): BufferGeometry {
  const count = positions.length / 3;
  const seeds = new Float32Array(count);

  // Deterministic per-point seed drives size, drift phase and push strength.
  for (let i = 0; i < count; i++) {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    seeds[i] = s - Math.floor(s);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  geometry.setAttribute("aShell", new BufferAttribute(shell, 1));

  return geometry;
}

export default function BrainField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Device tier decides point budget and pixel ratio. Viewport size is the
    // most reliable signal; core count is deliberately a weak one, since
    // plenty of capable laptops report only four.
    const nav = navigator as Navigator & { deviceMemory?: number };
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lowPower =
      window.innerWidth < 900 ||
      (coarsePointer && window.innerWidth < 1200) ||
      (nav.deviceMemory ?? 8) <= 2 ||
      (navigator.hardwareConcurrency ?? 8) <= 2;

    const maxPixelRatio = lowPower ? 1.5 : 2;
    let cloudUrl = lowPower
      ? "/models/brain-points-mobile.bin"
      : "/models/brain-points.bin";

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      // No WebGL. The CSS gradient backdrop stands in on its own.
      return;
    }

    /**
     * Software rasterizers (SwiftShader, llvmpipe, Microsoft Basic Render)
     * do every blended fragment on the CPU, which turns a cheap additive
     * point cloud into seconds of main-thread work. Detect them and drop to
     * a trickle of frames at the smallest point budget, so the visual still
     * lives but the page stays responsive.
     */
    let software = false;
    try {
      const gl = renderer.getContext();
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const name = debugInfo
        ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
        : "";
      software = /swiftshader|llvmpipe|software|basic render|paralle?l/i.test(
        name,
      );
    } catch {
      software = false;
    }

    // 0 means uncapped — let requestAnimationFrame run at display refresh.
    const targetFps = software ? 6 : lowPower ? 30 : reducedMotion ? 24 : 0;
    const minFrameMs = targetFps ? 1000 / targetFps - 1 : 0;

    // On a software renderer we draw the cloud, let it fade in, then stop:
    // a still point cloud beats a continuous animation that eats the CPU
    // the visitor needs for scrolling.
    const staticMode = software;
    const interactive = !reducedMotion && !staticMode;

    if (software) cloudUrl = "/models/brain-points-mobile.bin";

    renderer.setPixelRatio(
      software ? 0.75 : Math.min(window.devicePixelRatio || 1, maxPixelRatio),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 3.15);

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: lowPower ? 11.5 : 9.5 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uPointer: { value: { x: 0, y: 0 } },
      uPointerForce: { value: 0 },
      // Static mode skips the fade-in: every rendered frame is expensive on
      // a software rasterizer, so it draws the finished state once.
      uReveal: { value: staticMode ? 1 : 0 },
      uDim: { value: 1 },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
    });

    // Sparse procedural cloud so the hero is never empty on first paint.
    let geometry = buildGeometry(generateProceduralBrain(lowPower ? 3500 : 6000));
    const points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    /* --- Layout ---------------------------------------------------------- */

    // On wide screens the brain sits right of centre so the headline has
    // room on the left; on narrow screens it centres behind the text.
    const layout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      camera.aspect = aspect;
      camera.position.z = aspect < 0.85 ? 3.9 : aspect < 1.3 ? 3.45 : 3.15;
      camera.updateProjectionMatrix();

      // Sized to clear the headline column: on wide screens the whole brain
      // sits in the right-hand half, where the text scrim has faded out.
      points.position.x = aspect > 1.25 ? 0.62 : 0;
      // On narrow screens the copy needs a firm scrim for contrast, so the
      // brain rides high and reads as a luminous band above the headline
      // rather than a smear behind it.
      points.position.y = aspect > 1.25 ? -0.02 : 0.88;
      points.scale.setScalar(aspect > 1.25 ? 1.15 : 0.62);

      renderer.setPixelRatio(
        software ? 0.75 : Math.min(window.devicePixelRatio || 1, maxPixelRatio),
      );
      renderer.setSize(width, height);
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };

    layout();

    /**
     * Resting yaw puts the camera near the brain's lateral profile, which is
     * the angle that reads as a brain instantly. Rather than spinning through
     * a full turn — which spends half its time on the far less legible front
     * and back views — the cloud sways slowly around this angle.
     */
    const BASE_YAW = -1.48;
    points.rotation.set(-0.2, BASE_YAW, 0.07);

    /* --- Pointer state --------------------------------------------------- */

    const pointerTarget = { x: 0, y: 0 };
    const pointerSmooth = { x: 0, y: 0 };
    const pointerVelocity = { x: 0, y: 0 };
    let pointerForceTarget = 0;
    let parallaxTarget = { x: 0, y: 0 };
    const parallax = { x: 0, y: 0 };
    let swayPhase = 0;
    let dragOffset = 0;
    let lastTouchX: number | null = null;

    const viewportToView = (clientX: number, clientY: number) => {
      const ndcX = (clientX / window.innerWidth) * 2 - 1;
      const ndcY = -((clientY / window.innerHeight) * 2 - 1);
      const halfHeight =
        Math.tan(MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
      const halfWidth = halfHeight * camera.aspect;
      return { x: ndcX * halfWidth, y: ndcY * halfHeight, ndcX, ndcY };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!interactive) return;
      const p = viewportToView(event.clientX, event.clientY);
      pointerTarget.x = p.x;
      pointerTarget.y = p.y;
      parallaxTarget = { x: p.ndcX, y: p.ndcY };
      pointerForceTarget = 1;
    };

    const onPointerLeave = () => {
      pointerForceTarget = 0;
      parallaxTarget = { x: 0, y: 0 };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!interactive || event.touches.length === 0) return;
      const touch = event.touches[0];

      const p = viewportToView(touch.clientX, touch.clientY);
      pointerTarget.x = p.x;
      pointerTarget.y = p.y;
      pointerForceTarget = 1;

      // Horizontal drag turns the brain. Vertical movement is left to the
      // browser so the page still scrolls normally — no preventDefault.
      if (lastTouchX !== null) {
        dragOffset += ((touch.clientX - lastTouchX) / window.innerWidth) * 3;
      }
      lastTouchX = touch.clientX;
    };

    const onTouchEnd = () => {
      lastTouchX = null;
      pointerForceTarget = 0;
    };

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    }

    /* --- Scroll dimming --------------------------------------------------- */

    let dimTarget = 1;
    let scrollQueued = false;

    const readScroll = () => {
      scrollQueued = false;
      // Fade toward a floor rather than away: the brain must stay visible
      // behind every section, just quieter than it is in the hero.
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 1.1));
      dimTarget = 1 - 0.55 * progress;
    };

    const onScroll = () => {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(readScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    readScroll();

    const onResize = () => {
      layout();
      readScroll();
      // A settled static render is stale at the new size.
      wake();
    };
    window.addEventListener("resize", onResize);

    /* --- Point cloud swap -------------------------------------------------- */

    const abort = new AbortController();
    let revealing = false;

    fetch(cloudUrl, { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const next = buildGeometry(decodePointCloud(buffer));
        points.geometry = next;
        geometry.dispose();
        geometry = next;
        uniforms.uSize.value = lowPower ? 10.5 : 8.6;
        if (!staticMode) uniforms.uReveal.value = 0;
        revealing = true;
      })
      .catch(() => {
        // Keep the procedural cloud; upgrade it to full density so the hero
        // still looks finished if the baked asset never arrives.
        if (abort.signal.aborted) return;
        const next = buildGeometry(
          generateProceduralBrain(lowPower ? 12000 : 42000),
        );
        points.geometry = next;
        geometry.dispose();
        geometry = next;
        if (!staticMode) uniforms.uReveal.value = 0;
        revealing = true;
      });

    /* --- Render loop -------------------------------------------------------- */

    const clock = new Clock();
    let frame = 0;
    let running = true;

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        // A settled static render is still on screen and still correct.
        if (settled) return;
        clock.getDelta(); // discard the gap so nothing jumps
        frame = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    let pending = 0;
    let settled = false;

    function tick() {
      frame = requestAnimationFrame(tick);

      // Clamp delta so a backgrounded tab or a long task cannot produce a
      // huge jump when the loop resumes.
      pending += Math.min(clock.getDelta(), 1 / 30);

      // Frame cap. Uncapped, requestAnimationFrame already matches the
      // display's refresh rate; capped, we coalesce the skipped time into
      // the next step so motion stays smooth rather than stuttering.
      if (minFrameMs && pending * 1000 < minFrameMs) return;

      const delta = pending;
      pending = 0;
      uniforms.uTime.value += delta;

      // Spring the pointer toward the cursor with a little overshoot, which
      // is what gives the field its sense of inertia.
      const stiffness = 1 - Math.exp(-delta * 7.5);
      pointerVelocity.x += (pointerTarget.x - pointerSmooth.x) * stiffness * 1.6;
      pointerVelocity.y += (pointerTarget.y - pointerSmooth.y) * stiffness * 1.6;
      pointerVelocity.x *= 0.82;
      pointerVelocity.y *= 0.82;
      pointerSmooth.x += pointerVelocity.x;
      pointerSmooth.y += pointerVelocity.y;

      uniforms.uPointer.value.x = pointerSmooth.x;
      uniforms.uPointer.value.y = pointerSmooth.y;
      uniforms.uPointerForce.value +=
        (pointerForceTarget - uniforms.uPointerForce.value) *
        (1 - Math.exp(-delta * 4));

      parallax.x += (parallaxTarget.x - parallax.x) * (1 - Math.exp(-delta * 2.2));
      parallax.y += (parallaxTarget.y - parallax.y) * (1 - Math.exp(-delta * 2.2));

      // Slow sway around the lateral angle, plus cursor parallax and
      // whatever the user dragged, which eases back rather than snapping.
      swayPhase += delta * (reducedMotion ? 0.09 : 0.2);
      dragOffset *= Math.exp(-delta * 0.3);
      points.rotation.y =
        BASE_YAW +
        Math.sin(swayPhase) * (reducedMotion ? 0.16 : 0.3) +
        dragOffset +
        parallax.x * 0.1;
      points.rotation.x = -0.2 + parallax.y * 0.16;
      points.rotation.z = 0.07 + parallax.x * 0.05;

      uniforms.uDim.value +=
        (dimTarget - uniforms.uDim.value) * (1 - Math.exp(-delta * 5));

      if (revealing && uniforms.uReveal.value < 1) {
        uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + delta * 1.3);
      } else if (!revealing) {
        uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + delta * 2.2);
      }

      renderer.render(scene, camera);

      // Software renderers settle to a still image once the cloud has
      // faded in, and only wake again on resize.
      if (staticMode && revealing && uniforms.uReveal.value >= 1) {
        settled = true;
        cancelAnimationFrame(frame);
      }
    }

    /** Restarts the loop after it has settled in static mode. */
    function wake() {
      if (!settled || !running) return;
      settled = false;
      clock.getDelta();
      pending = 0;
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);

    /* --- Teardown ------------------------------------------------------------ */

    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      abort.abort();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // The gradient backdrop lives in BrainBackdrop so it paints from the
  // server-rendered HTML; this element only hosts the canvas.
  return <div ref={containerRef} aria-hidden="true" className="h-full w-full" />;
}
