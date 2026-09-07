import { getDatabase } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default function AdminPage() {
  const db = getDatabase();

  return (
    <AdminDashboardClient
      initialPortfolio={db.portfolio}
      initialHero={db.hero}
      initialSiteSettings={db.siteSettings}
      initialTypography={db.typography}
      initialSocialLinks={db.socialLinks}
      username="admin"
    />
  );
}
