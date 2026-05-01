import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/projects";

const base = "https://marcoaurelio.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const work = getAllSlugs().map((slug) => ({
    url: `${base}/work/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...work,
  ];
}
