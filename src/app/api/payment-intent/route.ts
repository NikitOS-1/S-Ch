import { NextResponse } from "next/server";
import { createPaymentIntent } from "@/features/stripe-elements-form/server";

export async function POST() {
  try {
    const clientSecret = await createPaymentIntent();
    return NextResponse.json({ clientSecret });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "PaymentIntent failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
