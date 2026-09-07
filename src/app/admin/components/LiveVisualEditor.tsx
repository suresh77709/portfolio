"use client";

import React, { useState, useEffect, useRef } from "react";
import { PortfolioData, Project, SkillCategory } from "@/data/portfolio";
import { HeroSettings, SiteSettings } from "@/types/settings";
import { TypographySettings, FONT_LIBRARY } from "@/data/fonts";
import { SocialLinkItem } from "@/data/socials";
import { MediaPickerModal } from "./MediaPickerModal";
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Save,
  RotateCcw,
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Video,
  Layers,
  Check,
  X,
  ExternalLink,
  Edit3,
  Upload,
  Eye,
  Plus,
  Trash2,
  HelpCircle,
} from "lucide-react";

// Public preview components
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Skills } from "@/components/sections/Skills";
import { Experiments } from "@/components/sections/Experiments";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export interface LiveVisualEditorProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
  hero: HeroSettings;
  setHero: React.Dispatch<React.SetStateAction<HeroSettings>>;
  typography: TypographySettings;
  setTypography: React.Dispatch<React.SetStateAction<TypographySettings>>;
  socialLinks: SocialLinkItem[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinkItem[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onSave: () => Promise<void>;
  onDiscard: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onExit: () => void;
}

type DeviceMode = "desktop" | "laptop" | "tablet" | "mobile";
type ActiveEditElement =
  | null
  | { type: "heroText" }
  | { type: "heroMedia" }
  | { type: "aboutBio" }
  | { type: "project"; projectId: string }
  | { type: "service"; serviceNum: string }
  | { type: "contact" };

export function LiveVisualEditor({
  portfolio,
  setPortfolio,
  hero,
  setHero,
  typography,
  setTypography,
  socialLinks,
  setSocialLinks,
  siteSettings,
  setSiteSettings,
  onSave,
  onDiscard,
  isSaving,
  hasUnsavedChanges,
  onExit,
}: LiveVisualEditorProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [activeElement, setActiveElement] = useState<ActiveEditElement>({ type: "heroMedia" });
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    title: string;
    accept?: "all" | "image" | "video";
    currentValue?: string;
    onSelect: (url: string) => void;
  }>({
    isOpen: false,
    title: "Select Media",
    onSelect: () => {},
  });

  // Warn on tab close if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Viewport width calculation
  const getViewportWidthClass = () => {
    switch (deviceMode) {
      case "mobile":
        return "max-w-[390px] shadow-2xl border-x border-white/20";
      case "tablet":
        return "max-w-[768px] shadow-2xl border-x border-white/20";
      case "laptop":
        return "max-w-[1280px] shadow-2xl border-x border-white/20";
      case "desktop":
      default:
        return "w-full";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080809] text-[#F5F5F2] overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <header className="h-14 border-b border-white/10 bg-[#0E0E11] px-4 flex items-center justify-between z-30 shrink-0">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#A8A8A3] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Exit Live Editor"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Editor</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-wider text-white">
              LIVE VISUAL BUILDER
            </span>
          </div>
          {hasUnsavedChanges && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30 animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>

        {/* Viewport Simulator Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono ${
              deviceMode === "desktop"
                ? "bg-white text-black font-bold"
                : "text-[#A8A8A3] hover:text-white"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[10px]">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode("laptop")}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono ${
              deviceMode === "laptop"
                ? "bg-white text-black font-bold"
                : "text-[#A8A8A3] hover:text-white"
            }`}
            title="Laptop View (1280px)"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="text-[10px]">1280px</span>
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono ${
              deviceMode === "tablet"
                ? "bg-white text-black font-bold"
                : "text-[#A8A8A3] hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="text-[10px]">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono ${
              deviceMode === "mobile"
                ? "bg-white text-black font-bold"
                : "text-[#A8A8A3] hover:text-white"
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[10px]">Mobile</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <button
              onClick={onDiscard}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-[#A8A8A3] hover:text-white font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Discard</span>
            </button>
          )}

          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </header>

      {/* Editor Body: Live Preview + Contextual Inspector Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Live Preview Frame Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#050506] flex justify-center items-start custom-scrollbar">
          <div
            className={`w-full transition-all duration-300 min-h-full bg-[#0B0B0C] relative ${getViewportWidthClass()}`}
          >
            {/* Clickable Section Triggers / Visual Highlighting */}
            <div className="relative">
              {/* Hero Section Preview with Click-To-Inspect */}
              <div
                onClick={() => setActiveElement({ type: "heroMedia" })}
                className="relative group cursor-pointer"
              >
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Click to Edit Hero Media & Opacity</span>
                  </span>
                </div>
                <Hero data={portfolio.personal} heroSettings={hero} />
              </div>

              {/* Intro Section Preview */}
              <Intro data={portfolio.personal} />

              {/* Selected Work Preview */}
              <div
                onClick={() => setActiveElement({ type: "project", projectId: portfolio.projects[0]?.id || "" })}
                className="relative group cursor-pointer"
              >
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Click to Edit Projects</span>
                  </span>
                </div>
                <SelectedWork
                  projects={portfolio.projects}
                  categories={portfolio.categories}
                />
              </div>

              {/* Services / Skills Preview */}
              <div
                onClick={() => setActiveElement({ type: "service", serviceNum: portfolio.skills[0]?.number || "01" })}
                className="relative group cursor-pointer"
              >
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Click to Edit Services</span>
                  </span>
                </div>
                <Skills skills={portfolio.skills} />
              </div>

              {/* Experiments */}
              <Experiments />

              {/* About Profile Preview */}
              <div
                onClick={() => setActiveElement({ type: "aboutBio" })}
                className="relative group cursor-pointer"
              >
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Click to Edit About & Bio</span>
                  </span>
                </div>
                <About data={portfolio} />
              </div>

              {/* Contact Preview */}
              <div
                onClick={() => setActiveElement({ type: "contact" })}
                className="relative group cursor-pointer"
              >
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-black font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Click to Edit Contact Details</span>
                  </span>
                </div>
                <Contact data={portfolio.personal} />
              </div>

              {/* Footer Preview */}
              <Footer data={portfolio.personal} socialLinks={socialLinks} />
            </div>
          </div>
        </div>

        {/* Contextual Side Inspector Panel */}
        <aside className="w-80 sm:w-96 bg-[#0E0E11] border-l border-white/10 flex flex-col justify-between overflow-y-auto shrink-0 z-20 custom-scrollbar">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                INSPECTOR CONTROLS
              </span>
            </div>
            {/* Quick Section Switcher Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveElement({ type: "heroMedia" })}
                className={`p-1.5 rounded-lg text-xs font-mono ${
                  activeElement?.type === "heroMedia" ? "bg-white text-black font-bold" : "text-[#A8A8A3] hover:text-white"
                }`}
                title="Hero Media & Opacity"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveElement({ type: "heroText" })}
                className={`p-1.5 rounded-lg text-xs font-mono ${
                  activeElement?.type === "heroText" ? "bg-white text-black font-bold" : "text-[#A8A8A3] hover:text-white"
                }`}
                title="Hero Typography & Text"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inspector Content */}
          <div className="p-5 flex flex-col gap-6">
            {/* 1. HERO MEDIA & OPACITY CONTROLS */}
            {activeElement?.type === "heroMedia" && (
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
                    HERO BACKGROUND & OPACITY
                  </h4>
                  <p className="text-[11px] font-mono text-[#6F6F6B]">
                    Instant live visual adjustments. Changes render immediately.
                  </p>
                </div>

                {/* Media Type Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase text-[#A8A8A3]">
                    Background Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: "ambient", label: "Ambient Canvas" },
                      { id: "image", label: "Hero Image" },
                      { id: "video", label: "Looping Video" },
                      { id: "slideshow", label: "Slideshow" },
                    ].map((mode) => {
                      const isSelected = (hero.bgType || "ambient") === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setHero({ ...hero, bgType: mode.id as any })}
                          className={`p-2.5 rounded-xl border transition-all text-left ${
                            isSelected
                              ? "bg-white text-black font-bold border-white"
                              : "bg-[#121215] text-[#A8A8A3] border-white/10 hover:border-white/20"
                          }`}
                        >
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image Media Picker */}
                {hero.bgType === "image" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                    <span className="text-xs font-mono text-white font-semibold">
                      Hero Image
                    </span>
                    {hero.bgMediaUrl ? (
                      <div className="relative h-32 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={hero.bgMediaUrl}
                          alt="Hero background"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-xs font-mono text-[#6F6F6B]">
                        No image chosen
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setMediaPickerConfig({
                          isOpen: true,
                          title: "Replace Hero Background Image",
                          accept: "image",
                          currentValue: hero.bgMediaUrl,
                          onSelect: (url) => setHero((prev) => ({ ...prev, bgMediaUrl: url })),
                        })
                      }
                      className="w-full py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Computer / Select</span>
                    </button>
                  </div>
                )}

                {/* Video Media Picker */}
                {hero.bgType === "video" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                    <span className="text-xs font-mono text-white font-semibold">
                      Hero Video
                    </span>
                    {hero.bgMediaUrl ? (
                      <div className="relative h-32 rounded-xl overflow-hidden border border-white/10 bg-black">
                        <video
                          src={hero.bgMediaUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-24 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-xs font-mono text-[#6F6F6B]">
                        No video chosen
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setMediaPickerConfig({
                          isOpen: true,
                          title: "Replace Hero Video",
                          accept: "video",
                          currentValue: hero.bgMediaUrl,
                          onSelect: (url) => setHero((prev) => ({ ...prev, bgMediaUrl: url })),
                        })
                      }
                      className="w-full py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video from Computer</span>
                    </button>
                  </div>
                )}

                {/* Slideshow Add Slides */}
                {hero.bgType === "slideshow" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-white font-semibold">
                        Slideshow Images
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setMediaPickerConfig({
                            isOpen: true,
                            title: "Add Slide to Hero Slideshow",
                            accept: "image",
                            onSelect: (url) => {
                              const list = hero.bgSlideshowUrls || [];
                              setHero((prev) => ({ ...prev, bgSlideshowUrls: [...list, url] }));
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-white text-black font-mono text-[11px] font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Slide</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(hero.bgSlideshowUrls || []).map((slide, idx) => (
                        <div
                          key={idx}
                          className="relative h-16 rounded-lg overflow-hidden border border-white/10 group"
                        >
                          <img src={slide} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (hero.bgSlideshowUrls || []).filter((_, i) => i !== idx);
                              setHero((prev) => ({ ...prev, bgSlideshowUrls: updated }));
                            }}
                            className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Opacity Slider */}
                <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-semibold">Media Opacity</span>
                    <span className="text-emerald-400 font-bold">
                      {hero.bgMediaOpacity !== undefined
                        ? (hero.bgMediaOpacity <= 1 ? Math.round(hero.bgMediaOpacity * 100) : hero.bgMediaOpacity)
                        : 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={
                      hero.bgMediaOpacity !== undefined
                        ? (hero.bgMediaOpacity <= 1 ? Math.round(hero.bgMediaOpacity * 100) : hero.bgMediaOpacity)
                        : 100
                    }
                    onChange={(e) =>
                      setHero({ ...hero, bgMediaOpacity: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-[#6F6F6B]">
                    Live visibility of the background graphic/video.
                  </span>
                </div>

                {/* Dark Overlay Strength Slider */}
                <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white font-semibold">Dark Overlay Strength</span>
                    <span className="text-emerald-400 font-bold">
                      {hero.bgOverlayOpacity !== undefined
                        ? (hero.bgOverlayOpacity <= 1 ? Math.round(hero.bgOverlayOpacity * 100) : hero.bgOverlayOpacity)
                        : 65}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={
                      hero.bgOverlayOpacity !== undefined
                        ? (hero.bgOverlayOpacity <= 1 ? Math.round(hero.bgOverlayOpacity * 100) : hero.bgOverlayOpacity)
                        : 65
                    }
                    onChange={(e) =>
                      setHero({ ...hero, bgOverlayOpacity: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-[#6F6F6B]">
                    Darkens background so headline typography is sharp and readable.
                  </span>
                </div>
              </div>
            )}

            {/* 2. HERO TYPOGRAPHY & TEXT CONTROLS */}
            {activeElement?.type === "heroText" && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
                    HERO TYPOGRAPHY & HEADINGS
                  </h4>
                  <p className="text-[11px] font-mono text-[#6F6F6B]">
                    Live inline editing for hero text and typography
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Top Badge Text</label>
                  <input
                    type="text"
                    value={hero.badgeText || ""}
                    onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Hero Title Line 1</label>
                  <input
                    type="text"
                    value={hero.title1 || ""}
                    onChange={(e) => setHero({ ...hero, title1: e.target.value })}
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Hero Title Line 2</label>
                  <input
                    type="text"
                    value={hero.title2 || ""}
                    onChange={(e) => setHero({ ...hero, title2: e.target.value })}
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Subtitle / Tagline</label>
                  <textarea
                    rows={3}
                    value={hero.subtitle || ""}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white resize-none"
                  />
                </div>

                {/* Font Selector */}
                <div className="flex flex-col gap-1.5 text-xs font-mono pt-2 border-t border-white/10">
                  <label className="text-[#A8A8A3] uppercase">Hero Font Family</label>
                  <select
                    value={typography.heroTitle?.fontFamily || "default"}
                    onChange={(e) =>
                      setTypography((prev) => ({
                        ...prev,
                        heroTitle: {
                          ...(prev.heroTitle || {}),
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  >
                    {FONT_LIBRARY.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 3. ABOUT & BIO CONTROLS */}
            {activeElement?.type === "aboutBio" && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
                    ABOUT & BIO EDITING
                  </h4>
                  <p className="text-[11px] font-mono text-[#6F6F6B]">
                    Edit editorial statement and philosophy points
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Editorial Statement</label>
                  <textarea
                    rows={3}
                    value={portfolio.personal.editorialStatement}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, editorialStatement: e.target.value },
                      }))
                    }
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Location & Status</label>
                  <input
                    type="text"
                    value={portfolio.personal.location}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value },
                      }))
                    }
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>
              </div>
            )}

            {/* 4. CONTACT CONTROLS */}
            {activeElement?.type === "contact" && (
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">
                    CONTACT & COMMISSION DETAILS
                  </h4>
                  <p className="text-[11px] font-mono text-[#6F6F6B]">
                    Update your inquiry email and availability status
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Email Address</label>
                  <input
                    type="email"
                    value={portfolio.personal.email}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value },
                      }))
                    }
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase">Availability Banner</label>
                  <input
                    type="text"
                    value={portfolio.personal.availability}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, availability: e.target.value },
                      }))
                    }
                    className="p-2.5 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Media Picker Modal with Direct Windows File Picker & Drag-and-Drop */}
      <MediaPickerModal
        isOpen={mediaPickerConfig.isOpen}
        title={mediaPickerConfig.title}
        acceptType={mediaPickerConfig.accept}
        currentValue={mediaPickerConfig.currentValue}
        onClose={() => setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }))}
        onSelect={(url) => {
          mediaPickerConfig.onSelect(url);
          setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
}
