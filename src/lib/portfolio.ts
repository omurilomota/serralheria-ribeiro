import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { portfolioItems, type PortfolioItem } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export async function getPortfolio(limit?: number): Promise<PortfolioItem[]> {
  try {
    await ensureSeeded();
    const query = db
      .select()
      .from(portfolioItems)
      .orderBy(desc(portfolioItems.featured), asc(portfolioItems.sortOrder), desc(portfolioItems.id));
    const rows = limit ? await query.limit(limit) : await query;
    return rows;
  } catch (error) {
    console.error("[portfolio] falha ao carregar itens:", error);
    return [];
  }
}

export function portfolioCategories(items: PortfolioItem[]): string[] {
  return Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b));
}
