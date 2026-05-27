import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const routes = ["", "/recursos", "/sobre", "/precos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${env.appUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route ? "monthly" : "weekly",
    priority: route ? 0.7 : 1,
  }));
}
