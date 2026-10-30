import Link from "next/link";
import { buildWhatsAppLink, company } from "@/lib/config";
import { Icon, Logo } from "@/components/site/brand";

const whatsappHref = buildWhatsAppLink(
  "Olá! Encontrei a Serralheria Ribeiro pelo site e quero um orçamento.",
);

export function SiteFooter() {
  return (
    <footer className="no-print bg-ink text-paper">
      <div className="container-site flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo variant="light" compact />
          <a
            href={company.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-[0.78rem] text-paper/55 hover:text-paper"
          >
            {company.address.street} · {company.address.city} - {company.address.state}
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-brand text-[0.8rem]">
            <Icon name="whatsapp" className="h-4 w-4" />
            {company.phoneDisplay}
          </a>
          <Link href="/acompanhar" className="text-[0.78rem] text-paper/50 hover:text-paper">
            Acompanhar
          </Link>
          <Link href="/admin" className="text-[0.78rem] text-paper/50 hover:text-paper">
            Painel
          </Link>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-site py-3 text-center">
          <a
            href="https://wa.me/5518998133524"
            target="_blank"
            rel="noreferrer"
            aria-label="Falar com Murilo Mota no WhatsApp"
            className="text-[0.68rem] text-paper/30 transition-colors hover:text-paper/60"
          >
            Desenvolvido por Murilo Mota · 55 (18) 99813-3524
          </a>
        </div>
      </div>
    </footer>
  );
}
