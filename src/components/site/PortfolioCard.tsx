"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/db/schema";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/12870099/pexels-photo-12870099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200";

export function PortfolioCard({
  item,
  priority = false,
}: {
  item: Pick<PortfolioItem, "id" | "title" | "category" | "description" | "imageUrl" | "location">;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(item.imageUrl);
  const [failed, setFailed] = useState(false);
  return (
    <figure className="group relative overflow-hidden rounded-[4px] bg-steel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={item.title}
        loading={priority ? "eager" : "lazy"}
        onError={() => {
          if (failed) return;
          setFailed(true);
          setSrc(FALLBACK_IMAGE);
        }}
        className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:h-64"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-3">
        <p className="font-display text-lg uppercase leading-tight text-paper">{item.title}</p>
        <p className="text-[0.7rem] uppercase tracking-[0.12em] text-brand-soft/80">{item.category}</p>
      </figcaption>
    </figure>
  );
}
