import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { routing } from "@/i18n/routing";

const siteUrl = "https://www.sqlnoir.com";
const defaultTitle =
  "Interactive SQL Game | Learn SQL by Solving Detective Cases | SQLNoir";
const defaultDescription =
  "SQLNoir is an interactive SQL game where you solve crimes and mysteries using SQL queries. Learn SQL by playing detective in this engaging SQL learning game.";

const localeMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: defaultTitle,
    description: defaultDescription,
    keywords: ["SQL game", "learn SQL", "interactive SQL tutorial", "SQL practice", "SQL detective game"],
  },
  "pt-br": {
    title: "Jogo Interativo de SQL | Aprenda SQL Resolvendo Casos de Detetive | SQLNoir",
    description: "SQLNoir é um jogo interativo de SQL onde você soluciona crimes e mistérios usando consultas SQL. Aprenda SQL sendo detetive neste envolvente jogo de aprendizado.",
    keywords: ["jogo de SQL", "aprender SQL", "tutorial interativo de SQL", "praticar SQL", "jogo de detetive SQL"],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMeta[locale] || localeMeta.en;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: "%s | SQLNoir",
    },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        "pt-BR": "/pt-br",
      },
      types: {
        "application/rss+xml": "/blog/rss.xml",
      },
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: "SQLNoir",
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: "SQLNoir interactive SQL detective game",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/open-graph-image.png"],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-96x96.png",
      apple: "/apple-touch-icon.png",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "SQLNoir",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/open-graph-image.png`,
        width: 1200,
        height: 630,
      },
      sameAs: [
        "https://github.com/hristo2612/SQLNoir",
        "https://discord.gg/rMQRwrRYHH",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "SQLNoir",
      description: defaultDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/cases?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${siteUrl}/#site-navigation`,
      name: ["Home", "Cases", "Blog", "Help"],
      url: [
        `${siteUrl}/`,
        `${siteUrl}/cases`,
        `${siteUrl}/blog`,
        `${siteUrl}/help`,
      ],
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <Script
          id="seo-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
