"use client";

import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/db/schema";
import { PortfolioCard } from "@/components/site/PortfolioCard";

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((item) => item.category))).sort()],
    [items],
  );
  const [active, setActive] = useState("Todos");

  const filtered = active === "Todos" ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`rounded-full border px-3.5 py-1.5 text-[0.75rem] font-semibold transition-colors ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-white text-ink/65 hover:border-ink/40 hover:text-ink"
              }`}
              aria-pressed={isActive}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <PortfolioCard key={item.id} item={item} priority={index < 3} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 rounded-[4px] border border-line bg-white p-6 text-sm text-muted">
          Ainda não há fotos nesta categoria. Fale com a gente para ver projetos semelhantes.
        </p>
      )}
    </div>
  );
}
