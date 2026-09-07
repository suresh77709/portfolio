"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Project } from "@/data/portfolio";
import { X, Play, ArrowUpRight, CheckCircle2, Tag } from "lucide-react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-300">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-10 text-[#F5F5F2] shadow-2xl border border-white/15 flex flex-col gap-8 custom-scrollbar">
        {/* Top Header Bar */}
        <div className="flex justify-between items-start gap-4 pb-6 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
                PROJECT {project.number}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider glass-badge text-emerald-400 border border-emerald-500/20">
                {project.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif tracking-tight text-white uppercase">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-3 rounded-full glass-button hover:bg-white/20 transition-all shrink-0"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Media Player / Hero Section */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#121215] border border-white/10">
          {project.videoUrl ? (
            <iframe
              src={project.videoUrl}
              title={project.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          )}
        </div>

        {/* Overview & Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="text-lg font-serif text-white tracking-wide">
              PROJECT OVERVIEW
            </h3>
            <p className="text-sm sm:text-base text-[#A8A8A3] leading-relaxed font-light">
              {project.fullDescription || project.shortDescription}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-3 py-1 rounded-md glass-badge text-[#A8A8A3] flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3 text-white/50" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 p-6 rounded-2xl glass-card border border-white/10">
            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#6F6F6B]">CLIENT</span>
                <span className="text-white font-semibold">{project.client}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#6F6F6B]">YEAR</span>
                <span className="text-white font-semibold">{project.year}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#6F6F6B]">CATEGORY</span>
                <span className="text-white font-semibold">{project.category}</span>
              </div>
            </div>

            {/* Services List */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] font-mono text-[#6F6F6B] uppercase tracking-widest">
                DELIVERABLES & SERVICES
              </span>
              <ul className="flex flex-col gap-1.5 text-xs font-sans text-[#A8A8A3]">
                {project.services.map((service, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Inquiry CTA */}
            <a
              href={`mailto:sureshtriple7709@gmail.com?subject=Inquiry regarding ${encodeURIComponent(
                project.title
              )}`}
              className="mt-2 w-full py-3 rounded-full glass-button text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 group"
            >
              <span>INQUIRE ABOUT SIMILAR WORK</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
