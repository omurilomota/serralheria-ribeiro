import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/lib/portfolio";
import { PortfolioGallery } from "@/components/site/PortfolioGallery";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trabalhos",
  description: "Fotos de portões, calhas e estruturas da Serralheria Ribeiro em Junqueirópolis - SP.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const items = await getPortfolio();

  return (
    <div className="bg-paper">
      <section className="container-site py-8 md:py-10">
        <div className="flex items-end justify-between gap-4">
          <h1 className="display text-[2.1rem] sm:text-[2.6rem]">Trabalhos</h1>
          <Link href="/orcamento" className="btn btn-dark py-2 text-[0.8rem]">
            Orçar
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6">
          {items.length > 0 ? (
            <PortfolioGallery items={items} />
          ) : (
            <p className="text-sm text-muted">Fotos em atualização.</p>
          )}
        </div>
      </section>
    </div>
  );
}
