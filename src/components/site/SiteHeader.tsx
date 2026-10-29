"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buildWhatsAppLink, company } from "@/lib/config";
import { Icon, Logo } from "@/components/site/brand";

const navLinks = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/portfolio", label: "Fotos" },
  { href: "/orcamento", label: "Orçamento" },
];

const whatsappHref = buildWhatsAppLink(
  "Olá! Vim pelo site da Serralheria Ribeiro e quero um orçamento.",
);

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Página inicial da Serralheria Ribeiro" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo compact />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-[0.84rem] font-medium ${
                pathname === link.href ? "text-brand-dark" : "text-ink/70 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-brand hidden px-3 py-2 text-[0.8rem] sm:inline-flex"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            {company.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-[3px] border border-line md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper md:hidden" aria-label="Navegação mobile">
          <div className="container-site flex flex-col py-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-3 text-sm font-medium">
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn btn-brand my-2 w-full"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
