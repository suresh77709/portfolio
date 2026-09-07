"use client";

import { useState, useRef, useEffect, useMemo, DragEvent } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Search,
  Check,
  AlertCircle,
  Sparkles,
  Layers,
  FolderOpen,
  ArrowUpRight,
  HardDrive,
  RefreshCw,
} from "lucide-react";

export interface MediaItem {
  filename: string;
  url: string;
  thumbnailUrl?: string | null;
  size: number;
  createdAt: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  usedBy?: { type: string; title: string; id?: string }[];
  inUse?: boolean;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  acceptType?: "image" | "video" | "all";
  currentValue?: string;
  multiple?: boolean;
  onSelect: (url: string, media?: MediaItem) => void;
  onSelectMultiple?: (urls: string[], mediaList?: MediaItem[]) => void;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  title = "Media Manager",
  acceptType = "all",
  currentValue,
  multiple = false,
  onSelect,
  onSelectMultiple,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">(
    acceptType === "video" ? "video" : acceptType === "image" ? "image" : "all"
  );

  // Single Selection State
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  // Multiple Selection State
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);

  // Upload States
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine accepted MIME types string for native Windows picker
  const acceptAttribute = useMemo(() => {
    if (acceptType === "image") {
      return "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.avif,.gif,.svg";
    }
    if (acceptType === "video") {
      return "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";
    }
    return "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime,.jpg,.jpeg,.png,.webp,.avif,.gif,.svg,.mp4,.webm,.mov";
  }, [acceptType]);

  // Fetch library media
  const fetchLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error("Failed to load media library:", err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLibrary();
      setUploadError(null);
      setUploadProgress(0);
      setUploadStatus("");
      setSelectedItem(null);
      setSelectedItems([]);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isUploading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isUploading, onClose]);

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Upload handler with progress simulation / feedback
  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(15);
    setUploadStatus("Reading files from computer...");

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      // Progress animation
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer);
            return 85;
          }
          return prev + 15;
        });
      }, 150);

      setUploadStatus("Uploading & optimizing media...");

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed with status ${res.status}`);
      }

      setUploadProgress(100);
      setUploadStatus("Uploaded & optimized successfully!");

      const data = await res.json();
      const newItems: MediaItem[] = Array.isArray(data.all)
        ? data.all
        : Array.isArray(data.media)
        ? data.media
        : data.media
        ? [data.media]
        : [];

      // Refresh media library
      await fetchLibrary();

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus("");

        if (multiple && onSelectMultiple && newItems.length > 0) {
          onSelectMultiple(
            newItems.map((item) => item.url),
            newItems
          );
          onClose();
        } else if (newItems.length > 0) {
          const first = newItems[0];
          setSelectedItem(first);
          onSelect(first.url, first);
          onClose();
        }
      }, 500);
    } catch (err: any) {
      console.error("Upload error:", err);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
      setUploadError(err.message || "Failed to upload file. Please try again.");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Filtered media for library tab
  const filteredLibrary = useMemo(() => {
    return mediaList.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [mediaList, searchQuery, typeFilter]);

  // Toggle selection for multiple mode
  const handleToggleMultipleItem = (item: MediaItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.url === item.url);
      if (exists) {
        return prev.filter((i) => i.url !== item.url);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleConfirmSelection = () => {
    if (multiple && onSelectMultiple) {
      onSelectMultiple(
        selectedItems.map((i) => i.url),
        selectedItems
      );
      onClose();
    } else if (selectedItem) {
      onSelect(selectedItem.url, selectedItem);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0E0E11] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#131317]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-white tracking-wide uppercase">
                {title}
              </h3>
              <p className="text-[11px] font-mono text-[#8E8E93]">
                {multiple
                  ? "Select or upload multiple images/videos"
                  : acceptType === "video"
                  ? "Select or upload video file (MP4, WebM up to 150MB)"
                  : "Select or upload image file (WebP, PNG, JPG, AVIF)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#A8A8A3] hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-white/10 flex items-center justify-between bg-[#0B0B0E]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-mono tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeTab === "upload"
                  ? "border-emerald-400 text-white font-bold bg-white/5"
                  : "border-transparent text-[#8E8E93] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>UPLOAD FROM COMPUTER</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("library");
                fetchLibrary();
              }}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-mono tracking-wider transition-all flex items-center gap-2 border-b-2 ${
                activeTab === "library"
                  ? "border-emerald-400 text-white font-bold bg-white/5"
                  : "border-transparent text-[#8E8E93] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>CHOOSE FROM MEDIA LIBRARY ({mediaList.length})</span>
            </button>
          </div>

          {currentValue && (
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#6F6F6B]">
              <span>Current:</span>
              <span className="text-[#A8A8A3] max-w-[200px] truncate">
                {currentValue}
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[380px] max-h-[60vh]">
          {/* TAB 1: UPLOAD FROM COMPUTER */}
          {activeTab === "upload" && (
            <div className="flex flex-col gap-6">
              {/* Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={acceptAttribute}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleUploadFiles(e.target.files);
                  }
                }}
              />

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed p-10 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                    : "border-white/15 bg-white/[0.02] hover:border-emerald-400/50 hover:bg-white/[0.04]"
                } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center mb-4 shadow-xl group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8 animate-pulse" />
                </div>

                <h4 className="text-lg font-serif text-white font-semibold mb-1">
                  Drag & Drop Media Here
                </h4>
                <p className="text-xs font-mono text-[#8E8E93] max-w-sm mb-6">
                  Directly drag images or videos from your Windows File Explorer, or click the button below to browse.
                </p>

                {/* Prominent Upload from Computer Button */}
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>UPLOAD FROM COMPUTER</span>
                </button>

                <span className="mt-4 text-[10px] font-mono text-[#6F6F6B]">
                  Supported formats: JPG, PNG, WebP, AVIF, GIF, SVG, MP4, WebM (Auto-optimized)
                </span>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="rounded-xl p-4 bg-white/5 border border-white/10 flex flex-col gap-2 animate-in fade-in">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {uploadStatus}
                    </span>
                    <span className="text-white font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-200 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="rounded-xl p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Current / Selected Preview */}
              {selectedItem && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-black overflow-hidden relative flex-shrink-0 border border-white/10">
                      {selectedItem.type === "video" ? (
                        <video
                          src={selectedItem.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={selectedItem.thumbnailUrl || selectedItem.url}
                          alt={selectedItem.filename}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-white font-bold truncate max-w-sm">
                        {selectedItem.filename}
                      </div>
                      <div className="text-[11px] font-mono text-[#8E8E93]">
                        {formatBytes(selectedItem.size)} • {selectedItem.type.toUpperCase()}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        Ready to apply to page
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmSelection}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    Confirm & Apply
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHOOSE FROM MEDIA LIBRARY */}
          {activeTab === "library" && (
            <div className="flex flex-col gap-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6F6F6B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search media files by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-[#6F6F6B] focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => setTypeFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors ${
                      typeFilter === "all"
                        ? "bg-white/15 text-white font-bold"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTypeFilter("image")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors flex items-center gap-1 ${
                      typeFilter === "image"
                        ? "bg-white/15 text-white font-bold"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    Images
                  </button>
                  <button
                    onClick={() => setTypeFilter("video")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-colors flex items-center gap-1 ${
                      typeFilter === "video"
                        ? "bg-white/15 text-white font-bold"
                        : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    Videos
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              {isLoadingLibrary ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                  <span className="text-xs font-mono text-[#8E8E93]">
                    Loading media library...
                  </span>
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-[#6F6F6B]" />
                  <p className="text-xs font-mono text-[#8E8E93]">
                    No media items found matching your filter.
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="text-xs font-mono text-emerald-400 hover:underline mt-1"
                  >
                    Upload from your computer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredLibrary.map((item) => {
                    const isSelected = multiple
                      ? selectedItems.some((i) => i.url === item.url)
                      : selectedItem?.url === item.url || currentValue === item.url;

                    return (
                      <div
                        key={item.filename}
                        onClick={() => {
                          if (multiple) {
                            handleToggleMultipleItem(item);
                          } else {
                            setSelectedItem(item);
                          }
                        }}
                        className={`group relative rounded-2xl overflow-hidden bg-[#141418] border transition-all duration-200 cursor-pointer flex flex-col ${
                          isSelected
                            ? "border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg scale-[1.02]"
                            : "border-white/10 hover:border-white/30 hover:scale-[1.01]"
                        }`}
                      >
                        {/* Media Thumbnail Container */}
                        <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                          {item.type === "video" ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white">
                                  <Film className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.thumbnailUrl || item.url}
                              alt={item.filename}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          )}

                          {/* Selected Checkmark Badge */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg font-bold">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Usage Badge */}
                          {item.inUse && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
                              In Use ({item.usedBy?.length || 1})
                            </div>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-2.5 flex flex-col gap-1">
                          <span
                            className="text-[11px] font-mono text-white font-medium truncate"
                            title={item.filename}
                          >
                            {item.filename}
                          </span>
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8E93]">
                            <span>{formatBytes(item.size)}</span>
                            <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-white/5">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-[#131317]">
          <div className="text-xs font-mono text-[#8E8E93]">
            {multiple ? (
              <span>{selectedItems.length} media selected</span>
            ) : selectedItem ? (
              <span className="text-emerald-400 truncate max-w-sm block">
                Selected: {selectedItem.filename}
              </span>
            ) : (
              <span>Select or upload a file to proceed</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-mono text-[#A8A8A3] hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={
                isUploading ||
                (multiple ? selectedItems.length === 0 : !selectedItem)
              }
              className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
