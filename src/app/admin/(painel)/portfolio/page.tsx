import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { deletePortfolioItem, togglePortfolioFeatured } from "@/app/admin/actions";
import { AdminPageHeader, EmptyState } from "@/components/admin/ui";
import { PortfolioUploadForm } from "@/components/admin/PortfolioUploadForm";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

const categories = ["Portões", "Calhas", "Grades", "Estruturas", "Carretas", "Reformas"];

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { ok, erro } = await searchParams;
  const rows = await db
    .select()
    .from(portfolioItems)
    .orderBy(desc(portfolioItems.featured), asc(portfolioItems.sortOrder), desc(portfolioItems.id));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Portfólio"
        subtitle="Arraste uma imagem do PC/celular ou cole um link. Os itens marcados como destaque aparecem primeiro."
      >
        <Link href="/portfolio" target="_blank" className="btn btn-outline bg-white text-[0.8rem]">
          Ver no site
          <Icon name="arrowUpRight" className="h-4 w-4" />
        </Link>
      </AdminPageHeader>

      {ok && (
        <p className="rounded-[3px] border border-emerald-300 bg-emerald-50 p-3 text-[0.82rem] font-medium text-emerald-800">
          Foto adicionada ao portfólio.
        </p>
      )}
      {erro && (
        <p className="rounded-[3px] border border-red-300 bg-red-50 p-3 text-[0.82rem] font-medium text-red-700">
          {erro === "upload"
            ? "Não foi possível enviar a imagem. Configure o Supabase Storage ou use um link."
            : "Informe o título e um link de imagem válido."}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
        <section className="rounded-[5px] border border-line bg-white p-4 md:p-5 xl:sticky xl:top-6">
          <h2 className="font-display text-lg uppercase leading-none">Nova foto</h2>
          <PortfolioUploadForm categories={categories} /> 
        </section>

        <div>
          {rows.length === 0 ? (
            <EmptyState
              title="Portfólio vazio"
              description="Adicione a primeira foto para o site começar a mostrar os trabalhos da serralheria."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {rows.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[5px] border border-line bg-white">
                  <div className="relative h-36 bg-steel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    <span className="absolute left-2 top-2 badge border-paper/25 bg-ink/70 text-paper backdrop-blur">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="absolute right-2 top-2 badge border-brand/40 bg-brand text-ink">
                        Destaque
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-[0.85rem] font-semibold leading-snug">{item.title}</h3>
                    <p className="mt-0.5 line-clamp-2 text-[0.74rem] text-muted">
                      {item.description ?? "Sem descrição."}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <form action={togglePortfolioFeatured}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-[3px] border border-line px-2 py-1 text-[0.68rem] font-semibold text-ink/70 hover:border-brand hover:text-brand-dark"
                        >
                          {item.featured ? "Remover destaque" : "Destacar"}
                        </button>
                      </form>
                      <form action={deletePortfolioItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 rounded-[3px] border border-line px-2 py-1 text-[0.68rem] font-semibold text-red-600 hover:border-red-300"
                        >
                          <Icon name="trash" className="h-3 w-3" />
                          Excluir
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
