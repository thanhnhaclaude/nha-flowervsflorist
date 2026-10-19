import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, posts } from "@/lib/db";
import { AdminHeader } from "../../ui";
import { PostForm } from "../post-form";
import { deletePost } from "../actions";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [post] = await db.select().from(posts).where(eq(posts.id, Number((await params).id))).limit(1);
  if (!post) notFound();
  const { saved } = await searchParams;
  return (
    <>
      <Link href="/admin/posts" className="mb-3 inline-block text-sm font-bold text-plum-600 hover:underline">
        ← All posts
      </Link>
      <AdminHeader title={post.title}>
        <Link href={`/blog/${post.slug}`} target="_blank" className="btn btn-sm border-2 border-line bg-white">
          View
        </Link>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button className="btn btn-sm border-2 border-rose-200 bg-white text-rose-700">Delete</button>
        </form>
      </AdminHeader>
      {saved && <p className="mb-4 rounded-xl bg-leaf-soft p-3 text-sm font-bold text-leaf">Saved.</p>}
      <PostForm post={post} />
    </>
  );
}
