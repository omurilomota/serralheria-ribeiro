import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";

const defaultPortfolio = [
  {
    title: "Portão deslizante com automação",
    category: "Portões",
    description: "Portão em aço carbono com pintura eletrostática preta e motor deslizante.",
    imageUrl: "https://images.pexels.com/photos/12870099/pexels-photo-12870099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Junqueirópolis - SP",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "Calha em alumínio sob medida",
    category: "Calhas",
    description: "Calha de alumínio com caimento calculado e acabamento em telhado de concreto.",
    imageUrl: "https://images.pexels.com/photos/13307118/pexels-photo-13307118.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Junqueirópolis - SP",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "Portão social residencial",
    category: "Portões",
    description: "Portão social com gradeamento e pintura em tom cobre, fechamento completo da fachada.",
    imageUrl:
      "https://images.pexels.com/photos/12870099/pexels-photo-12870099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Residência - Junqueirópolis",
    featured: true,
    sortOrder: 3,
  },
  {
    title: "Rufos e proteção de telhado",
    category: "Calhas",
    description: "Rufo de vedação no encontro do telhado com a parede, evitando infiltração.",
    imageUrl:
      "https://images.pexels.com/photos/13793186/pexels-photo-13793186.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Junqueirópolis - SP",
    featured: false,
    sortOrder: 4,
  },
  {
    title: "Solda em estrutura metálica",
    category: "Estruturas",
    description: "Reforço estrutural e solda em galpão comercial, com acabamento lixado.",
    imageUrl:
      "https://images.pexels.com/photos/5845964/pexels-photo-5845964.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Pq. Industrial - Junqueirópolis",
    featured: true,
    sortOrder: 5,
  },
  {
    title: "Cobertura de galpão",
    category: "Estruturas",
    description: "Estrutura metálica e cobertura para área de carga de comércio.",
    imageUrl:
      "https://images.pexels.com/photos/26872298/pexels-photo-26872298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Comércio - região",
    featured: false,
    sortOrder: 6,
  },
  {
    title: "Reforma de carreta",
    category: "Carretas",
    description: "Reforma de chassi, assoalho e soldas em carreta de carga.",
    imageUrl:
      "https://images.pexels.com/photos/36003984/pexels-photo-36003984.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Oficina Ribeiro",
    featured: false,
    sortOrder: 7,
  },
  {
    title: "Grades de proteção",
    category: "Grades",
    description: "Grades sob medida para janelas e muros, com fixação reforçada.",
    imageUrl:
      "https://images.pexels.com/photos/10372450/pexels-photo-10372450.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Residencial - Junqueirópolis",
    featured: false,
    sortOrder: 8,
  },
  {
    title: "Condutores de águas pluviais",
    category: "Calhas",
    description: "Descidas de água dimensionadas para escoar sem manchar a fachada.",
    imageUrl:
      "https://images.pexels.com/photos/13307118/pexels-photo-13307118.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
    location: "Junqueirópolis - SP",
    featured: false,
    sortOrder: 9,
  },
];

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(portfolioItems);

  if ((row?.count ?? 0) === 0) {
    await db.insert(portfolioItems).values(defaultPortfolio).onConflictDoNothing();
    return;
  }

  // Repair rows that still point to the old local image files, keeping any
  // admin edits to other fields intact by only updating the image URL.
  for (const item of defaultPortfolio) {
    await db
      .update(portfolioItems)
      .set({ imageUrl: item.imageUrl })
      .where(eq(portfolioItems.title, item.title));
  }
}

/**
 * Seeds the portfolio once per server process. Safe to call from any
 * server component or route handler.
 */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      console.error("[seed] não foi possível popular o portfólio:", error);
    });
  }
  await seedPromise;
}
