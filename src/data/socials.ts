export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  handle: string;
  enabled: boolean;
  order: number;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "instagram",
    platform: "Instagram",
    url: "https://instagram.com",
    handle: "@suresh.visuals",
    enabled: true,
    order: 1,
  },
  {
    id: "youtube",
    platform: "YouTube",
    url: "https://youtube.com",
    handle: "SureshEdits",
    enabled: true,
    order: 2,
  },
  {
    id: "behance",
    platform: "Behance",
    url: "https://behance.net",
    handle: "sureshdesign",
    enabled: true,
    order: 3,
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    url: "https://linkedin.com",
    handle: "suresh-creative",
    enabled: true,
    order: 4,
  },
  {
    id: "github",
    platform: "GitHub",
    url: "https://github.com",
    handle: "suresh-editor",
    enabled: false,
    order: 5,
  },
  {
    id: "email",
    platform: "Email",
    url: "mailto:sureshtriple7709@gmail.com",
    handle: "sureshtriple7709@gmail.com",
    enabled: true,
    order: 6,
  },
];
