"use client";

import Script from "next/script";

const STRIPE_PRICING_TABLE_ID = "prctbl_1TVC0LGOS4749DyqvOBnRPsE";
const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51OWQ84GOS4749Dyqe8XfVcieOSAbPC7wPtaLn9z4NhsFCvrst7Lyl82fx56PSeAAvIWGVvEY6fzTA3HIcD4sz4PP006o2yD0xm";

export default function StripePricingTable() {
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<stripe-pricing-table pricing-table-id="${STRIPE_PRICING_TABLE_ID}" publishable-key="${STRIPE_PUBLISHABLE_KEY}"></stripe-pricing-table>`,
        }}
      />
    </>
  );
}
