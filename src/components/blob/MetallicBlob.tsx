"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
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
  mat: THREE.MeshStandardMaterial,
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
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 2.15,
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
  initialState: NonNullable<MetallicBlobProps["initialState"]>;
  onStateChange?: MetallicBlobProps["onStateChange"];
  onRipple: (clientX: number, clientY: number) => void;
};

function BlobScene({
  detail,
  initialState,
  onStateChange,
  onRipple,
}: SceneProps) {
  const {
    advance,
    cycleState,
    pointerHandlers,
    applyClickImpulse,
    clickKick,
    hoverSmoothedRef,
    noisePhase,
    noiseFreq,
    noiseAmp,
    roughness,
    scale,
    emissive,
  } = useBlobState(initialState, onStateChange);
  const [extraWireShell, setExtraWireShell] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireMeshRef = useRef<THREE.Mesh>(null);
  const wireMeshOuterRef = useRef<THREE.Mesh>(null);

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
    const id = requestAnimationFrame(() => {
      for (const ref of [wireMeshRef, wireMeshOuterRef]) {
        const m = ref.current;
        if (!m) continue;
        m.raycast = (raycaster, intersects) => {
          void raycaster;
          void intersects;
        };
      }
    });
    return () => cancelAnimationFrame(id);
  }, [extraWireShell]);

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

    material.roughness = roughness.current;
    material.envMapIntensity = 2.68;
    const em = emissive.current;
    material.emissiveIntensity = em;
    if (em > 0.0001) {
      material.emissive.setRGB(1, 1, 1);
    } else {
      material.emissive.setRGB(0, 0, 0);
    }

    const g = groupRef.current;
    if (g) {
      const t = state.clock.elapsedTime;
      g.position.y = Math.sin(t * ((Math.PI * 2) / 3)) * 0.15;
      g.rotation.y += 0.002;
      const s = scale.current;
      g.scale.setScalar(s);
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setExtraWireShell(true);
      applyClickImpulse();
      cycleState();
      const ev = e.nativeEvent;
      onRipple(ev.clientX, ev.clientY);
    },
    [applyClickImpulse, cycleState, onRipple],
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
          onClick={handleClick}
          onPointerEnter={() => {
            pointerHandlers.onPointerEnter();
          }}
          onPointerLeave={() => {
            pointerHandlers.onPointerLeave();
          }}
        />
        <mesh
          ref={wireMeshRef}
          geometry={geometry}
          material={wireMaterial}
          renderOrder={1}
        />
        <mesh
          ref={wireMeshOuterRef}
          geometry={geometry}
          material={wireMaterial}
          visible={extraWireShell}
          scale={1.019}
          renderOrder={2}
        />
      </group>
    </>
  );
}

export default function MetallicBlob({
  className,
  initialState = 0,
  onStateChange,
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
            <BlobScene
              detail={icosahedronDetail}
              initialState={initialState}
              onStateChange={onStateChange}
              onRipple={addRipple}
            />
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
