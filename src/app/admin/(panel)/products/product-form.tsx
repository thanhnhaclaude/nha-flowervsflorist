"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { saveProduct } from "./actions";
import { img } from "@/lib/format";
import type { Product } from "@/lib/db/schema";

type Cat = { slug: string; name: string; group: string };
const COLORS = ["red", "pink", "white", "yellow", "orange", "purple", "green"];

export function ProductForm({ product, categories }: { product?: Product; categories: Cat[] }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [images, setImages] = useState((product?.images ?? []).join("\n"));
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const e = state?.errors ?? {};
  const list = images.split("\n").map((s) => s.trim()).filter(Boolean);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadErr("");
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setUploadErr(data.message ?? "Upload failed");
      else setImages((x) => (x.trim() ? `${x.trim()}\n${data.url}` : data.url));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const err = (k: string) => e[k] && <p className="error-text">{e[k]}</p>;
  const groups = ["occasion", "flower", "collection"];

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="space-y-5 rounded-2xl bg-white p-5 shadow-card md:p-6">
        {state?.message && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{state.message}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={product?.name} className="field" required aria-invalid={Boolean(e.name) || undefined} />
            {err("name")}
          </div>
          <div>
            <label className="label" htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" defaultValue={product?.slug} className="field" placeholder="auto from name" aria-invalid={Boolean(e.slug) || undefined} />
            {err("slug")}
          </div>
          <div>
            <label className="label" htmlFor="price">Price (Standard, USD)</label>
            <input id="price" name="price" inputMode="decimal" defaultValue={product ? (product.price / 100).toFixed(2) : ""} className="field" required aria-invalid={Boolean(e.price) || undefined} />
            {err("price")}
          </div>
          <div>
            <label className="label" htmlFor="compareAt">Compare-at price <span className="font-normal text-muted">(optional, real previous price only)</span></label>
            <input id="compareAt" name="compareAt" inputMode="decimal" defaultValue={product?.compareAt ? (product.compareAt / 100).toFixed(2) : ""} className="field" />
            {err("compareAt")}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="short">Short summary</label>
          <input id="short" name="short" maxLength={300} defaultValue={product?.short} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={5} defaultValue={product?.description} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="includes">What&apos;s included <span className="font-normal text-muted">(one per line)</span></label>
          <textarea id="includes" name="includes" rows={4} defaultValue={product?.includes.join("\n")} className="field" />
        </div>
        <fieldset>
          <legend className="label">Categories</legend>
          {groups.map((g) => (
            <div key={g} className="mb-3">
              <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-muted">{g}s</p>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <label key={c.slug} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm">
                      <input type="checkbox" name="categories" value={c.slug} defaultChecked={product?.categories.includes(c.slug)} className="accent-rose-600" /> {c.name}
                    </label>
                  ))}
              </div>
            </div>
          ))}
          {err("categories")}
        </fieldset>
        <fieldset>
          <legend className="label">Colors</legend>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <label key={c} className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm capitalize">
                <input type="checkbox" name="colors" value={c} defaultChecked={product?.colors.includes(c)} className="accent-rose-600" /> {c}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="label">Images</p>
          {list.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2">
              {list.map((src) => (
                <Image key={src} src={img(src)} alt="" width={100} height={125} className="aspect-[4/5] w-full rounded-lg object-cover" unoptimized={src.startsWith("http")} />
              ))}
            </div>
          )}
          <textarea name="images" rows={4} value={images} onChange={(ev) => setImages(ev.target.value)} className="field font-mono text-xs" aria-label="Image paths, one per line" aria-invalid={Boolean(e.images) || undefined} />
          <p className="mt-1 text-xs text-muted">One per line. First image is the main photo. Catalog keys (p/peony-dream) or uploaded /media/… paths.</p>
          {err("images")}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={(ev) => upload(ev.target.files)} />
          <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-outline btn-sm mt-3 w-full" disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload images
          </button>
          {uploadErr && <p className="error-text">{uploadErr}</p>}
        </div>
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-card">
          {[
            ["active", "Visible in store", product?.active ?? true],
            ["nextDay", "Next-day eligible (unchecked = needs 1 extra prep day)", product?.nextDay ?? true],
            ["hasSizes", "Offer Standard / Deluxe / Premium sizes", product?.hasSizes ?? true],
            ["bestSeller", "Best seller", product?.bestSeller ?? false],
            ["featured", "Featured on home page", product?.featured ?? false],
          ].map(([k, label, on]) => (
            <label key={String(k)} className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" name={String(k)} defaultChecked={Boolean(on)} className="h-5 w-5 accent-rose-600" /> {label}
            </label>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="label" htmlFor="badge">Badge</label>
              <input id="badge" name="badge" maxLength={40} defaultValue={product?.badge ?? ""} className="field" placeholder="New, Seasonal…" />
            </div>
            <div>
              <label className="label" htmlFor="sortOrder">Sort order</label>
              <input id="sortOrder" name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} className="field" />
            </div>
          </div>
        </div>
        <button className="btn btn-primary w-full" disabled={pending}>
          {pending && <Loader2 className="h-5 w-5 animate-spin" />} {product ? "Save product" : "Create product"}
        </button>
      </div>
    </form>
  );
}
