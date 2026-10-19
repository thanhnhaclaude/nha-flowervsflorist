"use client";

import Image from "next/image";
import { useState } from "react";
import { img } from "@/lib/format";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={src}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative h-24 w-20 overflow-hidden rounded-xl ring-2 transition-all ${i === active ? "ring-plum-600" : "ring-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={img(src)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[1.5rem] bg-petal">
        <Image key={images[active]} src={img(images[active])} alt={name} fill fetchPriority="high" loading="eager" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}
