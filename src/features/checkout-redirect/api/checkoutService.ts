import "server-only";

import { requireAppUrl } from "@/shared/config/env";
import { getStripeServer } from "@/shared/lib/stripe-server";

export async function createCheckoutSession(): Promise<string> {
  const baseUrl = requireAppUrl();
  const stripe = getStripeServer();
  const session = await stripe.checkout.sessions.create({
    mode: "payment", // or "subscription"
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Pro Plan",
          },
          unit_amount: 1900,
          //  (----if you want to create a subscription, uncomment the following block----)
          // recurring: {
          //   interval: "month", // day, week, month, year
          //   interval_count: 1, // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (optional)
          //   trial_period_days: 0, // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (optional)
          //   trial_period_unit: "day", // day, week, month, year (optional)
          //   trial_period_interval_count: 0, // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (optional)
          //   trial_period_interval_unit: "day", // day, week, month, year (optional)
          //   trial_period_interval_count: 0, // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (optional)
          // },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
  });
  if (!session.url) {
    throw new Error("Checkout session did not return a URL");
  }
  return session.url;
}
