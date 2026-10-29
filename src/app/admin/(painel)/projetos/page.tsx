import Link from "next/link";
import { desc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { projectEvents, projects } from "@/db/schema";
import { projectStatuses } from "@/lib/config";
import { formatDateTimeBR, formatPhoneBR, whatsappNumber } from "@/lib/format";
import { createProject, deleteProject, updateProjectStatus } from "@/app/admin/actions";
import { AdminPageHeader, EmptyState, ProjectBadge } from "@/components/admin/ui";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  const { ok, erro } = await searchParams;
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt)).limit(80);
  const events =
    rows.length > 0
      ? await db
          .select()
          .from(projectEvents)
          .where(inArray(projectEvents.projectId, rows.map((row) => row.id)))
          .orderBy(desc(projectEvents.createdAt))
      : [];

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Projetos e acompanhamento"
        subtitle="Atualize a etapa da obra. O cliente consulta o mesmo código no site e vê a evolução em tempo real."
      />

      {ok && (
        <p className="rounded-[3px] border border-emerald-300 bg-emerald-50 p-3 text-[0.82rem] font-medium text-emerald-800">
          Projeto cadastrado. Envie o código para o cliente acompanhar pelo site.
        </p>
      )}
      {erro && (
        <p className="rounded-[3px] border border-red-300 bg-red-50 p-3 text-[0.82rem] font-medium text-red-700">
          {erro === "codigo"
            ? "Não foi possível cadastrar: verifique se o código já existe e tente outro."
            : "Informe o nome do cliente e o título do projeto."}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
        <section className="rounded-[5px] border border-line bg-white p-4 md:p-5 xl:sticky xl:top-6">
          <h2 className="font-display text-lg uppercase leading-none">Novo projeto</h2>
          <p className="mt-1 text-[0.76rem] text-muted">
            Crie após fechar o orçamento. O código é o que o cliente digita no site.
          </p>
          <form action={createProject} className="mt-3 space-y-3">
            <div>
              <label htmlFor="clientName" className="field-label">
                Cliente *
              </label>
              <input id="clientName" name="clientName" required className="field" placeholder="Nome do cliente" />
            </div>
            <div>
              <label htmlFor="title" className="field-label">
                Projeto *
              </label>
              <input
                id="title"
                name="title"
                required
                className="field"
                placeholder="Ex.: Calha e rufos - casa térrea"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="clientPhone" className="field-label">
                  WhatsApp
                </label>
                <input id="clientPhone" name="clientPhone" className="field" placeholder="(18) 99999-9999" />
              </div>
              <div>
                <label htmlFor="code" className="field-label">
                  Código (opcional)
                </label>
                <input
                  id="code"
                  name="code"
                  className="field uppercase"
                  placeholder="SR-A1B2C3"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="field-label">
                Endereço
              </label>
              <input id="address" name="address" className="field" placeholder="Rua, número, bairro" />
            </div>
            <div>
              <label htmlFor="forecast" className="field-label">
                Previsão
              </label>
              <input
                id="forecast"
                name="forecast"
                className="field"
                placeholder="Ex.: instalação na semana de 12/05"
              />
            </div>
            <button type="submit" className="btn btn-dark w-full">
              <Icon name="plus" className="h-4 w-4" />
              Cadastrar projeto
            </button>
          </form>
        </section>

        <div className="space-y-3">
          {rows.length === 0 ? (
            <EmptyState
              title="Nenhum projeto cadastrado"
              description="Cadastre o primeiro projeto ao lado. Cada atualização de status fica registrada no histórico do cliente."
            />
          ) : (
            rows.map((project) => {
              const latest = events.find((event) => event.projectId === project.id);
              const current = projectStatuses.find((status) => status.id === project.status);
              const trackingUrl = `/acompanhar?codigo=${project.code}`;
              const clientMessage = `Olá ${project.clientName.split(" ")[0]}! Atualização do seu projeto ${project.code} na Serralheria Ribeiro: ${
                current?.label ?? project.status
              }. ${project.forecast ? `Previsão: ${project.forecast}.` : ""} Acompanhe pelo site ou responda aqui.`;

              return (
                <article key={project.id} className="rounded-[5px] border border-line bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3.5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[0.92rem] font-semibold">{project.clientName}</h2>
                        <ProjectBadge status={project.status} />
                        <span className="font-display text-[0.95rem] uppercase tracking-[0.08em] text-brand-dark">
                          {project.code}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[0.78rem] text-muted">
                        {project.title}
                        {project.clientPhone ? ` · ${formatPhoneBR(project.clientPhone)}` : ""}
                      </p>
                      <p className="text-[0.7rem] text-muted">
                        Atualizado em {formatDateTimeBR(project.updatedAt)}
                        {project.forecast ? ` · Previsão: ${project.forecast}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={trackingUrl} target="_blank" className="btn btn-outline px-2.5 py-1.5 text-[0.72rem]">
                        <Icon name="search" className="h-3.5 w-3.5" />
                        Ver como cliente
                      </Link>
                      {project.clientPhone && (
                        <a
                          href={`https://wa.me/${whatsappNumber(project.clientPhone)}?text=${encodeURIComponent(clientMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-brand px-2.5 py-1.5 text-[0.72rem]"
                        >
                          <Icon name="whatsapp" className="h-3.5 w-3.5" />
                          Avisar cliente
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 px-4 py-3.5 md:grid-cols-[1fr_1.1fr]">
                    <div>
                      <p className="text-[0.64rem] uppercase tracking-[0.12em] text-muted">Último registro</p>
                      <p className="mt-1 text-[0.82rem] font-medium">
                        {latest
                          ? projectStatuses.find((status) => status.id === latest.status)?.label ?? latest.status
                          : "Sem eventos"}
                      </p>
                      {latest?.note && (
                        <p className="mt-1 rounded-[3px] border border-line bg-paper p-2 text-[0.76rem] leading-relaxed text-ink/75">
                          {latest.note}
                        </p>
                      )}
                      <a
                        href={trackingUrl}
                        target="_blank"
                        className="mt-2 inline-block break-all text-[0.7rem] text-brand-dark underline underline-offset-2"
                      >
                        /acompanhar?codigo={project.code}
                      </a>
                    </div>

                    <form action={updateProjectStatus} className="space-y-2 rounded-[3px] border border-line bg-paper p-3">
                      <input type="hidden" name="projectId" value={project.id} />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`status-${project.id}`} className="field-label">
                            Etapa
                          </label>
                          <select
                            id={`status-${project.id}`}
                            name="status"
                            defaultValue={project.status}
                            className="field px-2 py-1.5 text-[0.76rem]"
                          >
                            {projectStatuses.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`forecast-${project.id}`} className="field-label">
                            Previsão
                          </label>
                          <input
                            id={`forecast-${project.id}`}
                            name="forecast"
                            defaultValue={project.forecast ?? ""}
                            className="field px-2 py-1.5 text-[0.76rem]"
                            placeholder="Ex.: instalação dia 20"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`note-${project.id}`} className="field-label">
                          Observação para o cliente
                        </label>
                        <input
                          id={`note-${project.id}`}
                          name="note"
                          className="field px-2 py-1.5 text-[0.76rem]"
                          placeholder="Ex.: peça pronta, instalação agendada para sexta"
                        />
                      </div>
                      <button type="submit" className="btn btn-dark w-full py-1.5 text-[0.74rem]">
                        Atualizar etapa
                      </button>
                    </form>

                    <form action={deleteProject} className="mt-2">
                      <input type="hidden" name="projectId" value={project.id} />
                      <DeleteProjectButton />
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
