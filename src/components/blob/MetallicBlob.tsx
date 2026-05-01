"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type RootState, type ThreeEvent } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { appendBlobNoiseAndDisplace } from "./blobShaders";
import type { MetallicBlobProps } from "./blob.types";
import { useBlobState } from "./useBlobState";
import { cn } from "@/lib/utils";

const DPR_CAP = 1.5;

function createBlobMaterial() {
  const uniforms = {
    uNoisePhase: { value: 0 },
    uNoiseFreq: { value: 1.2 },
    uNoiseAmp: { value: 0.38 },
    uHoverStrength: { value: 0 },
  };

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
    roughness: 0.05,
    envMapIntensity: 2.5,
  });

  mat.userData.blobUniforms = uniforms;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uNoisePhase = uniforms.uNoisePhase;
    shader.uniforms.uNoiseFreq = uniforms.uNoiseFreq;
    shader.uniforms.uNoiseAmp = uniforms.uNoiseAmp;
    shader.uniforms.uHoverStrength = uniforms.uHoverStrength;
    shader.vertexShader = appendBlobNoiseAndDisplace(shader.vertexShader);
  };

  return mat;
}

type SceneProps = {
  detail: number;
  initialState: NonNullable<MetallicBlobProps["initialState"]>;
  onStateChange?: MetallicBlobProps["onStateChange"];
  onRipple: (clientX: number, clientY: number) => void;
  onHoverChange: (hovering: boolean) => void;
  onGlowMove: (clientX: number, clientY: number) => void;
};

function BlobScene({
  detail,
  initialState,
  onStateChange,
  onRipple,
  onHoverChange,
  onGlowMove,
}: SceneProps) {
  const {
    advance,
    cycleState,
    pointerHandlers,
    stateRef,
    hoverSmoothedRef,
    noisePhase,
    noiseFreq,
    noiseAmp,
    roughness,
    scale,
    emissive,
    strobePhase,
  } = useBlobState(initialState, onStateChange);
  const groupRef = useRef<THREE.Group>(null);
  const strobeRef = useRef<THREE.PointLight>(null);
  const material = useMemo(() => createBlobMaterial(), []);
  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.4, detail),
    [detail],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    advance(delta);
    const u = material.userData.blobUniforms as {
      uNoisePhase: { value: number };
      uNoiseFreq: { value: number };
      uNoiseAmp: { value: number };
      uHoverStrength: { value: number };
    };
    u.uNoisePhase.value = noisePhase.current;
    u.uNoiseFreq.value = noiseFreq.current;
    u.uNoiseAmp.value = noiseAmp.current;
    u.uHoverStrength.value = hoverSmoothedRef.current;

    material.roughness = roughness.current;
    material.envMapIntensity = 2.5;
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
      g.rotation.y += 0.003;
      const s = scale.current;
      g.scale.setScalar(s);
    }

    const strobe = strobeRef.current;
    if (strobe) {
      if (stateRef.current === 3) {
        const pulse = 0.5 + 0.5 * Math.sin(strobePhase.current);
        strobe.intensity = 1.4 * pulse + 0.35;
      } else {
        strobe.intensity = 0;
      }
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      cycleState();
      const ev = e.nativeEvent;
      onRipple(ev.clientX, ev.clientY);
    },
    [cycleState, onRipple],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} near={0.1} far={100} />
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[2, 4, 2]}
        intensity={1.6}
        color={new THREE.Color(1, 1, 1)}
      />
      <pointLight
        position={[-3, -2, -1]}
        intensity={0.8}
        color={new THREE.Color(0.667, 0.667, 0.667)}
      />
      <pointLight
        ref={strobeRef}
        position={[3, 2, 2]}
        intensity={0}
        color={new THREE.Color(1, 1, 1)}
      />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <group ref={groupRef}>
        <mesh
          geometry={geometry}
          material={material}
          onClick={handleClick}
          onPointerEnter={() => {
            pointerHandlers.onPointerEnter();
            onHoverChange(true);
          }}
          onPointerLeave={() => {
            pointerHandlers.onPointerLeave();
            onHoverChange(false);
          }}
          onPointerMove={(e) => {
            const ev = e.nativeEvent;
            onGlowMove(ev.clientX, ev.clientY);
          }}
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
  const [hovering, setHovering] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const glowRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  const moveGlow = useCallback((x: number, y: number) => {
    const el = glowRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }, []);

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
              onHoverChange={setHovering}
              onGlowMove={moveGlow}
            />
          </Canvas>
        </Suspense>
      </div>

      <div
        ref={glowRef}
        className="pointer-events-none fixed z-[5] h-[120px] w-[120px] rounded-full"
        style={{
          opacity: hovering ? 0.12 : 0,
          background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
          filter: "blur(12px)",
          transition: "opacity 0.25s ease-out",
          left: 0,
          top: 0,
          willChange: "transform, opacity",
        }}
        aria-hidden
      />

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
