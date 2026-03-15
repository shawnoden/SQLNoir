"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Lock, Shield, Award, Heart } from "lucide-react";
import {
  trackPaywallShown,
  trackPaywallCtaClicked,
  trackPaywallDismissed,
} from "@/lib/posthog";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  triggerLocation: string;
  isSignedIn: boolean;
  onSignInRequired: () => void;
}

export function PaywallModal({
  isOpen,
  onClose,
  caseId,
  triggerLocation,
  isSignedIn,
  onSignInRequired,
}: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      trackPaywallShown(caseId, triggerLocation);
    }
  }, [isOpen, caseId, triggerLocation]);

  const handleCtaClick = async () => {
    trackPaywallCtaClicked(caseId);

    if (!isSignedIn) {
      onSignInRequired();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    trackPaywallDismissed(caseId);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border-2 border-amber-700/50 shadow-2xl">
        {/* Dark noir header with texture */}
        <div className="paper-texture-dark px-6 py-5 text-center relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-amber-200/70 hover:text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-3">
            <div className="bg-amber-400/20 p-3 rounded-full border border-amber-400/30">
              <Shield className="w-8 h-8 text-amber-300" />
            </div>
          </div>
          <h2 className="font-detective text-2xl text-amber-100 mb-1">
            Upgrade to Detective License
          </h2>
          <p className="text-amber-300/80 text-sm font-detective">
            The deeper mysteries await, detective...
          </p>
        </div>

        {/* Benefits section on paper texture */}
        <div className="paper-texture px-6 py-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-amber-100 p-1.5 rounded-lg border border-amber-300">
                <Lock className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-detective text-amber-900 text-sm">
                  Unlock 4 advanced cases
                </p>
                <p className="text-amber-700/70 text-xs mt-0.5">
                  Intermediate &amp; advanced investigations with complex SQL
                  challenges
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-amber-100 p-1.5 rounded-lg border border-amber-300">
                <Award className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-detective text-amber-900 text-sm">
                  Earn exclusive XP badges
                </p>
                <p className="text-amber-700/70 text-xs mt-0.5">
                  Show off your SQL mastery with licensed-only achievements
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-amber-100 p-1.5 rounded-lg border border-amber-300">
                <Heart className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-detective text-amber-900 text-sm">
                  Support indie development
                </p>
                <p className="text-amber-700/70 text-xs mt-0.5">
                  Help us build more cases and keep SQLNoir growing
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-5">
            <div className="inline-flex items-baseline gap-1">
              <span className="font-detective text-3xl text-amber-900">
                $14.99
              </span>
            </div>
            <p className="text-amber-700/70 text-xs mt-1 font-detective">
              One-time payment &mdash; forever yours
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleCtaClick}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-detective text-lg text-amber-50
                     bg-amber-800 hover:bg-amber-700 transition-colors
                     border-2 border-amber-900/50 shadow-lg hover:shadow-xl
                     flex items-center justify-center gap-2
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-5 h-5" />
                {isSignedIn ? "Get Your License" : "Sign In to Get Your License"}
              </>
            )}
          </button>

          {/* Secondary action */}
          <button
            onClick={handleDismiss}
            className="w-full mt-3 py-2 text-center text-amber-700/70 hover:text-amber-800
                     text-sm font-detective transition-colors"
          >
            Continue with free cases
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
