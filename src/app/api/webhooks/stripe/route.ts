import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    if (!session.id) {
      console.error("Webhook received session without id");
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    if (userId) {
      // Idempotency check: skip if this session was already processed
      const { data: existing } = await supabaseAdmin
        .from("user_info")
        .select("stripe_session_id")
        .eq("id", userId)
        .single();

      if (existing?.stripe_session_id === session.id) {
        console.log(`License already granted for session ${session.id}, skipping`);
        return NextResponse.json({ received: true });
      }

      // Signed-in purchase: grant license immediately
      const { error } = await supabaseAdmin
        .from("user_info")
        .update({
          has_license: true,
          license_purchased_at: new Date().toISOString(),
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_session_id: session.id,
        })
        .eq("id", userId);

      if (error) {
        console.error("Failed to update license:", error);
        return NextResponse.json(
          { error: "Failed to update license" },
          { status: 500 }
        );
      }

      console.log(`License granted to user ${userId}`);
    } else {
      // Idempotency check: skip if this session was already stored
      const { data: existingPending } = await supabaseAdmin
        .from("pending_licenses")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existingPending) {
        console.log(`Pending license already stored for session ${session.id}, skipping`);
        return NextResponse.json({ received: true });
      }

      const email = session.customer_details?.email || session.customer_email;
      if (!email) {
        console.error("Webhook received session without customer email");
        return NextResponse.json(
          { error: "Missing customer email" },
          { status: 400 }
        );
      }

      // Anonymous purchase: store as pending license to be claimed after sign-in
      const { error } = await supabaseAdmin
        .from("pending_licenses")
        .insert({
          email,
          stripe_session_id: session.id,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Failed to store pending license:", error);
        return NextResponse.json(
          { error: "Failed to store pending license" },
          { status: 500 }
        );
      }

      console.log(`Pending license stored for email: ${email}`);
    }
  }

  return NextResponse.json({ received: true });
}
