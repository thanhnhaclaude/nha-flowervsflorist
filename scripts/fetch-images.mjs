/**
 * Downloads the royalty-free Unsplash photos listed in image-manifest.mjs into /public/images
 * (cropped + WebP via the Unsplash image CDN). Already-downloaded files are skipped.
 *
 *   npm run fetch-images            # download missing files
 *   npm run fetch-images -- --force # re-download everything
 */
import fs from "node:fs";
import path from "node:path";
import { IMAGES, SIZES } from "./image-manifest.mjs";

const OUT = path.join(process.cwd(), "public", "images");
const FORCE = process.argv.includes("--force");

async function download([key, [id, kind]]) {
  const file = path.join(OUT, `${key}.webp`);
  if (!FORCE && fs.existsSync(file)) return "skip";
  const [w, h] = SIZES[kind];
  const url = `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=entropy&fm=webp&q=78`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return "ok";
}

const entries = Object.entries(IMAGES);
let ok = 0, skip = 0, failed = 0;
for (let i = 0; i < entries.length; i += 6) {
  const results = await Promise.allSettled(entries.slice(i, i + 6).map(download));
  for (const r of results) {
    if (r.status === "rejected") {
      failed++;
      console.error("  ✗", r.reason.message);
    } else if (r.value === "ok") ok++;
    else skip++;
  }
}
console.log(`Images: ${ok} downloaded, ${skip} already present, ${failed} failed`);
if (failed) process.exit(1);
