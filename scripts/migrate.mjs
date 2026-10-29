import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const useSsl =
  process.env.DB_SSL === "true" ||
  /supabase\.(co|com)/i.test(databaseUrl) ||
  /pooler\.supabase/i.test(databaseUrl);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

const db = drizzle(pool);

try {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("MIGRATIONS APPLIED SUCCESSFULLY");
} catch (error) {
  console.error("MIGRATION FAILED:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
