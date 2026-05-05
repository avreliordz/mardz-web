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
import { appendBlobNoiseAndDisplace } from "./blobShaders";
import type { MetallicBlobProps } from "./blob.types";
import { useBlobState } from "./useBlobState";
import { cn } from "@/lib/utils";

const DPR_CAP = 1.5;

/** W × √(2), height × √(2), depth × √(2) → direction ~45° azimuth & ~45° elevation from −Z “behind” axis */
const BACKLIGHT_POS = new THREE.Vector3(-5, 5, -5);

/** Sparse cursor rim — tight falloff, low peak intensity */
const CURSOR_LIGHT_PEAK = 0.72;
const CURSOR_LIGHT_DISTANCE = 5.5;

type BlobUniforms = {
  uNoisePhase: { value: number };
  uNoiseFreq: { value: number };
  uNoiseAmp: { value: number };
  uHoverStrength: { value: number };
};

function createBlobUniforms(): BlobUniforms {
  return {
    uNoisePhase: { value: 0 },
    uNoiseFreq: { value: 0.72 },
    uNoiseAmp: { value: 0.14 },
    uHoverStrength: { value: 0 },
  };
}

function attachBlobVertexShader(mat: THREE.MeshStandardMaterial, uniforms: BlobUniforms) {
  mat.userData.blobUniforms = uniforms;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uNoisePhase = uniforms.uNoisePhase;
    shader.uniforms.uNoiseFreq = uniforms.uNoiseFreq;
    shader.uniforms.uNoiseAmp = uniforms.uNoiseAmp;
    shader.uniforms.uHoverStrength = uniforms.uHoverStrength;
    shader.vertexShader = appendBlobNoiseAndDisplace(shader.vertexShader);
  };
}

function createMainBlobMaterial(uniforms: BlobUniforms) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    metalness: 1,
    roughness: 0.08,
    envMapIntensity: 2.15,
  });
  attachBlobVertexShader(mat, uniforms);
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
  attachBlobVertexShader(mat, uniforms);
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
    hoverSmoothedRef,
    noisePhase,
    noiseFreq,
    noiseAmp,
    roughness,
    scale,
    emissive,
  } = useBlobState(initialState, onStateChange);
  const { camera } = useThree();
  const [wireframeActive, setWireframeActive] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireMeshRef = useRef<THREE.Mesh>(null);
  const cursorLightRef = useRef<THREE.PointLight>(null);
  /** Initial hint toward camera (+Z) until first hover hit */
  const cursorLightTarget = useRef(new THREE.Vector3(0, 0.2, 4.2));
  const cursorLightIntensity = useRef(0);
  const cursorLightIntensityTarget = useRef(0);

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
    const wm = wireMeshRef.current;
    if (!wm) return;
    wm.raycast = (raycaster, intersects) => {
      void raycaster;
      void intersects;
    };
  }, []);

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

    material.roughness = roughness.current;
    material.envMapIntensity = 2.45;
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

    const cursorLight = cursorLightRef.current;
    if (cursorLight) {
      cursorLight.position.lerp(
        cursorLightTarget.current,
        1 - Math.exp(-delta * 11),
      );
      const ti = cursorLightIntensityTarget.current;
      cursorLightIntensity.current +=
        (ti - cursorLightIntensity.current) * (1 - Math.exp(-delta * 8));
      cursorLight.intensity = cursorLightIntensity.current;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      setWireframeActive((v) => !v);
      cycleState();
      const ev = e.nativeEvent;
      onRipple(ev.clientX, ev.clientY);
    },
    [cycleState, onRipple],
  );

  const updateCursorLightFromEvent = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!e.face) return;
      const towardCam = new THREE.Vector3().subVectors(camera.position, e.point);
      if (towardCam.lengthSq() < 1e-8) return;
      towardCam.normalize();
      cursorLightTarget.current
        .copy(e.point)
        .addScaledVector(towardCam, 0.38);
      cursorLightIntensityTarget.current = CURSOR_LIGHT_PEAK;
    },
    [camera],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} near={0.1} far={100} />
      <directionalLight
        position={[BACKLIGHT_POS.x, BACKLIGHT_POS.y, BACKLIGHT_POS.z]}
        intensity={0.95}
        color={new THREE.Color(0.78, 0.82, 0.92)}
      />
      <pointLight
        ref={cursorLightRef}
        intensity={0}
        distance={CURSOR_LIGHT_DISTANCE}
        decay={2}
        color={new THREE.Color(0.94, 0.96, 1)}
      />
      <BlobEnvironment />
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
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
            cursorLightIntensityTarget.current = 0;
          }}
          onPointerMove={(e) => {
            updateCursorLightFromEvent(e);
            const ev = e.nativeEvent;
            onGlowMove(ev.clientX, ev.clientY);
          }}
        />
        <mesh
          ref={wireMeshRef}
          geometry={geometry}
          material={wireMaterial}
          visible={wireframeActive}
          renderOrder={1}
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
        className="pointer-events-none fixed z-[5] h-[96px] w-[96px] rounded-full"
        style={{
          opacity: hovering ? 0.11 : 0,
          background:
            "radial-gradient(circle, rgba(248,250,255,0.55) 0%, rgba(150,170,210,0.08) 42%, transparent 68%)",
          filter: "blur(18px)",
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
