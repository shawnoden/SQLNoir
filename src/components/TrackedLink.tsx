"use client";

import { Link } from "@/i18n/navigation";
import { track } from "@vercel/analytics/react";
import { capture } from "@/lib/analytics";
import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";

type TrackedLinkProps = ComponentProps<typeof Link> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
    event: string;
    eventProps?: Record<string, string | number | boolean | null>;
    children: ReactNode;
  };

export function TrackedLink({
  event,
  eventProps,
  children,
  className,
  ...rest
}: TrackedLinkProps) {
  return (
    <Link
      {...rest}
      className={className}
      onClick={(e) => {
        if (rest.onClick) {
          rest.onClick(e);
        }
        track(event, eventProps ?? {});
        capture("cta_clicked", {
          cta_name: event,
          location: (eventProps?.source as string) ?? "",
        });
      }}
    >
      {children}
    </Link>
  );
}
