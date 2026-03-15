import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { caseId } = await req.json();

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price is not configured" },
      { status: 500 }
    );
  }

  const origin = req.headers.get("origin") || "https://www.sqlnoir.com";

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("line_items[0][price]", priceId);
  params.append("line_items[0][quantity]", "1");
  params.append("success_url", `${origin}/cases?license=success`);
  params.append("cancel_url", `${origin}/cases?license=cancelled`);
  if (caseId) {
    params.append("metadata[case_id]", caseId);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: session.error?.message || "Failed to create checkout session" },
      { status: 400 }
    );
  }

  return NextResponse.json({ url: session.url });
}
