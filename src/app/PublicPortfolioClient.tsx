"use client";

import { useLenis } from "@/hooks/useLenis";
import { PortfolioData } from "@/data/portfolio";
import { SocialLinkItem } from "@/data/socials";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Skills } from "@/components/sections/Skills";
import { Experiments } from "@/components/sections/Experiments";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

import { HeroSettings } from "@/types/settings";

interface PublicPortfolioClientProps {
  initialData: PortfolioData;
  socialLinks?: SocialLinkItem[];
  heroSettings?: HeroSettings;
}

export function PublicPortfolioClient({ initialData, socialLinks, heroSettings }: PublicPortfolioClientProps) {
  useLenis();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F2] relative">
        <Navbar data={initialData.personal} />

        <main className="relative z-10">
          <Hero data={initialData.personal} heroSettings={heroSettings} />
          <Intro data={initialData.personal} />
          <SelectedWork
            projects={initialData.projects}
            categories={initialData.categories}
          />
          <Skills skills={initialData.skills} />
          <Experiments />
          <About data={initialData} />
          <Contact data={initialData.personal} />
        </main>

        <Footer data={initialData.personal} socialLinks={socialLinks} />
      </div>
    </PageTransition>
  );
}
