import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
    ssl:
      process.env.DB_SSL === "true" ||
      /supabase\.(co|com)/i.test(process.env.DATABASE_URL ?? "")
        ? { rejectUnauthorized: false }
        : undefined,
  },
});