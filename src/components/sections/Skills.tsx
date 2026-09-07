"use client";

import { useState } from "react";
import Image from "next/image";
import { SkillCategory } from "@/data/portfolio";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface SkillsProps {
  skills: SkillCategory[];
}

export function Skills({ skills }: SkillsProps) {
  const [activeSkill, setActiveSkill] = useState<SkillCategory | null>(skills[0] || null);

  return (
    <section
      id="skills"
      className="relative w-full py-28 px-6 sm:px-12 bg-[#080809] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block mb-2 font-label">
                03 / 06 — CORE SERVICES & CAPABILITIES
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif text-[#F5F5F2] tracking-tight uppercase font-section-heading">
                SPECIALIZATIONS
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-mono text-[#A8A8A3] max-w-md font-body-text">
              EXPERT SERVICES IN GRAPHIC DESIGN, VIDEO EDITING, FIVEM CINEMATICS, REELS & BRANDING.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Skill List Container */}
        <div className="relative w-full flex flex-col">
          {skills.map((skill, index) => {
            const isSelected = activeSkill?.number === skill.number;
            return (
              <ScrollReveal
                key={skill.number}
                variant="fade-up"
                delay={index * 60}
                className="w-full"
              >
                <div
                  onMouseEnter={() => setActiveSkill(skill)}
                  className={`group relative w-full py-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer transition-all duration-300 ${
                    isSelected ? "bg-white/[0.02] px-4 rounded-xl" : "hover:px-4"
                  }`}
                  data-cursor="VIEW"
                >
                  {/* Number & Title */}
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="text-xs font-mono text-emerald-400 font-semibold font-label">
                      {skill.number}
                    </span>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#F5F5F2] group-hover:text-white transition-all group-hover:translate-x-2 uppercase font-portfolio-title">
                      {skill.title}
                    </h3>
                  </div>

                  {/* Subtitle & Description */}
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-xs font-mono text-[#A8A8A3] group-hover:text-white font-medium font-label">
                        {skill.subtitle}
                      </span>
                      <span className="text-[11px] font-sans text-[#6F6F6B] max-w-xs text-left md:text-right hidden sm:block font-body-text">
                        {skill.description}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full glass-button flex items-center justify-center group-hover:rotate-45 transition-transform shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Desktop Active Skill Preview Card */}
        {activeSkill && (
          <ScrollReveal variant="fade-up" delay={200} className="hidden lg:block">
            <div className="mt-6 p-6 glass-panel rounded-2xl max-w-md ml-auto border border-white/10">
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-[#121215]">
                <Image
                  src={activeSkill.previewImage}
                  alt={activeSkill.title}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-[#F5F5F2] font-label">
                <span className="font-bold text-emerald-400">{activeSkill.number} — {activeSkill.title}</span>
              </div>
              <p className="text-xs text-[#A8A8A3] font-sans mt-2 leading-relaxed font-body-text">
                {activeSkill.description}
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
