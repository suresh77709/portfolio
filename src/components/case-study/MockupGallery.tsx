"use client";

import Image from "next/image";
import { Project } from "@/data/portfolio";

export function MockupGallery({ project }: { project: Project }) {
  const gallery = project.gallery || [];

  if (gallery.length === 0) return null;

  return (
    <section className="w-full py-24 px-6 sm:px-12 bg-[#0B0B0C] border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block mb-2">
              APPLICATIONS & CAMPAIGN SHOWCASE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F2] tracking-tight uppercase">
              FINAL OUTCOME
            </h2>
          </div>

          <p className="text-xs font-mono text-[#A8A8A3]">
            FULL PRODUCTION MOCKUPS & PHYSICAL ARTIFACTS
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-col gap-12">
          {gallery.map((item, index) => (
            <div
              key={item.id}
              className="group glass-card rounded-3xl overflow-hidden p-4 sm:p-6 flex flex-col gap-4"
              data-cursor="VIEW"
            >
              <div className="relative w-full h-[360px] sm:h-[560px] md:h-[680px] rounded-2xl overflow-hidden bg-[#121215]">
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="flex justify-between items-center px-2 py-1 text-xs font-mono text-[#A8A8A3]">
                <span>FIG {index + 1} — {item.caption}</span>
                <span className="text-[#6F6F6B]">{project.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
