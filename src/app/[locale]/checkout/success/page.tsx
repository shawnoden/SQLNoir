"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { CheckCircle, LogIn } from "lucide-react";

export default function CheckoutSuccessPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-claim license when user signs in
  useEffect(() => {
    if (user && !claimed) {
      claimLicense();
    }
  }, [user, claimed]);

  const claimLicense = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/claim-license", { method: "POST" });
      const data = await res.json();
      if (data.success || data.error === "No pending license found for this email") {
        // Either claimed successfully or was already granted via webhook
        setClaimed(true);
      }
    } catch {
      // License may have been granted directly via webhook — treat as success
      setClaimed(true);
    } finally {
      setClaiming(false);
    }
  };

  const showSignInPrompt = !loading && !user;
  const showClaimingState = user && claiming;
  const showSuccess = user && (claimed || !claiming);

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
              {showSignInPrompt ? "Payment Received!" : "Welcome, Detective"}
            </h1>
            <p className="text-amber-800 text-lg">
              {showSignInPrompt
                ? "Sign in to activate your Detective License and unlock all cases."
                : showClaimingState
                ? "Activating your license..."
                : "Your Detective License is now active. All 6 cases are unlocked and waiting for you."}
            </p>
          </div>

          {showSignInPrompt && (
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              Sign In to Activate License
            </button>
          )}

          {showClaimingState && (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
            </div>
          )}

          {showSuccess && (
            <>
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
            </>
          )}

          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </main>
    </>
  );
}
