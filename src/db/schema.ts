import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export type QuoteItem = {
  description: string;
  quantity: number;
  unitCents: number;
};

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  protocol: varchar("protocol", { length: 24 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  city: varchar("city", { length: 120 }).notNull().default("Junqueirópolis"),
  address: varchar("address", { length: 220 }),
  serviceId: varchar("service_id", { length: 80 }).notNull(),
  serviceName: varchar("service_name", { length: 160 }).notNull(),
  material: varchar("material", { length: 80 }),
  meters: integer("meters").notNull().default(0),
  quantity: integer("quantity").notNull().default(1),
  urgency: varchar("urgency", { length: 40 }).notNull().default("sem-pressa"),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  estimateMinCents: integer("estimate_min_cents").notNull().default(0),
  estimateMaxCents: integer("estimate_max_cents").notNull().default(0),
  status: varchar("status", { length: 40 }).notNull().default("novo"),
  source: varchar("source", { length: 60 }).notNull().default("site"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quotations = pgTable("quotations", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 32 }).notNull().unique(),
  clientName: varchar("client_name", { length: 160 }).notNull(),
  clientPhone: varchar("client_phone", { length: 40 }),
  clientCity: varchar("client_city", { length: 120 }),
  clientAddress: varchar("client_address", { length: 220 }),
  serviceTitle: varchar("service_title", { length: 200 }).notNull().default("Orçamento"),
  items: jsonb("items").$type<QuoteItem[]>().notNull().default([]),
  notes: text("notes"),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  discountCents: integer("discount_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  validityDays: integer("validity_days").notNull().default(10),
  status: varchar("status", { length: 40 }).notNull().default("enviado"),
  leadId: integer("lead_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 24 }).notNull().unique(),
  clientName: varchar("client_name", { length: 160 }).notNull(),
  clientPhone: varchar("client_phone", { length: 40 }),
  title: varchar("title", { length: 200 }).notNull(),
  address: varchar("address", { length: 220 }),
  status: varchar("status", { length: 40 }).notNull().default("medicao"),
  forecast: varchar("forecast", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectEvents = pgTable("project_events", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  status: varchar("status", { length: 40 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  description: varchar("description", { length: 260 }),
  imageUrl: text("image_url").notNull(),
  location: varchar("location", { length: 120 }),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type Quotation = typeof quotations.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectEvent = typeof projectEvents.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
