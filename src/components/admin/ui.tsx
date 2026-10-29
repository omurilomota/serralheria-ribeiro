import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/site/brand";
import { leadStatuses, projectStatuses, quoteStatuses } from "@/lib/config";

const tones: Record<string, string> = {
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  zinc: "bg-zinc-100 text-zinc-600 border-zinc-200",
  brand: "bg-brand/15 text-brand-dark border-brand/30",
};

export function LeadBadge({ status }: { status: string }) {
  const found = leadStatuses.find((item) => item.id === status) ?? leadStatuses[0];
  return <span className={`badge border ${tones[found.tone] ?? tones.zinc}`}>{found.label}</span>;
}

export function QuoteBadge({ status }: { status: string }) {
  const found = quoteStatuses.find((item) => item.id === status) ?? quoteStatuses[0];
  const tone = status === "aprovado" ? "emerald" : status === "recusado" ? "zinc" : "amber";
  return <span className={`badge border ${tones[tone]}`}>{found.label}</span>;
}

export function ProjectBadge({ status }: { status: string }) {
  const index = projectStatuses.findIndex((item) => item.id === status);
  const found = projectStatuses[index] ?? projectStatuses[0];
  const tone = index >= 4 ? "emerald" : index >= 1 ? "amber" : "sky";
  return <span className={`badge border ${tones[tone]}`}>{found.label}</span>;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className={`flex h-full flex-col justify-between rounded-[5px] border p-4 transition-shadow hover:shadow-[0_18px_30px_-28px_rgba(0,0,0,0.5)] ${
        accent ? "border-ink bg-ink text-paper" : "border-line bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${accent ? "text-paper/50" : "text-muted"}`}>
          {label}
        </p>
        <span
          className={`grid h-7 w-7 place-items-center rounded-[3px] ${
            accent ? "bg-brand/20 text-brand" : "bg-brand/12 text-brand-dark"
          }`}
        >
          <Icon name={icon} className="h-4 w-4" />
        </span>
      </div>
      <p className={`mt-3 font-display text-[1.9rem] leading-none ${accent ? "text-paper" : "text-ink"}`}>
        {value}
      </p>
      {hint && <p className={`mt-1 text-[0.72rem] ${accent ? "text-paper/50" : "text-muted"}`}>{hint}</p>}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function AdminPageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-[1.9rem] uppercase leading-none tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-[0.82rem] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[5px] border border-dashed border-line bg-white/60 p-8 text-center">
      <p className="font-display text-lg uppercase">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[0.82rem] text-muted">{description}</p>
    </div>
  );
}
