import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { getAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { IMAGE_TYPES, uploadDir } from "@/lib/uploads";

const MAX = 8 * 1024 * 1024;

/** Admin image upload -> { url: "/media/2026/10/name-abc123.webp" } */
export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "No file received." }, { status: 400 });
  const ext = IMAGE_TYPES[file.type];
  if (!ext) return NextResponse.json({ message: "Use a JPG, PNG, WebP, AVIF or GIF image." }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ message: "Images must be 8 MB or smaller." }, { status: 413 });

  const now = new Date();
  const sub = path.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "image";
  const name = `${base}-${randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(uploadDir(), sub);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/media/${sub.split(path.sep).join("/")}/${name}` }, { status: 201 });
}
