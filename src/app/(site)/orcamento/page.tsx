import type { Metadata } from "next";
import { getService } from "@/lib/config";
import { QuoteCalculator } from "@/components/site/QuoteCalculator";

export const metadata: Metadata = {
  title: "Orçamento",
  description:
    "Peça um orçamento de calha, portão ou serralheria e envie direto no WhatsApp da Serralheria Ribeiro em Junqueirópolis - SP.",
  alternates: { canonical: "/orcamento" },
};

export default async function OrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ servico?: string }>;
}) {
  const params = await searchParams;
  const initialService = params.servico ? getService(params.servico) : undefined;

  return (
    <div className="bg-paper">
      <section className="container-site py-8 md:py-10">
        <h1 className="display text-[2.1rem] sm:text-[2.6rem]">Orçamento</h1>
        <p className="mt-1 text-sm text-muted">Escolha o serviço, informe a medida e envie no WhatsApp.</p>
        <div className="mt-6">
          <QuoteCalculator key={initialService?.id ?? "default"} initialServiceId={initialService?.id} />
        </div>
      </section>
    </div>
  );
}
