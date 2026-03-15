import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(req: NextRequest) {
  try {
    // User must be signed in to claim
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to claim your license" },
        { status: 401 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const userEmail = session.user.email;

    // Check for pending license matching this email
    const { data: pending, error: fetchError } = await supabaseAdmin
      .from("pending_licenses")
      .select("*")
      .eq("email", userEmail)
      .is("claimed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !pending) {
      return NextResponse.json(
        { error: "No pending license found for this email" },
        { status: 404 }
      );
    }

    // Grant the license
    const { error: updateError } = await supabaseAdmin
      .from("user_info")
      .update({
        has_license: true,
        license_purchased_at: pending.created_at,
        stripe_customer_id: pending.stripe_customer_id,
        stripe_session_id: pending.stripe_session_id,
      })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Failed to grant license:", updateError);
      return NextResponse.json(
        { error: "Failed to grant license" },
        { status: 500 }
      );
    }

    // Mark pending license as claimed
    await supabaseAdmin
      .from("pending_licenses")
      .update({
        claimed_at: new Date().toISOString(),
        claimed_by: session.user.id,
      })
      .eq("id", pending.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Claim license error:", error);
    return NextResponse.json(
      { error: "Failed to claim license" },
      { status: 500 }
    );
  }
}
