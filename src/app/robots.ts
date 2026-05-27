import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/recursos", "/sobre", "/precos", "/login", "/cadastro"],
        disallow: [
          "/dashboard",
          "/clientes",
          "/agenda",
          "/atendimentos",
          "/produtos",
          "/financeiro",
          "/auth",
        ],
      },
    ],
    sitemap: `${env.appUrl}/sitemap.xml`,
  };
}
