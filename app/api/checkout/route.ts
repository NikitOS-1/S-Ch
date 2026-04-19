import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_URL is not configured" },
        { status: 500 }
      );
    }
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
      return NextResponse.json(
        { error: "Checkout session did not return a URL" },
        { status: 500 }
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (stripeError: unknown) {
    const message =
      stripeError instanceof Error ? stripeError.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
