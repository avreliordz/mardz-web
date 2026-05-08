"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type RootState,
  type ThreeEvent,
} from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { BlobEnvironment } from "./blobEnvTexture";
import { appendBlobNoiseAndDisplace, appendBlobSurfaceGrain } from "./blobShaders";
import type { MetallicBlobProps } from "./blob.types";
import { useBlobState } from "./useBlobState";
import { cn } from "@/lib/utils";

const DPR_CAP = 1.5;

const DRAG_ROT_Y = 0.0052;
const DRAG_PINCH = 0.00165;
const TAP_THRESH_PX = 7;
const PINCH_LIMIT = 0.15;
/** Click cycles 1 … MAX then back to 1 duplicate triangle stack (wire shells). */
const MAX_WIRE_SHELLS = 4;
const WIRE_SHELL_SCALE_STEP = 0.019;

type BlobUniforms = {
  uNoisePhase: { value: number };
  uNoiseFreq: { value: number };
  uNoiseAmp: { value: number };
  uHoverStrength: { value: number };
  uClickKick: { value: number };
};

function createBlobUniforms(): BlobUniforms {
  return {
    uNoisePhase: { value: 0 },
    uNoiseFreq: { value: 0.72 },
    uNoiseAmp: { value: 0.14 },
    uHoverStrength: { value: 0 },
    uClickKick: { value: 0 },
  };
}

function attachBlobShaders(
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  uniforms: BlobUniforms,
  opts?: { surfaceGrain?: boolean },
) {
  mat.userData.blobUniforms = uniforms;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uNoisePhase = uniforms.uNoisePhase;
    shader.uniforms.uNoiseFreq = uniforms.uNoiseFreq;
    shader.uniforms.uNoiseAmp = uniforms.uNoiseAmp;
    shader.uniforms.uHoverStrength = uniforms.uHoverStrength;
    shader.uniforms.uClickKick = uniforms.uClickKick;
    shader.vertexShader = appendBlobNoiseAndDisplace(shader.vertexShader);
    if (opts?.surfaceGrain) {
      shader.fragmentShader = `uniform float uNoisePhase;\n${appendBlobSurfaceGrain(shader.fragmentShader)}`;
    }
  };
}

function createMainBlobMaterial(uniforms: BlobUniforms) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.88, 0.94, 0.99),
    metalness: 0.04,
    roughness: 0.055,
    transmission: 0.89,
    thickness: 0.95,
    ior: 1.54,
    transparent: true,
    opacity: 1,
    envMapIntensity: 2.35,
    attenuationColor: new THREE.Color(0.82, 0.92, 1),
    attenuationDistance: 1.05,
    clearcoat: 0.38,
    clearcoatRoughness: 0.09,
    specularIntensity: 1,
    specularColor: new THREE.Color(1, 1, 1),
  });
  attachBlobShaders(mat, uniforms, { surfaceGrain: true });
  return mat;
}

/** Shares displacement uniforms so wireframe tracks the same deformation as the shaded mesh. */
function createWireframeOverlayMaterial(uniforms: BlobUniforms) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.82, 0.88, 0.96),
    emissive: new THREE.Color(0.35, 0.42, 0.55),
    emissiveIntensity: 0.06,
    metalness: 0.25,
    roughness: 0.55,
    envMapIntensity: 0.5,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
  });
  attachBlobShaders(mat, uniforms);
  return mat;
}

type SceneProps = {
  detail: number;
  onRipple: (clientX: number, clientY: number) => void;
};

function BlobScene({ detail, onRipple }: SceneProps) {
  const { gl } = useThree();
  const {
    advance,
    pointerHandlers,
    applyClickImpulse,
    clickKick,
    hoverSmoothedRef,
    noisePhase,
    noiseFreq,
    noiseAmp,
    roughness,
    scale,
  } = useBlobState();
  const [wireShellCount, setWireShellCount] = useState(1);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const pinchOffsetRef = useRef(0);

  const blobUniforms = useMemo(() => createBlobUniforms(), []);
  const material = useMemo(
    () => createMainBlobMaterial(blobUniforms),
    [blobUniforms],
  );
  const wireMaterial = useMemo(
    () => createWireframeOverlayMaterial(blobUniforms),
    [blobUniforms],
  );
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.4, detail),
    [detail],
  );

  useEffect(() => {
    wireMeshRefs.current.length = wireShellCount;
    const id = requestAnimationFrame(() => {
      for (let i = 0; i < wireShellCount; i++) {
        const m = wireMeshRefs.current[i];
        if (!m) continue;
        m.raycast = (raycaster, intersects) => {
          void raycaster;
          void intersects;
        };
      }
    });
    return () => cancelAnimationFrame(id);
  }, [wireShellCount]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
    };
  }, [geometry, material, wireMaterial]);

  useFrame((state, delta) => {
    advance(delta);
    const u = blobUniforms;
    u.uNoisePhase.value = noisePhase.current;
    u.uNoiseFreq.value = noiseFreq.current;
    u.uNoiseAmp.value = noiseAmp.current;
    u.uHoverStrength.value = hoverSmoothedRef.current;
    u.uClickKick.value = clickKick.current;

    material.roughness = Math.min(0.18, 0.028 + roughness.current * 0.55);
    material.envMapIntensity = 2.55;

    const g = groupRef.current;
    if (g) {
      const t = state.clock.elapsedTime;
      g.position.y = Math.sin(t * ((Math.PI * 2) / 3)) * 0.15;
      if (!draggingRef.current) {
        g.rotation.y += 0.002;
      }
      const s = scale.current * (1 + pinchOffsetRef.current);
      g.scale.setScalar(s);
    }
  });

  const endDragSession = useCallback(
    (ev: PointerEvent, clientX: number, clientY: number) => {
      const el = gl.domElement;
      try {
        el.releasePointerCapture(ev.pointerId);
      } catch {
        /* not captured */
      }
      draggingRef.current = false;

      const start = dragStartRef.current;
      dragStartRef.current = null;
      if (!start) return;
      const dx = clientX - start.x;
      const dy = clientY - start.y;
      if (dx * dx + dy * dy < TAP_THRESH_PX * TAP_THRESH_PX) {
        setWireShellCount((n) => (n % MAX_WIRE_SHELLS) + 1);
        applyClickImpulse();
        onRipple(clientX, clientY);
      }
    },
    [applyClickImpulse, gl, onRipple],
  );

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.stopPropagation();
      draggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      const el = gl.domElement;
      const pid = e.pointerId;

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        const g = groupRef.current;
        if (!g) return;
        g.rotation.y += ev.movementX * DRAG_ROT_Y;
        pinchOffsetRef.current = THREE.MathUtils.clamp(
          pinchOffsetRef.current - ev.movementY * DRAG_PINCH,
          -PINCH_LIMIT,
          PINCH_LIMIT,
        );
      };

      const onUpOrCancel = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUpOrCancel);
        el.removeEventListener("pointercancel", onUpOrCancel);
        endDragSession(ev, ev.clientX, ev.clientY);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUpOrCancel);
      el.addEventListener("pointercancel", onUpOrCancel);
      el.setPointerCapture(pid);
    },
    [endDragSession, gl],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} near={0.1} far={100} />
      <BlobEnvironment />
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          material={material}
          onPointerDown={handlePointerDown}
          onPointerEnter={() => {
            pointerHandlers.onPointerEnter();
          }}
          onPointerLeave={() => {
            pointerHandlers.onPointerLeave();
          }}
        />
        {Array.from({ length: wireShellCount }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              wireMeshRefs.current[i] = el;
            }}
            geometry={geometry}
            material={wireMaterial}
            scale={1 + i * WIRE_SHELL_SCALE_STEP}
            renderOrder={i + 1}
          />
        ))}
      </group>
    </>
  );
}

export default function MetallicBlob({
  className,
  icosahedronDetail = 5,
}: MetallicBlobProps) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dpr, setDpr] = useState(1);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const rippleId = useRef(0);
  useEffect(() => {
    setMounted(true);
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    setDpr(Math.min(DPR_CAP, window.devicePixelRatio || 1));
  }, []);

  const addRipple = useCallback((clientX: number, clientY: number) => {
    const id = rippleId.current++;
    setRipples((r) => [...r, { id, x: clientX, y: clientY }]);
    window.setTimeout(() => {
      setRipples((r) => r.filter((x) => x.id !== id));
    }, 620);
  }, []);

  const handleGlCreated = useCallback((state: RootState) => {
    state.gl.setClearColor(0x000000, 1);
    state.gl.domElement.setAttribute("data-blob-hero", "");
    state.gl.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
    });
  }, []);

  if (!mounted || reducedMotion) {
    return (
      <div
        className={cn(
          "absolute inset-0 z-0 h-full min-h-[100vh] w-full bg-black",
          className,
        )}
        data-blob-hero
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "absolute inset-0 z-0 h-full min-h-[100vh] w-full bg-black",
        className,
      )}
      data-blob-hero
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 cursor-none">
        <Suspense
          fallback={<div className="absolute inset-0 bg-black" aria-hidden />}
        >
          <Canvas
            className="h-full w-full touch-none"
            style={{ width: "100%", height: "100%" }}
            dpr={[1, dpr]}
            frameloop="always"
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "default",
            }}
            onCreated={handleGlCreated}
          >
            <BlobScene detail={icosahedronDetail} onRipple={addRipple} />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute size-10 animate-blob-ripple rounded-full border border-white/25"
            style={{
              left: r.x,
              top: r.y,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
