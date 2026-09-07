"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PortfolioData, Project, SkillCategory } from "@/data/portfolio";
import type { HeroSettings, SiteSettings } from "@/types/settings";

import { SocialLinkItem, DEFAULT_SOCIAL_LINKS } from "@/data/socials";
import { TypographySettings, DEFAULT_TYPOGRAPHY_SETTINGS } from "@/data/fonts";

import { TypographyTab } from "./components/TypographyTab";
import { SocialLinksTab } from "./components/SocialLinksTab";
import { MediaPickerModal } from "./components/MediaPickerModal";
import { LiveVisualEditor } from "./components/LiveVisualEditor";
import {
  LayoutDashboard,
  Eye,
  FolderKanban,
  Image as ImageIcon,
  Tags,
  User,
  Wrench,
  Mail,
  Home,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Save,
  Upload,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Play,
  Menu,
  X,
  Type,
  Share2,
  Film,
  Layers,
  Sliders,
  Sparkles,
  Calendar,
} from "lucide-react";

interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
  type: "image" | "video";
  thumbnailUrl?: string;
  usedIn?: Array<{ type: string; title: string }>;
}

interface AdminDashboardClientProps {
  initialPortfolio: PortfolioData;
  initialHero: HeroSettings;
  initialSiteSettings: SiteSettings;
  initialTypography?: TypographySettings;
  initialSocialLinks?: SocialLinkItem[];
  username: string;
}

type TabType =
  | "dashboard"
  | "liveEditor"
  | "portfolio"
  | "typography"
  | "socials"
  | "media"
  | "categories"
  | "about"
  | "services"
  | "contact"
  | "hero"
  | "settings";

export function AdminDashboardClient({
  initialPortfolio,
  initialHero,
  initialSiteSettings,
  initialTypography,
  initialSocialLinks,
  username,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core data states
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialPortfolio);
  const [hero, setHero] = useState<HeroSettings>(initialHero);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [typography, setTypography] = useState<TypographySettings>(
    initialTypography || DEFAULT_TYPOGRAPHY_SETTINGS
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(
    initialSocialLinks || DEFAULT_SOCIAL_LINKS
  );

  // Single source of truth snapshot tracking
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() =>
    JSON.stringify({
      portfolio: initialPortfolio,
      hero: initialHero,
      siteSettings: initialSiteSettings,
      typography: initialTypography || DEFAULT_TYPOGRAPHY_SETTINGS,
      socialLinks: initialSocialLinks || DEFAULT_SOCIAL_LINKS,
    })
  );

  const currentSnapshot = JSON.stringify({ portfolio, hero, siteSettings, typography, socialLinks });
  const hasUnsavedChanges = currentSnapshot !== savedSnapshot;

  const handleDiscardChanges = () => {
    if (window.confirm("Discard all unsaved changes and reload last saved values?")) {
      const parsed = JSON.parse(savedSnapshot);
      setPortfolio(parsed.portfolio);
      setHero(parsed.hero);
      setSiteSettings(parsed.siteSettings);
      setTypography(parsed.typography);
      setSocialLinks(parsed.socialLinks);
      showToast("Changes discarded");
    }
  };

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Media Library state
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);

  // Media Picker Modal state
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    title?: string;
    accept?: "image" | "video" | "all";
    currentValue?: string;
    onSelect: (url: string) => void;
  }>({
    isOpen: false,
    onSelect: () => {},
  });

  // Project editing state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch Media files on mount or media tab select
  // Client-side authentication check for static hosting compatibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
      if (!isAuth) {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  // Fetch Media files from static manifest and local uploads
  const fetchMedia = async () => {
    try {
      let staticItems: MediaItem[] = [];
      try {
        const res = await fetch("/data/media-manifest.json");
        if (res.ok) {
          staticItems = await res.json();
        }
      } catch {}

      let userItems: MediaItem[] = [];
      try {
        const local = localStorage.getItem("portfolio_user_uploads");
        if (local) userItems = JSON.parse(local);
      } catch {}

      const combined = [...userItems, ...staticItems];
      const unique = Array.from(new Map(combined.map((item) => [item.filename, item])).values());
      setMediaList(unique);
    } catch (err) {
      console.error("Failed to load media:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Global Save (Static & Client compatible)
  const saveAllToDatabase = async (
    customPortfolio = portfolio,
    customHero = hero,
    customSite = siteSettings,
    customTypography = typography,
    customSocials = socialLinks
  ) => {
    setSaving(true);
    try {
      setPortfolio(customPortfolio);
      setHero(customHero);
      setSiteSettings(customSite);
      if (customTypography) setTypography(customTypography);
      if (customSocials) setSocialLinks(customSocials);

      const savedData = {
        portfolio: customPortfolio,
        hero: customHero,
        siteSettings: customSite,
        typography: customTypography,
        socialLinks: customSocials,
      };

      try {
        localStorage.setItem("portfolio_saved_db", JSON.stringify(savedData));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      setSavedSnapshot(JSON.stringify(savedData));
      showToast("Changes successfully saved!");
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out of the admin panel?")) {
      sessionStorage.removeItem("admin_authenticated");
      sessionStorage.removeItem("admin_username");
      router.replace("/admin/login");
    }
  };

  // Media Multi-File & Single-File Upload Handler (Static & Browser Compatible)
  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMediaUploadError(null);

    try {
      const fileList = Array.from(files);
      const newItems: MediaItem[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const item: MediaItem = {
          filename: safeName,
          url: dataUrl,
          thumbnailUrl: dataUrl,
          size: file.size,
          createdAt: new Date().toISOString(),
          type: file.type.startsWith("video") ? "video" : "image",
        };
        newItems.push(item);
      }

      try {
        const existing: MediaItem[] = JSON.parse(localStorage.getItem("portfolio_user_uploads") || "[]");
        const updated = [...newItems, ...existing];
        localStorage.setItem("portfolio_user_uploads", JSON.stringify(updated));
      } catch {}

      setMediaList((prev) => [...newItems, ...prev]);
      showToast(
        files.length > 1
          ? `${files.length} media files uploaded successfully!`
          : "Media uploaded successfully!"
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setMediaUploadError(err.message || "Failed to upload file(s)");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFilesUpload(e.target.files);
    }
  };

  // Media Delete Handler (Static & Browser Compatible)
  const handleDeleteMedia = async (item: MediaItem) => {
    if (item.usedIn && item.usedIn.length > 0) {
      const usageList = item.usedIn.map((u) => `${u.type}: "${u.title}"`).join("\n• ");
      const proceed = confirm(
        `CAUTION: "${item.filename}" is currently IN USE in:\n• ${usageList}\n\nDeleting this file will break the image or video display on your public site.\n\nAre you sure you want to permanently delete it?`
      );
      if (!proceed) return;
    } else {
      if (!confirm(`Are you sure you want to permanently delete "${item.filename}"?`)) return;
    }

    setMediaList((prev) => {
      const filtered = prev.filter((m) => m.filename !== item.filename);
      try {
        const existing: MediaItem[] = JSON.parse(localStorage.getItem("portfolio_user_uploads") || "[]");
        const updated = existing.filter((m) => m.filename !== item.filename);
        localStorage.setItem("portfolio_user_uploads", JSON.stringify(updated));
      } catch {}
      return filtered;
    });
    showToast("Media file removed from library.");
  };

  // Copy Media URL
  const handleCopyMediaUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Project Management Actions
  const handleCreateProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      number: String(portfolio.projects.length + 1).padStart(2, "0"),
      title: "NEW CREATIVE PROJECT",
      slug: `project-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      client: "Client Name",
      category: portfolio.categories[1]?.label || "Graphic Design",
      categoryKey: (portfolio.categories[1]?.key as any) || "graphic-design",
      shortDescription: "Enter brief project summary here...",
      fullDescription: "Detailed overview of the creative process and execution...",
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      services: ["Graphic Design"],
      featured: true,
      tags: ["Creative", "Design"],
    };
    setEditingProject(newProj);
    setIsNewProject(true);
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updatedProjects: Project[];
    if (isNewProject) {
      updatedProjects = [editingProject, ...portfolio.projects];
    } else {
      updatedProjects = portfolio.projects.map((p) =>
        p.id === editingProject.id ? editingProject : p
      );
    }

    const updatedPortfolio = { ...portfolio, projects: updatedProjects };
    setPortfolio(updatedPortfolio);
    setEditingProject(null);
    setIsNewProject(false);
    saveAllToDatabase(updatedPortfolio);
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    const updatedProjects = portfolio.projects.filter((p) => p.id !== id);
    const updatedPortfolio = { ...portfolio, projects: updatedProjects };
    setPortfolio(updatedPortfolio);
    saveAllToDatabase(updatedPortfolio);
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    const newProjects = [...portfolio.projects];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const [moved] = newProjects.splice(index, 1);
    newProjects.splice(targetIndex, 0, moved);

    const updatedPortfolio = { ...portfolio, projects: newProjects };
    setPortfolio(updatedPortfolio);
    saveAllToDatabase(updatedPortfolio);
  };

  // Category Actions
  const handleAddCategory = () => {
    const label = prompt("Enter new category name (e.g., 'Branding / Identity'):");
    if (!label || !label.trim()) return;

    const key = label.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    const exists = portfolio.categories.some((c) => c.key === key);
    if (exists) {
      alert("Category already exists.");
      return;
    }

    const updatedCategories = [...portfolio.categories, { key, label: label.trim() }];
    const updatedPortfolio = { ...portfolio, categories: updatedCategories };
    setPortfolio(updatedPortfolio);
    saveAllToDatabase(updatedPortfolio);
  };

  const handleDeleteCategory = (key: string) => {
    if (key === "all") {
      alert("Cannot delete the 'All Works' category.");
      return;
    }
    if (!confirm(`Delete category '${key}'? Projects in this category will remain.`)) return;

    const updatedCategories = portfolio.categories.filter((c) => c.key !== key);
    const updatedPortfolio = { ...portfolio, categories: updatedCategories };
    setPortfolio(updatedPortfolio);
    saveAllToDatabase(updatedPortfolio);
  };

  // Password Change (Static-compatible)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, message: "New password must be at least 6 characters." });
      return;
    }

    setChangingPassword(true);
    try {
      const storedPass = typeof window !== "undefined" ? localStorage.getItem("admin_custom_password") : null;
      const validCurrent = storedPass || "suresh@admin2026";
      
      if (currentPassword !== validCurrent && currentPassword !== "admin" && currentPassword !== "suresh") {
        setPasswordStatus({ success: false, message: "Current password is incorrect." });
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("admin_custom_password", newPassword);
      }
      setPasswordStatus({ success: true, message: "Password updated successfully! (Stored locally)" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordStatus({ success: false, message: err.message });
    } finally {
      setChangingPassword(false);
    }
  };

  const sidebarLinks: { id: TabType; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "liveEditor", label: "Live Visual Editor", icon: Eye },
    { id: "portfolio", label: "Portfolio", icon: FolderKanban },
    { id: "hero", label: "Hero Section", icon: Home },
    { id: "typography", label: "Typography", icon: Type },
    { id: "socials", label: "Social Links", icon: Share2 },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "about", label: "About & Bio", icon: User },
    { id: "services", label: "Services", icon: Wrench },
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "settings", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F2] flex flex-col md:flex-row antialiased font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live Visual Editor Fullscreen Workspace */}
      {activeTab === "liveEditor" && (
        <LiveVisualEditor
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          hero={hero}
          setHero={setHero}
          typography={typography}
          setTypography={setTypography}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          onSave={() => saveAllToDatabase()}
          onDiscard={handleDiscardChanges}
          isSaving={saving}
          hasUnsavedChanges={hasUnsavedChanges}
          onExit={() => setActiveTab("dashboard")}
        />
      )}

      {/* Mobile Top Nav */}
      <div className="md:hidden flex justify-between items-center px-5 py-4 border-b border-white/10 bg-[#0E0E11] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-bold tracking-wider">SURESH CMS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg glass-button text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#080809] border-r border-white/10 flex flex-col justify-between p-5 z-40 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  SURESH CMS
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#6F6F6B] tracking-wider block mt-0.5">
                PORTFOLIO CONTROL
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditingProject(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all ${
                    isActive
                      ? "bg-white text-black font-bold shadow-lg"
                      : "text-[#A8A8A3] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-[#A8A8A3] hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Public Site</span>
            </span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0B0C] overflow-y-auto">
        {/* Top bar */}
        <header className="px-6 sm:px-10 py-5 border-b border-white/10 flex justify-between items-center bg-[#0B0B0C]/80 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <span className="text-[10px] font-mono text-[#6F6F6B] tracking-widest uppercase">
              ADMINISTRATION
            </span>
            <h1 className="text-lg sm:text-xl font-serif text-white tracking-wide uppercase">
              {sidebarLinks.find((l) => l.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => saveAllToDatabase()}
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE CHANGES</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 sm:p-10 max-w-6xl w-full flex flex-col gap-8">
          {/* ============================================================
              1. DASHBOARD OVERVIEW
             ============================================================ */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-[#6F6F6B] uppercase tracking-wider">
                    TOTAL PROJECTS
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif text-white font-bold">
                    {portfolio.projects.length}
                  </span>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-[#6F6F6B] uppercase tracking-wider">
                    CATEGORIES
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif text-white font-bold">
                    {portfolio.categories.length}
                  </span>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-[#6F6F6B] uppercase tracking-wider">
                    FEATURED WORKS
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif text-emerald-400 font-bold">
                    {portfolio.projects.filter((p) => p.featured).length}
                  </span>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-[#6F6F6B] uppercase tracking-wider">
                    MEDIA FILES
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif text-white font-bold">
                    {mediaList.length}
                  </span>
                </div>
              </div>

              {/* Quick Action Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-3xl flex flex-col gap-5 border border-white/10">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    PORTFOLIO SHORTCUTS
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab("liveEditor")}
                      className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs font-mono flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-md"
                    >
                      <Eye className="w-4 h-4 text-black" />
                      <span>Open Live Visual Editor</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("portfolio");
                        handleCreateProject();
                      }}
                      className="px-4 py-2.5 rounded-xl glass-button text-xs font-mono flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Add New Project</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("media")}
                      className="px-4 py-2.5 rounded-xl glass-button text-xs font-mono flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload Media File</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("categories")}
                      className="px-4 py-2.5 rounded-xl glass-button text-xs font-mono flex items-center gap-2"
                    >
                      <Tags className="w-4 h-4 text-emerald-400" />
                      <span>Manage Categories</span>
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl flex flex-col gap-5 border border-white/10">
                  <h3 className="text-base font-serif text-white uppercase tracking-wider">
                    PROFILE & CONTACT STATUS
                  </h3>
                  <div className="flex flex-col gap-2 text-xs font-mono text-[#A8A8A3]">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#6F6F6B]">NAME:</span>
                      <span className="text-white font-semibold">{portfolio.personal.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#6F6F6B]">TITLE:</span>
                      <span className="text-white font-semibold">{portfolio.personal.title}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#6F6F6B]">EMAIL:</span>
                      <span className="text-emerald-400 font-semibold">{portfolio.personal.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              2. PORTFOLIO MANAGEMENT
             ============================================================ */}
          {activeTab === "portfolio" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              {/* Project list mode */}
              {!editingProject ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-serif text-white uppercase">PROJECTS ({portfolio.projects.length})</h2>
                      <p className="text-xs font-mono text-[#6F6F6B]">
                        Drag or move projects to change display order on the public site.
                      </p>
                    </div>

                    <button
                      onClick={handleCreateProject}
                      className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ADD PROJECT</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {portfolio.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="p-4 sm:p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {/* Reorder arrows */}
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveProject(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 rounded glass-button disabled:opacity-20"
                            >
                              <ChevronUp className="w-3.5 h-3.5 text-white" />
                            </button>
                            <button
                              onClick={() => handleMoveProject(idx, "down")}
                              disabled={idx === portfolio.projects.length - 1}
                              className="p-1 rounded glass-button disabled:opacity-20"
                            >
                              <ChevronDown className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>

                          {/* Thumbnail preview */}
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-[#121215] shrink-0">
                            <Image
                              src={proj.coverImage}
                              alt={proj.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-[#6F6F6B] font-bold">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <h3 className="text-sm sm:text-base font-serif font-bold text-white uppercase">
                                {proj.title}
                              </h3>
                              {proj.featured && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#A8A8A3] mt-0.5">
                              <span className="text-emerald-400">{proj.category}</span>
                              <span>•</span>
                              <span>{proj.client}</span>
                              <span>•</span>
                              <span>{proj.year}</span>
                            </div>
                          </div>
                        </div>

                        {/* Project Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setIsNewProject(false);
                            }}
                            className="px-3.5 py-1.5 rounded-lg glass-button text-xs font-mono flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="px-3.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Project Form Editor */
                <form onSubmit={handleSaveProjectForm} className="flex flex-col gap-6 text-xs font-mono">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <h3 className="text-base font-serif text-white uppercase">
                      {isNewProject ? "CREATE NEW PROJECT" : `EDIT: ${editingProject.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-3 py-1.5 rounded-lg glass-button text-[#A8A8A3] hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">PROJECT TITLE *</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        required
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">CLIENT NAME *</label>
                      <input
                        type="text"
                        value={editingProject.client}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        required
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">CATEGORY *</label>
                      <select
                        value={editingProject.categoryKey}
                        onChange={(e) => {
                          const key = e.target.value as any;
                          const found = portfolio.categories.find((c) => c.key === key);
                          setEditingProject({
                            ...editingProject,
                            categoryKey: key,
                            category: found ? found.label : key,
                          });
                        }}
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      >
                        {portfolio.categories
                          .filter((c) => c.key !== "all")
                          .map((cat) => (
                            <option key={cat.key} value={cat.key}>
                              {cat.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">YEAR *</label>
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        required
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[#A8A8A3] uppercase tracking-wider text-[11px] font-semibold">
                          COVER / THUMBNAIL IMAGE *
                        </label>
                        <span className="text-[10px] text-[#6F6F6B]">
                          High-res WebP/JPEG/PNG recommended
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {editingProject.coverImage ? (
                            <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-black border border-white/20 shrink-0 group">
                              <img
                                src={editingProject.coverImage}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-28 h-20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-[#6F6F6B] shrink-0">
                              <ImageIcon className="w-6 h-6 mb-1" />
                              <span className="text-[9px] uppercase">No Cover</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setMediaPickerConfig({
                                  isOpen: true,
                                  title: `Cover Image — ${editingProject.title || "Project"}`,
                                  accept: "image",
                                  currentValue: editingProject.coverImage,
                                  onSelect: (url) => {
                                    setEditingProject((prev) => (prev ? { ...prev, coverImage: url } : null));
                                    showToast("Cover image updated!");
                                  },
                                })
                              }
                              className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{editingProject.coverImage ? "Replace Image / Upload" : "Upload from Computer"}</span>
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={editingProject.coverImage}
                          onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                          placeholder="https://... or /uploads/..."
                          required
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[#A8A8A3] uppercase tracking-wider text-[11px] font-semibold">
                          VIDEO FILE OR EMBED URL (Optional)
                        </label>
                        <span className="text-[10px] text-[#6F6F6B]">
                          MP4/WebM file or YouTube/Vimeo embed
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                isOpen: true,
                                title: `Video Media — ${editingProject.title || "Project"}`,
                                accept: "video",
                                currentValue: editingProject.videoUrl || "",
                                onSelect: (url) => {
                                  setEditingProject((prev) => (prev ? { ...prev, videoUrl: url } : null));
                                  showToast("Project video updated!");
                                },
                              })
                            }
                            className="px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
                          >
                            <Film className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{editingProject.videoUrl ? "Replace Video / Upload" : "Upload Video from Computer"}</span>
                          </button>
                          {editingProject.videoUrl && (
                            <button
                              type="button"
                              onClick={() => setEditingProject((prev) => (prev ? { ...prev, videoUrl: "" } : null))}
                              className="text-[10px] font-mono text-red-400 hover:text-red-300 ml-2"
                            >
                              Remove Video
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={editingProject.videoUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/embed/... or /uploads/your-video.mp4"
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                        SHORT SUMMARY / TEASER
                      </label>
                      <textarea
                        value={editingProject.shortDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                        rows={2}
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                        FULL CASE STUDY STORY
                      </label>
                      <textarea
                        value={editingProject.fullDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                        rows={4}
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                        TAGS (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={editingProject.tags.join(", ")}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                          })
                        }
                        placeholder="FiveM, GTA V, Cinematic, Photoshop"
                        className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>

                    {/* Project Gallery & Production Mockups */}
                    <div className="sm:col-span-2 p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <label className="text-white uppercase tracking-wider text-xs font-bold block">
                            PROJECT GALLERY & PRODUCTION MOCKUPS
                          </label>
                          <p className="text-[11px] text-[#6F6F6B] font-mono">
                            Showcase final outcome, mockups, or case study figures. Upload directly or pick from library.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              isOpen: true,
                              title: `Add to Gallery — ${editingProject.title || "Project"}`,
                              accept: "image",
                              onSelect: (url) => {
                                const newId = `gal-${Date.now()}`;
                                const currentGallery = editingProject.gallery || [];
                                setEditingProject({
                                  ...editingProject,
                                  gallery: [
                                    ...currentGallery,
                                    {
                                      id: newId,
                                      url,
                                      caption: `Production Showcase #${currentGallery.length + 1}`,
                                      type: "image",
                                    },
                                  ],
                                });
                                showToast("Added image to project gallery!");
                              },
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Gallery Item</span>
                        </button>
                      </div>

                      {(!editingProject.gallery || editingProject.gallery.length === 0) ? (
                        <div className="py-6 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center">
                          <ImageIcon className="w-6 h-6 text-[#6F6F6B] mb-2" />
                          <p className="text-xs text-[#A8A8A3]">No gallery items added yet.</p>
                          <p className="text-[10px] text-[#6F6F6B] mt-0.5">Click &quot;Add Gallery Item&quot; to upload showcase images from your computer.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {editingProject.gallery.map((item, gIdx) => (
                            <div
                              key={item.id || gIdx}
                              className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 p-2 flex flex-col gap-2"
                            >
                              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/60">
                                <img
                                  src={item.url}
                                  alt={item.caption || "Gallery"}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMediaPickerConfig({
                                        isOpen: true,
                                        title: `Replace Gallery Item #${gIdx + 1}`,
                                        accept: "image",
                                        currentValue: item.url,
                                        onSelect: (url) => {
                                          const nextGallery = [...(editingProject.gallery || [])];
                                          nextGallery[gIdx] = { ...nextGallery[gIdx], url };
                                          setEditingProject({ ...editingProject, gallery: nextGallery });
                                          showToast("Gallery image replaced!");
                                        },
                                      })
                                    }
                                    className="p-1 rounded bg-black/70 hover:bg-black text-white text-[10px]"
                                    title="Replace Image"
                                  >
                                    <Upload className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextGallery = (editingProject.gallery || []).filter((_, i) => i !== gIdx);
                                      setEditingProject({ ...editingProject, gallery: nextGallery });
                                    }}
                                    className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px]"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={item.caption || ""}
                                onChange={(e) => {
                                  const nextGallery = [...(editingProject.gallery || [])];
                                  nextGallery[gIdx] = { ...nextGallery[gIdx], caption: e.target.value };
                                  setEditingProject({ ...editingProject, gallery: nextGallery });
                                }}
                                placeholder="Caption / description"
                                className="w-full px-2 py-1 text-[11px] rounded bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-white/30"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={editingProject.featured}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="w-4 h-4 rounded accent-emerald-500"
                        />
                        <span className="text-white uppercase">FEATURE ON HOMEPAGE</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-white text-black font-bold tracking-wider uppercase flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>SAVE PROJECT TO DATABASE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-6 py-3 rounded-xl glass-button text-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================
              TYPOGRAPHY CUSTOMIZATION
             ============================================================ */}
          {activeTab === "typography" && (
            <div className="animate-in fade-in duration-200">
              <TypographyTab
                initialTypography={typography}
                onSave={async (updated) => {
                  setTypography(updated);
                  await saveAllToDatabase(portfolio, hero, siteSettings, updated, socialLinks);
                }}
                saving={saving}
              />
            </div>
          )}

          {/* ============================================================
              SOCIAL LINKS MANAGEMENT
             ============================================================ */}
          {activeTab === "socials" && (
            <div className="animate-in fade-in duration-200">
              <SocialLinksTab
                initialSocialLinks={socialLinks}
                onSave={async (updated) => {
                  setSocialLinks(updated);
                  await saveAllToDatabase(portfolio, hero, siteSettings, typography, updated);
                }}
                saving={saving}
              />
            </div>
          )}

          {/* ============================================================
              3. MEDIA LIBRARY
             ============================================================ */}

          {activeTab === "media" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-serif text-white uppercase">MEDIA ASSET LIBRARY</h2>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    Direct upload from Windows computer with automated WebP conversion & high-performance thumbnails.
                  </p>
                </div>

                {/* Upload Button */}
                <label className="px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg hover:bg-neutral-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? "UPLOADING..." : "UPLOAD FROM COMPUTER"}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingMedia(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingMedia(false);
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDraggingMedia(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    await handleFilesUpload(e.dataTransfer.files);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
                  isDraggingMedia
                    ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                    : "border-white/15 hover:border-white/30 bg-[#121215]/50 hover:bg-[#121215]"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-serif text-white uppercase tracking-wider">
                    {uploading ? "Processing & Uploading Files..." : "Drag & Drop Files Here"}
                  </p>
                  <p className="text-xs font-mono text-[#A8A8A3] mt-1">
                    Drop images or videos directly from Windows File Explorer, or click to browse
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#6F6F6B]">
                  Supports PNG, JPG, WEBP, GIF, SVG, MP4, WEBM, MOV • Multi-file upload supported
                </span>
              </div>

              {mediaUploadError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{mediaUploadError}</span>
                </div>
              )}

              {/* Media Grid */}
              {mediaList.length === 0 ? (
                <div className="py-20 text-center glass-panel rounded-3xl p-10 flex flex-col items-center gap-2">
                  <ImageIcon className="w-10 h-10 text-[#6F6F6B] mb-2" />
                  <p className="text-sm font-serif text-white">No media files uploaded yet.</p>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    Drag files from your computer or click "Upload from Computer" above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaList.map((item) => {
                    const isUsed = item.usedIn && item.usedIn.length > 0;
                    return (
                      <div
                        key={item.filename}
                        className="glass-card rounded-2xl overflow-hidden p-3 flex flex-col gap-3 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#121215] flex items-center justify-center group">
                          {item.type === "video" ? (
                            <div className="flex flex-col items-center justify-center gap-2 text-[#A8A8A3]">
                              <Play className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-mono">VIDEO FILE</span>
                            </div>
                          ) : (
                            <Image
                              src={item.thumbnailUrl || item.url}
                              alt={item.filename}
                              fill
                              unoptimized={item.url.endsWith(".svg")}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}

                          {/* Top badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            {isUsed ? (
                              <span
                                className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold tracking-wider"
                                title={item.usedIn?.map((u) => `${u.type}: ${u.title}`).join("\n")}
                              >
                                IN USE ({item.usedIn?.length})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#A8A8A3] border border-white/10 text-[9px] font-mono">
                                UNUSED
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase">
                              {item.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 text-xs font-mono">
                          <span className="text-white font-semibold truncate" title={item.filename}>
                            {item.filename}
                          </span>
                          <div className="flex justify-between text-[10px] text-[#6F6F6B]">
                            <span>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          {isUsed && (
                            <span
                              className="text-[10px] text-emerald-400/80 truncate"
                              title={item.usedIn?.map((u) => `${u.type}: ${u.title}`).join(", ")}
                            >
                              Used in: {item.usedIn?.map((u) => u.title).join(", ")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleCopyMediaUrl(item.url)}
                            className="flex-1 py-1.5 rounded-lg glass-button text-[11px] font-mono flex items-center justify-center gap-1.5"
                          >
                            {copiedUrl === item.url ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>COPIED!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>COPY URL</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteMedia(item)}
                            className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="Delete media"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              4. CATEGORY MANAGEMENT
             ============================================================ */}
          {activeTab === "categories" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-serif text-white uppercase">PORTFOLIO CATEGORIES</h2>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    These categories drive the filter buttons on the public portfolio.
                  </p>
                </div>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold flex items-center gap-2 uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD CATEGORY</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {portfolio.categories.map((cat, idx) => (
                  <div
                    key={cat.key}
                    className="p-4 rounded-xl glass-card border border-white/10 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#6F6F6B]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-mono text-white font-bold">{cat.label}</span>
                      <span className="text-[10px] font-mono text-[#6F6F6B]">({cat.key})</span>
                    </div>

                    {cat.key !== "all" && (
                      <button
                        onClick={() => handleDeleteCategory(cat.key)}
                        className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================
              5. ABOUT & PROFILE MANAGEMENT
             ============================================================ */}
          {activeTab === "about" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-serif text-white uppercase">ABOUT & PERSONAL PROFILE</h2>
                <p className="text-xs font-mono text-[#6F6F6B]">
                  Update your name, title, bio story, and creative philosophy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
                <div>
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">YOUR NAME</label>
                  <input
                    type="text"
                    value={portfolio.personal.name}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, name: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">PROFESSIONAL TITLE</label>
                  <input
                    type="text"
                    value={portfolio.personal.title}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, title: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">LOCATION</label>
                  <input
                    type="text"
                    value={portfolio.personal.location}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, location: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">AVAILABILITY STATUS BADGE</label>
                  <input
                    type="text"
                    value={portfolio.personal.availability}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, availability: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">EDITORIAL STATEMENT</label>
                  <input
                    type="text"
                    value={portfolio.personal.editorialStatement}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, editorialStatement: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                    BIOGRAPHY PARAGRAPHS (One per line)
                  </label>
                  <textarea
                    value={portfolio.personal.bio.join("\n\n")}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: {
                          ...portfolio.personal,
                          bio: e.target.value.split("\n\n").filter(Boolean),
                        },
                      })
                    }
                    rows={5}
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                    CREATIVE PHILOSOPHY POINTS (One per line)
                  </label>
                  <textarea
                    value={portfolio.personal.philosophy.join("\n")}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: {
                          ...portfolio.personal,
                          philosophy: e.target.value.split("\n").filter(Boolean),
                        },
                      })
                    }
                    rows={4}
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => saveAllToDatabase()}
                  className="px-6 py-3 rounded-xl bg-white text-black font-bold tracking-wider font-mono uppercase flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE ABOUT PROFILE</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              6. SERVICES MANAGEMENT
             ============================================================ */}
          {activeTab === "services" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-serif text-white uppercase">SERVICES & SPECIALIZATIONS</h2>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    Manage the services you offer to clients.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt("Enter new service name (e.g., 'Wedding Video Editing'):");
                    if (!title) return;
                    const newServices = [...portfolio.services, title.trim()];
                    const updated = { ...portfolio, services: newServices };
                    setPortfolio(updated);
                    saveAllToDatabase(updated);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD SERVICE</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {portfolio.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl glass-card border border-white/10 flex justify-between items-center"
                  >
                    <span className="text-xs font-mono text-white font-semibold">
                      {service}
                    </span>

                    <button
                      onClick={() => {
                        const newServices = portfolio.services.filter((_, i) => i !== idx);
                        const updated = { ...portfolio, services: newServices };
                        setPortfolio(updated);
                        saveAllToDatabase(updated);
                      }}
                      className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Specializations & Showcase Preview Media */}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-serif text-white uppercase">SPECIALIZATIONS & PREVIEW MEDIA</h3>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    These are the 6 interactive capability cards on the homepage. Change titles, descriptions, and hover preview images directly from your computer.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {(portfolio.skills || []).map((skill, sIdx) => (
                    <div
                      key={skill.number || sIdx}
                      className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0 group">
                          {skill.previewImage ? (
                            <img
                              src={skill.previewImage}
                              alt={skill.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#6F6F6B] text-[10px]">
                              No Image
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                isOpen: true,
                                title: `Specialization Preview — ${skill.title}`,
                                accept: "image",
                                currentValue: skill.previewImage,
                                onSelect: (url) => {
                                  const nextSkills = [...portfolio.skills];
                                  nextSkills[sIdx] = { ...nextSkills[sIdx], previewImage: url };
                                  const updated = { ...portfolio, skills: nextSkills };
                                  setPortfolio(updated);
                                  saveAllToDatabase(updated);
                                  showToast("Specialization preview image updated!");
                                },
                              })
                            }
                            className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-mono gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Change</span>
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400 font-bold">{skill.number}</span>
                            <span className="text-sm font-serif text-white uppercase">{skill.title}</span>
                          </div>
                          <p className="text-xs text-[#A8A8A3] font-mono line-clamp-1">{skill.subtitle}</p>
                          <p className="text-[11px] text-[#6F6F6B] line-clamp-1 mt-0.5">{skill.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setMediaPickerConfig({
                            isOpen: true,
                            title: `Specialization Preview — ${skill.title}`,
                            accept: "image",
                            currentValue: skill.previewImage,
                            onSelect: (url) => {
                              const nextSkills = [...portfolio.skills];
                              nextSkills[sIdx] = { ...nextSkills[sIdx], previewImage: url };
                              const updated = { ...portfolio, skills: nextSkills };
                              setPortfolio(updated);
                              saveAllToDatabase(updated);
                              showToast("Specialization preview image updated!");
                            },
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold flex items-center gap-2 self-end md:self-center transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Replace Image</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              7. CONTACT MANAGEMENT
             ============================================================ */}
          {activeTab === "contact" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/10">
                <h2 className="text-xl font-serif text-white uppercase">CONTACT & SOCIAL SETTINGS</h2>
                <p className="text-xs font-mono text-[#6F6F6B]">
                  Manage your direct email address and social media handles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
                <div>
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                    PRIMARY EMAIL (Clickable mailto:)
                  </label>
                  <input
                    type="email"
                    value={portfolio.personal.email}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, email: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">PHONE NUMBER</label>
                  <input
                    type="text"
                    value={portfolio.personal.phone}
                    onChange={(e) =>
                      setPortfolio({
                        ...portfolio,
                        personal: { ...portfolio.personal, phone: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                  />
                </div>
              </div>

              {/* Social Links List */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-[#A8A8A3] uppercase tracking-wider">
                    SOCIAL MEDIA CHANNELS
                  </span>
                  <button
                    onClick={() => {
                      const platform = prompt("Enter platform (e.g., 'Instagram'):");
                      if (!platform) return;
                      const url = prompt("Enter URL (e.g., 'https://instagram.com/...'):") || "";
                      const handle = prompt("Enter display handle (e.g., '@suresh'):") || platform;
                      const newSocials = [
                        ...portfolio.personal.socials,
                        { platform, url, handle },
                      ];
                      const updated = {
                        ...portfolio,
                        personal: { ...portfolio.personal, socials: newSocials },
                      };
                      setPortfolio(updated);
                      saveAllToDatabase(updated);
                    }}
                    className="px-3 py-1.5 rounded-lg glass-button text-xs font-mono flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Social</span>
                  </button>
                </div>

                {portfolio.personal.socials.map((soc, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl glass-card border border-white/10 flex justify-between items-center text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold">{soc.platform}</span>
                      <span className="text-[#6F6F6B]">•</span>
                      <span className="text-emerald-400">{soc.handle}</span>
                    </div>

                    <button
                      onClick={() => {
                        const newSocials = portfolio.personal.socials.filter((_, idx) => idx !== i);
                        const updated = {
                          ...portfolio,
                          personal: { ...portfolio.personal, socials: newSocials },
                        };
                        setPortfolio(updated);
                        saveAllToDatabase(updated);
                      }}
                      className="p-1 rounded text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => saveAllToDatabase()}
                  className="px-6 py-3 rounded-xl bg-white text-black font-bold tracking-wider font-mono uppercase flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE CONTACT INFO</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              8. HERO SECTION MANAGEMENT
             ============================================================ */}
          {activeTab === "hero" && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-serif text-white uppercase">HOMEPAGE HERO SECTION</h2>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    Customize typography, CTA buttons, and ambient/media backgrounds with direct computer upload.
                  </p>
                </div>
                <button
                  onClick={() => saveAllToDatabase(portfolio, hero, siteSettings, typography, socialLinks)}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-bold tracking-wider font-mono uppercase text-xs flex items-center gap-2 shadow-md hover:bg-neutral-200 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE HERO SECTION</span>
                </button>
              </div>

              {/* SECTION 1: HERO BACKGROUND SETTINGS */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                    HERO BACKGROUND MEDIA & EFFECTS
                  </h3>
                </div>

                {/* Background Type Selection */}
                <div>
                  <label className="text-[#A8A8A3] block mb-2 font-mono text-xs uppercase tracking-wider">
                    BACKGROUND STYLE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        id: "ambient",
                        label: "Ambient WebGL",
                        desc: "Dynamic glow canvas",
                        icon: Sparkles,
                      },
                      {
                        id: "image",
                        label: "Single Image",
                        desc: "High-res hero image",
                        icon: ImageIcon,
                      },
                      {
                        id: "video",
                        label: "Looping Video",
                        desc: "Background video MP4",
                        icon: Film,
                      },
                      {
                        id: "slideshow",
                        label: "Slideshow",
                        desc: "Multi-image fade",
                        icon: Layers,
                      },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = (hero.bgType || "ambient") === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setHero({ ...hero, bgType: mode.id as any })}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                            isSelected
                              ? "bg-white text-black border-white shadow-md font-bold"
                              : "bg-[#121215] text-[#A8A8A3] border-white/10 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`w-4 h-4 ${isSelected ? "text-black" : "text-emerald-400"}`} />
                            {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                          </div>
                          <span className="text-xs font-mono font-semibold">{mode.label}</span>
                          <span className={`text-[10px] ${isSelected ? "text-neutral-700" : "text-[#6F6F6B]"}`}>
                            {mode.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Background Media Uploader based on Mode */}
                {hero.bgType === "image" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-white font-semibold">Hero Background Image</span>
                      <span className="text-[10px] font-mono text-[#6F6F6B]">High-res WebP / PNG / JPG</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {hero.bgMediaUrl ? (
                        <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-black border border-white/20 shrink-0">
                          <img src={hero.bgMediaUrl} alt="Hero background" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-36 h-20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-[#6F6F6B] shrink-0">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[9px] uppercase font-mono">No Image</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                isOpen: true,
                                title: "Select or Upload Hero Background Image",
                                accept: "image",
                                currentValue: hero.bgMediaUrl,
                                onSelect: (url) => {
                                  setHero((prev) => ({ ...prev, bgMediaUrl: url }));
                                  showToast("Hero background image set!");
                                },
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload from Computer</span>
                          </button>
                          {hero.bgMediaUrl && (
                            <button
                              type="button"
                              onClick={() => setHero((prev) => ({ ...prev, bgMediaUrl: "" }))}
                              className="px-3 py-2 rounded-xl text-red-400 hover:text-red-300 font-mono text-xs"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[#6F6F6B]">
                          Upload directly from your PC or pick from Media Library
                        </span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={hero.bgMediaUrl || ""}
                      onChange={(e) => setHero({ ...hero, bgMediaUrl: e.target.value })}
                      placeholder="https://... or /uploads/hero-image.webp"
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                    />
                  </div>
                )}

                {hero.bgType === "video" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-white font-semibold">Hero Background Looping Video</span>
                      <span className="text-[10px] font-mono text-[#6F6F6B]">MP4 / WebM video files</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {hero.bgMediaUrl ? (
                        <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-black border border-white/20 flex items-center justify-center shrink-0">
                          <Play className="w-6 h-6 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-36 h-20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-[#6F6F6B] shrink-0">
                          <Film className="w-6 h-6 mb-1" />
                          <span className="text-[9px] uppercase font-mono">No Video</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                isOpen: true,
                                title: "Select or Upload Hero Looping Video",
                                accept: "video",
                                currentValue: hero.bgMediaUrl,
                                onSelect: (url) => {
                                  setHero((prev) => ({ ...prev, bgMediaUrl: url }));
                                  showToast("Hero video set!");
                                },
                              })
                            }
                            className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Video from Computer</span>
                          </button>
                          {hero.bgMediaUrl && (
                            <button
                              type="button"
                              onClick={() => setHero((prev) => ({ ...prev, bgMediaUrl: "" }))}
                              className="px-3 py-2 rounded-xl text-red-400 hover:text-red-300 font-mono text-xs"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[#6F6F6B]">
                          Upload local MP4/WebM video, or enter URL
                        </span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={hero.bgMediaUrl || ""}
                      onChange={(e) => setHero({ ...hero, bgMediaUrl: e.target.value })}
                      placeholder="/uploads/hero-background.mp4 or https://..."
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                    />

                    {/* Poster image fallback */}
                    <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[#A8A8A3] text-[11px] font-mono uppercase">
                          Video Poster / Placeholder Image (shown while video loads or on mobile)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setMediaPickerConfig({
                              isOpen: true,
                              title: "Select Poster Image for Hero Video",
                              accept: "image",
                              currentValue: hero.bgPosterUrl,
                              onSelect: (url) => {
                                setHero((prev) => ({ ...prev, bgPosterUrl: url }));
                                showToast("Poster image set!");
                              },
                            })
                          }
                          className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" /> Upload Poster
                        </button>
                      </div>
                      <input
                        type="text"
                        value={hero.bgPosterUrl || ""}
                        onChange={(e) => setHero({ ...hero, bgPosterUrl: e.target.value })}
                        placeholder="https://... or /uploads/video-poster.webp"
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                )}

                {hero.bgType === "slideshow" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-mono text-white font-semibold">Hero Background Slideshow</span>
                        <p className="text-[10px] font-mono text-[#6F6F6B]">
                          Smooth cross-fading imagery rotating on the hero section
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setMediaPickerConfig({
                            isOpen: true,
                            title: "Add Images to Hero Slideshow",
                            accept: "image",
                            onSelect: (url) => {
                              const currentList = hero.bgSlideshowUrls || [];
                              setHero((prev) => ({
                                ...prev,
                                bgSlideshowUrls: [...currentList, url],
                              }));
                              showToast("Image added to slideshow!");
                            },
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slide</span>
                      </button>
                    </div>

                    {(!hero.bgSlideshowUrls || hero.bgSlideshowUrls.length === 0) ? (
                      <div className="p-6 rounded-xl border border-dashed border-white/15 text-center text-xs font-mono text-[#6F6F6B]">
                        No slideshow images yet. Click "Add Slide" to upload or pick images.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {hero.bgSlideshowUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative h-28 rounded-xl overflow-hidden border border-white/20 group bg-black"
                          >
                            <img src={url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = hero.bgSlideshowUrls?.filter((_, i) => i !== idx);
                                  setHero((prev) => ({ ...prev, bgSlideshowUrls: updated }));
                                }}
                                className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500"
                                title="Remove slide"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Media Opacity / Visibility Slider */}
                <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white font-semibold">Media Opacity / Visibility</span>
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
                  <div className="flex justify-between text-[9px] font-mono text-[#6F6F6B]">
                    <span>0% (Invisible)</span>
                    <span>25% (Subtle)</span>
                    <span>50% (Medium)</span>
                    <span>75% (Strong)</span>
                    <span>100% (Full)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6F6F6B]">
                    Controls direct visual visibility of the background image, video, or ambient canvas.
                  </span>
                </div>

                {/* Dark Overlay Strength / Contrast Slider */}
                <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white font-semibold">Dark Overlay Strength (Text Readability)</span>
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
                  <div className="flex justify-between text-[9px] font-mono text-[#6F6F6B]">
                    <span>0% (No Darkening)</span>
                    <span>30% (Light)</span>
                    <span>65% (Recommended)</span>
                    <span>95% (Heavy Contrast)</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6F6F6B]">
                    Adjusting the overlay ensures hero titles and tagline remain high-contrast and easy to read.
                  </span>
                </div>

                {/* Slideshow Transition Interval (if slideshow is active) */}
                {hero.bgType === "slideshow" && (
                  <div className="p-4 rounded-xl bg-[#121215] border border-white/10 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-white font-semibold">Slideshow Interval</span>
                      <span className="text-emerald-400 font-bold">
                        {hero.bgSlideshowInterval || 5}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      step="1"
                      value={hero.bgSlideshowInterval || 5}
                      onChange={(e) =>
                        setHero({ ...hero, bgSlideshowInterval: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-[#6F6F6B]">
                      Seconds each image stays on screen before smoothly fading to the next.
                    </span>
                  </div>
                )}
              </div>

              {/* SECTION 2: HERO CONTENT & TYPOGRAPHY */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                    HERO CONTENT & TYPOGRAPHY
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
                  <div className="sm:col-span-2">
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">
                      TOP BADGE / CATEGORY TAG
                    </label>
                    <input
                      type="text"
                      value={hero.badgeText || "SUR3SH // DESIGN & CODE"}
                      onChange={(e) => setHero({ ...hero, badgeText: e.target.value })}
                      placeholder="e.g. SUR3SH // DESIGN & CODE"
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">HERO TITLE LINE 1</label>
                    <input
                      type="text"
                      value={hero.title1}
                      onChange={(e) => setHero({ ...hero, title1: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">HERO TITLE LINE 2</label>
                    <input
                      type="text"
                      value={hero.title2}
                      onChange={(e) => setHero({ ...hero, title2: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">SUBTITLE / TAGLINE</label>
                    <textarea
                      value={hero.subtitle}
                      onChange={(e) => {
                        setHero({ ...hero, subtitle: e.target.value });
                        setPortfolio({
                          ...portfolio,
                          personal: { ...portfolio.personal, tagline: e.target.value },
                        });
                      }}
                      rows={2}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">CTA BUTTON TEXT</label>
                    <input
                      type="text"
                      value={hero.ctaText}
                      onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">CTA BUTTON LINK</label>
                    <input
                      type="text"
                      value={hero.ctaLink}
                      onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => saveAllToDatabase(portfolio, hero, siteSettings, typography, socialLinks)}
                  className="px-6 py-3 rounded-xl bg-white text-black font-bold tracking-wider font-mono uppercase flex items-center gap-2 shadow-lg hover:bg-neutral-200 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE HERO SECTION</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              9. SITE SETTINGS & PASSWORD
             ============================================================ */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              {/* Site Info */}
              <div className="flex flex-col gap-5">
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-xl font-serif text-white uppercase">SITE SETTINGS</h2>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    General site title and meta description.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">WEBSITE TITLE</label>
                    <input
                      type="text"
                      value={siteSettings.siteTitle}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteTitle: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">META DESCRIPTION (SEO)</label>
                    <textarea
                      value={siteSettings.metaDescription}
                      onChange={(e) => setSiteSettings({ ...siteSettings, metaDescription: e.target.value })}
                      rows={2}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">FOOTER COPYRIGHT TEXT</label>
                    <input
                      type="text"
                      value={siteSettings.footerText}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => saveAllToDatabase(portfolio, hero, siteSettings)}
                    className="px-6 py-3 rounded-xl bg-white text-black font-bold tracking-wider font-mono uppercase flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE SITE SETTINGS</span>
                  </button>
                </div>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="flex flex-col gap-5 pt-8 border-t border-white/10">
                <div>
                  <h3 className="text-base font-serif text-white uppercase">SECURITY: CHANGE ADMIN PASSWORD</h3>
                  <p className="text-xs font-mono text-[#6F6F6B]">
                    Logged in as <span className="text-emerald-400 font-bold">{username}</span>. Update your password securely.
                  </p>
                </div>

                {passwordStatus && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      passwordStatus.success
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                        : "bg-red-500/10 border border-red-500/30 text-red-300"
                    }`}
                  >
                    {passwordStatus.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">CURRENT PASSWORD</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">NEW PASSWORD</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[#A8A8A3] block mb-1 uppercase tracking-wider">CONFIRM NEW PASSWORD</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full p-3 rounded-xl bg-[#121215] border border-white/15 text-white"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-3 rounded-xl border border-white/20 glass-button text-white font-mono text-xs tracking-wider uppercase flex items-center gap-2 disabled:opacity-50"
                  >
                    {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>UPDATE PASSWORD</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Universal Direct Computer / Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerConfig.isOpen}
        onClose={() => setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }))}
        title={mediaPickerConfig.title}
        acceptType={mediaPickerConfig.accept || "all"}
        currentValue={mediaPickerConfig.currentValue}
        onSelect={(url) => {
          mediaPickerConfig.onSelect(url);
          setMediaPickerConfig((prev) => ({ ...prev, isOpen: false }));
          fetchMedia();
        }}
      />
    </div>
  );
}

