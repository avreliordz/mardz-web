"use client";

import { useCallback, useRef } from "react";
import type { BlobDiscreteState, BlobStateTargets } from "./blob.types";

/** Faceted / grid-ish read at index 0; click cycles 0 → 1 → 2 → 0. */
const STATE_TABLE: BlobStateTargets[] = [
  {
    noiseFreq: 1.85,
    noiseAmp: 0.2,
    speed: 0.85,
    roughness: 0.22,
    scale: 1,
    emissiveMax: 0,
  },
  {
    noiseFreq: 0.42,
    noiseAmp: 0.26,
    speed: 0.16,
    roughness: 0.08,
    scale: 1.12,
    emissiveMax: 0,
  },
  {
    noiseFreq: 2.75,
    noiseAmp: 0.13,
    speed: 1.65,
    roughness: 0.08,
    scale: 1,
    emissiveMax: 0.08,
  },
];

function easeToward(current: number, target: number, dt: number, tau: number) {
  if (tau <= 0) return target;
  const k = 1 - Math.exp(-dt / tau);
  return current + (target - current) * k;
}

export function useBlobState(
  initialState: BlobDiscreteState = 0,
  onStateChange?: (state: number) => void,
) {
  const stateRef = useRef<BlobDiscreteState>(initialState);
  const hoverTargetRef = useRef(0);
  const hoverSmoothedRef = useRef(0);

  const noiseFreq = useRef(STATE_TABLE[initialState].noiseFreq);
  const noiseAmp = useRef(STATE_TABLE[initialState].noiseAmp);
  const speed = useRef(STATE_TABLE[initialState].speed);
  const roughness = useRef(STATE_TABLE[initialState].roughness);
  const scale = useRef(STATE_TABLE[initialState].scale);
  const emissive = useRef(0);
  const noisePhase = useRef(0);
  const strobePhase = useRef(0);
  const clickKick = useRef(0);

  const applyClickImpulse = useCallback(() => {
    clickKick.current = Math.min(clickKick.current + 0.92, 1);
    noisePhase.current += 2.85;
  }, []);

  const computeTargets = useCallback((): BlobStateTargets => {
    const s = STATE_TABLE[stateRef.current];
    const h = hoverSmoothedRef.current;
    const freqMul = 1 + 0.28 * h;
    const ampMul = 1 + 0.22 * h;
    return {
      noiseFreq: s.noiseFreq * freqMul,
      noiseAmp: s.noiseAmp * ampMul,
      speed: s.speed,
      roughness: s.roughness,
      scale: s.scale,
      emissiveMax: s.emissiveMax,
    };
  }, []);

  const advance = useCallback((dt: number) => {
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

    const emMax = t.emissiveMax;
    if (stateRef.current === 2) {
      strobePhase.current += dt * Math.PI * 2 * 8;
      const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(strobePhase.current));
      const flicker = 0.06 + 0.02 * Math.sin(dt * 620 + noisePhase.current * 3);
      emissive.current = easeToward(
        emissive.current,
        Math.min(emMax * pulse + flicker, emMax * 1.25),
        dt,
        0.04,
      );
    } else {
      strobePhase.current = 0;
      emissive.current = easeToward(emissive.current, 0, dt, 0.12);
    }
  }, [computeTargets]);

  const cycleState = useCallback(() => {
    const next = ((stateRef.current + 1) % 3) as BlobDiscreteState;
    stateRef.current = next;
    onStateChange?.(next);
  }, [onStateChange]);

  const pointerHandlers = {
    onPointerEnter: () => {
      hoverTargetRef.current = 1;
    },
    onPointerLeave: () => {
      hoverTargetRef.current = 0;
    },
  };

  return {
    stateRef,
    hoverSmoothedRef,
    advance,
    cycleState,
    pointerHandlers,
    applyClickImpulse,
    clickKick,
    noiseFreq,
    noiseAmp,
    speed,
    roughness,
    scale,
    emissive,
    noisePhase,
    strobePhase,
  };
}
