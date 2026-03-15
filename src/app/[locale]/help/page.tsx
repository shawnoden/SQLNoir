import type { Metadata } from "next";
import Script from "next/script";
import { HelpPageClient } from "@/components/HelpPageClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("help.metadata");

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/help",
    },
    openGraph: {
      url: "https://www.sqlnoir.com/help",
    },
  };
}

export default async function HelpPage() {
  const t = await getTranslations("help");
  const tNav = await getTranslations("nav");

  const faqItems = [
    {
      question: t("faqClueQ"),
      answer: t("faqClueA"),
    },
    {
      question: t("faqBugQ"),
      answer: t("faqBugA"),
    },
    {
      question: t("faqContributeQ"),
      answer: t("faqContributeA"),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tNav("home"),
            item: "https://www.sqlnoir.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: tNav("help"),
            item: "https://www.sqlnoir.com/help",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "ContactPage",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://www.sqlnoir.com/help",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: "https://discord.gg/rMQRwrRYHH",
            name: t("discordTitle"),
          },
          {
            "@type": "ContactPoint",
            contactType: "technical support",
            url: "https://github.com/hristo2612/SQLNoir/issues",
            name: t("githubTitle"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <HelpPageClient />
      <Script
        id="help-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
