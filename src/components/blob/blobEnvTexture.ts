"use client";

import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const EQ_W = 1024;
const EQ_H = 512;

/**
 * Equirectangular HDR-style map: soft studio gradient and blurred luminance noise
 * for chrome reflections (monochrome).
 */
export function paintBlobEquirectEnv(canvas: HTMLCanvasElement) {
  canvas.width = EQ_W;
  canvas.height = EQ_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cx0 = EQ_W / 2;
  const cy0 = EQ_H / 2;
  const spot = Math.hypot(EQ_W, EQ_H) * 0.11;
  const ang = Math.PI / 4;
  const cx = cx0 + Math.cos(ang) * spot;
  const cy = cy0 - Math.sin(ang) * spot;
  const rad = Math.hypot(EQ_W, EQ_H) * 0.95;
  const rg = ctx.createRadialGradient(cx, cy, rad * 0.05, cx, cy, rad);
  rg.addColorStop(0, "#f2f2f2");
  rg.addColorStop(0.12, "#a8a8a8");
  rg.addColorStop(0.38, "#303030");
  rg.addColorStop(0.72, "#0c0c0c");
  rg.addColorStop(1, "#020202");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, EQ_W, EQ_H);

  const halfDiag = Math.hypot(EQ_W, EQ_H) * 0.52;
  const vg = ctx.createLinearGradient(
    cx0 - Math.cos(ang) * halfDiag,
    cy0 - Math.sin(ang) * halfDiag,
    cx0 + Math.cos(ang) * halfDiag,
    cy0 + Math.sin(ang) * halfDiag,
  );
  vg.addColorStop(0, "rgba(255,255,255,0.14)");
  vg.addColorStop(0.35, "rgba(80,80,80,0.08)");
  vg.addColorStop(0.55, "rgba(0,0,0,0.12)");
  vg.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, EQ_W, EQ_H);

  const nw = 200;
  const nh = 100;
  const noise = document.createElement("canvas");
  noise.width = nw;
  noise.height = nh;
  const nctx = noise.getContext("2d");
  if (!nctx) return;
  const img = nctx.createImageData(nw, nh);
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      const i = (y * nw + x) * 4;
      const v = 55 + Math.random() * 200;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  nctx.putImageData(img, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.filter = "blur(28px)";
  ctx.globalAlpha = 0.62;
  ctx.drawImage(noise, 0, 0, EQ_W, EQ_H);
  ctx.globalAlpha = 0.28;
  ctx.filter = "blur(6px)";
  ctx.drawImage(noise, Math.random() * 6, Math.random() * 6, EQ_W, EQ_H);
  ctx.restore();
}

export function BlobEnvironment() {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    const canvas = document.createElement("canvas");
    paintBlobEquirectEnv(canvas);

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const target = pmrem.fromEquirectangular(tex);
    tex.dispose();

    const prev = scene.environment;
    scene.environment = target.texture;

    return () => {
      scene.environment = prev ?? null;
      target.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}
