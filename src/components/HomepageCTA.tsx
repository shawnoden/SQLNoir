"use client";

import { useEffect, useState } from "react";
import { TrackedLink } from "./TrackedLink";
import posthog from "posthog-js";

const CTA_COPY_MAP: Record<string, string> = {
  "start-investigating": "Start Investigating",
  "solve-first-case": "Solve Your First Case",
  "begin-mystery": "Begin the Mystery",
};

interface HomepageCTAProps {
  ctaId: string;
  source: string;
  className: string;
}

export function HomepageCTA({ ctaId, source, className }: HomepageCTAProps) {
  const [ctaText, setCtaText] = useState("Start Investigation");

  useEffect(() => {
    const flag = posthog.getFeatureFlag("homepage-cta-copy");
    if (typeof flag === "string" && CTA_COPY_MAP[flag]) {
      setCtaText(CTA_COPY_MAP[flag]);
    }
  }, []);

  return (
    <TrackedLink
      href="/cases"
      event="cta_click"
      eventProps={{
        cta_id: ctaId,
        page: "/",
        source,
        cta_variant: posthog.getFeatureFlag("homepage-cta-copy") as string,
      }}
      className={className}
    >
      {ctaText}
    </TrackedLink>
  );
}
