"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuotation } from "@/app/admin/actions";
import { formatBRL } from "@/lib/format";
import { services } from "@/lib/config";
import { Icon } from "@/components/site/brand";

type ItemRow = { description: string; quantity: string; unit: string };

const emptyRow: ItemRow = { description: "", quantity: "1", unit: "" };

function parseMoneyToCents(value: string): number {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

function parseQuantity(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function QuoteBuilder() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("Junqueirópolis");
  const [clientAddress, setClientAddress] = useState("");
  const [serviceTitle, setServiceTitle] = useState("Calhas em alumínio");
  const [validityDays, setValidityDays] = useState("10");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState(
    "Valores incluem fabricação e instalação. Medição técnica a confirmar no local.",
  );
  const [items, setItems] = useState<ItemRow[]>([
    { description: "Calha em alumínio sob medida (m linear)", quantity: "18", unit: "110,00" },
  ]);

  const subtotalCents = useMemo(
    () =>
      items.reduce(
        (total, item) => total + parseQuantity(item.quantity) * parseMoneyToCents(item.unit),
        0,
      ),
    [items],
  );
  const discountCents = Math.min(parseMoneyToCents(discount), subtotalCents);
  const totalCents = subtotalCents - discountCents;

  function updateItem(index: number, field: keyof ItemRow, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    );
  }

  function addCatalogItem(serviceId: string) {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return;
    const option = service.options[0];
    setItems((current) => [
      ...current,
      {
        description: `${service.name} — ${option.label}`,
        quantity: String(service.baseUnits),
        unit: (option.minCents / 100).toFixed(2).replace(".", ","),
      },
    ]);
    setServiceTitle(service.short);
  }

  function handleSubmit() {
    setError(null);
    const cleanedItems = items
      .map((item) => ({
        description: item.description.trim(),
        quantity: parseQuantity(item.quantity),
        unitCents: parseMoneyToCents(item.unit),
      }))
      .filter((item) => item.description.length > 0 && item.quantity > 0);

    if (clientName.trim().length < 2) {
      setError("Informe o nome do cliente.");
      return;
    }
    if (cleanedItems.length === 0) {
      setError("Adicione pelo menos um item com descrição, quantidade e valor unitário.");
      return;
    }

    startTransition(async () => {
      const result = await createQuotation({
        clientName,
        clientPhone,
        clientCity,
        clientAddress,
        serviceTitle,
        notes,
        validityDays: Number(validityDays) || 10,
        discountCents,
        items: cleanedItems,
      });
      if (!result.ok || !result.id) {
        setError(result.error ?? "Não foi possível salvar o orçamento.");
        return;
      }
      router.push(`/admin/orcamentos/${result.id}?novo=1`);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_0.7fr] xl:items-start">
      <div className="space-y-4">
        <section className="rounded-[5px] border border-line bg-white p-4 md:p-5">
          <h2 className="font-display text-lg uppercase leading-none">Dados do cliente</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="clientName" className="field-label">
                Nome / empresa *
              </label>
              <input
                id="clientName"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                className="field"
                placeholder="Ex.: Maria Ribeiro"
              />
            </div>
            <div>
              <label htmlFor="clientPhone" className="field-label">
                WhatsApp
              </label>
              <input
                id="clientPhone"
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                className="field"
                placeholder="(18) 99999-9999"
              />
            </div>
            <div>
              <label htmlFor="clientCity" className="field-label">
                Cidade
              </label>
              <input
                id="clientCity"
                value={clientCity}
                onChange={(event) => setClientCity(event.target.value)}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="clientAddress" className="field-label">
                Endereço da obra
              </label>
              <input
                id="clientAddress"
                value={clientAddress}
                onChange={(event) => setClientAddress(event.target.value)}
                className="field"
                placeholder="Rua, número, bairro"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="serviceTitle" className="field-label">
                Título do orçamento
              </label>
              <input
                id="serviceTitle"
                value={serviceTitle}
                onChange={(event) => setServiceTitle(event.target.value)}
                className="field"
                placeholder="Ex.: Calhas e rufos - obra residencial"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[5px] border border-line bg-white p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg uppercase leading-none">Itens</h2>
            <div className="flex items-center gap-2">
              <select
                onChange={(event) => {
                  if (event.target.value) addCatalogItem(event.target.value);
                  event.target.value = "";
                }}
                defaultValue=""
                className="field w-auto px-2 py-1.5 text-[0.74rem]"
                aria-label="Adicionar serviço do catálogo"
              >
                <option value="">+ Serviço do catálogo</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.short}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setItems((current) => [...current, { ...emptyRow }])}
                className="btn btn-outline px-2.5 py-1.5 text-[0.74rem]"
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
                Item
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2.5">
            {items.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-[3px] border border-line p-2.5 sm:grid-cols-[1fr_70px_110px_32px]">
                <input
                  value={item.description}
                  onChange={(event) => updateItem(index, "description", event.target.value)}
                  className="field px-2.5 py-1.5 text-[0.82rem]"
                  placeholder="Descrição do item"
                  aria-label={`Descrição do item ${index + 1}`}
                />
                <input
                  value={item.quantity}
                  onChange={(event) => updateItem(index, "quantity", event.target.value)}
                  className="field px-2.5 py-1.5 text-[0.82rem]"
                  placeholder="Qtd."
                  inputMode="decimal"
                  aria-label={`Quantidade do item ${index + 1}`}
                />
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[0.7rem] text-muted">R$</span>
                  <input
                    value={item.unit}
                    onChange={(event) => updateItem(index, "unit", event.target.value)}
                    className="field py-1.5 pl-7 pr-2 text-[0.82rem]"
                    placeholder="0,00"
                    inputMode="decimal"
                    aria-label={`Valor unitário do item ${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="grid h-9 w-8 place-items-center rounded-[3px] border border-line text-muted hover:border-red-300 hover:text-red-600"
                  aria-label={`Remover item ${index + 1}`}
                >
                  <Icon name="trash" className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[0.7rem] text-muted">
            A quantidade e o valor unitário aceitam vírgula. Ex.: 18,5 metros × R$ 110,00.
          </p>
        </section>

        <section className="rounded-[5px] border border-line bg-white p-4 md:p-5">
          <h2 className="font-display text-lg uppercase leading-none">Condições</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-[120px_140px_1fr]">
            <div>
              <label htmlFor="validity" className="field-label">
                Validade (dias)
              </label>
              <input
                id="validity"
                value={validityDays}
                onChange={(event) => setValidityDays(event.target.value.replace(/\D/g, ""))}
                className="field"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="discount" className="field-label">
                Desconto (R$)
              </label>
              <input
                id="discount"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                className="field"
                placeholder="0,00"
                inputMode="decimal"
              />
            </div>
            <div>
              <label htmlFor="notes" className="field-label">
                Observações no PDF
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={2}
                className="field resize-none"
              />
            </div>
          </div>
        </section>

        {error && (
          <p role="alert" className="rounded-[3px] border border-red-300 bg-red-50 p-3 text-[0.82rem] font-medium text-red-700">
            {error}
          </p>
        )}
      </div>

      <aside className="rounded-[5px] border border-line bg-white p-4 md:p-5 xl:sticky xl:top-6">
        <h2 className="font-display text-lg uppercase leading-none">Resumo</h2>
        <dl className="mt-3 space-y-2 text-[0.82rem]">
          <div className="flex justify-between gap-3 border-b border-line pb-2">
            <dt className="text-muted">Itens</dt>
            <dd className="font-medium">{items.filter((item) => item.description.trim()).length}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line pb-2">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium">{formatBRL(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line pb-2">
            <dt className="text-muted">Desconto</dt>
            <dd className="font-medium">- {formatBRL(discountCents)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 pt-1">
            <dt className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">Total</dt>
            <dd className="font-display text-2xl leading-none text-brand-dark">{formatBRL(totalCents)}</dd>
          </div>
        </dl>

        <button type="button" onClick={handleSubmit} disabled={pending} className="btn btn-brand mt-4 w-full">
          {pending ? "Gerando proposta…" : "Salvar e gerar proposta"}
          {!pending && <Icon name="arrow" className="h-4 w-4" />}
        </button>
        <p className="mt-2 text-[0.7rem] leading-relaxed text-muted">
          A proposta fica salva no painel. Depois você abre a versão de impressão e salva como PDF
          ou envia pelo WhatsApp.
        </p>
      </aside>
    </div>
  );
}
