import { formatBRLRange, formatNumberBR } from "@/lib/format";

export type LeadMessageInput = {
  protocol: string;
  name: string;
  city: string;
  address?: string | null;
  serviceName: string;
  optionLabel: string;
  measureLabel: string;
  units: number;
  urgencyLabel: string;
  notes?: string | null;
  minCents: number;
  maxCents: number;
};

export function buildLeadMessage(input: LeadMessageInput): string {
  const lines = [
    "*Orçamento pelo site — Serralheria Ribeiro*",
    `Protocolo: ${input.protocol}`,
    "",
    `*Serviço:* ${input.serviceName}`,
    `*Material/opção:* ${input.optionLabel}`,
    `*Medida:* ${formatNumberBR(input.units)} ${input.measureLabel.toLowerCase()}`,
    `*Prazo:* ${input.urgencyLabel}`,
    `*Faixa estimada pelo site:* ${formatBRLRange(input.minCents, input.maxCents)}`,
    "",
    `*Nome:* ${input.name}`,
    `*Cidade:* ${input.city}`,
    input.address && input.address.trim().length > 0 ? `*Endereço:* ${input.address.trim()}` : null,
  ].filter((line): line is string => Boolean(line));

  if (input.notes && input.notes.trim().length > 0) {
    lines.push(`*Observações:* ${input.notes.trim()}`);
  }

  lines.push("", "Envio fotos do local por aqui. Podemos confirmar a medição?");
  return lines.join("\n");
}
