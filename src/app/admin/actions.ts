"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  leads,
  portfolioItems,
  projectEvents,
  projects,
  quotations,
  type QuoteItem,
} from "@/db/schema";
import { ADMIN_COOKIE, adminToken, checkPassword, isAdmin } from "@/lib/admin";
import { projectStatuses, quoteStatuses } from "@/lib/config";
import { formatPhoneBR } from "@/lib/format";
import { uploadPortfolioImage } from "@/lib/storage";

export type ActionResult = { ok: boolean; error?: string; id?: number; number?: string; code?: string };

async function guard(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

function refreshSite() {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/acompanhar");
}

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/admin/login?erro=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function updateLeadStatus(formData: FormData): Promise<void> {
  await guard();
  const leadId = Number(formData.get("leadId"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(leadId) || leadId <= 0) return;
  await db.update(leads).set({ status }).where(eq(leads.id, leadId));
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData): Promise<void> {
  await guard();
  const leadId = Number(formData.get("leadId"));
  if (!Number.isInteger(leadId) || leadId <= 0) return;
  await db.delete(leads).where(eq(leads.id, leadId));
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export async function createQuotation(input: {
  clientName: string;
  clientPhone: string;
  clientCity: string;
  clientAddress: string;
  serviceTitle: string;
  notes: string;
  validityDays: number;
  discountCents: number;
  items: QuoteItem[];
}): Promise<ActionResult> {
  await guard();
  const clientName = input.clientName.trim().slice(0, 150);
  if (clientName.length < 2) return { ok: false, error: "Informe o nome do cliente." };

  const items = (input.items ?? [])
    .map((item) => ({
      description: String(item.description ?? "").trim().slice(0, 200),
      quantity: Math.max(0, Math.min(9999, Number(item.quantity) || 0)),
      unitCents: Math.max(0, Math.round(Number(item.unitCents) || 0)),
    }))
    .filter((item) => item.description.length > 0 && item.quantity > 0);

  if (items.length === 0) {
    return { ok: false, error: "Adicione pelo menos um item com descrição e quantidade." };
  }

  const subtotalCents = items.reduce((total, item) => total + item.quantity * item.unitCents, 0);
  const discountCents = Math.max(0, Math.min(subtotalCents, Math.round(input.discountCents) || 0));
  const totalCents = subtotalCents - discountCents;

  const [counter] = await db.select({ count: sql<number>`count(*)::int` }).from(quotations);
  const number = `ORC-${new Date().getFullYear()}-${String((counter?.count ?? 0) + 1).padStart(4, "0")}`;

  try {
    const [created] = await db
      .insert(quotations)
      .values({
        number,
        clientName,
        clientPhone: formatPhoneBR(input.clientPhone).slice(0, 38),
        clientCity: input.clientCity.trim().slice(0, 110),
        clientAddress: input.clientAddress.trim().slice(0, 200),
        serviceTitle: input.serviceTitle.trim().slice(0, 180) || "Orçamento",
        items,
        notes: input.notes.trim().slice(0, 1500) || null,
        subtotalCents,
        discountCents,
        totalCents,
        validityDays: Math.max(1, Math.min(90, Number(input.validityDays) || 10)),
        status: "enviado",
      })
      .returning({ id: quotations.id, number: quotations.number });

    revalidatePath("/admin/orcamentos");
    revalidatePath("/admin");
    return { ok: true, id: created?.id, number: created?.number };
  } catch (error) {
    console.error("[quotes] falha ao criar orçamento:", error);
    return { ok: false, error: "Não foi possível salvar o orçamento. Tente novamente." };
  }
}

export async function updateQuoteStatus(formData: FormData): Promise<void> {
  await guard();
  const quoteId = Number(formData.get("quoteId"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(quoteId) || !quoteStatuses.some((item) => item.id === status)) return;
  await db.update(quotations).set({ status }).where(eq(quotations.id, quoteId));
  revalidatePath("/admin/orcamentos");
}

export async function createProject(formData: FormData): Promise<void> {
  await guard();
  const clientName = String(formData.get("clientName") ?? "").trim().slice(0, 150);
  const title = String(formData.get("title") ?? "").trim().slice(0, 180);
  if (clientName.length < 2 || title.length < 2) {
    redirect("/admin/projetos?erro=dados");
  }

  let code = String(formData.get("code") ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
  if (!code) {
    code = `SR-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
  }

  try {
    const [created] = await db
      .insert(projects)
      .values({
        code,
        clientName,
        clientPhone: formatPhoneBR(String(formData.get("clientPhone") ?? "")).slice(0, 38) || null,
        title,
        address: String(formData.get("address") ?? "").trim().slice(0, 200) || null,
        status: "medicao",
        forecast: String(formData.get("forecast") ?? "").trim().slice(0, 110) || null,
      })
      .returning({ id: projects.id });

    if (created) {
      await db.insert(projectEvents).values({
        projectId: created.id,
        status: "medicao",
        note: "Projeto cadastrado e medição agendada.",
      });
    }
  } catch (error) {
    console.error("[projects] falha ao criar projeto:", error);
    redirect("/admin/projetos?erro=codigo");
  }

  revalidatePath("/admin/projetos");
  revalidatePath("/acompanhar");
  redirect("/admin/projetos?ok=1");
}

export async function updateProjectStatus(formData: FormData): Promise<void> {
  await guard();
  const projectId = Number(formData.get("projectId"));
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  const forecast = String(formData.get("forecast") ?? "").trim().slice(0, 110);
  if (!Number.isInteger(projectId) || !projectStatuses.some((item) => item.id === status)) return;

  await db
    .update(projects)
    .set({ status, updatedAt: new Date(), ...(forecast ? { forecast } : {}) })
    .where(eq(projects.id, projectId));
  await db.insert(projectEvents).values({
    projectId,
    status,
    note: note || null,
  });

  revalidatePath("/admin/projetos");
  revalidatePath("/acompanhar");
  refreshSite();
}
export async function deleteProject(formData: FormData): Promise<void> {
  await guard();
  const projectId = Number(formData.get("projectId"));
  if (!Number.isInteger(projectId) || projectId <= 0) return;
  await db.delete(projectEvents).where(eq(projectEvents.projectId, projectId));
  await db.delete(projects).where(eq(projects.id, projectId));
  revalidatePath("/admin/projetos");
  revalidatePath("/acompanhar");
  refreshSite();
}

export async function addPortfolioItem(formData: FormData): Promise<void> {
  await guard();
  const title = String(formData.get("title") ?? "").trim().slice(0, 150);
  let imageUrl = String(formData.get("imageUrl") ?? "").trim().slice(0, 800);
  const imageFile = formData.get("imageFile");

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadedUrl = await uploadPortfolioImage(imageFile);
    if (!uploadedUrl) {
      redirect("/admin/portfolio?erro=upload");
    }
    imageUrl = uploadedUrl;
  }

  const category = String(formData.get("category") ?? "").trim().slice(0, 50) || "Portões";
  if (title.length < 2 || imageUrl.length < 6) {
    redirect("/admin/portfolio?erro=dados");
  }

  const [counter] = await db.select({ count: sql<number>`count(*)::int` }).from(portfolioItems);

  await db.insert(portfolioItems).values({
    title,
    category,
    imageUrl,
    description: String(formData.get("description") ?? "").trim().slice(0, 240) || null,
    location: String(formData.get("location") ?? "").trim().slice(0, 110) || null,
    featured: formData.get("featured") === "on",
    sortOrder: (counter?.count ?? 0) + 1,
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect("/admin/portfolio?ok=1");
}

export async function deletePortfolioItem(formData: FormData): Promise<void> {
  await guard();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function togglePortfolioFeatured(formData: FormData): Promise<void> {
  await guard();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  await db
    .update(portfolioItems)
    .set({ featured: sql`not ${portfolioItems.featured}` })
    .where(eq(portfolioItems.id, id));
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
}


