import type { MetadataRoute } from "next";

const SITE_URL = "https://checkmiete.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/analyse`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/rechner`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/mietrecht`,lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/ueber`,    lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/kontakt`,  lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
  ];
}
