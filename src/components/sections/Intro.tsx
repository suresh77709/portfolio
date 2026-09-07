"use client";

import { useEffect, useRef } from "react";
import { PortfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface IntroProps {
  data: PortfolioData["personal"];
}

export function Intro({ data }: IntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (headlineRef.current) {
        headlineRef.current.style.opacity = "1";
        headlineRef.current.style.transform = "none";
      }
      return;
    }

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0.2, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative w-full py-24 px-6 sm:px-12 bg-[#0B0B0C] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Tag */}
        <ScrollReveal variant="fade-up">
          <div className="flex items-center gap-3 text-xs font-mono text-[#6F6F6B] tracking-widest uppercase font-label">
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span>CREATIVE VISION & PHILOSOPHY</span>
          </div>
        </ScrollReveal>

        {/* Large Editorial Headline */}
        <h2
          ref={headlineRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F5F5F2] leading-[1.1] tracking-tight max-w-5xl uppercase font-section-heading"
        >
          “{data.editorialStatement}”
        </h2>

        {/* Narrative & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
          <ScrollReveal variant="fade-up" delay={100} className="lg:col-span-7">
            <div className="flex flex-col gap-6 text-sm sm:text-base text-[#A8A8A3] leading-relaxed font-sans font-light font-body-text">
              <p>{data.bio[0]}</p>
              <p>{data.bio[1]}</p>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <ScrollReveal variant="scale-in" delay={100}>
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-white/10">
                <span className="text-3xl sm:text-4xl font-serif text-[#F5F5F2] font-semibold text-emerald-400 font-display">
                  100+
                </span>
                <span className="text-xs font-mono text-[#6F6F6B] tracking-wider uppercase mt-2 font-label">
                  PROJECTS COMPLETED
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="scale-in" delay={150}>
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-white/10">
                <span className="text-3xl sm:text-4xl font-serif text-[#F5F5F2] font-semibold font-display">
                  5+
                </span>
                <span className="text-xs font-mono text-[#6F6F6B] tracking-wider uppercase mt-2 font-label">
                  SPECIALIZED CATEGORIES
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="scale-in" delay={200}>
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-white/10">
                <span className="text-3xl sm:text-4xl font-serif text-[#F5F5F2] font-semibold font-display">
                  100%
                </span>
                <span className="text-xs font-mono text-[#6F6F6B] tracking-wider uppercase mt-2 font-label">
                  CLIENT SATISFACTION
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="scale-in" delay={250}>
              <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center border border-white/10">
                <span className="text-3xl sm:text-4xl font-serif text-[#F5F5F2] font-semibold font-display">
                  24H
                </span>
                <span className="text-xs font-mono text-[#6F6F6B] tracking-wider uppercase mt-2 font-label">
                  INQUIRY TURNAROUND
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
