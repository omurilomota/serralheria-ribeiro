import type { Service, ServiceOption } from "@/lib/config";

export function resolveOption(service: Service, optionId: string): ServiceOption {
  return service.options.find((option) => option.id === optionId) ?? service.options[0];
}

function roundToTenReais(cents: number): number {
  return Math.max(0, Math.round(cents / 1000) * 1000);
}

export function calculateEstimate(service: Service, optionId: string, units: number) {
  const option = resolveOption(service, optionId);
  const safeUnits = Number.isFinite(units) && units > 0 ? units : 0;
  const minCents = roundToTenReais(option.minCents * safeUnits);
  const maxCents = roundToTenReais(option.maxCents * safeUnits);
  return { option, units: safeUnits, minCents, maxCents };
}

export function parseUnits(raw: string): number {
  const parsed = Number.parseFloat(raw.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100000) : 0;
}
