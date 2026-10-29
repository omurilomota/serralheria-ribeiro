import Link from "next/link";
import { buildWhatsAppLink, company } from "@/lib/config";
import { Icon } from "@/components/site/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-dark">
        404
      </p>
      <h1 className="display mt-3 text-[2.4rem]">Página não encontrada</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-dark">
          Voltar ao início
        </Link>
        <a
          href={buildWhatsAppLink(`Olá! Preciso de ajuda no site da ${company.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-brand"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}