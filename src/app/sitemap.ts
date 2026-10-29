import type { MetadataRoute } from "next";
import { company } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${company.siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${company.siteUrl}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${company.siteUrl}/orcamento`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${company.siteUrl}/acompanhar`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
