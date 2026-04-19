import "server-only";

import { getStripeServer } from "@/shared/lib/stripe-server";

export async function createPaymentIntent(): Promise<string> {
  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2900,
    currency: "usd",
    description: "Pro Plan — Stripe Elements demo (test mode)",
    metadata: {
      product_name: "Pro Plan",
      demo: "elements",
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  if (!paymentIntent.client_secret) {
    throw new Error("PaymentIntent did not return a client secret");
  }
  return paymentIntent.client_secret;
}
