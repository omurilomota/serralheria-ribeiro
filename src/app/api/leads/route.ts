import { db } from "@/db";
import { leads } from "@/db/schema";
import {
  buildWhatsAppLink,
  getService,
  urgencyOptions,
} from "@/lib/config";
import { calculateEstimate } from "@/lib/estimate";
import { parseMeters, protocolNumber } from "@/lib/format";
import { buildLeadMessage } from "@/lib/lead-message";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type LeadPayload = {
  serviceId?: string;
  optionId?: string;
  units?: string | number;
  urgency?: string;
  name?: string;
  phone?: string;
  city?: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
};

export async function POST(request: Request) {
  if (!rateLimit(`leads:${clientIp(request)}`, 10, 60_000)) {
    return Response.json({ error: "Muitas tentativas. Aguarde um minuto." }, { status: 429 });
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return Response.json({ error: "Não foi possível ler os dados enviados." }, { status: 400 });
  }

  const service = getService(String(payload.serviceId ?? ""));
  if (!service) {
    return Response.json({ error: "Selecione um serviço válido." }, { status: 400 });
  }

  const units = parseMeters(payload.units ?? 0);
  if (units <= 0) {
    return Response.json({ error: "Informe uma metragem ou quantidade válida." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim().slice(0, 150);
  if (name.length < 2) {
    return Response.json({ error: "Informe seu nome." }, { status: 400 });
  }

  const phoneDigits = String(payload.phone ?? "").replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return Response.json({ error: "Informe um WhatsApp com DDD." }, { status: 400 });
  }

  const city = String(payload.city ?? "Junqueirópolis").trim().slice(0, 110) || "Junqueirópolis";
  const address = String(payload.address ?? "").trim().slice(0, 210);
  if (address.length < 5) {
    return Response.json({ error: "Informe o endereço completo." }, { status: 400 });
  }
  const notes = String(payload.notes ?? "").trim().slice(0, 900);
  const photoUrl = String(payload.photoUrl ?? "").trim().slice(0, 500);
  const urgency = urgencyOptions.find((item) => item.id === payload.urgency) ?? urgencyOptions[0];

  const estimate = calculateEstimate(service, String(payload.optionId ?? ""), units);
  const protocol = protocolNumber();

  const message = buildLeadMessage({
    protocol,
    name,
    city,
    address,
    serviceName: service.name,
    optionLabel: estimate.option.label,
    measureLabel: service.measureLabel,
    units,
    urgencyLabel: urgency.label,
    notes,
    minCents: estimate.minCents,
    maxCents: estimate.maxCents,
  });

  let stored = true;
  try {
    await db.insert(leads).values({
      protocol,
      name,
      phone: phoneDigits,
      city,
      address: address || null,
      serviceId: service.id,
      serviceName: service.name,
      material: estimate.option.label,
      meters: Math.round(units * 100),
      quantity: 1,
      urgency: urgency.id,
      notes: [notes, photoUrl ? `Foto: ${photoUrl}` : ""].filter(Boolean).join("\n") || null,
      photoUrl: photoUrl || null,
      estimateMinCents: estimate.minCents,
      estimateMaxCents: estimate.maxCents,
      status: "novo",
      source: "calculadora-site",
    });
  } catch (error) {
    stored = false;
    console.error("[leads] falha ao salvar lead:", error);
  }

  return Response.json({
    protocol,
    stored,
    estimate: { minCents: estimate.minCents, maxCents: estimate.maxCents },
    whatsappUrl: buildWhatsAppLink(message),
    message,
  });
}
