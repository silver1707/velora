import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#050207",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(env.appUrl),
  applicationName: "Velora",
  title: {
    default: "Velora | Gestão para cabeleireiras",
    template: "%s | Velora",
  },
  description:
    "Sistema moderno para cabeleireiras organizarem clientes, agenda, atendimentos, produtos usados, histórico técnico e financeiro.",
  keywords: [
    "Velora",
    "sistema para cabeleireira",
    "agenda para salão",
    "gestão de clientes",
    "controle de estoque salão",
    "financeiro para cabeleireira",
  ],
  authors: [{ name: "Velora" }],
  creator: "Velora",
  publisher: "Velora",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.svg", sizes: "180x180" }],
    shortcut: ["/brand/favicon.svg"],
    other: [
      {
        rel: "mask-icon",
        url: "/brand/safari-pinned-tab.svg",
        color: "#A866FF",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: env.appUrl,
    siteName: "Velora",
    title: "Velora | Gestão premium para cabeleireiras",
    description:
      "Clientes, agenda, atendimentos, produtos e financeiro em um sistema elegante para rotina de beleza.",
    images: [
      {
        url: "/marketing/velora-hero.png",
        width: 1792,
        height: 1024,
        alt: "Dashboard Velora em um notebook sobre uma bancada de salão",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velora | Gestão para cabeleireiras",
    description:
      "Sistema moderno para organizar clientes, agenda, serviços, estoque e financeiro.",
    images: ["/marketing/velora-hero.png"],
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
