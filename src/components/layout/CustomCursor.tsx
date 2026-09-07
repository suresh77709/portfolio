"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CustomCursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(true);

  useEffect(() => {
    // Check for touch interface
    const checkTouch = () => {
      setIsTouch(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia("(pointer: coarse)").matches
      );
    };

    checkTouch();
    if (isTouch || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const updatePosition = () => {
      // Smooth lerp cursor tracking
      currentX += (mouseX - currentX) * 0.25;
      currentY += (mouseY - currentY) * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target) {
        const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
        if (cursorTarget) {
          const customLabel = cursorTarget.getAttribute("data-cursor");
          setLabel(customLabel || "");
          setIsHovered(true);
        } else {
          const isInteractive = target.closest("a, button, input, [role='button']");
          if (isInteractive) {
            setLabel("");
            setIsHovered(true);
          } else {
            setLabel("");
            setIsHovered(false);
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isTouch, prefersReducedMotion]);

  if (isTouch || prefersReducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
      }}
    >
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-200 ${
          isHovered
            ? label
              ? "w-16 h-16 bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-110"
              : "w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/40 scale-125"
            : "w-4 h-4 bg-white/60 backdrop-blur-xs border border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        }`}
      >
        {label && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#F5F5F2] uppercase select-none">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
