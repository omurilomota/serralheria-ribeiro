import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "node:crypto";

export const ADMIN_COOKIE = "sr_admin_session";

function adminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production" && !password) {
    throw new Error("ADMIN_PASSWORD deve ser definido em produção.");
  }
  return password ?? "ribeiro2026";
}

export function adminToken(): string {
  return createHash("sha256").update(`sr::${adminPassword()}`).digest("hex").slice(0, 40);
}

export function checkPassword(candidate: string): boolean {
  return candidate.trim() === adminPassword();
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

