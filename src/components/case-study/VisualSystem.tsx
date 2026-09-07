"use client";

import { useState } from "react";
import { Project } from "@/data/portfolio";
import { Check, Copy } from "lucide-react";

export function VisualSystem({ project }: { project: Project }) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const primaryFont = project.typography?.primaryFont || "Inter Display";
  const secondaryFont = project.typography?.secondaryFont || "JetBrains Mono";
  const specText = project.typography?.specimenText || project.title;
  const colors = project.colors || [
    { name: "Obsidian Void", hex: "#0B0B0C", role: "Primary Canvas" },
    { name: "Emerald Accent", hex: "#10B981", role: "Interactive Highlight" },
    { name: "Titanium White", hex: "#F5F5F2", role: "Typography" }
  ];

  return (
    <section className="w-full py-24 px-6 sm:px-12 bg-[#080809] border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-8 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase block mb-2">
              DESIGN SYSTEM SPECIFICATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F2] tracking-tight uppercase">
              VISUAL SYSTEM
            </h2>
          </div>

          <p className="text-xs font-mono text-[#A8A8A3]">
            TYPOGRAPHY SPECIMEN & COLOR PALETTE ARCHITECTURE
          </p>
        </div>

        {/* Typography Specimen Section */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col gap-8">
          <div className="flex justify-between items-center pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#6F6F6B] uppercase tracking-widest block">
                TYPOGRAPHIC FAMILY
              </span>
              <span className="text-xl font-serif text-[#F5F5F2]">
                {primaryFont} + {secondaryFont}
              </span>
            </div>
            <span className="text-xs font-mono text-[#A8A8A3] hidden sm:block">
              {project.typography?.description || "Bespoke typography architecture."}
            </span>
          </div>

          {/* Large Type Specimen */}
          <div className="py-8">
            <span className="text-xs font-mono text-[#6F6F6B] block mb-4">SPECIMEN DISPLAY</span>
            <p className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#F5F5F2] leading-tight tracking-tight uppercase">
              {specText}
            </p>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase">
            COLOR PALETTE TOKENS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color, i) => (
              <div
                key={i}
                onClick={() => copyHex(color.hex)}
                className="glass-card p-4 rounded-2xl flex flex-col gap-4 cursor-pointer group"
                data-cursor="OPEN →"
              >
                <div
                  className="w-full h-32 rounded-xl shadow-inner relative flex items-end justify-end p-3"
                  style={{ backgroundColor: color.hex }}
                >
                  <button className="w-8 h-8 rounded-full glass-button flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedHex === color.hex ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-[#F5F5F2] font-semibold">
                    {color.name}
                  </span>
                  <span className="text-xs font-mono text-[#6F6F6B]">{color.hex}</span>
                </div>

                <span className="text-[11px] font-sans text-[#A8A8A3]">
                  {color.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
