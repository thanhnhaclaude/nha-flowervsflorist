"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { savePost } from "./actions";
import type { Post } from "@/lib/db/schema";

export function PostForm({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, undefined);
  const e = state?.errors ?? {};
  const date = post ? new Date(post.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card md:p-6">
        {state?.message && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{state.message}</p>}
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" name="title" defaultValue={post?.title} className="field" aria-invalid={Boolean(e.title) || undefined} />
          {e.title && <p className="error-text">{e.title}</p>}
        </div>
        <div>
          <label className="label" htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} maxLength={400} defaultValue={post?.excerpt} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="content">Content (Markdown)</label>
          <textarea id="content" name="content" rows={22} defaultValue={post?.content} className="field font-mono text-sm" aria-invalid={Boolean(e.content) || undefined} />
          <p className="mt-1 text-xs text-muted">Use ## for headings, - for bullet lists, **bold**, *italic* and [link text](/roses).</p>
          {e.content && <p className="error-text">{e.content}</p>}
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card">
          <div>
            <label className="label" htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" defaultValue={post?.slug} className="field" placeholder="auto from title" aria-invalid={Boolean(e.slug) || undefined} />
            {e.slug && <p className="error-text">{e.slug}</p>}
          </div>
          <div>
            <label className="label" htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={post?.status ?? "published"} className="field">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="publishedAt">Publish date</label>
            <input id="publishedAt" name="publishedAt" type="date" defaultValue={date} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="category">Category</label>
            <input id="category" name="category" defaultValue={post?.category ?? "Flower Guides"} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="cover">Cover image</label>
            <input id="cover" name="cover" defaultValue={post?.cover ?? ""} className="field font-mono text-xs" placeholder="blog/flower-care or /media/…" />
          </div>
        </div>
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card">
          <p className="text-sm font-extrabold uppercase tracking-wider text-plum-700">SEO</p>
          <div>
            <label className="label" htmlFor="seoTitle">SEO title</label>
            <input id="seoTitle" name="seoTitle" maxLength={200} defaultValue={post?.seoTitle ?? ""} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="seoDescription">Meta description</label>
            <textarea id="seoDescription" name="seoDescription" rows={3} maxLength={300} defaultValue={post?.seoDescription ?? ""} className="field" />
          </div>
        </div>
        <button className="btn btn-primary w-full" disabled={pending}>
          {pending && <Loader2 className="h-5 w-5 animate-spin" />} {post ? "Save post" : "Publish post"}
        </button>
      </div>
    </form>
  );
}
