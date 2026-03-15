import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Purchase Complete",
  description: "Your SQLNoir Detective License is now active.",
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Cases", href: "/cases", activeMatch: "/cases" },
          { label: "Help", href: "/help", activeMatch: "/help" },
        ]}
      />
      <main className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-detective text-3xl text-amber-900">
              Welcome, Detective
            </h1>
            <p className="text-amber-800 text-lg">
              Your Detective License is now active. All 6 cases are unlocked
              and waiting for you.
            </p>
          </div>

          <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm space-y-3">
            <p className="font-detective text-amber-900 text-lg">
              What you get:
            </p>
            <ul className="text-amber-800 text-left space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                Access to all 6 detective cases
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                Beginner through Advanced difficulty
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                Unlimited SQL practice with real schemas
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                XP tracking and progress badges
              </li>
            </ul>
          </div>

          <Link
            href="/cases"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Open the Case Files
          </Link>
        </div>
      </main>
    </>
  );
}
