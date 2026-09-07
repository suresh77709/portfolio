export interface ProjectColor {
  name: string;
  hex: string;
  role: string;
}

export interface ProjectTypography {
  primaryFont: string;
  secondaryFont: string;
  description: string;
  specimenText: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectGalleryItem {
  id: string;
  url: string;
  caption: string;
  aspectRatio: 'wide' | 'tall' | 'square';
}

export interface Project {
  id: string;
  number: string;
  title: string;
  slug: string;
  year: string;
  client: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  heroImage: string;
  challenge: string;
  concept: string;
  solution: string;
  outcome: string;
  services: string[];
  metrics: ProjectMetric[];
  colors: ProjectColor[];
  typography: ProjectTypography;
  gallery: ProjectGalleryItem[];
  featured: boolean;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "lumiere-haute-horlogerie",
    number: "01",
    title: "LUMIÈRE HAUTE HORLOGERIE",
    slug: "lumiere-haute-horlogerie",
    year: "2026",
    client: "Lumière Atelier Paris",
    category: "BRAND IDENTITY & LUXURY PACKAGING",
    shortDescription: "A liquid-glass brand architecture and tactile packaging system for a modern Swiss-French haute horlogerie house.",
    fullDescription: "Lumière Haute Horlogerie represents the pinnacle of micro-mechanical engineering and aesthetic restraint. Commissioned to redefine luxury watchmaking identity for a new generation of collectors, we crafted a comprehensive visual identity, bespoke typography, physical packaging monoliths, and digital flagship experiences.",
    coverImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
    heroImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=90",
    challenge: "Traditional Swiss watchmaking branding often relies on conservative heritage tropes that fail to resonate with modern avant-garde collectors. Lumière required an identity that felt contemporary yet timeless, striking a precise balance between Swiss engineering rigor and French artistic poeticism.",
    concept: "Refraction of light through sapphire crystal became the central conceptual driver. We designed an identity system governed by liquid glass surfaces, razor-sharp typographic geometry, and tactile material contrasting obsidian matte black with polished silver foil stampings.",
    solution: "We engineered a custom variable display typeface ('Lumière Sans Serif') featuring light-refracting ink traps, a minimalist monogram symbol based on internal escapement geometry, and unboxing packaging constructed from recycled black composite slate and hand-finished frosted glass sleeves.",
    outcome: "The launch collection sold out within 48 hours. The brand identity won Gold at the European Design Awards 2026 and elevated brand equity recognition by +180% across international luxury markets.",
    services: [
      "Brand Architecture",
      "Bespoke Typography",
      "Tactile Packaging Design",
      "Art Direction",
      "Digital Flagship Experience",
      "3D Product Visualization"
    ],
    metrics: [
      { label: "Launch Sold Out", value: "48 Hours" },
      { label: "Brand Equity Increase", value: "+180%" },
      { label: "Global Design Awards", value: "3 Gold Medals" }
    ],
    colors: [
      { name: "Obsidian Void", hex: "#0B0B0C", role: "Primary Background & Packaging Matte" },
      { name: "Sapphire Frost", hex: "#E2E8F0", role: "Primary Typography & Foil Stamping" },
      { name: "Platinum Refraction", hex: "#94A3B8", role: "Secondary Accents & Micro Grid Lines" },
      { name: "Champagne Silver", hex: "#CBD5E1", role: "Special Edition Highlight Accent" }
    ],
    typography: {
      primaryFont: "Lumière Serif Display",
      secondaryFont: "Space Grotesk Mono",
      description: "High-contrast editorial serif paired with precision architectural monospaced numerals.",
      specimenText: "Aa Bb Cc Dd 0123456789 — SWISS PRECISION Meets FRENCH POETICS"
    },
    gallery: [
      {
        id: "lumiere-1",
        url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1400&q=85",
        caption: "Bespoke obsidian timepiece box with laser-engraved glass insert.",
        aspectRatio: "wide"
      },
      {
        id: "lumiere-2",
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
        caption: "Editorial monograph brochure printed on 200gsm tactile cotton stock.",
        aspectRatio: "tall"
      },
      {
        id: "lumiere-3",
        url: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?auto=format&fit=crop&w=1400&q=85",
        caption: "Digital luxury flagship interface showcasing 3D micro-movement breakdown.",
        aspectRatio: "wide"
      }
    ],
    featured: true
  },
  {
    id: "nexus-spatial-os",
    number: "02",
    title: "NEXUS SPATIAL OPERATING SYSTEM",
    slug: "nexus-spatial-os",
    year: "2026",
    client: "Nexus Labs Zurich",
    category: "DIGITAL EXPERIENCE & SPATIAL UI",
    shortDescription: "A zero-latency spatial interface design system built for next-generation volumetric display devices.",
    fullDescription: "Nexus Spatial OS reimagines human-computer interaction for post-screen spatial computing. Built around principles of optical physics, fluid depth perception, and acoustic visual feedback, the visual system establishes a brand new design language for spatial operating systems.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85",
    heroImage: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2000&q=90",
    challenge: "Traditional 2D user interface guidelines fail in 3D spatial environments, causing visual fatigue and disorientation. Nexus required a spatial visual language that feels weightless, legible across infinite depth planes, and instinctively human.",
    concept: "We developed 'Volumetric Glassmorphism' — dynamic light-bending interface plates that adjust refraction indices based on room lighting and gaze tracking, ensuring maximum legibility without cluttering the physical environment.",
    solution: "A complete design framework comprising 40+ volumetric widgets, responsive spatial typography hierarchy, haptic visual feedback indicators, and a brand identity that embodies dark ambient glass and spectral light dispersion.",
    outcome: "Adopted by leading enterprise spatial hardware developers; reduced cognitive UI friction by 42% in user testing studies and set the industry standard for spatial design systems.",
    services: [
      "Spatial UI/UX Architecture",
      "Volumetric Design System",
      "Motion Design & Haptic Feedback",
      "Brand Identity & OS Design",
      "Design System Documentation"
    ],
    metrics: [
      { label: "Cognitive Load Reduction", value: "-42%" },
      { label: "Spatial Developer Adoption", value: "50,000+" },
      { label: "Design System Tokens", value: "240 Components" }
    ],
    colors: [
      { name: "Deep Space", hex: "#08080A", role: "Spatial Void Base" },
      { name: "Spectral Cyan", hex: "#38BDF8", role: "Active Spatial Anchor" },
      { name: "Bioluminescent Amber", hex: "#F59E0B", role: "Primary Interactive State" },
      { name: "Glass Frost", hex: "#F8FAFC", role: "Volumetric Surface & Text" }
    ],
    typography: {
      primaryFont: "Nexus Grotesk Spatial",
      secondaryFont: "SF Pro Mono",
      description: "Designed specifically for sub-pixel anti-aliasing in stereoscopic optical display lenses.",
      specimenText: "VOLUMETRIC UI — 3D INTERACTION ARCHITECTURE"
    },
    gallery: [
      {
        id: "nexus-1",
        url: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1400&q=85",
        caption: "Volumetric glass window system floating in real-world spatial environment.",
        aspectRatio: "wide"
      },
      {
        id: "nexus-2",
        url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1000&q=85",
        caption: "Color spectrum and optical refraction token documentation.",
        aspectRatio: "tall"
      }
    ],
    featured: true
  },
  {
    id: "aether-monograph",
    number: "03",
    title: "AETHER ARCHITECTURAL MONOGRAPH",
    slug: "aether-monograph",
    year: "2025",
    client: "Aether Press London",
    category: "ART DIRECTION & EDITORIAL PUBLISHING",
    shortDescription: "A 480-page hardcover architectural monograph exploring brutalist minimalism and light in modern Nordic spaces.",
    fullDescription: "Aether is a celebration of architectural silence. Created in collaboration with architectural photographer Henrik Lindqvist, this limited-edition publication explores 24 minimalist concrete structures across Scandinavia and Japan through ultra-fine duotone printing and radical grid typography.",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=90",
    challenge: "Capturing the tactile weight of raw concrete and subtle shadow cast in a printed book format requires extreme precision in prepress, paper selection, and typographic pacing.",
    concept: "The book structure mirrors architectural spatial sequencing. Generous white space acts as hallways, heavy typographic headers act as load-bearing beams, and silver edge-gilding simulates architectural light wells.",
    solution: "Printed on bespoke 170gsm Swedish un-coated paper with quad-tone black inks, silver foil debossing on raw dark linen cloth binding, accompanied by an acrylic glass dust jacket.",
    outcome: "Selected for the Tokyo TDC Annual Award 2025 and featured in Design Week, selling out all 1,500 numbered collector copies during pre-order.",
    services: [
      "Editorial Design & Grid Architecture",
      "Curatorial Art Direction",
      "Typography & Micro-typesetting",
      "Prepress & Custom Print Production",
      "Exhibition Catalog Design"
    ],
    metrics: [
      { label: "Edition Size", value: "1,500 Copies" },
      { label: "Pre-order Sales", value: "100% Sold Out" },
      { label: "Tokyo TDC Award", value: "Selected Work" }
    ],
    colors: [
      { name: "Concrete Slate", hex: "#1E1E20", role: "Linen Cover & Primary Dark Base" },
      { name: "Paper Bone", hex: "#F3F3EF", role: "Interior Page Uncoated Stock" },
      { name: "Silver Leaf", hex: "#D1D5DB", role: "Edge Gilding & Foil Debossing" }
    ],
    typography: {
      primaryFont: "Nordic Grotesk Light",
      secondaryFont: "Bodoni Poster Compressed",
      description: "Ultra-clean geometric sans paired with monolithic compressed serif for chapter titles.",
      specimenText: "SPACE — SILENCE — STRUCTURE — SCANDINAVIAN BRUTALISM"
    },
    gallery: [
      {
        id: "aether-1",
        url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1400&q=85",
        caption: "Hardcover linen binding with acrylic translucent dust sleeve.",
        aspectRatio: "wide"
      },
      {
        id: "aether-2",
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=85",
        caption: "Double page spread showing mathematical grid system and photography.",
        aspectRatio: "tall"
      }
    ],
    featured: true
  },
  {
    id: "chronos-kinetic-type",
    number: "04",
    title: "CHRONOS KINETIC TYPE SYSTEM",
    slug: "chronos-kinetic-type",
    year: "2025",
    client: "Kinetic Motion Lab NYC",
    category: "KINETIC TYPOGRAPHY & MOTION SYSTEM",
    shortDescription: "A real-time variable font engine and generative motion identity system for digital cultural institutions.",
    fullDescription: "Chronos explores the boundary between typography, time, and generative physics. Built as an open variable font spec, Chronos dynamically responds to audio frequencies, mouse speed, and scroll velocity, producing liquid typographic distortion in real-time.",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=85",
    heroImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2000&q=90",
    challenge: "Creating kinetic typography that remains 100% legible while undergoing continuous fluid physics deformation.",
    concept: "Variable axis parameters (Slant, Weight, Distortion, Refraction) controlled by spring physics, allowing letters to morph like mercury without losing structural stroke anchors.",
    solution: "Constructed a custom WebGL/GSAP typographic renderer capable of 120 FPS web performance, accompanied by interactive poster installations at NYC Digital Art Center.",
    outcome: "Over 200,000 interactive web sessions, featured on Awwwards Site of the Day, and licensed by major cultural festivals worldwide.",
    services: [
      "Variable Font Engineering",
      "Generative Motion Design",
      "Interactive WebGL Typography",
      "Motion System Guidelines",
      "Live Audio Visualizers"
    ],
    metrics: [
      { label: "Frame Rate", value: "120 FPS Native" },
      { label: "Interactive Sessions", value: "200,000+" },
      { label: "Awwwards Recognition", value: "Site of the Day" }
    ],
    colors: [
      { name: "Void Dark", hex: "#070709", role: "Stage Canvas" },
      { name: "Electric Mercury", hex: "#F4F4F5", role: "Kinetic Glyphs" },
      { name: "Laser Violet", hex: "#8B5CF6", role: "Frequency Modulation Glow" }
    ],
    typography: {
      primaryFont: "Chronos Variable Dynamic",
      secondaryFont: "Space Mono",
      description: "Custom variable font with 4 interactive axes: Weight, Width, Fluidity, and Refraction.",
      specimenText: "TYPOGRAPHY IN MOTION — GENERATIVE TIME AXIS"
    },
    gallery: [
      {
        id: "chronos-1",
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1400&q=85",
        caption: "Interactive typographic wall installation reacting to audience movement.",
        aspectRatio: "wide"
      }
    ],
    featured: true
  },
  {
    id: "solaris-architectural-identity",
    number: "05",
    title: "SOLARIS ARCHITECTURAL IDENTITY",
    slug: "solaris-architectural-identity",
    year: "2025",
    client: "Solaris Group Berlin",
    category: "BRAND IDENTITY & WAYFINDING",
    shortDescription: "A monolithic visual identity, environmental graphics, and wayfinding design system for a zero-carbon innovation campus.",
    fullDescription: "Solaris is a 40,000 sq meter sustainable research campus in Berlin. We designed an identity system rooted in solar tracking geometry, utilizing shadow play, brass inlay floor markers, and glass signage etched with microscopic solar grids.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=90",
    challenge: "Designing a wayfinding and identity system that adapts to seasonal daylight changes without needing electricity or digital displays.",
    concept: "Using sun angles to project typographic direction markers onto floors and walls at specific times of day using precision-cut architectural glass prisms.",
    solution: "Created an all-weather architectural signage suite made of recycled bronze, tempered low-iron glass, and eco-friendly mineral pigments.",
    outcome: "Awarded German Design Award 2025 for Wayfinding Excellence and reduced Campus navigation confusion by 90%.",
    services: [
      "Environmental Graphic Design",
      "Architectural Wayfinding",
      "Brand System Architecture",
      "Signage Materials Engineering",
      "Brand Guidelines Monograph"
    ],
    metrics: [
      { label: "Campus Area", value: "40,000 m²" },
      { label: "Wayfinding Efficiency", value: "+90%" },
      { label: "German Design Award", value: "Winner 2025" }
    ],
    colors: [
      { name: "Solar Bronze", hex: "#9A3412", role: "Primary Architectural Accent" },
      { name: "Dark Titan Slate", hex: "#111827", role: "Signage Structure Base" },
      { name: "Low-Iron Glass", hex: "#F1F5F9", role: "Transparent Monolith Panel" }
    ],
    typography: {
      primaryFont: "Solaris Wayfinding Mono",
      secondaryFont: "Inter Tight Bold",
      description: "Engineered for maximum legibility at distances up to 50 meters under varying sunlight.",
      specimenText: "SOLARIS CAMPUS BERLIN — WAYFINDING SYSTEM 2025"
    },
    gallery: [
      {
        id: "solaris-1",
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=85",
        caption: "Brass inlay directional floor markers cast into polished terrazzo.",
        aspectRatio: "wide"
      }
    ],
    featured: true
  }
];
