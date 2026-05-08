"use client";

import { useCallback, useRef } from "react";
import type { BlobStateTargets } from "./blob.types";

/** Single “grid-ish” crystal base; hover still modulates noise slightly. */
const BASE: BlobStateTargets = {
  noiseFreq: 1.85,
  noiseAmp: 0.2,
  speed: 0.85,
  roughness: 0.11,
  scale: 1,
  emissiveMax: 0,
};

function easeToward(current: number, target: number, dt: number, tau: number) {
  if (tau <= 0) return target;
  const k = 1 - Math.exp(-dt / tau);
  return current + (target - current) * k;
}

export function useBlobState() {
  const hoverTargetRef = useRef(0);
  const hoverSmoothedRef = useRef(0);

  const noiseFreq = useRef(BASE.noiseFreq);
  const noiseAmp = useRef(BASE.noiseAmp);
  const speed = useRef(BASE.speed);
  const roughness = useRef(BASE.roughness);
  const scale = useRef(BASE.scale);
  const noisePhase = useRef(0);
  const clickKick = useRef(0);

  const applyClickImpulse = useCallback(() => {
    clickKick.current = Math.min(clickKick.current + 0.92, 1);
    noisePhase.current += 2.85;
  }, []);

  const computeTargets = useCallback((): BlobStateTargets => {
    const h = hoverSmoothedRef.current;
    const freqMul = 1 + 0.28 * h;
    const ampMul = 1 + 0.22 * h;
    return {
      noiseFreq: BASE.noiseFreq * freqMul,
      noiseAmp: BASE.noiseAmp * ampMul,
      speed: BASE.speed,
      roughness: BASE.roughness,
      scale: BASE.scale,
      emissiveMax: 0,
    };
  }, []);

  const advance = useCallback(
    (dt: number) => {
      const ht = hoverTargetRef.current;
      const hs = hoverSmoothedRef.current;
      const tauHover = ht > hs ? 0.12 : 0.18;
      hoverSmoothedRef.current = easeToward(hs, ht, dt, tauHover);

      const t = computeTargets();
      const tauMorph = 0.22;
      noiseFreq.current = easeToward(noiseFreq.current, t.noiseFreq, dt, tauMorph);
      noiseAmp.current = easeToward(noiseAmp.current, t.noiseAmp, dt, tauMorph);
      speed.current = easeToward(speed.current, t.speed, dt, tauMorph);
      roughness.current = easeToward(roughness.current, t.roughness, dt, tauMorph);
      scale.current = easeToward(scale.current, t.scale, dt, tauMorph);

      noisePhase.current += dt * speed.current * (1.0 + clickKick.current * 0.95);
      clickKick.current *= Math.exp(-dt * 2.15);
    },
    [computeTargets],
  );

  const pointerHandlers = {
    onPointerEnter: () => {
      hoverTargetRef.current = 1;
    },
    onPointerLeave: () => {
      hoverTargetRef.current = 0;
    },
  };

  return {
    hoverSmoothedRef,
    advance,
    pointerHandlers,
    applyClickImpulse,
    clickKick,
    noiseFreq,
    noiseAmp,
    speed,
    roughness,
    scale,
    noisePhase,
  };
}
