export interface Experiment {
  id: string;
  title: string;
  year: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
}

export const EXPERIMENTS_DATA: Experiment[] = [
  {
    id: "exp-01",
    title: "NEON GLOW COMPOSITING",
    year: "2026",
    category: "PHOTOSHOP LAB",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85",
    description: "Digital photo manipulation study exploring cyberpunk rim lighting and atmospheric fog effects.",
    tags: ["Photoshop", "Compositing", "Lighting"]
  },
  {
    id: "exp-02",
    title: "GTA V CINEMATIC SHADER TEST",
    year: "2026",
    category: "FIVE M & GAMING",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85",
    description: "Custom Reshade and camera path trajectory experiments for FiveM server roleplay trailers.",
    tags: ["FiveM", "GTA V", "Camera Tracks"]
  },
  {
    id: "exp-03",
    title: "VINTAGE FILM COLOR GRADE",
    year: "2025",
    category: "COLOR GRADING",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=85",
    description: "35mm grain and halation emulation LUT creation for wedding highlights and music videos.",
    tags: ["Color Grade", "DaVinci", "35mm LUT"]
  },
  {
    id: "exp-04",
    title: "KINETIC REELS TYPOGRAPHY",
    year: "2025",
    category: "SHORT-FORM MOTION",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=85",
    description: "Synchronizing rapid-fire kinetic typography with 140 BPM beat drops for viral Instagram Reels.",
    tags: ["Kinetic Text", "After Effects", "Beat Sync"]
  },
  {
    id: "exp-05",
    title: "MINIMALIST ESSENTIAL POSTERS",
    year: "2025",
    category: "GRAPHIC DESIGN",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85",
    description: "Swiss grid typography applied to commercial coffee and lifestyle brand advertisements.",
    tags: ["Poster", "Swiss Grid", "Branding"]
  },
  {
    id: "exp-06",
    title: "WEDDING TEASER STORYBOARD",
    year: "2025",
    category: "FILM PACING",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    description: "Audio-visual pacing breakdown for 60-second wedding teaser reels.",
    tags: ["Wedding", "Storytelling", "Teaser"]
  }
];
