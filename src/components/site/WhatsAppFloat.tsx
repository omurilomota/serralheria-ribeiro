"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppLink, company } from "@/lib/config";
import { Icon } from "@/components/site/brand";

const href = buildWhatsAppLink("Olá! Vim pelo site da Serralheria Ribeiro e quero um orçamento.");

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname === "/orcamento") return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print fixed bottom-5 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-[#0b2e18] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] md:bottom-7 md:right-7"
      aria-label={`WhatsApp ${company.phoneDisplay}`}
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
