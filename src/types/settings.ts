export interface HeroSettings {
  title1: string;
  title2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badgeText: string;
  bgType?: "ambient" | "image" | "video" | "slideshow";
  bgMediaUrl?: string;
  bgSlideshowUrls?: string[];
  bgPosterUrl?: string;
  bgOverlayOpacity?: number;
  bgMediaOpacity?: number;
  bgSlideshowInterval?: number;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  footerText: string;
  email: string;
  phone: string;
}

export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  role: "ADMIN";
  updatedAt: string;
}
