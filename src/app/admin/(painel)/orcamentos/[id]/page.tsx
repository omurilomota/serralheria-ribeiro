import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { quotations } from "@/db/schema";
import { buildWhatsAppLink, company, quoteStatuses } from "@/lib/config";
import { formatBRL, formatDateBR, whatsappNumber } from "@/lib/format";
import { updateQuoteStatus } from "@/app/admin/actions";
import { PrintButton } from "@/components/admin/PrintButton";
import { QuoteBadge } from "@/components/admin/ui";
import { Icon, Logo } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
}) {
  const { id } = await params;
  const { novo } = await searchParams;
  const quoteId = Number(id);
  if (!Number.isInteger(quoteId) || quoteId <= 0) notFound();

  const [quote] = await db.select().from(quotations).where(eq(quotations.id, quoteId)).limit(1);
  if (!quote) notFound();

  const validityDate = new Date(quote.createdAt);
  validityDate.setDate(validityDate.getDate() + quote.validityDays);

  const whatsappMessage = [
    `*${company.name}* — Orçamento ${quote.number}`,
    `Cliente: ${quote.clientName}`,
    `Serviço: ${quote.serviceTitle}`,
    "",
    ...quote.items.map(
      (item) =>
        `• ${item.description} — ${item.quantity} × ${formatBRL(item.unitCents)} = ${formatBRL(
          item.quantity * item.unitCents,
        )}`,
    ),
    "",
    `Total: ${formatBRL(quote.totalCents)}`,
    `Validade: ${quote.validityDays} dias (até ${formatDateBR(validityDate)})`,
  ].join("\n");

  return (
    <div className="space-y-4">
      {novo && (
        <p className="no-print flex items-center gap-2 rounded-[3px] border border-emerald-300 bg-emerald-50 p-3 text-[0.82rem] font-medium text-emerald-800">
          <Icon name="check" className="h-4 w-4" />
          Orçamento {quote.number} salvo. Agora imprima/salve em PDF ou envie pelo WhatsApp.
        </p>
      )}

      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/orcamentos" className="btn btn-outline bg-white px-3 py-2 text-[0.78rem]">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Orçamentos
          </Link>
          <QuoteBadge status={quote.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form action={updateQuoteStatus} className="flex items-center gap-1.5">
            <input type="hidden" name="quoteId" value={quote.id} />
            <select name="status" defaultValue={quote.status} className="field px-2 py-1.5 text-[0.76rem]" aria-label="Status">
              {quoteStatuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-outline bg-white px-2.5 py-1.5 text-[0.72rem]">
              Atualizar
            </button>
          </form>
          {quote.clientPhone && (
            <a
              href={`https://wa.me/${whatsappNumber(quote.clientPhone)}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brand text-[0.8rem]"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Enviar no WhatsApp
            </a>
          )}
          <PrintButton />
        </div>
      </div>

      <article className="print-sheet mx-auto max-w-[840px] border border-line bg-white p-6 shadow-[0_20px_40px_-36px_rgba(0,0,0,0.6)] md:p-10">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink pb-5">
          <div>
            <Logo />
            <p className="mt-3 text-[0.74rem] leading-relaxed text-muted">
              {company.address.street} · {company.address.district}
              <br />
              {company.address.city} - {company.address.state} · CNPJ {company.cnpj}
              <br />
              WhatsApp {company.phoneDisplay}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brand-dark">
              Proposta comercial
            </p>
            <p className="font-display text-2xl uppercase leading-none">{quote.number}</p>
            <p className="mt-2 text-[0.74rem] text-muted">
              Emissão: {formatDateBR(quote.createdAt)}
              <br />
              Validade: {quote.validityDays} dias ({formatDateBR(validityDate)})
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-muted">Cliente</p>
            <p className="mt-1 text-[0.92rem] font-semibold">{quote.clientName}</p>
            <p className="text-[0.8rem] leading-relaxed text-muted">
              {quote.clientPhone ? `${quote.clientPhone}` : "—"}
              {quote.clientCity ? ` · ${quote.clientCity}` : ""}
              {quote.clientAddress ? (
                <>
                  <br />
                  {quote.clientAddress}
                </>
              ) : null}
            </p>
          </div>
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-muted">Objeto</p>
            <p className="mt-1 text-[0.92rem] font-semibold">{quote.serviceTitle}</p>
            <p className="text-[0.8rem] leading-relaxed text-muted">
              Fabricação e instalação conforme itens abaixo.
            </p>
          </div>
        </section>

        <table className="mt-5 w-full border-collapse text-[0.82rem]">
          <thead>
            <tr className="bg-paper-deep text-left text-[0.64rem] uppercase tracking-[0.1em] text-ink/70">
              <th className="px-2.5 py-2 font-semibold">Descrição</th>
              <th className="px-2 py-2 text-right font-semibold">Qtd.</th>
              <th className="px-2 py-2 text-right font-semibold">Unitário</th>
              <th className="px-2.5 py-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={`${item.description}-${index}`} className="border-b border-line">
                <td className="px-2.5 py-2.5 align-top">{item.description}</td>
                <td className="px-2 py-2.5 text-right align-top">{item.quantity}</td>
                <td className="px-2 py-2.5 text-right align-top">{formatBRL(item.unitCents)}</td>
                <td className="px-2.5 py-2.5 text-right align-top font-medium">
                  {formatBRL(item.quantity * item.unitCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-[280px] space-y-1.5 text-[0.84rem]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatBRL(quote.subtotalCents)}</dd>
            </div>
            {quote.discountCents > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Desconto</dt>
                <dd>- {formatBRL(quote.discountCents)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-3 border-t-2 border-ink pt-2">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]">Total</dt>
              <dd className="font-display text-xl leading-none">{formatBRL(quote.totalCents)}</dd>
            </div>
          </dl>
        </div>

        <section className="mt-5 rounded-[3px] border border-line bg-paper p-3.5">
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Condições e observações
          </p>
          <p className="mt-1 whitespace-pre-line text-[0.8rem] leading-relaxed text-ink/80">
            {quote.notes ??
              "Valores incluem fabricação e instalação. Medição técnica a confirmar no local."}
          </p>
          <ul className="mt-2 list-inside list-disc text-[0.74rem] leading-relaxed text-muted">
            <li>Proposta válida por {quote.validityDays} dias a partir da data de emissão.</li>
            <li>Prazo de execução e forma de pagamento definidos na aprovação.</li>
            <li>Alterações de medida ou material podem alterar o valor final.</li>
          </ul>
        </section>

        <footer className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="border-t border-ink/30 pt-2 text-center text-[0.7rem] text-muted">
            {company.name}
            <br />
            CNPJ {company.cnpj}
          </div>
          <div className="border-t border-ink/30 pt-2 text-center text-[0.7rem] text-muted">
            {quote.clientName}
            <br />
            De acordo (cliente)
          </div>
        </footer>

        <p className="mt-6 text-center text-[0.66rem] text-muted">
          Dúvidas? Fale no WhatsApp {company.phoneDisplay} informando o número {quote.number}.
        </p>
      </article>

      <div className="no-print mx-auto max-w-[840px]">
        <a
          href={buildWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.76rem] font-medium text-muted underline underline-offset-2 hover:text-ink"
        >
          Enviar resumo deste orçamento para o WhatsApp da serralheria
        </a>
      </div>
    </div>
  );
}
