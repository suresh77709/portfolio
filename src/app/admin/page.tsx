import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const db = getDatabase();

  return (
    <AdminDashboardClient
      initialPortfolio={db.portfolio}
      initialHero={db.hero}
      initialSiteSettings={db.siteSettings}
      initialTypography={db.typography}
      initialSocialLinks={db.socialLinks}
      username={session.username}
    />
  );
}
