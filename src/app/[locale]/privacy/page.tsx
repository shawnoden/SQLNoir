import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getTranslations, getLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy.metadata");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates("/privacy", locale),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: "https://www.sqlnoir.com/privacy",
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

export default async function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-amber-800">
            Last updated: March 15, 2026
          </p>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              What We Collect
            </h2>
            <p className="text-amber-800 leading-relaxed">
              When you use SQLNoir, we may collect the following information:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>
                <strong>Account data:</strong> If you sign in with Google OAuth
                (via Supabase), we store your email address and a user ID.
              </li>
              <li>
                <strong>Analytics data:</strong> We use PostHog and Vercel
                Analytics to collect anonymized page views and feature usage
                data.
              </li>
              <li>
                <strong>Cookies:</strong> Authentication session cookies
                (Supabase) and analytics cookies (PostHog).
              </li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              How We Use It
            </h2>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>To provide and improve SQLNoir&apos;s features and content.</li>
              <li>To track your progress, XP, and solved cases (if signed in).</li>
              <li>
                To understand how users interact with the site so we can make it
                better.
              </li>
            </ul>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">Cookies</h2>
            <p className="text-amber-800 leading-relaxed">
              SQLNoir uses the following cookies:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>
                <strong>Authentication cookies</strong> (Supabase) — to keep you
                signed in across sessions.
              </li>
              <li>
                <strong>Analytics cookies</strong> (PostHog) — to collect
                anonymized usage data.
              </li>
            </ul>
            <p className="text-amber-800 leading-relaxed">
              You can disable cookies in your browser settings. Disabling
              authentication cookies will require you to sign in again on each
              visit.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Third-Party Services
            </h2>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>
                <strong>PostHog</strong> (
                <a
                  href="https://posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  posthog.com
                </a>
                ) — product analytics.
              </li>
              <li>
                <strong>Vercel Analytics</strong> — page view analytics.
              </li>
              <li>
                <strong>Supabase</strong> — authentication and database.
              </li>
              <li>
                <strong>Stripe</strong> — payment processing for Detective
                License purchases.
              </li>
            </ul>
            <p className="text-amber-800 leading-relaxed">
              We do not sell your data to any third parties.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Data Retention
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Account data is retained for as long as your account is active.
              Analytics data is retained in anonymized form and automatically
              expires based on PostHog and Vercel&apos;s retention policies.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">
              Your Rights
            </h2>
            <p className="text-amber-800 leading-relaxed">
              Under GDPR and other applicable privacy regulations, you have the
              right to:
            </p>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>
                Opt out of analytics tracking by enabling the{" "}
                <strong>Do Not Track</strong> setting in your browser. PostHog
                respects the DNT signal.
              </li>
            </ul>
            <p className="text-amber-800 leading-relaxed">
              To exercise any of these rights, contact us at the email below.
            </p>
          </section>

          <section className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-3">
            <h2 className="font-detective text-2xl text-amber-900">Contact</h2>
            <p className="text-amber-800 leading-relaxed">
              If you have any questions about this privacy policy or want to
              request data deletion, contact us at{" "}
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
