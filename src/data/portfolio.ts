export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectColor {
  name: string;
  hex: string;
  role: string;
}

export interface ProjectTypography {
  primaryFont?: string;
  secondaryFont?: string;
  description?: string;
  specimenText?: string;
}

export interface ProjectGalleryItem {
  id: string;
  url: string;
  caption: string;
  type?: "image" | "video";
  videoUrl?: string;
  aspectRatio?: "wide" | "tall" | "square";
}

export interface Project {
  id: string;
  number: string;
  title: string;
  slug: string;
  year: string;
  client: string;
  category: string; // Display Category
  categoryKey: "graphic-design" | "reels" | "gtav-fivem" | "clients" | "wedding";
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  videoUrl?: string;
  heroImage?: string;
  challenge?: string;
  concept?: string;
  solution?: string;
  outcome?: string;
  typography?: ProjectTypography;
  colors?: ProjectColor[];
  services: string[];
  metrics?: ProjectMetric[];
  gallery?: ProjectGalleryItem[];
  featured: boolean;
  tags: string[];
}

export interface SkillCategory {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  previewImage: string;
  tags: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    profession: string;
    tagline: string;
    editorialStatement: string;
    bio: string[];
    philosophy: string[];
    location: string;
    availability: string;
    email: string;
    phone: string;
    socials: SocialLink[];
  };
  categories: { key: string; label: string }[];
  projects: Project[];
  skills: SkillCategory[];
  tools: string[];
  services: string[];
  clients: string[];
}

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  personal: {
    name: "SURESH",
    title: "Graphic Designer & Video Editor",
    profession: "Graphic Designer & Video Editor",
    tagline: "Crafting high-impact visual design, cinematic video edits, and immersive gaming promos.",
    editorialStatement: "I CREATE CINEMATIC VISUAL CONTENT THAT DRIVES ENGAGEMENT & TELLS MEMORABLE STORIES.",
    bio: [
      "I am Suresh, a passionate Graphic Designer and Video Editor specializing in high-end Photoshop design, social media creatives, cinematic video editing, FiveM / GTA V trailers, and commercial client promos.",
      "Whether it's designing eye-catching posters for brands, editing fast-paced Instagram Reels, assembling cinematic wedding highlights, or producing high-octane GTA V server promos, I bring a refined creative vision to every project.",
      "I work with individual creators, esports gaming servers, businesses, and event organizers globally to turn ideas into striking visuals."
    ],
    philosophy: [
      "Visual hierarchy and color grading turn good content into unforgettable experiences.",
      "Pacing is everything — every video cut and graphic element must serve the narrative.",
      "High quality without bloat: clean aesthetics, sharp details, and engaging motion."
    ],
    location: "India / Remote Worldwide",
    availability: "OPEN FOR NEW CLIENT PROJECTS & COMMISSIONS",
    email: "sureshtriple7709@gmail.com",
    phone: "+91 98765 43210",
    socials: [
      { platform: "Email", url: "mailto:sureshtriple7709@gmail.com", handle: "sureshtriple7709@gmail.com" },
      { platform: "Instagram", url: "https://instagram.com", handle: "@suresh.visuals" },
      { platform: "YouTube", url: "https://youtube.com", handle: "SureshEdits" },
      { platform: "Behance", url: "https://behance.net", handle: "sureshdesign" }
    ]
  },

  categories: [
    { key: "all", label: "All Works" },
    { key: "graphic-design", label: "Graphic Design" },
    { key: "reels", label: "Reels / Video" },
    { key: "gtav-fivem", label: "GTA V / FiveM" },
    { key: "clients", label: "Client Projects" },
    { key: "wedding", label: "Wedding" }
  ],

  projects: [
    {
      id: "fivem-server-promo-trailer",
      number: "01",
      title: "LOS SANTOS ROLEPLAY SERVER TRAILER",
      slug: "fivem-server-promo-trailer",
      year: "2026",
      client: "Vortex RP FiveM Server",
      category: "GTA V / FiveM",
      categoryKey: "gtav-fivem",
      shortDescription: "Action-packed cinematic trailer and promotional graphics package for a top-tier FiveM roleplay server.",
      fullDescription: "Produced a high-octane cinematic trailer for Vortex RP using custom Rockstar Editor camera tracks, custom shaders, and synchronized sound design. Accompanied by server launch posters, logo redesign, and social media announcements.",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      services: ["GTA V Cinematics", "Sound Design", "Video Editing", "Gaming Graphics", "Social Promos"],
      metrics: [
        { label: "Trailer Views", value: "250K+" },
        { label: "Server Players Joined", value: "5,000+" },
        { label: "Player Retention", value: "+85%" }
      ],
      featured: true,
      tags: ["FiveM", "GTA V", "Cinematic Edit", "Trailer", "Rockstar Editor"]
    },
    {
      id: "instagram-reels-brand-campaign",
      number: "02",
      title: "URBAN STREETWEAR REELS CAMPAIGN",
      slug: "instagram-reels-brand-campaign",
      year: "2026",
      client: "Aura Apparel",
      category: "Reels / Video",
      categoryKey: "reels",
      shortDescription: "Fast-paced short-form video editing with custom motion graphics and color grading for streetwear brand reels.",
      fullDescription: "Created a series of 15-second high-energy Instagram Reels designed for viral reach. Used speed ramps, glitch transitions, beat syncs, and custom kinetic typography to showcase the new summer drop.",
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      services: ["Short-form Editing", "Instagram Reels", "Kinetic Motion", "Color Grading"],
      metrics: [
        { label: "Total Reels Reach", value: "1.2M+" },
        { label: "Engagement Rate", value: "14.2%" }
      ],
      featured: true,
      tags: ["Reels", "Short-Form", "Motion Design", "Beat Sync"]
    },
    {
      id: "photoshop-branding-poster-series",
      number: "03",
      title: "NEON CYBERPUNK POSTER ART",
      slug: "photoshop-branding-poster-series",
      year: "2025",
      client: "CyberNight Event Series",
      category: "Graphic Design",
      categoryKey: "graphic-design",
      shortDescription: "Hyper-detailed Photoshop manipulation and neon lighting compositing for a gaming music festival.",
      fullDescription: "Designed key visual art posters, social banners, and ticket artwork using advanced Photoshop photo manipulation, digital painting highlights, custom typography, and print-ready color separation.",
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      services: ["Photoshop Manipulation", "Posters", "Branding", "Social Media Creatives"],
      metrics: [
        { label: "Tickets Sold Out", value: "100%" },
        { label: "Posters Printed", value: "2,000 Copies" }
      ],
      featured: true,
      tags: ["Photoshop", "Poster Design", "Social Creatives", "Cyberpunk"]
    },
    {
      id: "royal-wedding-cinematic-highlight",
      number: "04",
      title: "ROYAL WEDDING CINEMATIC EDITS",
      slug: "royal-wedding-cinematic-highlight",
      year: "2025",
      client: "Private Client",
      category: "Wedding",
      categoryKey: "wedding",
      shortDescription: "Cinematic wedding highlights film, emotional teasers, and elegant social media wedding reels.",
      fullDescription: "Crafted a 4K wedding highlight video featuring filmic color grading, acoustic audio mixing, slow-motion drone shots, and intimate portrait pacing. Delivered full ceremony edit alongside 60-second teaser reels.",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      services: ["Wedding Editing", "Cinematic Color Grading", "Wedding Reels", "Storytelling"],
      metrics: [
        { label: "Deliverables", value: "4K Highlight + 5 Reels" },
        { label: "Turnaround Time", value: "7 Days" }
      ],
      featured: true,
      tags: ["Wedding Video", "Cinematic Edit", "Wedding Reels", "4K Video"]
    },
    {
      id: "business-advertisement-commercial",
      number: "05",
      title: "CAFE BRANDING & SOCIAL MEDIA ADS",
      slug: "business-advertisement-commercial",
      year: "2025",
      client: "Roast & Co. Artisanal Coffee",
      category: "Client Projects",
      categoryKey: "clients",
      shortDescription: "Complete marketing creative package including promotional videos, menu designs, and Meta video ads.",
      fullDescription: "Developed a cohesive advertising suite for Roast & Co.'s store launch. Combined moody food photography editing, Instagram video ad campaigns, promotional banners, and printable menu cards.",
      coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
      services: ["Commercial Ads", "Social Media Creatives", "Promotional Videos", "Marketing Banners"],
      metrics: [
        { label: "ROAS Increase", value: "3.4x" },
        { label: "Foot Traffic Growth", value: "+140%" }
      ],
      featured: true,
      tags: ["Client Project", "Video Ads", "Branding", "Marketing"]
    },
    {
      id: "gtav-fivem-esports-graphics",
      number: "06",
      title: "FIVEM DRAG RACING SERVER PROMO",
      slug: "gtav-fivem-esports-graphics",
      year: "2025",
      client: "Nitro Velocity RP",
      category: "GTA V / FiveM",
      categoryKey: "gtav-fivem",
      shortDescription: "High-octane car showcase trailer, livery graphics, and FiveM server branding graphics.",
      fullDescription: "Created custom vehicle cinematic edits using reshade presets in GTA V alongside high-impact graphic design overlays for server car meets and tournament announcements.",
      coverImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
      services: ["FiveM Promos", "GTA V Cinematics", "Vehicle Showcase", "Graphics"],
      featured: false,
      tags: ["FiveM", "GTA V", "Car Edit", "Cinematic"]
    }
  ],

  skills: [
    {
      number: "01",
      title: "GRAPHIC DESIGN",
      subtitle: "Photoshop Compositing & Social Creatives",
      description: "Crafting eye-catching posters, social media banners, branding kits, and promotional graphics with sharp detail.",
      previewImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      tags: ["Photoshop", "Posters", "Social Media", "Branding"]
    },
    {
      number: "02",
      title: "VIDEO EDITING",
      subtitle: "Cinematic Edits & Commercial Videos",
      description: "Editing high-impact videos with sound design, seamless transitions, visual effects, and professional color grading.",
      previewImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
      tags: ["Premiere Pro", "After Effects", "Color Grading", "FX"]
    },
    {
      number: "03",
      title: "INSTAGRAM REELS & SHORTS",
      subtitle: "Viral Short-Form Content",
      description: "Pacing short-form video content with kinetic typography, beat synchronization, and trendy aesthetic hooks.",
      previewImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      tags: ["Reels", "Shorts", "Kinetic Text", "Beat Sync"]
    },
    {
      number: "04",
      title: "GTA V / FIVEM PROMOS",
      subtitle: "RP Trailers & Gaming Graphics",
      description: "Producing cinematic server trailers, RP storyline intros, esports banners, and FiveM promotional videos.",
      previewImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
      tags: ["FiveM", "GTA V", "Rockstar Editor", "Trailers"]
    },
    {
      number: "05",
      title: "CLIENT & AD CAMPAIGNS",
      subtitle: "Marketing & Promotional Ads",
      description: "Delivering result-focused advertisement videos, product promos, Meta video ads, and business marketing graphics.",
      previewImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      tags: ["Commercials", "Meta Ads", "Promos", "Creatives"]
    },
    {
      number: "06",
      title: "WEDDING EDITING",
      subtitle: "Cinematic Highlights & Reels",
      description: "Transforming wedding footage into emotional story films, cinematic highlights, and aesthetic wedding reels.",
      previewImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      tags: ["Wedding Highlights", "Color Grade", "Teasers", "Storytelling"]
    }
  ],

  tools: [
    "Adobe Photoshop",
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "DaVinci Resolve",
    "Rockstar Editor / FiveM Tools",
    "Lightroom Classic",
    "Figma"
  ],

  services: [
    "Graphic Design & Photoshop Art",
    "Social Media Banner & Poster Design",
    "Cinematic Video Editing",
    "Instagram Reels & YouTube Shorts",
    "FiveM Server Trailers & GTA V Edits",
    "Wedding Highlights & Reels",
    "Commercial Video Advertisements",
    "Brand Identity & Creative Graphics"
  ],

  clients: [
    "Vortex FiveM RP",
    "Aura Streetwear",
    "CyberNight Events",
    "Roast & Co. Coffee",
    "Nitro Gaming Hub",
    "Private Wedding Clients"
  ]
};
