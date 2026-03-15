import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SQLNoir team.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: "Home", href: "/" },
          { label: "Cases", href: "/cases", activeMatch: "/cases" },
          { label: "Journal", href: "/blog", activeMatch: ["/blog"] },
          { label: "Help", href: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <h1 className="font-detective text-4xl text-amber-900">Contact</h1>
          <p className="text-amber-800 text-lg">
            Have a question, found a bug, or want to say hi? Reach out!
          </p>

          <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-detective text-amber-900 w-20 shrink-0">
                  Email
                </span>
                <a
                  href="mailto:hristoapps@gmail.com"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  hristoapps@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-detective text-amber-900 w-20 shrink-0">
                  GitHub
                </span>
                <a
                  href="https://github.com/hristo2612/SQLNoir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  github.com/hristo2612/SQLNoir
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-detective text-amber-900 w-20 shrink-0">
                  Discord
                </span>
                <a
                  href="https://discord.gg/rMQRwrRYHH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 underline"
                >
                  discord.gg/rMQRwrRYHH
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
