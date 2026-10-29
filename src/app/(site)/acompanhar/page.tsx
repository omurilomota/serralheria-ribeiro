import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projectEvents, projects, type Project, type ProjectEvent } from "@/db/schema";
import { buildWhatsAppLink, projectStatuses } from "@/lib/config";
import { formatDateTimeBR } from "@/lib/format";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acompanhar",
  description: "Consulte a etapa do seu projeto na Serralheria Ribeiro.",
  alternates: { canonical: "/acompanhar" },
};

type LookupResult = { project: Project; events: ProjectEvent[] } | null;

async function lookupProject(code: string): Promise<LookupResult> {
  const normalized = code.trim().toUpperCase().slice(0, 24);
  if (!normalized) return null;
  try {
    const [project] = await db.select().from(projects).where(eq(projects.code, normalized)).limit(1);
    if (!project) return null;
    const events = await db
      .select()
      .from(projectEvents)
      .where(eq(projectEvents.projectId, project.id))
      .orderBy(asc(projectEvents.createdAt));
    return { project, events };
  } catch (error) {
    console.error("[acompanhar] falha na consulta:", error);
    return null;
  }
}

export default async function AcompanharPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string }>;
}) {
  const params = await searchParams;
  const code = (params.codigo ?? "").trim().toUpperCase();
  const result = code ? await lookupProject(code) : null;
  const currentIndex = result
    ? projectStatuses.findIndex((status) => status.id === result.project.status)
    : -1;

  return (
    <div className="bg-paper">
      <section className="container-site py-8 md:py-10">
        <h1 className="display text-[2.1rem] sm:text-[2.6rem]">Acompanhar</h1>
        <form action="/acompanhar" method="get" className="mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
          <input
            id="codigo"
            name="codigo"
            defaultValue={code}
            placeholder="Código do projeto"
            className="field uppercase tracking-[0.08em]"
            autoComplete="off"
            required
            aria-label="Código do projeto"
          />
          <button type="submit" className="btn btn-dark shrink-0">
            Consultar
          </button>
        </form>

        {code && !result && (
          <div className="mt-8 max-w-lg">
            <p className="font-semibold">Código não encontrado.</p>
            <a
              href={buildWhatsAppLink(`Olá! Tentei consultar o projeto ${code} e não encontrei.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-brand mt-4"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Falar no WhatsApp
            </a>
          </div>
        )}

        {result && (
          <div className="mt-8 max-w-xl overflow-hidden rounded-[5px] border border-line bg-white">
            <div className="border-b border-line p-5">
              <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">{result.project.code}</p>
              <h2 className="mt-1 font-display text-2xl uppercase leading-tight">{result.project.title}</h2>
              {result.project.forecast && (
                <p className="mt-1 text-sm text-muted">{result.project.forecast}</p>
              )}
            </div>
            <ol className="divide-y divide-line">
              {projectStatuses.map((status, index) => {
                const isDone = index < currentIndex;
                const isCurrent = index === currentIndex;
                return (
                  <li
                    key={status.id}
                    className={`flex items-center gap-3 px-5 py-3 ${isCurrent ? "bg-brand/[0.07]" : ""}`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${
                        isDone
                          ? "bg-ink text-paper"
                          : isCurrent
                            ? "bg-brand text-ink"
                            : "border border-line text-ink/30"
                      }`}
                    >
                      {isDone ? <Icon name="check" className="h-3 w-3" /> : index + 1}
                    </span>
                    <span className={`text-sm ${isCurrent ? "font-semibold" : "text-ink/50"}`}>
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            {result.events.length > 0 && (
              <div className="border-t border-line p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.12em] text-muted">Última atualização</p>
                <p className="mt-1 text-sm">
                  {result.events[result.events.length - 1]?.note ??
                    projectStatuses.find((s) => s.id === result.project.status)?.label}
                </p>
                <p className="text-[0.72rem] text-muted">
                  {formatDateTimeBR(result.events[result.events.length - 1]?.createdAt)}
                </p>
              </div>
            )}
            <div className="border-t border-line p-4">
              <a
                href={buildWhatsAppLink(
                  `Olá! Sou ${result.project.clientName} e estou acompanhando o projeto ${result.project.code}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-brand w-full"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                Falar sobre este projeto
              </a>
            </div>
          </div>
        )}

        {!code && (
          <p className="mt-6 text-sm text-muted">
            Sem código?{" "}
            <Link href="/orcamento" className="font-semibold text-brand-dark">
              Peça um orçamento
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
