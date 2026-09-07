import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({
      portfolio: db.portfolio,
      hero: db.hero,
      siteSettings: db.siteSettings,
    });
  } catch (err: any) {
    console.error("Public Portfolio API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
