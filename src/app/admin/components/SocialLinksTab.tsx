"use client";

import React, { useState, useEffect } from "react";

import { SocialLinkItem, DEFAULT_SOCIAL_LINKS } from "@/data/socials";


import {
  Plus,
  Trash2,
  Save,
  ChevronUp,
  ChevronDown,
  Check,
  ExternalLink,
  Share2,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

interface SocialLinksTabProps {
  initialSocialLinks: SocialLinkItem[];
  onSave: (updated: SocialLinkItem[]) => Promise<void>;
  saving: boolean;
}

const COMMON_PLATFORMS = [
  "Instagram",
  "YouTube",
  "Behance",
  "LinkedIn",
  "GitHub",
  "Twitter / X",
  "Email",
  "ArtStation",
  "Discord",
  "Vimeo",
];

export function SocialLinksTab({
  initialSocialLinks,
  onSave,
  saving,
}: SocialLinksTabProps) {
  const [links, setLinks] = useState<SocialLinkItem[]>(
    initialSocialLinks || DEFAULT_SOCIAL_LINKS
  );

  useEffect(() => {
    if (initialSocialLinks && Array.isArray(initialSocialLinks)) {
      setLinks(initialSocialLinks);
    }
  }, [initialSocialLinks]);

  // Update specific item field
  const handleUpdateField = (
    id: string,
    field: keyof SocialLinkItem,
    value: any
  ) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Toggle enabled
  const handleToggleEnabled = (id: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  // Move link up or down
  const handleMove = (index: number, direction: "up" | "down") => {
    const newLinks = [...links];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    // Re-index order numbers
    const reordered = newLinks.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setLinks(reordered);
  };

  // Delete link
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this social link?")) return;
    const filtered = links
      .filter((item) => item.id !== id)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    setLinks(filtered);
  };

  // Add new link
  const handleAddLink = () => {
    const newId = `social-${Date.now()}`;
    const newLink: SocialLinkItem = {
      id: newId,
      platform: "Instagram",
      url: "https://instagram.com/",
      handle: "@suresh",
      enabled: true,
      order: links.length + 1,
    };
    setLinks([...links, newLink]);
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm("Reset social links to default list?")) {
      setLinks(DEFAULT_SOCIAL_LINKS);
    }
  };

  // Save changes
  const handleSave = async () => {
    await onSave(links);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header Tier */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-xl font-serif text-white uppercase tracking-wide">
              SOCIAL MEDIA LINKS MANAGEMENT
            </h2>
          </div>
          <p className="text-xs font-mono text-[#A8A8A3]">
            Manage links, handles, order, and visibility. Enabled links appear in the Footer across the public site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-[#A8A8A3] hover:text-white transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs tracking-wider uppercase flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD SOCIAL</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "SAVING..." : "SAVE LINKS"}</span>
          </button>
        </div>
      </div>

      {/* Social Links List */}
      <div className="flex flex-col gap-4">
        {links.map((item, index) => (
          <div
            key={item.id}
            className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
              item.enabled
                ? "border-white/10 bg-white/[0.02]"
                : "border-white/5 bg-white/[0.005] opacity-60"
            }`}
          >
            {/* Reorder and Platform Header */}
            <div className="flex items-center gap-3">
              {/* Up/Down buttons */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 transition-opacity"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === links.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 transition-opacity"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Order Number Badge */}
              <span className="w-6 h-6 rounded-full bg-white/5 text-[11px] font-mono text-[#A8A8A3] flex items-center justify-center font-bold">
                {index + 1}
              </span>

              {/* Platform Selector / Name */}
              <div className="min-w-[140px]">
                <label className="text-[10px] font-mono text-[#6F6F6B] uppercase block mb-1">
                  PLATFORM
                </label>
                <input
                  type="text"
                  list={`platforms-${item.id}`}
                  value={item.platform}
                  onChange={(e) =>
                    handleUpdateField(item.id, "platform", e.target.value)
                  }
                  placeholder="e.g. Instagram"
                  className="w-full px-3 py-2 rounded-xl bg-[#121215] border border-white/15 text-xs font-mono text-white font-medium focus:outline-none focus:border-white/40"
                />
                <datalist id={`platforms-${item.id}`}>
                  {COMMON_PLATFORMS.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Inputs: Handle & URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div>
                <label className="text-[10px] font-mono text-[#6F6F6B] uppercase block mb-1">
                  HANDLE / LABEL
                </label>
                <input
                  type="text"
                  value={item.handle}
                  onChange={(e) =>
                    handleUpdateField(item.id, "handle", e.target.value)
                  }
                  placeholder="@username"
                  className="w-full px-3 py-2 rounded-xl bg-[#121215] border border-white/15 text-xs font-mono text-[#A8A8A3] focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#6F6F6B] uppercase block mb-1">
                  DESTINATION URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) =>
                      handleUpdateField(item.id, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 pr-8 rounded-xl bg-[#121215] border border-white/15 text-xs font-mono text-[#A8A8A3] focus:outline-none focus:border-white/40"
                  />
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F6F6B] hover:text-white"
                      title="Test URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-2 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
              {/* Enabled toggle button */}
              <button
                type="button"
                onClick={() => handleToggleEnabled(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors border ${
                  item.enabled
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                    : "bg-white/5 border-white/10 text-[#6F6F6B] hover:text-white"
                }`}
              >
                {item.enabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>VISIBLE</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>HIDDEN</span>
                  </>
                )}
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
                title="Delete platform"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <div className="text-center py-12 glass-panel rounded-2xl border border-white/10 flex flex-col items-center gap-3">
            <p className="text-sm font-mono text-[#A8A8A3]">
              No social links configured.
            </p>
            <button
              type="button"
              onClick={handleAddLink}
              className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase"
            >
              Add First Social Platform
            </button>
          </div>
        )}
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono text-[#8E8E88] flex items-center gap-2">
        <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Social icons appear in one intentional location: the website Footer. Duplicate icon blocks from other sections have been consolidated for clean visual hierarchy.
        </span>
      </div>
    </div>
  );
}
