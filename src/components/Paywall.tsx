"use client";

import { useEffect, useState } from "react";
import { X, Lock, Sparkles } from "lucide-react";
import posthog from "posthog-js";

const PRICING_MAP: Record<string, string> = {
  "9-99": "$9.99",
  "14-99": "$14.99",
  "19-99": "$19.99",
};

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  caseSlug: string;
}

export function Paywall({ isOpen, onClose, caseSlug }: PaywallProps) {
  const [price, setPrice] = useState("$14.99");

  useEffect(() => {
    const flag = posthog.getFeatureFlag("pricing-display");
    if (typeof flag === "string" && PRICING_MAP[flag]) {
      setPrice(PRICING_MAP[flag]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCtaClick = () => {
    posthog.capture("paywall_cta_clicked", {
      case_slug: caseSlug,
      price,
      pricing_variant: posthog.getFeatureFlag("pricing-display"),
      placement_variant: posthog.getFeatureFlag("paywall-placement"),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-amber-50 border border-amber-200 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-600 hover:text-amber-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full">
            <Sparkles className="w-7 h-7 text-amber-700" />
          </div>
          <h2 className="font-detective text-2xl text-amber-900">
            Unlock All Cases
          </h2>
          <p className="text-amber-700">
            You&apos;ve proven your detective skills. Upgrade to access
            intermediate and advanced cases, plus future investigations.
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-6 text-center space-y-2">
          <p className="text-amber-600 text-sm font-medium uppercase tracking-wide">
            Detective Pro
          </p>
          <p className="font-detective text-4xl text-amber-900">{price}</p>
          <p className="text-amber-600 text-sm">per month</p>
        </div>

        <ul className="space-y-2 text-amber-800 text-sm">
          <li className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            All intermediate &amp; advanced cases
          </li>
          <li className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            New cases as they launch
          </li>
          <li className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            Detailed solution explanations
          </li>
        </ul>

        <button
          onClick={handleCtaClick}
          className="w-full py-3 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-colors duration-200 shadow-lg"
        >
          Upgrade Now
        </button>

        <button
          onClick={onClose}
          className="w-full text-center text-amber-600 hover:text-amber-800 text-sm"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
