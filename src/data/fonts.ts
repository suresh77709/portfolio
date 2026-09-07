export interface FontOption {
  id: string;
  name: string;
  family: string;
  googleFamilyName: string;
  category: "sans-serif" | "serif" | "display" | "monospace";
  weights: number[];
  sample: string;
}

export const FONT_LIBRARY: FontOption[] = [
  {
    id: "default",
    name: "System / Default Theme",
    family: "inherit",
    googleFamilyName: "",
    category: "sans-serif",
    weights: [400, 500, 600, 700, 800],
    sample: "Cinematic Visual Storytelling",
  },
  {
    id: "inter",
    name: "Inter",
    family: "'Inter', sans-serif",
    googleFamilyName: "Inter",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800, 900],
    sample: "Precision Modern Aesthetic",
  },
  {
    id: "manrope",
    name: "Manrope",
    family: "'Manrope', sans-serif",
    googleFamilyName: "Manrope",
    category: "sans-serif",
    weights: [400, 500, 600, 700, 800],
    sample: "Geometric Semi-Modern Sans",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    family: "'DM Sans', sans-serif",
    googleFamilyName: "DM+Sans",
    category: "sans-serif",
    weights: [400, 500, 600, 700, 800],
    sample: "Contemporary Clean Agency",
  },
  {
    id: "plus-jakarta-sans",
    name: "Plus Jakarta Sans",
    family: "'Plus Jakarta Sans', sans-serif",
    googleFamilyName: "Plus+Jakarta+Sans",
    category: "sans-serif",
    weights: [400, 500, 600, 700, 800],
    sample: "Tech & Editorial Modernity",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    family: "'Space Grotesk', sans-serif",
    googleFamilyName: "Space+Grotesk",
    category: "display",
    weights: [400, 500, 600, 700],
    sample: "High-Tech Expressive Display",
  },
  {
    id: "outfit",
    name: "Outfit",
    family: "'Outfit', sans-serif",
    googleFamilyName: "Outfit",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    sample: "Contemporary Wide Brand Type",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "'Poppins', sans-serif",
    googleFamilyName: "Poppins",
    category: "sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    sample: "Warm Geometric Curves",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "'Montserrat', sans-serif",
    googleFamilyName: "Montserrat",
    category: "sans-serif",
    weights: [400, 500, 600, 700, 800],
    sample: "Bold Urban Architectural",
  },
  {
    id: "archivo",
    name: "Archivo",
    family: "'Archivo', sans-serif",
    googleFamilyName: "Archivo",
    category: "sans-serif",
    weights: [400, 500, 600, 700, 800],
    sample: "High-Impact Cinematic Posters",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    googleFamilyName: "Playfair+Display",
    category: "serif",
    weights: [400, 500, 600, 700, 800, 900],
    sample: "Luxury Editorial Sophistication",
  },
];

export interface ElementTypography {
  fontFamily: string; // font id from FONT_LIBRARY
  fontWeight?: number; // 300 - 900
  letterSpacing?: number; // in em e.g. 0.05
  lineHeight?: number; // e.g. 1.2
  textTransform?: "none" | "uppercase" | "capitalize" | "lowercase";
}

export interface TypographySettings {
  globalFont: string; // "default" or font id
  heroTitle: ElementTypography;
  sectionHeadings: ElementTypography;
  bodyText: ElementTypography;
  navigation: ElementTypography;
  buttons: ElementTypography;
  portfolioTitles: ElementTypography;
  portfolioDescriptions: ElementTypography;
  labels: ElementTypography;
  footer: ElementTypography;
  specialDisplay: ElementTypography;
}

export const DEFAULT_TYPOGRAPHY_SETTINGS: TypographySettings = {
  globalFont: "default",
  heroTitle: {
    fontFamily: "default",
    fontWeight: 700,
    letterSpacing: -0.02,
    lineHeight: 0.95,
    textTransform: "uppercase",
  },
  sectionHeadings: {
    fontFamily: "default",
    fontWeight: 700,
    letterSpacing: -0.02,
    lineHeight: 1.05,
    textTransform: "uppercase",
  },
  bodyText: {
    fontFamily: "default",
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.6,
    textTransform: "none",
  },
  navigation: {
    fontFamily: "default",
    fontWeight: 500,
    letterSpacing: 0.05,
    textTransform: "uppercase",
  },
  buttons: {
    fontFamily: "default",
    fontWeight: 600,
    letterSpacing: 0.08,
    textTransform: "uppercase",
  },
  portfolioTitles: {
    fontFamily: "default",
    fontWeight: 600,
    letterSpacing: -0.01,
    lineHeight: 1.15,
    textTransform: "uppercase",
  },
  portfolioDescriptions: {
    fontFamily: "default",
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.5,
    textTransform: "none",
  },
  labels: {
    fontFamily: "default",
    fontWeight: 500,
    letterSpacing: 0.1,
    textTransform: "uppercase",
  },
  footer: {
    fontFamily: "default",
    fontWeight: 400,
    letterSpacing: 0.02,
    textTransform: "none",
  },
  specialDisplay: {
    fontFamily: "default",
    fontWeight: 800,
    letterSpacing: -0.03,
    lineHeight: 0.9,
    textTransform: "uppercase",
  },
};

/**
 * Returns list of unique Google Font names that are actively in use
 */
export function getActiveGoogleFonts(settings: TypographySettings): string[] {
  const activeIds = new Set<string>();

  if (settings.globalFont && settings.globalFont !== "default") {
    activeIds.add(settings.globalFont);
  }

  const areas: (keyof TypographySettings)[] = [
    "heroTitle",
    "sectionHeadings",
    "bodyText",
    "navigation",
    "buttons",
    "portfolioTitles",
    "portfolioDescriptions",
    "labels",
    "footer",
    "specialDisplay",
  ];

  for (const area of areas) {
    const val = settings[area];
    if (typeof val === "object" && val.fontFamily && val.fontFamily !== "default") {
      activeIds.add(val.fontFamily);
    }
  }

  const fontNames: string[] = [];
  for (const id of activeIds) {
    const opt = FONT_LIBRARY.find((f) => f.id === id);
    if (opt && opt.googleFamilyName) {
      // Load standard weight axis
      fontNames.push(`${opt.googleFamilyName}:wght@300;400;500;600;700;800;900`);
    }
  }

  return fontNames;
}

/**
 * Builds Google Fonts stylesheet URL for active fonts
 */
export function buildGoogleFontsUrl(settings: TypographySettings): string | null {
  const fonts = getActiveGoogleFonts(settings);
  if (fonts.length === 0) return null;

  const families = fonts.map((f) => `family=${f}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Converts font id to CSS font-family string
 */
export function getFontFamilyCss(fontId: string, globalFontId: string = "default"): string {
  if (fontId !== "default") {
    const found = FONT_LIBRARY.find((f) => f.id === fontId);
    if (found && found.family !== "inherit") return found.family;
  }
  if (globalFontId !== "default") {
    const foundGlobal = FONT_LIBRARY.find((f) => f.id === globalFontId);
    if (foundGlobal && foundGlobal.family !== "inherit") return foundGlobal.family;
  }
  return "inherit";
}
