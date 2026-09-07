"use client";

import { PortfolioData } from "@/data/portfolio";
import { CheckCircle2, Terminal, Award } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface AboutProps {
  data: PortfolioData;
}

export function About({ data }: AboutProps) {
  const { personal, tools, clients, services } = data;

  return (
    <section
      id="about"
      className="relative w-full py-28 px-6 sm:px-12 bg-[#080809] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block mb-2 font-label">
                05 / 06 — PROFILE & PHILOSOPHY
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif text-[#F5F5F2] tracking-tight uppercase font-section-heading">
                ABOUT SURESH
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-badge text-xs font-mono text-emerald-400 border border-emerald-500/20 font-label">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{personal.availability}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Editorial Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Biography Column */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <ScrollReveal variant="slide-up" delay={50}>
              <h3 className="text-2xl sm:text-4xl font-serif text-[#F5F5F2] leading-snug font-section-heading">
                “{personal.editorialStatement}”
              </h3>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={150}>
              <div className="flex flex-col gap-6 text-sm sm:text-base font-sans text-[#A8A8A3] leading-relaxed font-light font-body-text">
                {personal.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>

            {/* Design Philosophy Bullet Points */}
            <ScrollReveal variant="fade-up" delay={250}>
              <div className="mt-4 p-6 sm:p-8 rounded-2xl glass-panel flex flex-col gap-4 border border-white/10">
                <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block font-label">
                  CREATIVE PHILOSOPHY
                </span>
                <ul className="flex flex-col gap-3">
                  {personal.philosophy.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#F5F5F2] font-body-text">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Tools, Credentials & Client Roster Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Tools Stack */}
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-4 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#6F6F6B] tracking-widest uppercase font-label">
                  <Terminal className="w-4 h-4 text-white/60" />
                  <span>TOOLKIT & SOFTWARE STACK</span>
                </div>
                <div className="flex flex-wrap gap-2 font-label">
                  {tools.map((tool, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg glass-badge text-[#F5F5F2]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Services Offered */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-4 border border-white/10">
                <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block font-label">
                  SPECIALIZED SERVICES
                </span>
                <div className="flex flex-col gap-2.5 text-xs font-mono text-[#A8A8A3] font-body-text">
                  {services.map((service, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Client Roster */}
            <ScrollReveal variant="fade-up" delay={300}>
              <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col gap-4 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#6F6F6B] tracking-widest uppercase font-label">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>FEATURED CLIENTS & COLLABORATORS</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-[#A8A8A3] font-body-text">
                  {clients.map((client, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      <span>{client}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
