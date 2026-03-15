import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set — Stripe integration disabled");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID || "price_1TB3yzGn1qZYmxbB4k6Z6mfu",
  publishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
} as const;
