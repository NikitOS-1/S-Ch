import "server-only";

import type { CheckoutSessionDisplay } from "@/entities/payment";
import { getStripeServer } from "@/shared/lib/stripe-server";

export async function retrieveCheckoutSessionDisplay(
  sessionId: string
): Promise<CheckoutSessionDisplay> {
  const stripe = getStripeServer();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const email = session.customer_details?.email ?? "—";
  const amountCents = session.amount_total ?? 0;
  const currencyCode = (session.currency ?? "usd").toUpperCase();
  const amountDisplay = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amountCents / 100);

  const paymentLabel = session.payment_status === "paid" ? "paid" : "unpaid";

  return {
    customerEmail: email,
    amountDisplay,
    paymentLabel,
  };
}
