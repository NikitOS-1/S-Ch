import "server-only";

import { requireAppUrl } from "@/shared/config/env";
import { getStripeServer } from "@/shared/lib/stripe-server";

export async function createCheckoutSession(): Promise<string> {
  const baseUrl = requireAppUrl();
  const stripe = getStripeServer();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Pro Plan",
          },
          unit_amount: 2900,
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
