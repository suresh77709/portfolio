export interface SkillItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  previewImage: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface DesignerInfo {
  name: string;
  title: string;
  tagline: string;
  editorialStatement: string;
  bio: string[];
  philosophy: string[];
  location: string;
  availability: string;
  email: string;
  phone: string;
  resumeUrl: string;
  skills: SkillItem[];
  tools: string[];
  clients: string[];
  awards: Array<{ year: string; title: string; organization: string }>;
  socials: SocialLink[];
}

export const DESIGNER_DATA: DesignerInfo = {
  name: "KAIROS VANE",
  title: "Graphic Designer & Visual Systems Architect",
  tagline: "Visual identities, digital experiences & creative systems.",
  editorialStatement: "I BUILD VISUAL SYSTEMS THAT FEEL LIKE SOMETHING.",
  bio: [
    "With over 9 years of experience collaborating with haute horlogerie houses, spatial computing labs, architectural ateliers, and cultural institutions, I craft visual identities and editorial systems characterized by extreme precision and emotional resonance.",
    "My work unites Swiss typographic discipline with fluid digital glassmorphism, creating identities that feel monolithic in physical space and alive in digital environments.",
    "Based in Zurich and Paris, I partner with forward-thinking leaders globally to transform complex ideas into definitive visual language."
  ],
  philosophy: [
    "Design is not decoration — it is the structural integrity of communication.",
    "Restraint creates density. Eliminating visual noise amplifies what truly matters.",
    "The most powerful brand identities exist at the intersection of tactile physical craft and responsive digital liquid forms."
  ],
  location: "Zurich / Paris / Remote",
  availability: "AVAILABLE FOR SELECT COMMISSIONS — Q4 2026 / 2027",
  email: "kairos@kairosvane.com",
  phone: "+41 44 892 1042",
  resumeUrl: "/cv-kairos-vane-2026.pdf",
  skills: [
    {
      number: "01",
      title: "BRAND IDENTITY",
      subtitle: "Visual Architecture & Brand Systems",
      description: "Developing comprehensive identity systems, monograms, brand guidelines, and visual language frameworks.",
      previewImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "02",
      title: "ART DIRECTION",
      subtitle: "Editorial & Spatial Direction",
      description: "Curating photography, cinematic visual pacing, spatial installations, and publication design.",
      previewImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "03",
      title: "GRAPHIC DESIGN",
      subtitle: "Tactile Print & Monograph Publishing",
      description: "Crafting physical books, luxury packaging monoliths, posters, and museum exhibition catalogs.",
      previewImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "04",
      title: "TYPOGRAPHY",
      subtitle: "Bespoke Type Design & Micro-Typesetting",
      description: "Engineering custom display fonts, variable font axes, and mathematical typographic grid structures.",
      previewImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "05",
      title: "DIGITAL DESIGN",
      subtitle: "Spatial & Web Experience Design",
      description: "Designing high-end web flagships, volumetric spatial computing interfaces, and interactive glass UIs.",
      previewImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    },
    {
      number: "06",
      title: "MOTION DESIGN",
      subtitle: "Kinetic Typography & WebGL Motion",
      description: "Creating real-time kinetic visual systems, ambient UI motion, and interactive 3D WebGL experiences.",
      previewImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
    }
  ],
  tools: [
    "Figma / Spatial UI Studio",
    "Glyphs 3 (Font Engineering)",
    "Cinema 4D / Octane Render",
    "Adobe Creative Cloud Suite",
    "GSAP & WebGL Shaders",
    "Next.js / TypeScript / React"
  ],
  clients: [
    "Lumière Atelier Paris",
    "Nexus Labs Zurich",
    "Aether Publishing London",
    "Kinetic Motion Lab NYC",
    "Solaris Group Berlin",
    "Vogue International"
  ],
  awards: [
    { year: "2026", title: "Gold Medal — Luxury Brand Identity", organization: "European Design Awards" },
    { year: "2025", title: "Selected Book Design", organization: "Tokyo TDC Annual Award" },
    { year: "2025", title: "Wayfinding Design Excellence", organization: "German Design Award" },
    { year: "2024", title: "Site of the Year Nominee", organization: "Awwwards & FWA" }
  ],
  socials: [
    { platform: "LinkedIn", url: "https://linkedin.com", handle: "in/kairosvane" },
    { platform: "Behance", url: "https://behance.net", handle: "behance.net/kairosvane" },
    { platform: "Instagram", url: "https://instagram.com", handle: "@kairosvane.studio" },
    { platform: "Dribbble", url: "https://dribbble.com", handle: "dribbble.com/kairosvane" }
  ]
};
