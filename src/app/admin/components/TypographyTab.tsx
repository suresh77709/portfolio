"use client";

import React, { useState, useEffect } from "react";
import {
  FONT_LIBRARY,
  DEFAULT_TYPOGRAPHY_SETTINGS,
  TypographySettings,
  ElementTypography,
} from "@/data/fonts";
import {
  Type,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  Sliders,
  Eye,
  Layers,
  HelpCircle,
} from "lucide-react";

interface TypographyTabProps {
  initialTypography: TypographySettings;
  onSave: (updated: TypographySettings) => Promise<void>;
  saving: boolean;
}

type TypographyAreaKey =
  | "global"
  | "heroTitle"
  | "sectionHeadings"
  | "bodyText"
  | "navigation"
  | "buttons"
  | "portfolioTitles"
  | "portfolioDescriptions"
  | "labels"
  | "footer"
  | "specialDisplay";

interface AreaConfig {
  id: TypographyAreaKey;
  label: string;
  category: "Headings" | "Content" | "Interactive" | "Meta";
  description: string;
  sampleText: string;
}

const AREAS: AreaConfig[] = [
  {
    id: "global",
    label: "Global Font (Fallback)",
    category: "Meta",
    description: "Sets the baseline typography for the entire website unless overridden by a section.",
    sampleText: "Cinematic High-Impact Design & Creative Visual Storytelling",
  },
  {
    id: "heroTitle",
    label: "Main Heading / Hero Title",
    category: "Headings",
    description: "The primary big headline on the Hero section ('GRAPHIC DESIGNER & VIDEO EDITOR').",
    sampleText: "GRAPHIC DESIGNER & VIDEO EDITOR",
  },
  {
    id: "sectionHeadings",
    label: "Section Headings",
    category: "Headings",
    description: "Main section headers (Featured Works, Specializations, Experiments, About Suresh, Contact).",
    sampleText: "FEATURED WORKS & PORTFOLIO SHOWCASE",
  },
  {
    id: "bodyText",
    label: "Body Text",
    category: "Content",
    description: "Biography narratives, philosophy bullet points, and general readable text.",
    sampleText:
      "I create cinematic visual content that drives engagement & tells memorable stories. Available for graphic design commissions, video editing projects, FiveM server promos, and wedding video edits worldwide.",
  },
  {
    id: "navigation",
    label: "Navigation Links",
    category: "Interactive",
    description: "Desktop and mobile navigation menu items (WORK, SERVICES, ABOUT, CONTACT).",
    sampleText: "WORK  •  SERVICES  •  ABOUT  •  EXPERIMENTS  •  CONTACT",
  },
  {
    id: "buttons",
    label: "Buttons & CTAs",
    category: "Interactive",
    description: "Primary action buttons, showcase buttons, and contact triggers.",
    sampleText: "EXPLORE SHOWCASE  →",
  },
  {
    id: "portfolioTitles",
    label: "Portfolio Titles",
    category: "Headings",
    description: "Titles on each project case study and showcase card.",
    sampleText: "CYBERPUNK FIVE M TRAILER  •  NOVO LUXURY BRANDING",
  },
  {
    id: "portfolioDescriptions",
    label: "Portfolio Descriptions",
    category: "Content",
    description: "Short summaries and challenge snippets on project cards.",
    sampleText:
      "A fast-paced cinematic trailer produced for an elite FiveM RP server featuring custom sound design, camera transitions, and color grading.",
  },
  {
    id: "labels",
    label: "Labels & Small Text",
    category: "Meta",
    description: "Category tags, badges, project numbers, dates, and mono indicators.",
    sampleText: "01 / 06 — COMMISSIONS & CONTACT  •  AVAILABLE FOR HIRE",
  },
  {
    id: "footer",
    label: "Footer Text",
    category: "Meta",
    description: "Copyright statements and bottom footer tier information.",
    sampleText: "© 2026 SURESH. ALL RIGHTS RESERVED. TIME [IST]",
  },
  {
    id: "specialDisplay",
    label: "Special / Display Text",
    category: "Headings",
    description: "Metric numbers ('100+ PROJECTS', '100% CLIENT SATISFACTION'), large quote highlights.",
    sampleText: "100+ PROJECTS COMPLETED  •  24H TURNAROUND",
  },
];

export function TypographyTab({
  initialTypography,
  onSave,
  saving,
}: TypographyTabProps) {
  const [typography, setTypography] = useState<TypographySettings>(
    initialTypography || DEFAULT_TYPOGRAPHY_SETTINGS
  );
  const [selectedArea, setSelectedArea] = useState<TypographyAreaKey>("heroTitle");
  const [previewDarkBg, setPreviewDarkBg] = useState<boolean>(true);

  // Synchronize when initialTypography updates
  useEffect(() => {
    if (initialTypography) {
      setTypography(initialTypography);
    }
  }, [initialTypography]);

  const currentAreaConfig = AREAS.find((a) => a.id === selectedArea) || AREAS[1];

  // Helper to get active element settings safely
  const currentElementSetting: ElementTypography =
    selectedArea === "global"
      ? { fontFamily: typography.globalFont || "default" }
      : (typography[selectedArea as keyof TypographySettings] as ElementTypography) || {
          fontFamily: "default",
          fontWeight: 700,
          letterSpacing: 0,
          lineHeight: 1.1,
        };

  // Find currently selected font option
  const activeFontId = currentElementSetting.fontFamily || "default";
  const selectedFontOption =
    FONT_LIBRARY.find((f) => f.id === activeFontId) || FONT_LIBRARY[0];

  // Dynamic Google Font loader link for live preview
  const previewFont =
    activeFontId !== "default"
      ? selectedFontOption
      : FONT_LIBRARY.find((f) => f.id === typography.globalFont) || FONT_LIBRARY[0];

  const previewGoogleUrl =
    previewFont && previewFont.googleFamilyName
      ? `https://fonts.googleapis.com/css2?family=${previewFont.googleFamilyName}:wght@300;400;500;600;700;800;900&display=swap`
      : null;

  // Handlers for modifying settings
  const handleFontChange = (newFontId: string) => {
    if (selectedArea === "global") {
      setTypography((prev) => ({ ...prev, globalFont: newFontId }));
    } else {
      setTypography((prev) => ({
        ...prev,
        [selectedArea]: {
          ...(prev[selectedArea as keyof TypographySettings] as ElementTypography),
          fontFamily: newFontId,
        },
      }));
    }
  };

  const handleWeightChange = (weight: number) => {
    if (selectedArea === "global") return;
    setTypography((prev) => ({
      ...prev,
      [selectedArea]: {
        ...(prev[selectedArea as keyof TypographySettings] as ElementTypography),
        fontWeight: weight,
      },
    }));
  };

  const handleSpacingChange = (spacing: number) => {
    if (selectedArea === "global") return;
    setTypography((prev) => ({
      ...prev,
      [selectedArea]: {
        ...(prev[selectedArea as keyof TypographySettings] as ElementTypography),
        letterSpacing: spacing,
      },
    }));
  };

  const handleLineHeightChange = (lh: number) => {
    if (selectedArea === "global") return;
    setTypography((prev) => ({
      ...prev,
      [selectedArea]: {
        ...(prev[selectedArea as keyof TypographySettings] as ElementTypography),
        lineHeight: lh,
      },
    }));
  };

  const handleTextTransformChange = (
    tt: "none" | "uppercase" | "capitalize" | "lowercase"
  ) => {
    if (selectedArea === "global") return;
    setTypography((prev) => ({
      ...prev,
      [selectedArea]: {
        ...(prev[selectedArea as keyof TypographySettings] as ElementTypography),
        textTransform: tt,
      },
    }));
  };

  // Reset current element to default
  const handleUseDefault = () => {
    if (selectedArea === "global") {
      setTypography((prev) => ({ ...prev, globalFont: "default" }));
    } else {
      const defaultVal = DEFAULT_TYPOGRAPHY_SETTINGS[selectedArea as keyof TypographySettings];
      setTypography((prev) => ({
        ...prev,
        [selectedArea]: defaultVal,
      }));
    }
  };

  // Reset all typography
  const handleResetAll = () => {
    if (
      confirm(
        "Are you sure you want to reset ALL typography settings back to website defaults? This will revert all custom font choices across all sections."
      )
    ) {
      setTypography(DEFAULT_TYPOGRAPHY_SETTINGS);
    }
  };

  // Save changes
  const handleSaveClick = async () => {
    await onSave(typography);
  };

  // Compute computed inline preview style
  const computedPreviewStyle: React.CSSProperties = {
    fontFamily:
      previewFont && previewFont.family !== "inherit"
        ? previewFont.family
        : "system-ui, -apple-system, sans-serif",
    fontWeight: currentElementSetting.fontWeight || 600,
    letterSpacing: `${currentElementSetting.letterSpacing ?? 0}em`,
    lineHeight: currentElementSetting.lineHeight ?? 1.1,
    textTransform: currentElementSetting.textTransform ?? "none",
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Google font link for live preview container */}
      {previewGoogleUrl && <link rel="stylesheet" href={previewGoogleUrl} />}

      {/* Header Tier */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-serif text-white uppercase tracking-wide">
              TYPOGRAPHY & FONT CUSTOMIZATION
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A8A8A3]">
            Visually customize fonts, weights, spacing, and line-height with instant real-time live preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetAll}
            type="button"
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#A8A8A3] hover:text-white transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET ALL TYPOGRAPHY</span>
          </button>

          <button
            onClick={handleSaveClick}
            disabled={saving}
            type="button"
            className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "SAVING..." : "SAVE TYPOGRAPHY"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Target Area & Controls (7 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Step 1: Area Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>1. SELECT WEBSITE AREA</span>
              </span>
              <span className="text-[11px] font-mono text-[#6F6F6B]">
                {AREAS.length} Areas Configurable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {AREAS.map((area) => {
                const isSelected = selectedArea === area.id;
                const areaFont =
                  area.id === "global"
                    ? typography.globalFont
                    : (typography[area.id as keyof TypographySettings] as ElementTypography)
                        ?.fontFamily || "default";

                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSelectedArea(area.id)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-white/15 border-white/40 text-white shadow-md"
                        : "bg-white/[0.02] border-white/5 text-[#A8A8A3] hover:border-white/15 hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono font-medium">
                      <span>{area.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] font-mono text-[#6F6F6B] block mt-0.5">
                      Font: {areaFont === "default" ? "Theme Default" : areaFont}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] font-mono text-[#8E8E88] bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
              {currentAreaConfig.description}
            </p>
          </div>

          {/* Step 2: Font Family & Parameters */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>2. FONT SETTINGS — {currentAreaConfig.label}</span>
              </span>

              <button
                type="button"
                onClick={handleUseDefault}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline"
              >
                Use Default
              </button>
            </div>

            {/* Font Family Dropdown */}
            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <label className="text-[#A8A8A3] uppercase tracking-wider flex justify-between">
                <span>SELECT FONT FAMILY</span>
                <span className="text-[#6F6F6B]">Controlled Web Font Library</span>
              </label>
              <select
                value={activeFontId}
                onChange={(e) => handleFontChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/40 cursor-pointer"
              >
                <option value="default">
                  Default (Inherit {selectedArea === "global" ? "System Sans" : "Global Setting"})
                </option>
                {FONT_LIBRARY.filter((f) => f.id !== "default").map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name} ({font.category}) — {font.sample}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Controls (Disabled when editing global font) */}
            {selectedArea !== "global" && (
              <>
                {/* Font Weight */}
                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase tracking-wider flex justify-between">
                    <span>FONT WEIGHT</span>
                    <span className="text-emerald-400">{currentElementSetting.fontWeight || 600}</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[400, 500, 600, 700, 800].map((w) => {
                      const isWeightSelected =
                        (currentElementSetting.fontWeight || 600) === w;
                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleWeightChange(w)}
                          className={`py-2 text-center rounded-lg text-xs font-mono transition-all border ${
                            isWeightSelected
                              ? "bg-white text-black font-bold border-white"
                              : "bg-white/5 border-white/5 text-[#A8A8A3] hover:text-white"
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Letter Spacing Slider */}
                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-[#A8A8A3] uppercase tracking-wider">
                    <span>LETTER SPACING (TRACKING)</span>
                    <span className="text-emerald-400">
                      {(currentElementSetting.letterSpacing ?? 0).toFixed(2)} em
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-0.06"
                    max="0.25"
                    step="0.01"
                    value={currentElementSetting.letterSpacing ?? 0}
                    onChange={(e) => handleSpacingChange(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6F6F6B]">
                    <span>Tight (-0.06)</span>
                    <span>Standard (0)</span>
                    <span>Wide (+0.25)</span>
                  </div>
                </div>

                {/* Line Height Slider */}
                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center text-[#A8A8A3] uppercase tracking-wider">
                    <span>LINE HEIGHT (LEADING)</span>
                    <span className="text-emerald-400">
                      {(currentElementSetting.lineHeight ?? 1.1).toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="2.0"
                    step="0.05"
                    value={currentElementSetting.lineHeight ?? 1.1}
                    onChange={(e) => handleLineHeightChange(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6F6F6B]">
                    <span>Compact (0.85)</span>
                    <span>Balanced (1.2)</span>
                    <span>Relaxed (2.0)</span>
                  </div>
                </div>

                {/* Text Transform */}
                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <label className="text-[#A8A8A3] uppercase tracking-wider">
                    TEXT CAPITALIZATION
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: "none", label: "Default" },
                      { id: "uppercase", label: "UPPER" },
                      { id: "capitalize", label: "Capitalize" },
                      { id: "lowercase", label: "lower" },
                    ].map((tt) => {
                      const isTTSelected =
                        (currentElementSetting.textTransform || "none") === tt.id;
                      return (
                        <button
                          key={tt.id}
                          type="button"
                          onClick={() => handleTextTransformChange(tt.id as any)}
                          className={`py-2 text-center rounded-lg text-xs font-mono transition-all border ${
                            isTTSelected
                              ? "bg-white text-black font-bold border-white"
                              : "bg-white/5 border-white/5 text-[#A8A8A3] hover:text-white"
                          }`}
                        >
                          {tt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Live Real-Time Preview Canvas (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>REAL-TIME LIVE PREVIEW</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDarkBg(!previewDarkBg)}
                  className="px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-[#A8A8A3] hover:text-white"
                >
                  {previewDarkBg ? "Dark Canvas" : "Light Canvas"}
                </button>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  INSTANT
                </span>
              </div>
            </div>

            {/* Specimen Preview Card */}
            <div
              className={`flex-1 rounded-2xl p-8 border transition-colors flex flex-col justify-center gap-6 min-h-[360px] overflow-hidden ${
                previewDarkBg
                  ? "bg-[#080809] border-white/10 text-[#F5F5F2]"
                  : "bg-neutral-100 border-neutral-300 text-neutral-900"
              }`}
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono opacity-50 tracking-widest uppercase">
                  {currentAreaConfig.label} Specimen
                </span>

                {/* The main dynamic preview text */}
                <div style={computedPreviewStyle} className="transition-all duration-200">
                  {currentAreaConfig.sampleText}
                </div>
              </div>

              {/* Secondary Context Preview */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <span className="text-[10px] font-mono opacity-50 tracking-widest uppercase">
                  Context Demonstration
                </span>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
                  <div
                    style={{
                      ...computedPreviewStyle,
                      fontSize: "1.2rem",
                    }}
                  >
                    Suresh Creative Showcase
                  </div>
                  <div
                    style={{
                      fontFamily: previewFont?.family || "inherit",
                      fontSize: "0.85rem",
                      opacity: 0.7,
                      lineHeight: 1.5,
                    }}
                  >
                    Experience modern visual design crafted with precision, motion, and cinematic grading.
                  </div>
                </div>
              </div>
            </div>

            {/* Meta summary card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1.5 text-xs font-mono text-[#8E8E88]">
              <div className="flex justify-between">
                <span>Active Font:</span>
                <span className="text-white font-bold">{selectedFontOption.name}</span>
              </div>
              <div className="flex justify-between">
                <span>CSS Family:</span>
                <span className="text-emerald-400 font-mono text-[11px] truncate max-w-[240px]">
                  {selectedFontOption.family}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Weight & Spacing:</span>
                <span className="text-white">
                  {currentElementSetting.fontWeight || 600} • {(currentElementSetting.letterSpacing ?? 0).toFixed(2)}em
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
