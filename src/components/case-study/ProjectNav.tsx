"use client";

import Link from "next/link";
import { Project } from "@/data/projects";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ProjectNav({
  prevProject,
  nextProject,
}: {
  prevProject: Project | null;
  nextProject: Project | null;
}) {
  return (
    <section className="w-full py-20 px-6 sm:px-12 bg-[#080809] border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Previous Project Link */}
        {prevProject ? (
          <Link
            href={`/work/${prevProject.slug}`}
            className="group glass-card p-8 rounded-3xl flex flex-col justify-between gap-6 hover:bg-white/5 transition-all"
            data-cursor="OPEN →"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-[#6F6F6B]">
              <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
              <span>PREVIOUS PROJECT [{prevProject.number}]</span>
            </div>

            <div>
              <span className="text-xs font-mono text-[#A8A8A3] block mb-1">
                {prevProject.category}
              </span>
              <h3 className="text-2xl font-serif text-[#F5F5F2] group-hover:text-white transition-colors">
                {prevProject.title}
              </h3>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next Project Link */}
        {nextProject ? (
          <Link
            href={`/work/${nextProject.slug}`}
            className="group glass-card p-8 rounded-3xl flex flex-col justify-between gap-6 hover:bg-white/5 transition-all sm:text-right"
            data-cursor="OPEN →"
          >
            <div className="flex items-center justify-start sm:justify-end gap-2 text-xs font-mono text-[#6F6F6B]">
              <span>NEXT PROJECT [{nextProject.number}]</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </div>

            <div>
              <span className="text-xs font-mono text-[#A8A8A3] block mb-1">
                {nextProject.category}
              </span>
              <h3 className="text-2xl font-serif text-[#F5F5F2] group-hover:text-white transition-colors">
                {nextProject.title}
              </h3>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
