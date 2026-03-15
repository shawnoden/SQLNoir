import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const getStripe = () => {
  if (!publishableKey) {
    console.warn("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
    return null;
  }
  return loadStripe(publishableKey);
};
