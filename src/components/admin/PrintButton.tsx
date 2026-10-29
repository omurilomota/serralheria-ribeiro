"use client";

import { Icon } from "@/components/site/brand";

export function PrintButton({ label = "Imprimir / salvar PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-dark text-[0.8rem]">
      <Icon name="print" className="h-4 w-4" />
      {label}
    </button>
  );
}
