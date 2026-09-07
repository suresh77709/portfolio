import fs from "fs";
import path from "path";
import { INITIAL_PORTFOLIO_DATA, PortfolioData } from "@/data/portfolio";
import { generateSalt, hashPassword, verifyPassword } from "./auth";
import { TypographySettings, DEFAULT_TYPOGRAPHY_SETTINGS } from "@/data/fonts";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "portfolio-db.json");

export type { StoredUser, HeroSettings, SiteSettings } from "@/types/settings";
export type { SocialLinkItem } from "@/data/socials";
export { DEFAULT_SOCIAL_LINKS } from "@/data/socials";
import type { StoredUser, HeroSettings, SiteSettings } from "@/types/settings";
import type { SocialLinkItem } from "@/data/socials";
import { DEFAULT_SOCIAL_LINKS } from "@/data/socials";


export interface DatabaseSchema {
  portfolio: PortfolioData;
  hero: HeroSettings;
  siteSettings: SiteSettings;
  typography: TypographySettings;
  socialLinks: SocialLinkItem[];
  users: StoredUser[];
}

/**
 * Ensures data directory and db file exist with initial seeded content
 */
function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let db: DatabaseSchema | null = null;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(raw) as DatabaseSchema;
    } catch (err) {
      console.error("Failed to parse database file, re-initializing:", err);
    }
  }

  if (db) {
    let updated = false;
    if (!db.hero) {
      db.hero = {
        title1: "GRAPHIC DESIGNER",
        title2: "& VIDEO EDITOR",
        subtitle: db.portfolio?.personal?.tagline || INITIAL_PORTFOLIO_DATA.personal.tagline,
        ctaText: "EXPLORE SHOWCASE",
        ctaLink: "#work",
        badgeText: db.portfolio?.personal?.availability || INITIAL_PORTFOLIO_DATA.personal.availability,
        bgType: "ambient",
        bgOverlayOpacity: 65,
        bgMediaOpacity: 100,
        bgSlideshowInterval: 5,
      };
      updated = true;
    } else {
      if (!db.hero.bgType) {
        db.hero.bgType = "ambient";
        updated = true;
      }
      if (db.hero.bgOverlayOpacity === undefined) {
        db.hero.bgOverlayOpacity = 65;
        updated = true;
      }
      if (db.hero.bgMediaOpacity === undefined) {
        db.hero.bgMediaOpacity = 100;
        updated = true;
      }
      if (db.hero.bgSlideshowInterval === undefined) {
        db.hero.bgSlideshowInterval = 5;
        updated = true;
      }
    }
    if (!db.typography) {
      db.typography = DEFAULT_TYPOGRAPHY_SETTINGS;
      updated = true;
    }
    if (!db.socialLinks || !Array.isArray(db.socialLinks)) {
      db.socialLinks = DEFAULT_SOCIAL_LINKS;
      updated = true;
    }
    if (!db.users || !Array.isArray(db.users) || db.users.length === 0) {
      const defaultUsername = process.env.ADMIN_USERNAME || "admin";
      const defaultPassword = process.env.ADMIN_PASSWORD || "suresh@admin2026";
      const salt = generateSalt();
      const passwordHash = hashPassword(defaultPassword, salt);
      db.users = [
        {
          id: "admin-1",
          username: defaultUsername,
          passwordHash,
          salt,
          role: "ADMIN",
          updatedAt: new Date().toISOString(),
        },
      ];
      updated = true;
    }
    if (updated) {
      saveDatabase(db);
    }
    return db;
  }


  // Seed default admin user
  const defaultUsername = process.env.ADMIN_USERNAME || "admin";
  const defaultPassword = process.env.ADMIN_PASSWORD || "suresh@admin2026";
  const salt = generateSalt();
  const passwordHash = hashPassword(defaultPassword, salt);

  const initialDb: DatabaseSchema = {
    portfolio: INITIAL_PORTFOLIO_DATA,
    hero: {
      title1: "GRAPHIC DESIGNER",
      title2: "& VIDEO EDITOR",
      subtitle: INITIAL_PORTFOLIO_DATA.personal.tagline,
      ctaText: "EXPLORE SHOWCASE",
      ctaLink: "#work",
      badgeText: INITIAL_PORTFOLIO_DATA.personal.availability,
    },
    siteSettings: {
      siteTitle: "SURESH — Graphic Designer & Video Editor",
      metaDescription: INITIAL_PORTFOLIO_DATA.personal.tagline,
      footerText: `© ${new Date().getFullYear()} Suresh. All Rights Reserved.`,
      email: INITIAL_PORTFOLIO_DATA.personal.email,
      phone: INITIAL_PORTFOLIO_DATA.personal.phone,
    },
    typography: DEFAULT_TYPOGRAPHY_SETTINGS,
    socialLinks: DEFAULT_SOCIAL_LINKS,
    users: [
      {
        id: "admin-1",
        username: defaultUsername,
        passwordHash,
        salt,
        role: "ADMIN",
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  saveDatabase(initialDb);
  return initialDb;
}

/**
 * Saves database atomically to prevent partial writes
 */
function saveDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

/**
 * Gets full database
 */
export function getDatabase(): DatabaseSchema {
  return ensureDatabase();
}

/**
 * Gets the current public portfolio data
 */
export function getPortfolioData(): PortfolioData {
  const db = ensureDatabase();
  return db.portfolio;
}

/**
 * Updates portfolio data and saves to disk
 */
export function updatePortfolioData(updates: Partial<PortfolioData>): PortfolioData {
  const db = ensureDatabase();
  db.portfolio = {
    ...db.portfolio,
    ...updates,
  };
  saveDatabase(db);
  return db.portfolio;
}

/**
 * Gets Hero section settings
 */
export function getHeroSettings(): HeroSettings {
  const db = ensureDatabase();
  return db.hero;
}

/**
 * Updates Hero section settings
 */
export function updateHeroSettings(updates: Partial<HeroSettings>): HeroSettings {
  const db = ensureDatabase();
  db.hero = {
    ...db.hero,
    ...updates,
  };
  saveDatabase(db);
  return db.hero;
}

/**
 * Gets Site settings
 */
export function getSiteSettings(): SiteSettings {
  const db = ensureDatabase();
  return db.siteSettings;
}

/**
 * Updates Site settings
 */
export function updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
  const db = ensureDatabase();
  db.siteSettings = {
    ...db.siteSettings,
    ...updates,
  };
  saveDatabase(db);
  return db.siteSettings;
}

/**
 * Verifies admin credentials against database or env fallback
 */
export function verifyAdminCredentials(username: string, password: string): StoredUser | null {
  const db = ensureDatabase();
  const user = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    // Fallback check against env vars if configured
    const envUser = process.env.ADMIN_USERNAME || "admin";
    const envPass = process.env.ADMIN_PASSWORD || "suresh@admin2026";
    if (username.toLowerCase() === envUser.toLowerCase() && password === envPass) {
      return db.users[0] || null;
    }
    return null;
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) return null;

  return user;
}

/**
 * Updates admin password
 */
export function updateAdminPassword(username: string, newPassword: string): boolean {
  const db = ensureDatabase();
  const userIndex = db.users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());

  if (userIndex === -1) return false;

  const newSalt = generateSalt();
  const newHash = hashPassword(newPassword, newSalt);

  db.users[userIndex].salt = newSalt;
  db.users[userIndex].passwordHash = newHash;
  db.users[userIndex].updatedAt = new Date().toISOString();

  saveDatabase(db);
  return true;
}

/**
 * Gets Typography settings
 */
export function getTypographySettings(): TypographySettings {
  const db = ensureDatabase();
  return db.typography || DEFAULT_TYPOGRAPHY_SETTINGS;
}

/**
 * Updates Typography settings
 */
export function updateTypographySettings(updates: Partial<TypographySettings>): TypographySettings {
  const db = ensureDatabase();
  db.typography = {
    ...db.typography,
    ...updates,
  };
  saveDatabase(db);
  return db.typography;
}

/**
 * Gets Social Links
 */
export function getSocialLinks(): SocialLinkItem[] {
  const db = ensureDatabase();
  return (db.socialLinks || DEFAULT_SOCIAL_LINKS).sort((a, b) => a.order - b.order);
}

/**
 * Updates Social Links
 */
export function updateSocialLinks(links: SocialLinkItem[]): SocialLinkItem[] {
  const db = ensureDatabase();
  db.socialLinks = links;
  saveDatabase(db);
  return db.socialLinks;
}

export interface MediaUsageRef {
  type:
    | "Hero Background"
    | "Hero Video"
    | "Hero Slideshow"
    | "Project Cover"
    | "Project Video"
    | "Project Gallery"
    | "Project Gallery Video"
    | "Skill Preview"
    | "About Profile"
    | "About Editorial";
  title: string;
  id?: string;
}

/**
 * Scans all database entities to find where any media URL or filename is referenced.
 */
export function scanMediaUsage(): Record<string, MediaUsageRef[]> {
  const db = ensureDatabase();
  const usageMap: Record<string, MediaUsageRef[]> = {};

  const addUsage = (url: string | undefined | null, ref: MediaUsageRef) => {
    if (!url || typeof url !== "string") return;
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!usageMap[cleanUrl]) {
      usageMap[cleanUrl] = [];
    }
    // Also index by basename / filename for easy lookup
    const filename = path.basename(cleanUrl);
    if (!usageMap[filename]) {
      usageMap[filename] = [];
    }

    if (!usageMap[cleanUrl].some((r) => r.type === ref.type && r.id === ref.id && r.title === ref.title)) {
      usageMap[cleanUrl].push(ref);
    }
    if (!usageMap[filename].some((r) => r.type === ref.type && r.id === ref.id && r.title === ref.title)) {
      usageMap[filename].push(ref);
    }
  };

  // Hero Section
  if (db.hero) {
    if (db.hero.bgType === "image" || db.hero.bgType === "video") {
      addUsage(db.hero.bgMediaUrl, {
        type: db.hero.bgType === "video" ? "Hero Video" : "Hero Background",
        title: "Hero Background Media",
      });
    }
    if (db.hero.bgPosterUrl) {
      addUsage(db.hero.bgPosterUrl, {
        type: "Hero Background",
        title: "Hero Video Poster",
      });
    }
    if (Array.isArray(db.hero.bgSlideshowUrls)) {
      db.hero.bgSlideshowUrls.forEach((slideUrl, idx) => {
        addUsage(slideUrl, {
          type: "Hero Slideshow",
          title: `Hero Slide #${idx + 1}`,
        });
      });
    }
  }

  // Portfolio Projects
  if (db.portfolio?.projects && Array.isArray(db.portfolio.projects)) {
    db.portfolio.projects.forEach((proj) => {
      addUsage(proj.coverImage, {
        type: "Project Cover",
        title: proj.title,
        id: proj.id,
      });
      addUsage(proj.videoUrl, {
        type: "Project Video",
        title: proj.title,
        id: proj.id,
      });
      if (Array.isArray(proj.gallery)) {
        proj.gallery.forEach((item, gIdx) => {
          if (typeof item === "string") {
            addUsage(item, {
              type: "Project Gallery",
              title: `${proj.title} (Gallery #${gIdx + 1})`,
              id: proj.id,
            });
          } else if (item && typeof item === "object") {
            addUsage(item.url, {
              type: "Project Gallery",
              title: `${proj.title} (Gallery #${gIdx + 1})`,
              id: proj.id,
            });
            addUsage(item.videoUrl, {
              type: "Project Gallery Video",
              title: `${proj.title} (Gallery Video #${gIdx + 1})`,
              id: proj.id,
            });
          }
        });
      }
    });
  }

  // Skills
  if (db.portfolio?.skills && Array.isArray(db.portfolio.skills)) {
    db.portfolio.skills.forEach((skill) => {
      if (skill.previewImage) {
        addUsage(skill.previewImage, {
          type: "Skill Preview",
          title: skill.title || skill.subtitle || "Skill",
        });
      }
    });
  }

  // About / Personal metadata if present
  const anyPortfolio = db.portfolio as any;
  if (anyPortfolio?.about) {
    addUsage(anyPortfolio.about.profileImage, {
      type: "About Profile",
      title: "About Profile Picture",
    });
    if (Array.isArray(anyPortfolio.about.editorialImages)) {
      anyPortfolio.about.editorialImages.forEach((edImg: string, eIdx: number) => {
        addUsage(edImg, {
          type: "About Editorial",
          title: `About Editorial #${eIdx + 1}`,
        });
      });
    }
  }

  return usageMap;
}


