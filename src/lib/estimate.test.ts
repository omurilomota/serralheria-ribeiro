import { describe, expect, it } from "vitest";
import { calculateEstimate, parseUnits, resolveOption } from "./estimate";
import { formatBRL, formatBRLRange, parseMeters, whatsappNumber } from "./format";
import { buildLeadMessage } from "./lead-message";
import { services } from "./config";

const portao = services.find((service) => service.id === "portoes")!;
const calha = services.find((service) => service.id === "calhas")!;

describe("resolveOption", () => {
  it("encontra a opção pelo id", () => {
    expect(resolveOption(portao, "aluminio").label).toBe("Alumínio");
  });

  it("cai na primeira opção quando o id não existe", () => {
    expect(resolveOption(portao, "inexistente")).toBe(portao.options[0]);
  });
});

describe("calculateEstimate", () => {
  it("multiplica a faixa pela metragem e arredonda para R$ 10", () => {
    const result = calculateEstimate(portao, "aluminio", 10);
    expect(result.units).toBe(10);
    expect(result.minCents).toBe(850000);
    expect(result.maxCents).toBe(1380000);
    expect(result.minCents % 1000).toBe(0);
  });

  it("usa a primeira opção quando o id é inválido", () => {
    expect(calculateEstimate(calha, "xyz", 5).option).toBe(calha.options[0]);
  });

  it("zera unidades inválidas em vez de gerar NaN", () => {
    for (const units of [0, -3, Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = calculateEstimate(calha, "aluminio", units);
      expect(result.units).toBe(0);
      expect(result.minCents).toBe(0);
      expect(result.maxCents).toBe(0);
    }
  });
});

describe("parseUnits / parseMeters", () => {
  it("aceita vírgula e ponto decimal", () => {
    expect(parseUnits("6,3")).toBe(6.3);
    expect(parseUnits("6.3")).toBe(6.3);
    expect(parseMeters("12,5 m")).toBe(12.5);
  });

  it("rejeita zero, negativo e texto", () => {
    expect(parseUnits("0")).toBe(0);
    expect(parseUnits("-2")).toBe(0);
    expect(parseUnits("abc")).toBe(0);
    expect(parseMeters(null)).toBe(0);
  });

  it("limita a 100.000 unidades", () => {
    expect(parseUnits("999999")).toBe(100000);
  });
});

describe("formatadores", () => {
  it("formata moeda e faixa", () => {
    const plain = (value: string) => value.replace(/\u00a0/g, " ");
    expect(plain(formatBRL(620000))).toBe("R$ 6.200,00");
    expect(plain(formatBRLRange(620000, 980000))).toBe("R$ 6.200,00 a R$ 9.800,00");
  });

  it("normaliza o WhatsApp com DDI", () => {
    expect(whatsappNumber("(18) 99999-0116")).toBe("5518999990116");
    expect(whatsappNumber("5518999990116")).toBe("5518999990116");
  });
});

describe("buildLeadMessage", () => {
  it("inclui protocolo, serviço, faixa e contato", () => {
    const message = buildLeadMessage({
      protocol: "SR-ABC123",
      name: "João",
      city: "Junqueirópolis",
      address: "Rua A, 10",
      serviceName: portao.name,
      optionLabel: "Alumínio",
      measureLabel: portao.measureLabel,
      units: 6.3,
      urgencyLabel: "Nas próximas semanas",
      notes: "Portão da frente",
      minCents: 535500,
      maxCents: 869400,
    });

    expect(message).toContain("SR-ABC123");
    expect(message).toContain(portao.name);
    expect(message).toContain("Alumínio");
    const plain = message.replace(/\u00a0/g, " ");
    expect(plain).toContain("6,3 área do portão (m²)");
    expect(plain).toContain("R$ 5.355,00 a R$ 8.694,00");
    expect(plain).toContain("João");
    expect(message).toContain("Rua A, 10");
    expect(message).toContain("Portão da frente");
  });

  it("omite endereço e observações vazios", () => {
    const message = buildLeadMessage({
      protocol: "SR-X",
      name: "Ana",
      city: "Dracena",
      address: "   ",
      serviceName: calha.name,
      optionLabel: calha.options[0].label,
      measureLabel: calha.measureLabel,
      units: 10,
      urgencyLabel: "Sem pressa",
      notes: "",
      minCents: 78000,
      maxCents: 108000,
    });

    expect(message).not.toContain("*Endereço:*");
    expect(message).not.toContain("*Observações:*");
    expect(message).toContain("Ana");
  });
});
