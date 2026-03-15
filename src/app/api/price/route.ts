import { NextRequest, NextResponse } from "next/server";
import { getPriceTier } from "@/lib/ppp-prices";

export async function GET(req: NextRequest) {
  const country =
    req.nextUrl.searchParams.get("country") ||
    req.headers.get("x-vercel-ip-country") ||
    "US";

  const { amount, display, tier } = getPriceTier(country);

  return NextResponse.json({ amount, display, tier, country: country.toUpperCase() });
}
