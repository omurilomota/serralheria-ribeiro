import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { company, services } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: "Serralheria Ribeiro | Calhas, portões e estruturas em Junqueirópolis - SP",
    template: "%s | Serralheria Ribeiro",
  },
  description:
    "Serralheria e calhas em Junqueirópolis - SP. Portões, grades, estruturas metálicas, carretas, calhas de alumínio e galvanizado. Orçamento rápido pelo WhatsApp: (18) 99999-0116.",
  keywords: [
    "serralheria em Junqueirópolis",
    "calhas em Junqueirópolis",
    "conserto de calha Junqueirópolis",
    "portão automático Junqueirópolis",
    "estrutura metálica Junqueirópolis",
    "rufo e pingadeira",
    "Serralheria Ribeiro",
  ],
  authors: [{ name: company.name }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: company.name,
    title: "Serralheria Ribeiro | Do portão a calha, tudo em um só lugar",
    description:
      "Portões, grades, estruturas metálicas, carretas, calhas e rufos em Junqueirópolis - SP. Medição, fabricação e instalação com equipe própria.",
    images: [{ url: "https://images.pexels.com/photos/12870099/pexels-photo-12870099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", width: 1200, height: 630, alt: "Portão de aço da Serralheria Ribeiro" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121513",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  alternateName: "Serralheria Ribeiro - Calhas em Geral",
  description: company.subSlogan,
  url: company.siteUrl,
  telephone: "+5518999990116",
  image: "https://images.pexels.com/photos/12870099/pexels-photo-12870099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  priceRange: "$$",
  taxID: company.cnpj,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${company.address.street}, ${company.address.district}`,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.zip,
    addressCountry: "BR",
  },
  areaServed: [
    { "@type": "City", name: "Junqueirópolis" },
    { "@type": "City", name: "Dracena" },
    { "@type": "City", name: "Tupi Paulista" },
    { "@type": "City", name: "Pacaembu" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "07:00",
      closes: "12:00",
    },
  ],
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: service.name, description: service.description },
  })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-paper text-ink antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
