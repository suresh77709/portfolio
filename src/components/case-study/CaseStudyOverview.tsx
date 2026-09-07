"use client";

import { Project } from "@/data/portfolio";

export function CaseStudyOverview({ project }: { project: Project }) {
  const challenge = project.challenge || "Creating a visual language that stands out in a crowded market while maintaining clean aesthetic hierarchy.";
  const concept = project.concept || "Focus on dynamic visual pacing, vibrant color contrasts, and typography.";
  const solution = project.solution || "Delivered high-resolution designs and video edits tailored for maximum client engagement.";
  const outcome = project.outcome || "Increased engagement, positive feedback, and boosted brand visibility across digital channels.";

  return (
    <section className="w-full py-20 px-6 sm:px-12 bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Project Meta Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6">
            <div>
              <span className="text-[10px] font-mono text-[#6F6F6B] uppercase tracking-widest block mb-1">
                CLIENT
              </span>
              <span className="text-sm font-mono text-[#F5F5F2]">{project.client}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#6F6F6B] uppercase tracking-widest block mb-1">
                YEAR & TIMELINE
              </span>
              <span className="text-sm font-mono text-[#F5F5F2]">{project.year}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#6F6F6B] uppercase tracking-widest block mb-2">
                SERVICES DELIVERED
              </span>
              <div className="flex flex-wrap gap-2">
                {project.services.map((service, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-3 py-1 rounded-full glass-badge text-[#A8A8A3]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Deep Dive Column */}
        <div className="lg:col-span-8 flex flex-col gap-16">
          {/* Overview */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
              PROJECT OVERVIEW
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#F5F5F2]">
              {project.fullDescription || project.shortDescription}
            </h2>
          </div>

          {/* Challenge */}
          <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
            <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
              THE STRATEGIC CHALLENGE
            </span>
            <p className="text-sm sm:text-base font-sans text-[#A8A8A3] leading-relaxed font-light">
              {challenge}
            </p>
          </div>

          {/* Concept */}
          <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
            <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
              THE DESIGN CONCEPT
            </span>
            <p className="text-sm sm:text-base font-sans text-[#A8A8A3] leading-relaxed font-light">
              {concept}
            </p>
          </div>

          {/* Solution & Outcome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
                THE SOLUTION
              </span>
              <p className="text-xs sm:text-sm font-sans text-[#A8A8A3] leading-relaxed">
                {solution}
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
                FINAL OUTCOME
              </span>
              <p className="text-xs sm:text-sm font-sans text-[#A8A8A3] leading-relaxed">
                {outcome}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
