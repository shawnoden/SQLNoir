# Stripe PPP-Based Price Localization

## Problem
$14.99 is unaffordable in many countries. Without localized pricing, SQLNoir loses potential customers in India, Brazil, Southeast Asia, Eastern Europe, Africa, and Latin America.

## Solution
Create country-specific Stripe Checkout prices using PPP (Purchasing Power Parity) based on GDP per capita. 124 countries across 13 price tiers ($1.99-$14.99).

## Architecture

### Country Detection
Use Stripe's built-in geolocation — no custom IP lookup needed. The checkout API route reads the user's country from:
1. `req.headers.get("x-vercel-ip-country")` (Vercel provides this automatically)
2. Fallback: US pricing

### Price Resolution Flow
```
User clicks "Get License" → PaywallModal shows localized price
→ POST /api/checkout with country code
→ Route looks up price from PRICE_MAP constant
→ Creates Stripe Checkout with correct amount + currency
→ User pays in local currency where possible
```

### Implementation Approach
**One Stripe Product, multiple Prices** — create one Price per tier in Stripe (13 prices total). Map each country to a tier. The checkout route selects the correct Price ID based on country.

### Price Tiers (13 tiers, 124 countries)

| Tier | Price | Countries (sample) |
|------|-------|-------------------|
| 1 | $1.99 | India, Pakistan, Bangladesh, Ethiopia, Nepal, Myanmar |
| 2 | $2.49 | Nigeria, Kenya, Ghana, Tanzania, Uganda, Cambodia |
| 3 | $2.99 | Philippines, Vietnam, Egypt, Uzbekistan, Morocco |
| 4 | $3.99 | Brazil, Colombia, Peru, Ukraine, Indonesia, South Africa |
| 5 | $4.49 | China, Mexico, Thailand, Serbia, Bulgaria, Ecuador |
| 6 | $4.99 | Argentina, Malaysia, Costa Rica, Montenegro, Turkey |
| 7 | $5.99 | Hungary, Croatia, Romania, Chile, Poland, Latvia |
| 8 | $6.99 | Czechia, Estonia, Lithuania, Portugal, Greece, Slovakia |
| 9 | $7.99 | Slovenia, South Korea, Spain, Italy, Japan, New Zealand |
| 10 | $8.99 | France, UK, Israel, Finland, Belgium |
| 11 | $9.99 | Germany, Canada, Austria, Sweden |
| 12 | $11.99 | Australia, Netherlands, Denmark, Iceland |
| 13 | $14.99 | US, Norway, Switzerland, Luxembourg, Ireland, Singapore, Qatar, UAE |

### Currency
All prices in USD. Stripe handles FX conversion display. This avoids creating 100+ currency-specific prices and simplifies accounting.

### PaywallModal Price Display
The modal fetches the user's localized price via a new API route `GET /api/price?country=XX` that returns `{price: "$4.49", tier: 5}`. This is called on modal open using the country from a cookie or Vercel header.

### Files to Create/Modify

1. **`src/lib/ppp-prices.ts`** — PRICE_MAP constant mapping country codes to {priceId, amount, tier}
2. **`src/app/api/checkout/route.ts`** — Read country from Vercel header, look up correct priceId
3. **`src/app/api/price/route.ts`** — NEW: Returns localized price for display in PaywallModal
4. **`src/components/PaywallModal.tsx`** — Fetch and display localized price on open
5. **Stripe Dashboard** — Create 13 Price objects on the existing Detective License product

### Stripe Price Creation
Create prices via Stripe CLI:
```bash
stripe prices create --product prod_XXX --unit-amount 199 --currency usd -d "metadata[tier]=1" -d "metadata[label]=tier-1-1.99"
# ... repeat for all 13 tiers
```

## Edge Cases
- **VPN users**: They get the price for the VPN exit country. Acceptable — Stripe does this too.
- **Unknown country**: Falls back to $14.99 (US pricing).
- **Country changes between price display and checkout**: Checkout uses server-detected country, not client-cached. Minor price mismatch possible but unlikely.

## Risks
- **Price arbitrage**: Someone could VPN to India to get $1.99. Acceptable for a $15 product — the volume gain from fair pricing far outweighs edge-case abuse.
- **Stripe fee floor**: Stripe charges $0.30 + 2.9% per transaction. At $1.99, fees eat ~18%. Still profitable for a digital product with zero marginal cost.
