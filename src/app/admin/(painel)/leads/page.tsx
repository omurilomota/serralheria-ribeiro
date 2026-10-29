import Link from "next/link";
import { asc, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getService, leadStatuses, urgencyOptions } from "@/lib/config";
import { formatBRL, formatDateTimeBR, formatNumberBR, formatPhoneBR } from "@/lib/format";
import { deleteLead, updateLeadStatus } from "@/app/admin/actions";
import { AdminPageHeader, EmptyState, LeadBadge } from "@/components/admin/ui";
import { DeleteLeadButton } from "@/components/admin/DeleteLeadButton";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = leadStatuses.some((item) => item.id === status) ? status : undefined;

  const [rows, counts, followUps] = await Promise.all([
    activeStatus
      ? db.select().from(leads).where(sql`${leads.status} = ${activeStatus}`).orderBy(desc(leads.createdAt)).limit(200)
      : db.select().from(leads).orderBy(desc(leads.createdAt)).limit(200),
    db.select({ status: leads.status, count: sql<number>`count(*)::int` }).from(leads).groupBy(leads.status),
    db
      .select()
      .from(leads)
      .where(
        sql`${leads.status} in ('contatado','orcamento','negociando') and ${leads.createdAt} < now() - interval '3 days'`,
      )
      .orderBy(asc(leads.createdAt))
      .limit(6),
  ]);

  const countFor = (id: string) => counts.find((row) => row.status === id)?.count ?? 0;
  const total = counts.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Pedidos de orçamento do site"
        subtitle="Pedidos enviados pela calculadora. O lead já chega com serviço, material, medida e faixa de investimento."
      >
        <Link href="/orcamento" className="btn btn-outline bg-white text-[0.8rem]">
          Abrir calculadora
          <Icon name="arrowUpRight" className="h-4 w-4" />
        </Link>
      </AdminPageHeader>

      {followUps.length > 0 && (
        <section className="rounded-[5px] border border-brand/35 bg-brand/[0.07] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-dark">
                Follow-up automático
              </p>
              <h2 className="font-display text-lg uppercase leading-none">
                {followUps.length} orçamento(s) sem resposta há mais de 3 dias
              </h2>
            </div>
            <span className="badge border-brand/40 bg-white text-brand-dark">Retomar hoje</span>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {followUps.map((lead) => {
              const digits = lead.phone.replace(/\D/g, "");
              const followUpMessage = `Olá ${lead.name.split(" ")[0]}, tudo bem? Aqui é da Serralheria Ribeiro. Passando para saber se ficou alguma dúvida sobre o orçamento de ${lead.serviceName.toLowerCase()} (${lead.protocol}). Consigo ajustar algum detalhe para você fechar com a gente?`;
              return (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-2 rounded-[3px] border border-line bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.8rem] font-semibold">{lead.name}</p>
                    <p className="truncate text-[0.7rem] text-muted">
                      {lead.serviceName} · {formatDateTimeBR(lead.createdAt)}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${digits.length > 11 ? digits : `55${digits}`}?text=${encodeURIComponent(followUpMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-brand shrink-0 px-2.5 py-1.5 text-[0.7rem]"
                  >
                    <Icon name="whatsapp" className="h-3.5 w-3.5" />
                    Retomar
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-full border px-3 py-1.5 text-[0.75rem] font-semibold ${
            !activeStatus ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink/60 hover:border-ink/40"
          }`}
        >
          Todos ({total})
        </Link>
        {leadStatuses.map((item) => (
          <Link
            key={item.id}
            href={`/admin/leads?status=${item.id}`}
            className={`rounded-full border px-3 py-1.5 text-[0.75rem] font-semibold ${
              activeStatus === item.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white text-ink/60 hover:border-ink/40"
            }`}
          >
            {item.label} ({countFor(item.id)})
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Nenhum pedido por aqui"
          description="Assim que um cliente fizer a estimativa no site, o pedido chega nesta lista com o resumo pronto para o WhatsApp."
        />
      ) : (
        <div className="space-y-3">
          {rows.map((lead) => {
            const urgency = urgencyOptions.find((item) => item.id === lead.urgency)?.label ?? lead.urgency;
            const leadService = getService(lead.serviceId);
            const measureUnit = leadService?.measureLabel.includes("m²")
              ? "m²"
              : leadService?.measureLabel.toLowerCase().includes("linear")
                ? "m"
                : "un";
            const phoneDigits = lead.phone.replace(/\D/g, "");
            const waLink = `https://wa.me/${phoneDigits.length > 11 ? phoneDigits : `55${phoneDigits}`}?text=${encodeURIComponent(
              `Olá ${lead.name.split(" ")[0]}! Aqui é da Serralheria Ribeiro. Recebi seu pedido ${lead.protocol} pelo site (${lead.serviceName}). Podemos confirmar a medição?`,
            )}`;

            return (
              <article key={lead.id} className="rounded-[5px] border border-line bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3.5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[0.95rem] font-semibold">{lead.name}</h2>
                      <LeadBadge status={lead.status} />
                      <span className="text-[0.68rem] uppercase tracking-[0.1em] text-muted">{lead.protocol}</span>
                    </div>
                    <p className="mt-0.5 text-[0.78rem] text-muted">
                      {formatPhoneBR(lead.phone)} · {lead.city} · {formatDateTimeBR(lead.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-brand text-[0.76rem]">
                      <Icon name="whatsapp" className="h-4 w-4" />
                      Responder
                    </a>
                    <a href={`tel:+55${phoneDigits}`} className="btn btn-outline text-[0.76rem]">
                      <Icon name="phone" className="h-4 w-4" />
                      Ligar
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 px-4 py-3.5 md:grid-cols-[1.4fr_0.6fr]">
                  <div>
                    <dl className="grid grid-cols-2 gap-2.5 text-[0.8rem] sm:grid-cols-4">
                      <div>
                        <dt className="text-[0.66rem] uppercase tracking-[0.1em] text-muted">Serviço</dt>
                        <dd className="mt-0.5 font-medium leading-snug">{lead.serviceName}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.66rem] uppercase tracking-[0.1em] text-muted">Material</dt>
                        <dd className="mt-0.5 font-medium leading-snug">{lead.material ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.66rem] uppercase tracking-[0.1em] text-muted">Medida</dt>
                        <dd className="mt-0.5 font-medium leading-snug">
                          {formatNumberBR(lead.meters / 100)} {measureUnit}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[0.66rem] uppercase tracking-[0.1em] text-muted">Prazo</dt>
                        <dd className="mt-0.5 font-medium leading-snug">{urgency}</dd>
                      </div>
                    </dl>
                    {lead.address && (
                      <p className="mt-2 text-[0.78rem] text-ink/75">
                        <span className="font-semibold">Endereço:</span> {lead.address}
                      </p>
                    )}
                    {lead.notes && (
                      <p className="mt-3 rounded-[3px] border border-line bg-paper p-2.5 text-[0.78rem] leading-relaxed text-ink/75">
                        <span className="font-semibold">Observações:</span> {lead.notes}
                      </p>
                    )}
                  </div>

                  <div className="rounded-[3px] border border-brand/25 bg-brand/[0.06] p-3">
                    <p className="text-[0.64rem] uppercase tracking-[0.12em] text-muted">Estimativa do site</p>
                    <p className="font-display text-xl leading-tight text-brand-dark">
                      {formatBRL(lead.estimateMinCents)} – {formatBRL(lead.estimateMaxCents)}
                    </p>
                    <form action={updateLeadStatus} className="mt-2.5 flex items-center gap-2">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <select name="status" defaultValue={lead.status} className="field px-2 py-1.5 text-[0.76rem]">
                        {leadStatuses.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-dark px-3 py-1.5 text-[0.72rem]">
                        Salvar
                      </button>
                    </form>
                    <form action={deleteLead} className="mt-2">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <DeleteLeadButton />
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
