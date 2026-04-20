import "server-only";

import { requireAppUrl } from "@/shared/config/env";
import { getStripeServer } from "@/shared/lib/stripe-server";
import type { CreateCheckoutSessionRequest } from "../model/types";

export async function createCheckoutSession(
  params: CreateCheckoutSessionRequest
): Promise<string> {
  const normalizedAmountCents = Math.max(50, Math.floor(params.amountCents));
  const normalizedQuantity = Math.max(1, Math.floor(params.quantity));
  const baseUrl = requireAppUrl();
  const stripe = getStripeServer();
  const isSubscription = params.mode === "subscription";
  const session = await stripe.checkout.sessions.create({
    mode: params.mode,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: params.productName,
          },
          unit_amount: normalizedAmountCents,
          ...(isSubscription
            ? {
                recurring: {
                  interval: "month" as const,
                },
              }
            : {}),
        },
        quantity: normalizedQuantity,
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
