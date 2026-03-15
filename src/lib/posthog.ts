import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key) return;

  posthog.init(key, {
    api_host: host || "https://us.i.posthog.com",
    capture_pageview: false,
    loaded: () => {
      initialized = true;
    },
  });
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
