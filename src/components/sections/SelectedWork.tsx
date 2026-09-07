"use client";

import { useState, useMemo } from "react";
import { Project, PortfolioData } from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "../portfolio/ProjectModal";
import { Search, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";


interface SelectedWorkProps {
  projects: Project[];
  categories: PortfolioData["categories"];
}

export function SelectedWork({ projects, categories }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((proj) => {
      counts[proj.categoryKey] = (counts[proj.categoryKey] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === "all" || project.categoryKey === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <section
      id="work"
      className="relative w-full py-24 px-6 sm:px-12 bg-[#0B0B0C] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#6F6F6B] tracking-widest uppercase mb-2 font-label">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>02 / 06 — PORTFOLIO SHOWCASE</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-serif text-[#F5F5F2] tracking-tight uppercase font-section-heading">
                FEATURED WORKS
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-mono text-[#A8A8A3] max-w-md font-body-text">
              GRAPHIC DESIGN • INSTAGRAM REELS • GTA V / FIVEM CINEMATICS • COMMERCIAL ADS • WEDDING EDITS
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Navigation Bar & Search */}
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel border border-white/10">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-white text-black font-bold shadow-lg scale-[1.02]"
                      : "text-[#A8A8A3] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-black/10 text-black"
                        : "bg-white/10 text-[#6F6F6B]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#6F6F6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-white/10 text-xs font-mono text-white placeholder-[#6F6F6B] focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
        </ScrollReveal>


        {/* Projects Feed */}
        {filteredProjects.length > 0 ? (
          <div className="flex flex-col gap-12">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-3xl p-10 flex flex-col items-center gap-3">
            <p className="text-base font-serif text-[#F5F5F2]">No projects found in this category.</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="text-xs font-mono text-emerald-400 hover:underline"
            >
              Reset Category Filters
            </button>
          </div>
        )}
      </div>

      {/* Project Lightbox Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
