import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession } from "@/lib/auth";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const session = await getAdminSession(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await context.params;
  // Prevent directory traversal attacks
  const safeFilename = path.basename(filename);
  const targetPath = path.join(UPLOADS_DIR, safeFilename);

  if (!fs.existsSync(targetPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    fs.unlinkSync(targetPath);

    // Also remove thumbnail if present
    const ext = path.extname(safeFilename);
    const fileBase = safeFilename.replace(ext, "");
    const thumbPath = path.join(UPLOADS_DIR, `${fileBase}-thumb.webp`);
    if (fs.existsSync(thumbPath)) {
      try {
        fs.unlinkSync(thumbPath);
      } catch (thumbErr) {
        console.warn("Failed to delete thumbnail:", thumbErr);
      }
    }

    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (err: any) {
    console.error("Failed to delete media file:", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

