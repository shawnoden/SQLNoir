"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-900 text-amber-50 px-4 py-2 flex items-center justify-center gap-3 text-sm"
      style={{ maxHeight: 40 }}
    >
      <span>
        We use cookies for analytics. DNT is respected.
      </span>
      <Link
        href="/privacy"
        className="underline underline-offset-2 hover:text-amber-200"
      >
        Privacy Policy
      </Link>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("cookie-consent", "true");
          setVisible(false);
          window.dispatchEvent(new Event("cookie-consent-granted"));
        }}
        className="px-3 py-0.5 rounded bg-amber-50 text-amber-900 font-medium hover:bg-amber-200 transition-colors"
      >
        OK
      </button>
    </div>
  );
}
