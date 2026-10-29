import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/ui";
import { QuoteBuilder } from "@/components/admin/QuoteBuilder";
import { Icon } from "@/components/site/brand";

export default function NewQuotePage() {
  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Novo orçamento"
        subtitle="Monte a proposta item por item. O total é calculado automaticamente e a validade entra no PDF."
      >
        <Link href="/admin/orcamentos" className="btn btn-outline bg-white text-[0.8rem]">
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Voltar
        </Link>
      </AdminPageHeader>
      <QuoteBuilder />
    </div>
  );
}
