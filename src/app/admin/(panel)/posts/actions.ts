"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { invalidate } from "@/lib/memo";
import { and, eq, ne } from "drizzle-orm";
import { db, posts } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

export type PostFormState = { errors?: Record<string, string>; message?: string } | undefined;

export async function savePost(_: PostFormState, fd: FormData): Promise<PostFormState> {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const title = String(fd.get("title") ?? "").trim();
  const slug = slugify(String(fd.get("slug") || title));
  const content = String(fd.get("content") ?? "").trim();
  const errors: Record<string, string> = {};
  if (title.length < 5) errors.title = "Enter a title";
  if (content.length < 50) errors.content = "Write at least a few sentences";
  const [dupe] = await db.select({ id: posts.id }).from(posts).where(id ? and(eq(posts.slug, slug), ne(posts.id, id)) : eq(posts.slug, slug)).limit(1);
  if (dupe) errors.slug = "Another post already uses this slug";
  if (Object.keys(errors).length) return { errors, message: "Please fix the highlighted fields." };
  const date = String(fd.get("publishedAt") ?? "");
  const data = {
    title,
    slug,
    content,
    excerpt: String(fd.get("excerpt") ?? "").trim().slice(0, 400),
    cover: String(fd.get("cover") ?? "").trim() || null,
    category: String(fd.get("category") ?? "Flower Guides").trim().slice(0, 60) || "Flower Guides",
    status: (fd.get("status") === "draft" ? "draft" : "published") as "draft" | "published",
    seoTitle: String(fd.get("seoTitle") ?? "").trim().slice(0, 200) || null,
    seoDescription: String(fd.get("seoDescription") ?? "").trim().slice(0, 300) || null,
    publishedAt: /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T14:00:00Z`) : new Date(),
  };
  let postId = id;
  if (id) await db.update(posts).set(data).where(eq(posts.id, id));
  else postId = (await db.insert(posts).values(data))[0].insertId;
  invalidate("catalog:");
  revalidatePath("/blog", "layout");
  redirect(`/admin/posts/${postId}?saved=1`);
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  if (id) await db.delete(posts).where(eq(posts.id, id));
  invalidate("catalog:");
  revalidatePath("/blog", "layout");
  redirect("/admin/posts");
}
