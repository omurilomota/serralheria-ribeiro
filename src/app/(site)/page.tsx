import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink, company, differentials, faq, processSteps, services } from "@/lib/config";
import { getPortfolio } from "@/lib/portfolio";
import { PortfolioCard } from "@/components/site/PortfolioCard";
import { Icon } from "@/components/site/brand";

export const dynamic = "force-dynamic";

const whatsappHref = buildWhatsAppLink(
  "Olá! Vim pelo site da Serralheria Ribeiro e quero um orçamento.",
);

export default async function HomePage() {
  const portfolio = await getPortfolio(6);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="container-site relative grid items-center gap-8 py-10 md:py-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand">
              Junqueirópolis · SP
            </p>
            <h1 className="display mt-3 text-[2.7rem] sm:text-[3.6rem] lg:text-[4.1rem]">
              Do portão a calha,
              <br />
              <span className="text-brand">tudo em um só lugar.</span>
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/orcamento" className="btn btn-brand">
                Pedir orçamento
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                <Icon name="whatsapp" className="h-4 w-4" />
                {company.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/12870099/pexels-photo-12870099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
              alt="Portão de aço da Serralheria Ribeiro"
              width={960}
              height={720}
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="h-[280px] w-full rounded-[5px] object-cover sm:h-[380px] lg:h-[440px]"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-[4px] bg-ink/80 px-3 py-2.5 text-[0.78rem] backdrop-blur">
              <span>Material de qualidade · Equipe especializada</span>
              <Link href="/portfolio" className="font-semibold text-brand-soft">
                Ver fotos →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="scroll-mt-20 bg-paper py-12 md:py-16">
        <div className="container-site">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-[1.9rem] sm:text-[2.3rem]">Serviços</h2>
            <Link href="/orcamento" className="text-[0.8rem] font-semibold text-brand-dark hover:text-ink">
              Orçar →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/orcamento?servico=${service.id}`}
                className="group flex flex-col items-start gap-3 rounded-[4px] border border-line bg-white p-4 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <span className="grid h-9 w-9 place-items-center rounded-[3px] border border-line text-brand-dark group-hover:border-paper/20 group-hover:text-brand">
                  <Icon name={service.icon} className="h-4.5 w-4.5" />
                </span>
                <span className="text-[0.86rem] font-semibold leading-snug">{service.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-12 md:py-16">
        <div className="container-site">
          <h2 className="display text-[1.9rem] sm:text-[2.3rem]">Por que a Ribeiro?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {differentials.map((item) => (
              <div key={item.title} className="rounded-[4px] border border-line bg-white p-5">
                <Icon name="check" className="h-4 w-4 text-brand-dark" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {portfolio.length > 0 && (
        <section className="border-y border-line bg-paper-deep py-12 md:py-16">
          <div className="container-site">
            <div className="flex items-end justify-between gap-4">
              <h2 className="display text-[1.9rem] sm:text-[2.3rem]">Trabalhos</h2>
              <Link href="/portfolio" className="text-[0.8rem] font-semibold text-brand-dark hover:text-ink">
                Ver todos →
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((item, index) => (
                <PortfolioCard key={item.id} item={item} priority={index < 3} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-paper-deep py-12 md:py-16">
        <div className="container-site">
          <h2 className="display text-[1.9rem] sm:text-[2.3rem]">Por que a Ribeiro?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {differentials.map((item) => (
              <div key={item.title} className="rounded-[4px] border border-line bg-white p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-12 md:py-16">
        <div className="container-site">
          <h2 className="display text-[1.9rem] sm:text-[2.3rem]">Como funciona</h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item) => (
              <li key={item.step} className="rounded-[4px] border border-line bg-white p-5">
                <span className="font-display text-2xl text-brand-dark">{item.step}</span>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper-deep py-12 md:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="display text-[1.9rem] sm:text-[2.3rem]">Perguntas frequentes</h2>
          <div className="mt-6 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="rounded-[4px] border border-line bg-white p-4">
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="bg-ink py-12 text-paper md:py-16">
        <div className="container-site grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="display text-[2.1rem] sm:text-[2.6rem]">Vamos começar?</h2>
            <p className="mt-2 text-sm text-paper/55">
              {company.address.street} · {company.address.city}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-brand">
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp
              </a>
              <Link href="/orcamento" className="btn btn-ghost-light">
                Calculadora
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {["Material de qualidade", "Equipe especializada", "Compromisso com o projeto"].map((item) => (
              <div key={item} className="rounded-[4px] border border-paper/10 px-3 py-4">
                <Icon name="check" className="mx-auto h-4 w-4 text-brand" />
                <p className="mt-2 text-[0.74rem] font-medium leading-snug text-paper/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
