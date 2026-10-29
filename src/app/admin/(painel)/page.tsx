import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { leads, projects, quotations } from "@/db/schema";
import { company } from "@/lib/config";
import { formatBRL, formatDateTimeBR } from "@/lib/format";
import { AdminPageHeader, LeadBadge, ProjectBadge, StatCard } from "@/components/admin/ui";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [leadAggRows, quoteAggRows, projectAggRows, recentLeads, activeProjects] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        month: sql<number>`count(*) filter (where ${leads.createdAt} >= date_trunc('month', now()))::int`,
        novos: sql<number>`count(*) filter (where ${leads.status} = 'novo')::int`,
        abertos: sql<number>`count(*) filter (where ${leads.status} not in ('ganho','perdido'))::int`,
        pipeline: sql<number>`coalesce(sum(${leads.estimateMaxCents}) filter (where ${leads.status} not in ('ganho','perdido')), 0)::int`,
      })
      .from(leads),
    db
      .select({
        total: sql<number>`count(*)::int`,
        enviados: sql<number>`count(*) filter (where ${quotations.status} = 'enviado')::int`,
        aprovados: sql<number>`coalesce(sum(${quotations.totalCents}) filter (where ${quotations.status} = 'aprovado'), 0)::int`,
      })
      .from(quotations),
    db
      .select({
        total: sql<number>`count(*)::int`,
        ativos: sql<number>`count(*) filter (where ${projects.status} <> 'instalado')::int`,
      })
      .from(projects),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
    db.select().from(projects).orderBy(desc(projects.updatedAt)).limit(4),
  ]);

  const leadAgg = leadAggRows[0] ?? { total: 0, month: 0, novos: 0, abertos: 0, pipeline: 0 };
  const quoteAgg = quoteAggRows[0] ?? { total: 0, enviados: 0, aprovados: 0 };
  const projectAgg = projectAggRows[0] ?? { total: 0, ativos: 0 };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Visão geral"
        subtitle={`${company.name} · ferramentas de atendimento, orçamento e acompanhamento de projetos.`}
      >
        <Link href="/admin/orcamentos/novo" className="btn btn-dark text-[0.8rem]">
          <Icon name="plus" className="h-4 w-4" />
          Novo orçamento
        </Link>
        <Link href="/orcamento" className="btn btn-outline bg-white text-[0.8rem]">
          Calculadora pública
          <Icon name="arrowUpRight" className="h-4 w-4" />
        </Link>
      </AdminPageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pedidos no mês"
          value={String(leadAgg.month)}
          hint={`${leadAgg.total} desde o início`}
          icon="users"
          href="/admin/leads"
        />
        <StatCard
          label="Aguardando contato"
          value={String(leadAgg.novos)}
          hint={`${leadAgg.abertos} em negociação`}
          icon="whatsapp"
          href="/admin/leads"
        />
        <StatCard
          label="Potencial em negociação"
          value={formatBRL(leadAgg.pipeline)}
          hint="Soma das estimativas em aberto"
          icon="chart"
          accent
        />
        <StatCard
          label="Projetos ativos"
          value={String(projectAgg.ativos)}
          hint={`${projectAgg.total} cadastrados`}
          icon="structure"
          href="/admin/projetos"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.75fr]">
        <section className="overflow-hidden rounded-[5px] border border-line bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 md:px-5">
            <div>
              <h2 className="font-display text-lg uppercase leading-none">Últimos leads</h2>
              <p className="mt-1 text-[0.72rem] text-muted">Pedidos gerados pela calculadora do site.</p>
            </div>
            <Link href="/admin/leads" className="text-[0.75rem] font-semibold text-brand-dark hover:text-ink">
              Ver todos →
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-display text-lg uppercase">Nenhum lead ainda</p>
              <p className="mx-auto mt-1 max-w-sm text-[0.8rem] text-muted">
                Quando um cliente usar a calculadora do site, o pedido aparece aqui com medida,
                material e protocolo.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[0.86rem] font-semibold">{lead.name}</p>
                      <LeadBadge status={lead.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[0.75rem] text-muted">
                      {lead.serviceName} · {lead.material ?? "—"} · {formatBRL(lead.estimateMinCents)}–
                      {formatBRL(lead.estimateMaxCents)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.7rem] text-muted">{formatDateTimeBR(lead.createdAt)}</p>
                    <a
                      href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.72rem] font-semibold text-emerald-700 hover:underline"
                    >
                      Chamar no WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-[5px] border border-line bg-white p-4 md:p-5">
            <h2 className="font-display text-lg uppercase leading-none">Atalhos</h2>
            <div className="mt-3 space-y-2">
              {[
                { href: "/admin/orcamentos/novo", label: "Montar orçamento", hint: "Cliente, itens e validade", icon: "file" },
                { href: "/admin/projetos", label: "Atualizar projeto", hint: "Medição, produção, entrega", icon: "structure" },
                { href: "/admin/portfolio", label: "Subir foto no portfólio", hint: "Cole o link da imagem", icon: "camera" },
                { href: "/admin/leads", label: "Responder pedidos", hint: "Status e contato direto", icon: "whatsapp" },
              ].map((shortcut) => (
                <Link
                  key={shortcut.href}
                  href={shortcut.href}
                  className="flex items-center gap-3 rounded-[3px] border border-line px-3 py-2.5 transition-colors hover:border-ink/30 hover:bg-paper"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-[3px] bg-brand/12 text-brand-dark">
                    <Icon name={shortcut.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.82rem] font-semibold">{shortcut.label}</span>
                    <span className="block text-[0.7rem] text-muted">{shortcut.hint}</span>
                  </span>
                  <Icon name="arrow" className="h-4 w-4 text-ink/25" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[5px] border border-line bg-ink p-4 text-paper md:p-5">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-brand">Resumo comercial</p>
            <dl className="mt-3 space-y-2.5 text-[0.82rem]">
              <div className="flex justify-between gap-3 border-b border-paper/10 pb-2">
                <dt className="text-paper/55">Orçamentos emitidos</dt>
                <dd className="font-semibold">{quoteAgg.total}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-paper/10 pb-2">
                <dt className="text-paper/55">Aguardando resposta</dt>
                <dd className="font-semibold">{quoteAgg.enviados}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-paper/55">Aprovados (valor)</dt>
                <dd className="font-semibold text-brand-soft">{formatBRL(quoteAgg.aprovados)}</dd>
              </div>
            </dl>
            <Link href="/admin/orcamentos" className="btn btn-brand mt-4 w-full text-[0.8rem]">
              Ver orçamentos
            </Link>
          </section>

          <section className="rounded-[5px] border border-line bg-white p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg uppercase leading-none">Projetos</h2>
              <Link href="/admin/projetos" className="text-[0.72rem] font-semibold text-brand-dark">
                gerenciar
              </Link>
            </div>
            {activeProjects.length === 0 ? (
              <p className="mt-2 text-[0.78rem] text-muted">Nenhum projeto cadastrado ainda.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {activeProjects.map((project) => (
                  <li key={project.id} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.82rem] font-semibold">{project.clientName}</p>
                      <ProjectBadge status={project.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[0.72rem] text-muted">
                      {project.code} · {project.title}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
