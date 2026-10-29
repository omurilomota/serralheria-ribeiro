"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buildWhatsAppLink, company } from "@/lib/config";
import { Icon } from "@/components/site/brand";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site py-16 text-center">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-dark">
        Erro inesperado
      </p>
      <h1 className="display mt-3 text-[2.4rem]">Algo deu errado</h1>
      <p className="mt-2 text-sm text-muted">
        Tente novamente. Se o problema continuar, fale com a gente no WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-dark">
          Tentar novamente
        </button>
        <a
          href={buildWhatsAppLink(`Olá! Tive um problema no site da ${company.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-brand"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
        <Link href="/" className="btn btn-outline">
          Início
        </Link>
      </div>
    </div>
  );
}