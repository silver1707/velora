import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Velora",
    short_name: "Velora",
    description:
      "Sistema premium para cabeleireiras organizarem clientes, agenda, atendimentos, produtos e financeiro.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050207",
    theme_color: "#A866FF",
    categories: ["business", "productivity"],
    lang: "pt-BR",
    id: env.appUrl,
    icons: [
      {
        src: "/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/brand/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
