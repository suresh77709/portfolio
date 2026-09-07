"use client";

import { useState } from "react";
import Image from "next/image";
import { EXPERIMENTS_DATA, Experiment } from "@/data/experiments";
import { X, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Experiments() {
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);

  return (
    <section
      id="experiments"
      className="relative w-full py-28 px-6 sm:px-12 bg-[#0B0B0C] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block mb-2 font-label">
                04 / 06 — VISUAL RESEARCH & LAB
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif text-[#F5F5F2] tracking-tight uppercase font-section-heading">
                EXPERIMENTS
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-mono text-[#A8A8A3] max-w-md font-body-text">
              UNCOMMISSIONED GRAPHIC EXPLORATIONS, FIVE M SHADER TESTS, AND KINETIC REELS STUDIES.
            </p>
          </div>
        </ScrollReveal>

        {/* Grid of Experiments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERIMENTS_DATA.map((exp, index) => (
            <ScrollReveal
              key={exp.id}
              variant="fade-up"
              delay={(index % 3) * 80}
            >
              <div
                onClick={() => setSelectedExp(exp)}
                className="group glass-card rounded-2xl p-4 flex flex-col gap-4 cursor-pointer overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
                data-cursor="VIEW"
              >
                <div className="relative w-full h-72 rounded-xl overflow-hidden bg-[#121215]">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-badge text-[10px] font-mono text-[#F5F5F2] font-label">
                    {exp.year}
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-2">
                  <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase font-label">
                    {exp.category}
                  </span>
                  <h3 className="text-lg font-serif text-[#F5F5F2] group-hover:text-white transition-colors uppercase font-portfolio-title">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#A8A8A3] font-sans line-clamp-2 font-portfolio-desc">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2 font-label">
                    {exp.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-2 py-0.5 rounded glass-badge text-[#6F6F6B]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedExp && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0C]/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl glass-panel p-6 sm:p-8 rounded-3xl flex flex-col lg:flex-row gap-8 max-h-[90vh] overflow-y-auto border border-white/15">
            <button
              onClick={() => setSelectedExp(null)}
              className="absolute top-4 right-4 p-2 rounded-full glass-button hover:bg-white/20 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="relative w-full lg:w-3/5 h-[300px] sm:h-[400px] rounded-2xl overflow-hidden bg-[#121215]">
              <Image
                src={selectedExp.image}
                alt={selectedExp.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="w-full lg:w-2/5 flex flex-col justify-between py-2">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-emerald-400 uppercase font-label">
                  {selectedExp.category} — {selectedExp.year}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F5F2] uppercase font-section-heading">
                  {selectedExp.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A8A8A3] font-sans leading-relaxed font-body-text">
                  {selectedExp.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 font-label">
                  {selectedExp.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-3 py-1 rounded-full glass-badge text-[#A8A8A3]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs font-mono text-[#6F6F6B] font-label">
                RESEARCH ARCHIVE // SURESH LAB
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
