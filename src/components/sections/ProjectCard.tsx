"use client";

import Image from "next/image";
import { Project } from "@/data/portfolio";
import { ArrowUpRight, Play } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: () => void;
}

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  return (
    <ScrollReveal
      variant="fade-up"
      delay={(index % 3) * 80}
      threshold={0.08}
      className="w-full"
    >
      <div
        onClick={onSelect}
        className="group relative w-full rounded-3xl overflow-hidden glass-card p-6 sm:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch cursor-pointer border border-white/5 hover:border-white/20 transition-colors duration-500"
        data-cursor="VIEW"
      >
        {/* Visual Container */}
        <div className="relative w-full lg:w-3/5 h-[320px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-[#121215]">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority={index < 2}
            loading={index >= 2 ? "lazy" : undefined}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-transparent to-transparent pointer-events-none" />

          {/* Video Indicator Badge */}
          {project.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full glass-capsule flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Project Number Glass Badge */}
          <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full glass-capsule text-xs font-mono text-[#F5F5F2] font-semibold tracking-widest font-label">
            {project.number}
          </div>

          {/* Year Badge */}
          <div className="absolute top-5 right-5 px-3 py-1.5 rounded-full glass-badge text-xs font-mono text-[#A8A8A3] font-label">
            {project.year}
          </div>
        </div>

        {/* Narrative Metadata Column */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between py-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase font-label">
                {project.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif text-[#F5F5F2] tracking-tight group-hover:text-white transition-colors uppercase font-portfolio-title">
              {project.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#A8A8A3] font-sans leading-relaxed font-light font-portfolio-desc">
              {project.shortDescription}
            </p>

            {/* Key Services Badges */}
            <div className="flex flex-wrap gap-2 mt-2 font-label">
              {project.services.slice(0, 3).map((service, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md glass-badge text-[#A8A8A3]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Action Link */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 text-xs font-mono tracking-widest text-[#F5F5F2] group-hover:text-white font-btn">
              <span>VIEW DETAILS</span>
              <div className="w-8 h-8 rounded-full glass-button flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
            </div>

            <span className="text-xs font-mono text-[#6F6F6B] font-label">
              {project.client}
            </span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
