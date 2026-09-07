import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { getAdminSession } from "@/lib/auth";
import { scanMediaUsage } from "@/lib/db";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  ensureUploadsDir();

  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const usageMap = scanMediaUsage();

    // Separate thumbnails from primary media files
    const primaryFiles = files.filter(
      (file) => !file.startsWith(".") && !file.includes("-thumb.webp")
    );

    const mediaList = primaryFiles
      .map((file) => {
        const filePath = path.join(UPLOADS_DIR, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        const isVideo = [".mp4", ".webm", ".mov", ".mkv"].includes(ext);

        const fileBase = file.replace(ext, "");
        const thumbFilename = `${fileBase}-thumb.webp`;
        const hasThumb = fs.existsSync(path.join(UPLOADS_DIR, thumbFilename));

        const publicUrl = `/uploads/${file}`;
        const usages = usageMap[publicUrl] || usageMap[file] || [];

        return {
          filename: file,
          url: publicUrl,
          thumbnailUrl: hasThumb ? `/uploads/${thumbFilename}` : isVideo ? null : publicUrl,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          type: isVideo ? "video" : "image",
          usedBy: usages,
          inUse: usages.length > 0,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ media: mediaList });
  } catch (err: any) {
    console.error("Failed to list media files:", err);
    return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  ensureUploadsDir();

  try {
    const formData = await req.formData();

    // Check for multiple files or single file
    let filesToProcess: File[] = [];
    const filesAll = formData.getAll("files") as File[];
    if (filesAll && filesAll.length > 0 && filesAll[0].size > 0) {
      filesToProcess = filesAll;
    } else {
      const singleFile = formData.get("file") as File | null;
      if (singleFile && singleFile.size > 0) {
        filesToProcess = [singleFile];
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedMimeTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
      // Videos
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    const maxImageBytes = 50 * 1024 * 1024; // 50MB
    const maxVideoBytes = 150 * 1024 * 1024; // 150MB

    const results = [];

    for (const file of filesToProcess) {
      const mimeType = file.type || "application/octet-stream";

      // Fallback check extension if mimeType is generic
      const extFromName = path.extname(file.name).toLowerCase();
      const isExtAllowed = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".svg",
        ".avif",
        ".mp4",
        ".webm",
        ".mov",
      ].includes(extFromName);

      if (!allowedMimeTypes.includes(mimeType) && !isExtAllowed) {
        return NextResponse.json(
          {
            error: `Unsupported file type for "${file.name}". Supported: JPG, PNG, WebP, AVIF, GIF, SVG, MP4, WebM, MOV.`,
          },
          { status: 400 }
        );
      }

      const isVideo = mimeType.startsWith("video/") || [".mp4", ".webm", ".mov"].includes(extFromName);
      const maxSize = isVideo ? maxVideoBytes : maxImageBytes;

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: `File "${file.name}" exceeds maximum allowed size (${isVideo ? "150MB" : "50MB"}).`,
          },
          { status: 400 }
        );
      }

      const rawBuffer = Buffer.from(await file.arrayBuffer());
      const originalCleanName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
      const baseTimestamp = Date.now() + Math.floor(Math.random() * 1000);
      const filename = `${baseTimestamp}-${originalCleanName}`;
      const destinationPath = path.join(UPLOADS_DIR, filename);

      let finalWidth: number | undefined;
      let finalHeight: number | undefined;
      let hasThumbnail = false;
      const fileBase = filename.replace(path.extname(filename), "");
      const thumbFilename = `${fileBase}-thumb.webp`;
      const thumbDestinationPath = path.join(UPLOADS_DIR, thumbFilename);

      if (!isVideo && !mimeType.includes("svg")) {
        try {
          const image = sharp(rawBuffer);
          const meta = await image.metadata();
          finalWidth = meta.width;
          finalHeight = meta.height;

          // If image is huge (> 2560px), resize down while retaining quality
          if (meta.width && meta.width > 2560) {
            await image
              .resize({ width: 2560, withoutEnlargement: true })
              .toFile(destinationPath);
          } else {
            fs.writeFileSync(destinationPath, rawBuffer);
          }

          // Generate fast thumbnail for Admin UI
          await sharp(rawBuffer)
            .resize({ width: 480, height: 360, fit: "cover", position: "centre" })
            .webp({ quality: 80 })
            .toFile(thumbDestinationPath);
          hasThumbnail = true;
        } catch (sharpErr) {
          console.warn("Sharp optimization warning, saving raw buffer:", sharpErr);
          fs.writeFileSync(destinationPath, rawBuffer);
        }
      } else {
        // Video or SVG: write directly
        fs.writeFileSync(destinationPath, rawBuffer);
      }

      const fileUrl = `/uploads/${filename}`;
      const stats = fs.statSync(destinationPath);

      results.push({
        filename,
        url: fileUrl,
        thumbnailUrl: hasThumbnail ? `/uploads/${thumbFilename}` : isVideo ? null : fileUrl,
        size: stats.size,
        type: isVideo ? "video" : "image",
        width: finalWidth,
        height: finalHeight,
        createdAt: stats.birthtime.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      media: results.length === 1 ? results[0] : results,
      all: results,
    });
  } catch (err: any) {
    console.error("Media upload error:", err);
    return NextResponse.json({ error: "Failed to upload file: " + (err.message || "") }, { status: 500 });
  }
}
