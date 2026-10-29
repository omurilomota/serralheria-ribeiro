import type { ReactNode, SVGProps } from "react";
import { company } from "@/lib/config";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const serviceIcons: Record<string, ReactNode> = {
  gate: (
    <g {...strokeProps}>
      <path d="M3 20V9l3-3h12l3 3v11" />
      <path d="M6 20V11M10 20V11M14 20V11M18 20V11M3 16h18" />
    </g>
  ),
  fence: (
    <g {...strokeProps}>
      <path d="M4 21V7l2-3 2 3v14M12 21V7l2-3 2 3v14M20 21V7l2-3" />
      <path d="M2 12h20M2 17h20" />
    </g>
  ),
  structure: (
    <g {...strokeProps}>
      <path d="M3 19V8l9-4 9 4v11" />
      <path d="M3 8h18M8 19V8M16 19V8M3 19h18M3 12l18-4" />
    </g>
  ),
  trailer: (
    <g {...strokeProps}>
      <path d="M3 16V9h14l3 4v3" />
      <path d="M3 12h17M8 9v7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M20 13h1.5v5H19" />
    </g>
  ),
  weld: (
    <g {...strokeProps}>
      <path d="M4 20l7-7M15 4l5 5-3 3-5-5z" />
      <path d="M11 13l-3-3M3 21h4M14 21l1.5-1.5M19 18l1.5-1.5M17 21l2-2" />
    </g>
  ),
  gutter: (
    <g {...strokeProps}>
      <path d="M3 7h18l-2 5H5z" />
      <path d="M8 12v4M16 12v4M8 16h8" />
      <path d="M3 7 1.5 4M21 7l1.5-3" />
    </g>
  ),
  roof: (
    <g {...strokeProps}>
      <path d="M2 11 12 3l10 8" />
      <path d="M5 11v9h14v-9M5 15h6v5" />
      <path d="M15 13h4v4h-4z" />
    </g>
  ),
  detail: (
    <g {...strokeProps}>
      <path d="M3 6h18M3 10h18M5 14h4v6H5zM15 14h4v6h-4z" />
      <path d="M12 10v4" />
    </g>
  ),
  downspout: (
    <g {...strokeProps}>
      <path d="M6 3h5l-1 4H7z" />
      <path d="M9 7v6h5v8H9" />
      <path d="M17 3v6" />
    </g>
  ),
  tools: (
    <g {...strokeProps}>
      <path d="M14.7 6.3a3.5 3.5 0 0 0 4.6 4.6L21 9.5 14.5 3z" />
      <path d="M13 8 3 18l3 3 10-10" />
    </g>
  ),
};

const uiIcons: Record<string, ReactNode> = {
  whatsapp: (
    <path
      fill="currentColor"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
    />
  ),
  arrow: (
    <g {...strokeProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </g>
  ),
  arrowUpRight: (
    <g {...strokeProps}>
      <path d="M7 17 17 7M8 7h9v9" />
    </g>
  ),
  phone: (
    <g {...strokeProps}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L14.5 14l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1z" />
    </g>
  ),
  pin: (
    <g {...strokeProps}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </g>
  ),
  clock: (
    <g {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </g>
  ),
  check: (
    <g {...strokeProps}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </g>
  ),
  shield: (
    <g {...strokeProps}>
      <path d="M12 3l7 3v6c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </g>
  ),
  ruler: (
    <g {...strokeProps}>
      <path d="M3 15 15 3l6 6L9 21z" />
      <path d="M7 11l2 2M11 7l2 2M15 15l2 2" />
    </g>
  ),
  calc: (
    <g {...strokeProps}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h2M14 12h2M8 17h2M14 17h2" />
    </g>
  ),
  camera: (
    <g {...strokeProps}>
      <path d="M3 8h4l2-3h6l2 3h4v11H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </g>
  ),
  chart: (
    <g {...strokeProps}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-5M13 16V7M18 16v-8" />
    </g>
  ),
  file: (
    <g {...strokeProps}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </g>
  ),
  users: (
    <g {...strokeProps}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.9M17 14c2.3.7 4 2.8 4 5.4" />
    </g>
  ),
  logout: (
    <g {...strokeProps}>
      <path d="M9 4H5v16h4M14 8l4 4-4 4M8 12h10" />
    </g>
  ),
  plus: (
    <g {...strokeProps}>
      <path d="M12 5v14M5 12h14" />
    </g>
  ),
  trash: (
    <g {...strokeProps}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
    </g>
  ),
  search: (
    <g {...strokeProps}>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </g>
  ),
  copy: (
    <g {...strokeProps}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5H6a2 2 0 0 0-2 2v9" />
    </g>
  ),
  print: (
    <g {...strokeProps}>
      <path d="M6 9V3h12v6M6 18H4v-7h16v7h-2" />
      <rect x="7" y="14" width="10" height="7" />
    </g>
  ),
  menu: (
    <g {...strokeProps}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </g>
  ),
  close: (
    <g {...strokeProps}>
      <path d="M6 6l12 12M18 6 6 18" />
    </g>
  ),
  truck: (
    <g {...strokeProps}>
      <path d="M3 16V6h11v10M14 10h4l3 3v3h-3" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </g>
  ),
  home: (
    <g {...strokeProps}>
      <path d="M3 11 12 3l9 8M5 10v11h14V10" />
      <path d="M10 21v-6h4v6" />
    </g>
  ),
};

export type IconName = keyof typeof uiIcons | keyof typeof serviceIcons;

export function Icon({
  name,
  className = "h-5 w-5",
  ...rest
}: { name: string; className?: string } & SVGProps<SVGSVGElement>) {
  const content = uiIcons[name] ?? serviceIcons[name] ?? uiIcons.check;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...rest}>
      {content}
    </svg>
  );
}

export function Logo({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
}) {
  const isLight = variant === "light";
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-[4px] ${
          isLight ? "bg-paper text-ink" : "bg-ink text-brand"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <path
            d="M4 23V12h4v6h3V7h4v11h3v-6h4v11h3v-4h3v9H4z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.2rem] font-semibold uppercase tracking-[0.04em] ${
            isLight ? "text-paper" : "text-ink"
          }`}
        >
          Serralheria Ribeiro
        </span>
        <span
          className={`mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] ${
            isLight ? "text-paper/55" : "text-muted"
          }`}
        >
          {compact ? "Calhas em geral" : `${company.tagline} · Junqueirópolis`}
        </span>
      </span>
    </span>
  );
}
