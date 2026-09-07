import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  getDatabase,
  updatePortfolioData,
  updateHeroSettings,
  updateSiteSettings,
  updateTypographySettings,
  updateSocialLinks,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const db = getDatabase();
  return NextResponse.json({
    portfolio: db.portfolio,
    hero: db.hero,
    siteSettings: db.siteSettings,
    typography: db.typography,
    socialLinks: db.socialLinks,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.portfolio) {
      updatePortfolioData(body.portfolio);
    }
    if (body.hero) {
      updateHeroSettings(body.hero);
    }
    if (body.siteSettings) {
      updateSiteSettings(body.siteSettings);
    }
    if (body.typography) {
      updateTypographySettings(body.typography);
    }
    if (body.socialLinks) {
      updateSocialLinks(body.socialLinks);
    }

    const updatedDb = getDatabase();
    return NextResponse.json({
      success: true,
      portfolio: updatedDb.portfolio,
      hero: updatedDb.hero,
      siteSettings: updatedDb.siteSettings,
      typography: updatedDb.typography,
      socialLinks: updatedDb.socialLinks,
    });
  } catch (err: any) {
    console.error("Failed to update portfolio data:", err);
    return NextResponse.json(
      { error: "Failed to update portfolio data" },
      { status: 500 }
    );
  }
}
