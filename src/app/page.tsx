import { getPortfolioData, getSocialLinks, getHeroSettings } from "@/lib/db";
import { PublicPortfolioClient } from "./PublicPortfolioClient";


export default function HomePage() {
  const data = getPortfolioData();
  const socialLinks = getSocialLinks();
  const heroSettings = getHeroSettings();

  return (
    <PublicPortfolioClient
      initialData={data}
      socialLinks={socialLinks}
      heroSettings={heroSettings}
    />
  );
}

