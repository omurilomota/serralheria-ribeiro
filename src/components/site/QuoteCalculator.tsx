"use client";

import { useMemo, useState } from "react";
import { buildWhatsAppLink, getService, services, urgencyOptions } from "@/lib/config";
import { calculateEstimate, parseUnits } from "@/lib/estimate";
import { buildLeadMessage } from "@/lib/lead-message";
import { formatBRLRange, formatNumberBR } from "@/lib/format";
import { Icon } from "@/components/site/brand";

type Result = {
  protocol: string;
  stored: boolean;
  whatsappUrl: string;
  estimate: { minCents: number; maxCents: number };
};

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function QuoteCalculator({ initialServiceId }: { initialServiceId?: string }) {
  const preset = initialServiceId ? getService(initialServiceId) : undefined;
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(preset?.id ?? "");
  const [optionId, setOptionId] = useState(preset?.options[0]?.id ?? "");
  const [units, setUnits] = useState(preset ? String(preset.baseUnits) : "");
  const [urgency, setUrgency] = useState("proximas-semanas");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Junqueirópolis");
const [address, setAddress] = useState("");
  const [dontKnowMeasure, setDontKnowMeasure] = useState(false);
const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const service = getService(serviceId);
  const unitsValue = parseUnits(units);
const effectiveUnits = dontKnowMeasure ? 1 : unitsValue;
  const estimate = useMemo(
    () => (service ? calculateEstimate(service, optionId, effectiveUnits) : null),
    [service, optionId, effectiveUnits],
  );
  const urgencyLabel = urgencyOptions.find((item) => item.id === urgency)?.label ?? "";
  const unitAbbr = service
    ? service.measureLabel.includes("m²")
      ? "m²"
      : service.measureLabel.toLowerCase().includes("linear")
        ? "m"
        : "un"
    : "un";

  function handleService(id: string) {
    const next = getService(id);
    setServiceId(id);
    setOptionId(next?.options[0]?.id ?? "");
    setUnits(next ? String(next.baseUnits) : "");
    setError(null);
  }

  function validate(checkStep = step): string | null {
    if (checkStep === 0 && !service) return "Escolha o serviço.";
    if (checkStep === 1 && !dontKnowMeasure && unitsValue <= 0) return "Informe a medida.";
    if (checkStep === 2) {
      if (name.trim().length < 2) return "Informe seu nome.";
      if (phone.replace(/\D/g, "").length < 10) return "Informe o WhatsApp com DDD.";
      if (address.trim().length < 5) return "Informe o endereço completo.";
    }
    return null;
  }

  function goToStep(target: number) {
    if (target < 0 || target > 2) return;
    if (target <= step) {
      setStep(target);
      setError(null);
      return;
    }
    for (let s = step; s < target; s++) {
      const err = validate(s);
      if (err) {
        setError(err);
        setStep(s);
        return;
      }
    }
    setStep(target);
    setError(null);
  }

  async function handleSubmit() {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    if (!service || !estimate) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          optionId: estimate.option.id,
          units: effectiveUnits,
          urgency,
          name,
          phone,
          city,
          address,
          notes: dontKnowMeasure ? `Cliente não sabe medir; solicitar visita técnica. ${notes}`.trim() : notes,
        }),
      });
      const data = (await response.json()) as Partial<Result> & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível enviar.");
      setResult({
        protocol: data.protocol ?? "",
        stored: Boolean(data.stored),
        whatsappUrl: data.whatsappUrl ?? "",
        estimate: data.estimate ?? { minCents: estimate.minCents, maxCents: estimate.maxCents },
      });
      setStep(3);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Tente de novo ou chame no WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  const fallbackMessage =
    service && estimate
      ? buildLeadMessage({
          protocol: result?.protocol ?? "site",
          name: name || "Cliente do site",
          city,
          address,
          serviceName: service.name,
          optionLabel: estimate.option.label,
          measureLabel: service.measureLabel,
          units: effectiveUnits,
          urgencyLabel,
          notes,
          minCents: estimate.minCents,
          maxCents: estimate.maxCents,
        })
      : "Olá! Quero um orçamento com a Serralheria Ribeiro.";

  if (result) {
    return (
      <div className="rounded-[5px] border border-line bg-white p-5 md:p-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
          {result.protocol}
        </p>
        <h2 className="display mt-1 text-[1.8rem]">Pronto para enviar</h2>
        <p className="mt-3 font-display text-3xl leading-none text-brand-dark">
          {formatBRLRange(result.estimate.minCents, result.estimate.maxCents)}
        </p>
        <p className="mt-1 text-sm text-muted">
          {service?.short} · {formatNumberBR(unitsValue)} {unitAbbr}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={result.whatsappUrl || buildWhatsAppLink(fallbackMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-brand"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Enviar no WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setStep(0);
              setServiceId("");
              setName("");
              setPhone("");
              setNotes("");
            }}
            className="btn btn-outline"
          >
            Novo
          </button>
        </div>
        <p className="mt-3 text-[0.72rem] text-muted">Valor de referência. Confirmamos na medição.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[5px] border border-line bg-white">
      <div className="flex border-b border-line">
        {["Serviço", "Medida", "Dados"].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => goToStep(index)}
            className={`flex-1 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.1em] ${
              index === step ? "bg-ink text-paper" : index < step ? "text-ink" : "text-ink/35"
            }`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {services.map((item) => {
              const selected = item.id === serviceId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleService(item.id)}
                  className={`flex min-h-[96px] flex-col items-start gap-3 rounded-[4px] border p-4 text-left transition-colors ${
                    selected ? "border-brand bg-brand/[0.08]" : "border-line hover:border-ink/30"
                  }`}
                  aria-pressed={selected}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-[4px] bg-brand/[0.12] text-brand-dark">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-[0.86rem] font-semibold leading-snug">{item.short}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && service && (
          <div className="space-y-4">
            <div className="space-y-2">
              {service.options.map((item) => {
                const selected = item.id === optionId;
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-[4px] border p-3 min-h-[48px] ${
                      selected ? "border-brand bg-brand/[0.07]" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={item.id}
                      checked={selected}
                      onChange={() => setOptionId(item.id)}
                      className="accent-[#c8862c]"
                    />
                    <span className="text-[0.86rem] font-medium">{item.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="units" className="field-label">
                  {service.measureLabel}
                </label>
                <input
                  id="units"
                  inputMode="decimal"
                  value={units}
                  onChange={(event) => setUnits(event.target.value.replace(/[^\d.,]/g, ""))}
                  className="field"
                  disabled={dontKnowMeasure}
                />
              </div>
              <div>
                <label htmlFor="urgency" className="field-label">
                  Quando
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(event) => setUrgency(event.target.value)}
                  className="field"
                >
                  {urgencyOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-[0.82rem] text-ink/80">
              <input
                type="checkbox"
                checked={dontKnowMeasure}
                onChange={(event) => {
                  setDontKnowMeasure(event.target.checked);
                  if (event.target.checked) setUnits("1");
                }}
                className="accent-[#c8862c]"
              />
              Não sei medir / preciso de visita técnica
            </label>
            {dontKnowMeasure && (
              <p className="text-[0.78rem] text-muted">
                Vamos usar 1 unidade como referência inicial; a medição final será confirmada no local.
              </p>
            )}
            {estimate && estimate.minCents > 0 && (
              <p className="font-display text-2xl text-brand-dark">
                {formatBRLRange(estimate.minCents, estimate.maxCents)}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="field-label">
                Nome
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="field-label">
                WhatsApp
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(maskPhone(event.target.value))}
                className="field"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(18) 99999-9999"
              />
            </div>
            <div>
              <label htmlFor="city" className="field-label">
                Cidade
              </label>
              <input id="city" value={city} onChange={(event) => setCity(event.target.value)} className="field" />
            </div>
            <div>
              <label htmlFor="address" className="field-label">
                Endereço (rua, número, bairro)
              </label>
              <input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                className="field"
                placeholder="Rua, número e bairro"
                required
                autoComplete="street-address"
              />
            </div>
            <div>
              <label htmlFor="notes" className="field-label">
                Observação
              </label>
              <input
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="field"
                placeholder="Opcional"
              />
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-[0.8rem] font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-line pt-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">
              Voltar
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => {
                const validation = validate();
                if (validation) {
                  setError(validation);
                  return;
                }
                setError(null);
                setStep(step + 1);
              }}
              className="btn btn-brand"
            >
              Continuar
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting} className="btn btn-brand">
              {submitting ? "Enviando…" : "Gerar e enviar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
