import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { isAdmin } from "@/lib/admin";
import { company } from "@/lib/config";
import { Icon, Logo } from "@/components/site/brand";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { erro } = await searchParams;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-paper lg:flex">
        <div className="hairline-grid pointer-events-none absolute inset-0 opacity-[0.15]" />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(200,134,44,0.25), transparent 65%)" }}
        />
        <div className="relative">
          <Logo variant="light" />
        </div>
        <div className="relative">
          <span className="eyebrow text-brand">
            <span className="h-px w-7 bg-brand" />
            Área do dono
          </span>
          <h1 className="display mt-4 max-w-md text-[2.8rem] leading-[0.96]">
            Menos caderninho.
            <br />
            Mais controle.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
            Leads da calculadora, orçamentos profissionais em PDF e acompanhamento de projeto em um
            só lugar.
          </p>
          <ul className="mt-6 space-y-2.5 text-[0.84rem] text-paper/70">
            {[
              "Leads qualificados com medida e material",
              "Orçamento pronto para imprimir ou enviar",
              "Cliente acompanha o projeto pelo código",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[0.7rem] text-paper/35">
          {company.name} · CNPJ {company.cnpj}
        </p>
      </div>

      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-8 lg:mt-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-dark">
              Painel da serralheria
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none">Entrar no painel</h2>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
              Acesso restrito à equipe. Informe a senha para gerenciar leads, orçamentos e projetos.
            </p>
          </div>

          {erro && (
            <p className="mt-5 rounded-[3px] border border-red-300 bg-red-50 p-3 text-[0.8rem] font-medium text-red-700">
              Senha incorreta. Tente novamente.
            </p>
          )}

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="field-label">
                Senha de acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                className="field"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn btn-brand w-full">
              Entrar
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </form>

          {process.env.NODE_ENV !== "production" && (
            <div className="mt-5 rounded-[4px] border border-line bg-white p-3 text-[0.75rem] leading-relaxed text-muted">
              <p className="font-semibold text-ink">Acesso de demonstração</p>
              <p className="mt-0.5">
                Senha padrão: <code className="rounded bg-paper-deep px-1.5 py-0.5 font-semibold text-ink">ribeiro2026</code>
              </p>
{/*}              <p className="mt-1">Defina a variável ADMIN_PASSWORD para alterar.</p> */}
            </div>
          )}

          <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted hover:text-ink">
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
