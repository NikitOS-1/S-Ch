import "server-only";

import { getStripeServer } from "@/shared/lib/stripe-server";
import type { CreatePaymentIntentRequest } from "../model/types";

async function createOneTimePaymentIntent(
  params: CreatePaymentIntentRequest
): Promise<string> {
  const normalizedQuantity = Math.max(1, Math.floor(params.quantity));
  const normalizedAmountCents = Math.max(50, Math.floor(params.amountCents));
  const totalAmountCents = normalizedQuantity * normalizedAmountCents;
  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmountCents,
    currency: "usd",
    description: `${params.productName} — Stripe Elements demo (test mode)`,
    metadata: {
      mode: params.mode,
      product_name: params.productName,
      unit_amount_cents: String(normalizedAmountCents),
      quantity: String(normalizedQuantity),
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

async function createSubscriptionPaymentIntent(
  params: CreatePaymentIntentRequest
): Promise<string> {
  const normalizedQuantity = Math.max(1, Math.floor(params.quantity));
  const normalizedAmountCents = Math.max(50, Math.floor(params.amountCents));
  const stripe = getStripeServer();
  const product = await stripe.products.create({
    name: params.productName,
  });
  const price = await stripe.prices.create({
    currency: "usd",
    unit_amount: normalizedAmountCents,
    recurring: {
      interval: "month",
    },
    product: product.id,
  });
  const customer = await stripe.customers.create({
    description: "Stripe Elements subscription demo customer",
    metadata: {
      demo: "elements",
      mode: params.mode,
    },
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription",
    },
    items: [
      {
        price: price.id,
        quantity: normalizedQuantity,
      },
    ],
    expand: ["latest_invoice.confirmation_secret"],
    metadata: {
      demo: "elements",
      mode: params.mode,
      product_name: params.productName,
      unit_amount_cents: String(normalizedAmountCents),
      quantity: String(normalizedQuantity),
    },
  });
  const latestInvoice = subscription.latest_invoice;
  if (!latestInvoice || typeof latestInvoice === "string") {
    throw new Error("Subscription did not return latest invoice");
  }
  const confirmationSecret = latestInvoice.confirmation_secret;
  if (!confirmationSecret) {
    throw new Error("Subscription invoice did not return confirmation secret");
  }
  if (!confirmationSecret.client_secret) {
    throw new Error("Subscription confirmation secret did not return a client secret");
  }
  return confirmationSecret.client_secret;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentRequest
): Promise<string> {
  if (params.mode === "subscription") {
    return createSubscriptionPaymentIntent(params);
  }
  return createOneTimePaymentIntent(params);
}
