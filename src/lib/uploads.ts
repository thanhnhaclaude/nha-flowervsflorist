import "server-only";
import path from "node:path";
import os from "node:os";
import { env } from "@/lib/env";

/**
 * Uploaded images live OUTSIDE the app folder so redeploys don't delete them.
 * Default: ~/flowervsflorist-uploads (on Hostinger: /home/<user>/flowervsflorist-uploads). Override with UPLOAD_DIR.
 * Files are served by /media/[...path].
 */
export function uploadDir() {
  const fromEnv = env("UPLOAD_DIR");
  if (fromEnv) return path.resolve(fromEnv);
  return path.join(os.homedir(), "flowervsflorist-uploads");
}

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export const MIME_BY_EXT: Record<string, string> = Object.fromEntries(Object.entries(IMAGE_TYPES).map(([m, e]) => [e, m]));
