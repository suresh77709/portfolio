import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { INITIAL_PORTFOLIO_DATA } from "@/data/portfolio";
import { getTypographySettings } from "@/lib/db";
import { TypographyStyles } from "@/components/layout/TypographyStyles";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://suresh-portfolio.vercel.app"),
  title: `${INITIAL_PORTFOLIO_DATA.personal.name} — ${INITIAL_PORTFOLIO_DATA.personal.title}`,
  description: `${INITIAL_PORTFOLIO_DATA.personal.tagline} Graphic Design, Photoshop, Instagram Reels, FiveM / GTA V Cinematics, Commercial Ads, and Wedding Video Editing.`,
  keywords: [
    "Suresh",
    "Graphic Designer",
    "Video Editor",
    "Photoshop Designer",
    "Instagram Reels Editor",
    "FiveM Promos",
    "GTA V Trailers",
    "Wedding Video Editing",
    "Commercial Ads",
    "Branding"
  ],
  authors: [{ name: INITIAL_PORTFOLIO_DATA.personal.name }],
  openGraph: {
    title: `${INITIAL_PORTFOLIO_DATA.personal.name} — ${INITIAL_PORTFOLIO_DATA.personal.title}`,
    description: INITIAL_PORTFOLIO_DATA.personal.tagline,
    type: "website",
    locale: "en_US",
    siteName: `${INITIAL_PORTFOLIO_DATA.personal.name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${INITIAL_PORTFOLIO_DATA.personal.name} — ${INITIAL_PORTFOLIO_DATA.personal.title}`,
    description: INITIAL_PORTFOLIO_DATA.personal.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const typography = getTypographySettings();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <TypographyStyles settings={typography} />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#0B0B0C] text-[#F5F5F2] antialiased selection:bg-white/20 selection:text-white font-sans"
      >
        <ScrollProgress />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

