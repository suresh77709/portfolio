import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const COOKIE_NAME = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "default_super_secret_session_key_2026";

export interface SessionPayload {
  username: string;
  role: "ADMIN";
  exp: number; // Unix timestamp in seconds
}

/**
 * Generates a random salt
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Hashes a password using PBKDF2 with salt
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

/**
 * Verifies a password against hash and salt
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computedHash = hashPassword(password, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

/**
 * Creates an HMAC signed session token string
 */
export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    username,
    role: "ADMIN",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days validity
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies an HMAC signed session token
 */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  // Constant-time signature verification
  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isSignatureValid) return null;
  } catch {
    return null;
  }

  try {
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (payload.role !== "ADMIN") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to verify admin session from NextRequest or cookies()
 */
export async function getAdminSession(req?: NextRequest): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  return verifySessionToken(token);
}
