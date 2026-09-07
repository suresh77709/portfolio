"use client";

import React, { useEffect, useRef, useState } from "react";

export type ScrollRevealVariant =
  | "fade-up"
  | "fade-in"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "image-reveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.12,
  className = "",
  as: Component = "div",
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Initial and revealed transformation states using performant hardware-accelerated CSS
  const getTransformClasses = () => {
    switch (variant) {
      case "fade-up":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-7 pointer-events-none";
      case "slide-up":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12 pointer-events-none";
      case "fade-in":
        return isVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none";
      case "slide-left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10 pointer-events-none";
      case "slide-right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-10 pointer-events-none";
      case "scale-in":
        return isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-[0.96] pointer-events-none";
      case "image-reveal":
        return isVisible
          ? "opacity-100 scale-100 filter-none"
          : "opacity-0 scale-[1.04] pointer-events-none";
      default:
        return isVisible ? "opacity-100" : "opacity-0";
    }
  };

  const style: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: isVisible ? "auto" : "transform, opacity",
  };

  return (
    <Component
      ref={ref}
      style={style}
      className={`scroll-reveal-item transition-all ${getTransformClasses()} ${className}`}
    >
      {children}
    </Component>
  );
}
