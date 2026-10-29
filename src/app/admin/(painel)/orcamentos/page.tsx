import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { quotations } from "@/db/schema";
import { buildWhatsAppLink, company, quoteStatuses } from "@/lib/config";
import { formatBRL, formatDateBR, whatsappNumber } from "@/lib/format";
import { updateQuoteStatus } from "@/app/admin/actions";
import { AdminPageHeader, EmptyState, QuoteBadge } from "@/components/admin/ui";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  let rows: (typeof quotations.$inferSelect)[] = [];
  try {
    rows = await db.select().from(quotations).orderBy(desc(quotations.createdAt)).limit(200);
  } catch (error) {
    console.error("[admin/orcamentos] falha ao listar:", error);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Orçamentos"
        subtitle="Propostas com a identidade da Serralheria Ribeiro. Abra a versão de impressão e salve como PDF para enviar ao cliente."
      >
        <Link href="/admin/orcamentos/novo" className="btn btn-dark text-[0.8rem]">
          <Icon name="plus" className="h-4 w-4" />
          Novo orçamento
        </Link>
      </AdminPageHeader>

      {rows.length === 0 ? (
        <EmptyState
          title="Nenhum orçamento emitido"
          description="Monte o primeiro orçamento com os itens do serviço. O sistema calcula o total, guarda a validade e gera uma proposta pronta para PDF."
        />
      ) : (
        <div className="overflow-x-auto rounded-[5px] border border-line bg-white">
          <div className="hidden grid-cols-[1fr_1.2fr_0.7fr_0.7fr_0.8fr] gap-3 border-b border-line bg-paper-deep px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted md:grid">
            <span>Número</span>
            <span>Cliente</span>
            <span>Total</span>
            <span>Emitido</span>
            <span className="text-right">Ações</span>
          </div>
          <div className="divide-y divide-line">
            {rows.map((quote) => {
              const waMessage = `Olá ${quote.clientName.split(" ")[0]}! Segue o orçamento ${quote.number} da ${company.name} (${quote.serviceTitle}). Total: ${formatBRL(
                quote.totalCents,
              )}, válido por ${quote.validityDays} dias. Qualquer dúvida estou à disposição!`;
              return (
                <div
                  key={quote.id}
                  className="grid gap-3 px-4 py-3.5 md:grid-cols-[1fr_1.2fr_0.7fr_0.7fr_0.8fr] md:items-center"
                >
                  <div>
                    <Link href={`/admin/orcamentos/${quote.id}`} className="font-semibold hover:text-brand-dark">
                      {quote.number}
                    </Link>
                    <div className="mt-1">
                      <QuoteBadge status={quote.status} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[0.85rem] font-medium">{quote.clientName}</p>
                    <p className="truncate text-[0.72rem] text-muted">
                      {quote.serviceTitle} · {quote.items.length} item(ns)
                    </p>
                  </div>
                  <p className="font-display text-lg leading-none">{formatBRL(quote.totalCents)}</p>
                  <p className="text-[0.75rem] text-muted">{formatDateBR(quote.createdAt)}</p>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/orcamentos/${quote.id}`}
                      className="btn btn-outline px-2.5 py-1.5 text-[0.7rem]"
                    >
                      <Icon name="print" className="h-3.5 w-3.5" />
                      PDF
                    </Link>
                    {quote.clientPhone && (
                      <a
                        href={`https://wa.me/${whatsappNumber(quote.clientPhone)}?text=${encodeURIComponent(waMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-brand px-2.5 py-1.5 text-[0.7rem]"
                      >
                        <Icon name="whatsapp" className="h-3.5 w-3.5" />
                        Enviar
                      </a>
                    )}
                    <form action={updateQuoteStatus} className="flex items-center gap-1">
                      <input type="hidden" name="quoteId" value={quote.id} />
                      <select
                        name="status"
                        defaultValue={quote.status}
                        className="field px-2 py-1.5 text-[0.7rem]"
                        aria-label="Status do orçamento"
                      >
                        {quoteStatuses.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-[3px] border border-line px-2 py-1.5 text-[0.68rem] font-semibold text-ink/70 hover:border-ink/40"
                        aria-label="Salvar status do orçamento"
                      >
                        OK
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="text-[0.76rem] text-muted">
        Dica: ao abrir um orçamento, use{" "}
        <a
          href={buildWhatsAppLink("Olá! Quero saber mais sobre os orçamentos da Serralheria Ribeiro.")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-dark underline underline-offset-2"
        >
          o botão de imprimir
        </a>{" "}
        do navegador e escolha &ldquo;Salvar como PDF&rdquo;. O layout já sai no formato A4.
      </p>
    </div>
  );
}
