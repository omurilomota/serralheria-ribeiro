CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"protocol" varchar(24) NOT NULL,
	"name" varchar(160) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"city" varchar(120) DEFAULT 'Junqueirópolis' NOT NULL,
	"address" varchar(220),
	"service_id" varchar(80) NOT NULL,
	"service_name" varchar(160) NOT NULL,
	"material" varchar(80),
	"meters" integer DEFAULT 0 NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"urgency" varchar(40) DEFAULT 'sem-pressa' NOT NULL,
	"notes" text,
	"photo_url" text,
	"estimate_min_cents" integer DEFAULT 0 NOT NULL,
	"estimate_max_cents" integer DEFAULT 0 NOT NULL,
	"status" varchar(40) DEFAULT 'novo' NOT NULL,
	"source" varchar(60) DEFAULT 'site' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_protocol_unique" UNIQUE("protocol")
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"category" varchar(60) NOT NULL,
	"description" varchar(260),
	"image_url" text NOT NULL,
	"location" varchar(120),
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"status" varchar(40) NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(24) NOT NULL,
	"client_name" varchar(160) NOT NULL,
	"client_phone" varchar(40),
	"title" varchar(200) NOT NULL,
	"address" varchar(220),
	"status" varchar(40) DEFAULT 'medicao' NOT NULL,
	"forecast" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" varchar(32) NOT NULL,
	"client_name" varchar(160) NOT NULL,
	"client_phone" varchar(40),
	"client_city" varchar(120),
	"client_address" varchar(220),
	"service_title" varchar(200) DEFAULT 'Orçamento' NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"subtotal_cents" integer DEFAULT 0 NOT NULL,
	"discount_cents" integer DEFAULT 0 NOT NULL,
	"total_cents" integer DEFAULT 0 NOT NULL,
	"validity_days" integer DEFAULT 10 NOT NULL,
	"status" varchar(40) DEFAULT 'enviado' NOT NULL,
	"lead_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quotations_number_unique" UNIQUE("number")
);
