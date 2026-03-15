import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    // Check if user is signed in (optional — not required for checkout)
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const origin = req.headers.get("origin") || "https://www.sqlnoir.com";

    const checkoutParams: any = {
      mode: "payment" as const,
      payment_method_types: ["card" as const],
      line_items: [
        {
          price: STRIPE_CONFIG.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cases`,
      metadata: {} as Record<string, string>,
    };

    if (session?.user) {
      // Signed-in user: attach user_id and pre-fill email
      checkoutParams.customer_email = session.user.email;
      checkoutParams.metadata.user_id = session.user.id;
    } else {
      // Anonymous user: Stripe will collect email, we'll link after sign-in
      checkoutParams.metadata.anonymous = "true";
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
