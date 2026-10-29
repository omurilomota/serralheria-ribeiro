"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Logo } from "@/components/site/brand";
import { logoutAction } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Visão geral", icon: "chart" },
  { href: "/admin/leads", label: "Pedidos", icon: "users" },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: "file" },
  { href: "/admin/projetos", label: "Projetos", icon: "structure" },
  { href: "/admin/portfolio", label: "Portfólio", icon: "camera" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="no-print sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink/10 bg-ink text-paper lg:flex">
        <div className="border-b border-paper/10 p-5">
          <Link href="/admin">
            <Logo variant="light" compact />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Navegação do painel">
          {items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-[3px] px-3 py-2.5 text-[0.83rem] font-medium transition-colors ${
                  active ? "bg-brand text-ink" : "text-paper/65 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                <Icon name={item.icon} className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-paper/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-[3px] px-3 py-2.5 text-[0.8rem] text-paper/60 hover:bg-paper/10 hover:text-paper"
          >
            <Icon name="arrowUpRight" className="h-4 w-4" />
            Ver site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-[3px] px-3 py-2.5 text-left text-[0.8rem] text-paper/60 hover:bg-paper/10 hover:text-paper"
            >
              <Icon name="logout" className="h-4 w-4" />
              Sair do painel
            </button>
          </form>
          <p className="px-3 pb-1 pt-2 text-[0.62rem] uppercase tracking-[0.12em] text-paper/25">
            Serralheria Ribeiro
          </p>
        </div>
      </aside>

      <div className="no-print sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin">
            <Logo compact />
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-[0.72rem] font-semibold text-muted">
              Sair
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Navegação do painel mobile">
          {items.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.74rem] font-medium ${
                  active ? "bg-ink text-paper" : "bg-paper-deep text-ink/60"
                }`}
              >
                <Icon name={item.icon} className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
