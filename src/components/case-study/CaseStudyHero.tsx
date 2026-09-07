"use client";

import Image from "next/image";
import Link from "next/link";
import { Project } from "@/data/portfolio";
import { ArrowLeft } from "lucide-react";

export function CaseStudyHero({ project }: { project: Project }) {
  const heroImg = project.heroImage || project.coverImage;
  const metrics = project.metrics || [];

  return (
    <section className="relative w-full pt-32 pb-20 px-6 sm:px-12 bg-[#0B0B0C] border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A8A8A3] hover:text-[#F5F5F2] transition-colors"
          data-cursor="OPEN →"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO PORTFOLIO</span>
        </Link>

        {/* Header Meta */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#6F6F6B]">
            <span className="px-3 py-1 rounded-full glass-badge text-emerald-400 font-semibold">
              PROJECT {project.number}
            </span>
            <span>/</span>
            <span>{project.category}</span>
            <span>/</span>
            <span>{project.year}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-[#F5F5F2] tracking-tight uppercase leading-[0.95]">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-[#A8A8A3] font-sans font-light max-w-3xl leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Hero Image Container */}
        <div className="relative w-full h-[400px] sm:h-[600px] rounded-3xl overflow-hidden glass-card">
          <Image
            src={heroImg}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent opacity-40" />
        </div>

        {/* Metrics Grid */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            {metrics.map((metric, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-serif text-[#F5F5F2] font-semibold text-emerald-400">
                  {metric.value}
                </span>
                <span className="text-xs font-mono text-[#6F6F6B] uppercase tracking-wider mt-1">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
