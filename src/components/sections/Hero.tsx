"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PortfolioData } from "@/data/portfolio";
import { HeroSettings } from "@/types/settings";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import gsap from "gsap";

const AmbientGlassCanvas = dynamic(
  () => import("@/components/webgl/AmbientGlassCanvas").then((m) => m.AmbientGlassCanvas),
  { ssr: false }
);

interface HeroProps {
  data: PortfolioData["personal"];
  heroSettings?: HeroSettings;
}

export function Hero({ data, heroSettings }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (title1Ref.current) title1Ref.current.style.opacity = "1";
      if (title2Ref.current) title2Ref.current.style.opacity = "1";
      if (subtitleRef.current) subtitleRef.current.style.opacity = "1";
      if (ctaRef.current) ctaRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

      tl.fromTo(
        title1Ref.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.1 }
      )
        .fromTo(
          title2Ref.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.9"
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow interval if slideshow mode is active
  useEffect(() => {
    if (
      heroSettings?.bgType === "slideshow" &&
      heroSettings.bgSlideshowUrls &&
      heroSettings.bgSlideshowUrls.length > 1
    ) {
      const intervalSec = heroSettings.bgSlideshowInterval || 5;
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSettings.bgSlideshowUrls!.length);
      }, intervalSec * 1000);
      return () => clearInterval(timer);
    }
  }, [heroSettings?.bgType, heroSettings?.bgSlideshowUrls, heroSettings?.bgSlideshowInterval]);

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const workEl = document.getElementById("work");
    if (workEl) {
      workEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const bgType = heroSettings?.bgType || "ambient";
  
  // Normalize overlayOpacity (0 to 100%)
  const rawOverlay = heroSettings?.bgOverlayOpacity ?? 65;
  const overlayOpacity = rawOverlay <= 1 ? rawOverlay : rawOverlay / 100;

  // Normalize mediaOpacity (0 to 100%)
  const rawMedia = heroSettings?.bgMediaOpacity ?? 100;
  const mediaOpacity = rawMedia <= 1 ? rawMedia : rawMedia / 100;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[680px] flex flex-col justify-between items-center px-6 sm:px-12 pt-28 pb-10 overflow-hidden bg-[#0B0B0C]"
    >
      {/* Background Media Rendering with Direct Opacity Control */}
      {bgType === "video" && heroSettings?.bgMediaUrl ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src={heroSettings.bgMediaUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={heroSettings.bgPosterUrl}
            preload="metadata"
            className="w-full h-full object-cover scale-[1.02] transition-opacity duration-300"
            style={{ opacity: mediaOpacity }}
          />
        </div>
      ) : bgType === "image" && heroSettings?.bgMediaUrl ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroSettings.bgMediaUrl}
            alt="Hero Background"
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: mediaOpacity }}
          />
        </div>
      ) : bgType === "slideshow" &&
        heroSettings?.bgSlideshowUrls &&
        heroSettings.bgSlideshowUrls.length > 0 ? (
        <div className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-300" style={{ opacity: mediaOpacity }}>
          {heroSettings.bgSlideshowUrls.map((slideUrl, idx) => (
            <img
              key={idx}
              src={slideUrl}
              alt={`Slide ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}
        </div>
      ) : (
        /* Default WebGL 3D Ambient Glass Canvas with Opacity */
        <div className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-300" style={{ opacity: mediaOpacity }}>
          <AmbientGlassCanvas />
        </div>
      )}

      {/* Dark Overlay Gradient for contrast with configurable opacity */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0B0B0C]/90 via-[#0B0B0C]/50 to-[#0B0B0C] pointer-events-none z-[1] transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Subtle Grid Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-[2]" />

      {/* Top Meta info */}
      <div className="relative z-10 w-full max-w-7xl flex justify-between items-center text-xs font-mono text-[#A8A8A3] font-label">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{data.name} — OFFICIAL PORTFOLIO</span>
        </div>
        <div className="hidden sm:block text-[11px] tracking-widest text-[#6F6F6B]">
          {data.profession}
        </div>
      </div>

      {/* Center Cinematic Typography Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center justify-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-badge mb-6 text-[11px] font-mono tracking-widest uppercase font-label">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{heroSettings?.badgeText || data.availability}</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-serif tracking-tighter leading-[0.9] text-[#F5F5F2] font-semibold uppercase select-none font-hero-title">
          <span ref={title1Ref} className="block">
            {heroSettings?.title1 || "GRAPHIC DESIGNER"}
          </span>
          <span
            ref={title2Ref}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CBD5E1] to-[#64748B]"
          >
            {heroSettings?.title2 || "& VIDEO EDITOR"}
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-[#A8A8A3] font-sans font-light tracking-wide text-balance font-body-text"
        >
          {heroSettings?.subtitle || data.tagline}
        </p>

        {/* Action CTAs */}
        <div
          ref={ctaRef}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto font-btn"
        >
          <a
            href={heroSettings?.ctaLink || "#work"}
            onClick={heroSettings?.ctaLink?.startsWith("#") ? scrollToWork : undefined}
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-button text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-3 group"
            data-cursor="VIEW"
          >
            <span>{heroSettings?.ctaText || "EXPLORE SHOWCASE"}</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href={`mailto:${data.email}`}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs font-mono tracking-widest text-[#F5F5F2] hover:text-white transition-all flex items-center justify-center gap-2"
            data-cursor="OPEN →"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>CONTACT SURESH</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>


      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 w-full max-w-7xl flex justify-between items-end text-[11px] font-mono text-[#6F6F6B]">
        <div className="hidden md:block">
          <span>GRAPHIC DESIGN | REELS | GTA V / FIVEM | CLIENTS | WEDDING</span>
        </div>

        <a
          href="#work"
          onClick={scrollToWork}
          className="mx-auto md:mx-0 flex items-center gap-2 text-[#A8A8A3] hover:text-white transition-colors group cursor-pointer"
        >
          <span className="tracking-widest">SCROLL TO PORTFOLIO</span>
          <div className="w-5 h-8 rounded-full border border-white/20 p-1 flex justify-center items-start">
            <div className="w-1 h-2 rounded-full bg-white animate-bounce" />
          </div>
        </a>

        <div className="hidden md:block">
          <span>HIGH IMPACT VISUALS</span>
        </div>
      </div>
    </section>
  );
}
