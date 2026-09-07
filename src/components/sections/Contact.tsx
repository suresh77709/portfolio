"use client";

import { useState } from "react";
import { PortfolioData } from "@/data/portfolio";
import { ArrowUpRight, Copy, Check, Mail, Clock, MapPin, Zap } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ContactProps {
  data: PortfolioData["personal"];
}

export function Contact({ data }: ContactProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(data.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-32 px-6 sm:px-12 bg-[#0B0B0C] border-t border-white/5 overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" delay={50}>
          <div className="flex items-center gap-3 text-xs font-mono text-[#6F6F6B] tracking-widest uppercase font-label">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>06 / 06 — COMMISSIONS & CONTACT</span>
          </div>
        </ScrollReveal>

        {/* Large Headline */}
        <div className="flex flex-col gap-6">
          <ScrollReveal variant="slide-up" delay={100}>
            <h2 className="text-4xl sm:text-7xl md:text-8xl font-serif text-[#F5F5F2] leading-[0.95] tracking-tight uppercase max-w-5xl font-section-heading">
              LET’S CREATE SOMETHING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CBD5E1] to-[#64748B]">
                EXTRAORDINARY TOGETHER.
              </span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={200}>
            <p className="text-sm sm:text-base text-[#A8A8A3] font-sans font-light max-w-xl font-body-text">
              Available for graphic design commissions, video editing projects, FiveM server promos, and wedding video edits worldwide.
            </p>
          </ScrollReveal>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Large Glass Email CTA Box */}
          <ScrollReveal variant="fade-up" delay={250} className="lg:col-span-8">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col justify-between gap-8 border border-white/15 h-full">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3 text-xs font-mono text-[#6F6F6B] font-label">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>DIRECT EMAIL INQUIRIES</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full bg-emerald-500/10 font-label">
                  RESPONSE TIME &lt; 24H
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-[#A8A8A3] block mb-2 font-label">EMAIL ADDRESS</span>
                <a
                  href={`mailto:${data.email}`}
                  className="text-2xl sm:text-4xl font-mono text-[#F5F5F2] font-semibold tracking-tight break-all hover:text-emerald-400 transition-colors font-hero-title"
                >
                  {data.email}
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 font-btn">
                <button
                  onClick={copyEmail}
                  className="px-6 py-3.5 rounded-full glass-button text-xs font-mono tracking-widest uppercase flex items-center gap-2"
                  data-cursor="OPEN →"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>COPY EMAIL ADDRESS</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${data.email}`}
                  className="px-6 py-3.5 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs font-mono tracking-widest text-[#F5F5F2] flex items-center gap-2"
                  data-cursor="OPEN →"
                >
                  <span>OPEN MAIL CLIENT</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Dedicated Commission Specs Card (Replaces duplicate social links) */}
          <ScrollReveal variant="fade-up" delay={350} className="lg:col-span-4">
            <div className="glass-panel p-8 rounded-3xl flex flex-col gap-6 h-full justify-between border border-white/10">
              <span className="text-xs font-mono text-[#6F6F6B] tracking-widest uppercase font-label">
                COMMISSION DETAILS
              </span>

              <div className="flex flex-col gap-5 text-xs font-mono">
                <div className="flex items-start gap-3 pb-3 border-b border-white/5">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F5F5F2] block font-medium">STATUS</span>
                    <span className="text-[#A8A8A3]">{data.availability}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pb-3 border-b border-white/5">
                  <MapPin className="w-4 h-4 text-[#A8A8A3] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F5F5F2] block font-medium">LOCATION</span>
                    <span className="text-[#A8A8A3]">{data.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#A8A8A3] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F5F5F2] block font-medium">WORKFLOW</span>
                    <span className="text-[#A8A8A3]">Remote Collaboration & Fast Iteration</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-[#8E8E88]">
                Social links are placed in the footer below for a clean, non-repetitive layout.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
