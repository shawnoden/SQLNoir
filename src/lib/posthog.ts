import posthog from "posthog-js";

export const POSTHOG_KEY = "phc_C9evTEmJ8kVCqV0JMxU8A0sL3PdbBxmG0f3usUq4X5x";
export const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    respect_dnt: true,
  });

  initialized = true;
}

export function trackPaywallShown(caseId: string, triggerLocation: string) {
  posthog.capture("paywall_shown", {
    case_id: caseId,
    trigger_location: triggerLocation,
  });
}

export function trackPaywallCtaClicked(caseId: string) {
  posthog.capture("paywall_cta_clicked", {
    case_id: caseId,
  });
}

export function trackPaywallDismissed(caseId: string) {
  posthog.capture("paywall_dismissed", {
    case_id: caseId,
  });
}

export { posthog };
