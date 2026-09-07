"use client";

import { useEffect, useRef } from "react";

export function AmbientGlassCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Subtle ambient liquid orb animation parameters
    let time = 0;

    const render = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Primary Glass Ambient Glow (Emerald / Obsidian / Cyan soft highlights)
      const x1 = width * 0.5 + Math.sin(time * 0.8) * (width * 0.15);
      const y1 = height * 0.4 + Math.cos(time * 0.6) * (height * 0.12);
      const r1 = Math.min(width, height) * 0.35;

      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      grad1.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      grad1.addColorStop(0.5, "rgba(56, 189, 248, 0.02)");
      grad1.addColorStop(1, "rgba(11, 11, 12, 0)");

      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, Math.PI * 2);
      ctx.fill();

      // Secondary floating subtle orb
      const x2 = width * 0.3 + Math.cos(time * 0.5) * (width * 0.2);
      const y2 = height * 0.6 + Math.sin(time * 0.7) * (height * 0.15);
      const r2 = Math.min(width, height) * 0.25;

      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      grad2.addColorStop(0, "rgba(203, 213, 225, 0.04)");
      grad2.addColorStop(1, "rgba(11, 11, 12, 0)");

      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
    </div>
  );
}
