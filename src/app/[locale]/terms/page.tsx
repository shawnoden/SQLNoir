import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/terms", locale),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/terms",
      images: [
        {
          url: "/open-graph-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/open-graph-image.png"],
    },
  };
}

export default async function TermsPage() {
  const tNav = await getTranslations("nav");

  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: tNav("home"), href: "/" },
          { label: tNav("cases"), href: "/cases", activeMatch: "/cases" },
          { label: tNav("journal"), href: "/blog", activeMatch: ["/blog"] },
          { label: tNav("help"), href: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <h1 className="font-detective text-4xl text-amber-900">
            Terms of Service
          </h1>
          <p className="text-amber-800">Last updated: March 15, 2026</p>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Overview
            </h2>
            <p className="text-amber-800 leading-relaxed">
              SQLNoir is an interactive SQL learning platform where you solve
              detective cases using SQL queries. By using SQLNoir, you agree to
              these terms. SQLNoir is provided &quot;as is&quot; without warranty of any
              kind.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Accounts and Access
            </h2>
            <p className="text-amber-800 leading-relaxed">
              You can use SQLNoir without creating an account. Signing in with
              Google OAuth allows you to track progress across devices.
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>
                <strong>Free tier:</strong> Access to 2 introductory cases.
              </li>
              <li>
                <strong>Detective License:</strong> A one-time purchase of
                $14.99 that unlocks all cases.
              </li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Payments
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Payments are processed securely by{" "}
              <a
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:text-amber-900 underline"
              >
                Stripe
              </a>
              . The Detective License is a one-time digital purchase. Because it
              is a digital product with immediate access, refunds are generally
              not offered. If you experience any issues, please contact us and
              we&apos;ll do our best to help.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              User-Generated Content
            </h2>
            <p className="text-amber-800 leading-relaxed">
              SQL queries you write in SQLNoir are executed locally in your
              browser using SQL.js. We do not store, collect, or share your
              queries.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Acceptable Use
            </h2>
            <p className="text-amber-800 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>Use automated tools to scrape or crawl SQLNoir content.</li>
              <li>Attempt to disrupt or abuse the service.</li>
              <li>
                Redistribute or resell case content without permission.
              </li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Intellectual Property
            </h2>
            <p className="text-amber-800 leading-relaxed">
              All cases, stories, characters, and code on SQLNoir are copyright
              of SQLNoir and its creator. You may not reproduce or redistribute
              this content without written permission.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Termination
            </h2>
            <p className="text-amber-800 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              these terms. If your account is terminated, you will lose access to
              any purchased content.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Changes to These Terms
            </h2>
            <p className="text-amber-800 leading-relaxed">
              We may update these terms from time to time. Continued use of
              SQLNoir after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">Contact</h2>
            <p className="text-amber-800 leading-relaxed">
              Questions about these terms? Contact us at{" "}
              <a
                href="mailto:hristoapps@gmail.com"
                className="text-amber-700 hover:text-amber-900 underline"
              >
                hristoapps@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
