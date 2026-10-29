import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-[1180px] p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
