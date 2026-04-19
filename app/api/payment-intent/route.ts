import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";

export async function POST() {
  try {
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
      return NextResponse.json(
        { error: "PaymentIntent did not return a client secret" },
        { status: 500 }
      );
    }
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (stripeError: unknown) {
    const message =
      stripeError instanceof Error ? stripeError.message : "PaymentIntent failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
