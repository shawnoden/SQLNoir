"use client";

import { Link } from "@/i18n/navigation";

export function Footer() {
  return (
    <footer className="bg-amber-100 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-amber-800">
        <span>&copy; 2026 SQLNoir</span>
        <nav className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-amber-900 underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-amber-900 underline underline-offset-2"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="hover:text-amber-900 underline underline-offset-2"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
