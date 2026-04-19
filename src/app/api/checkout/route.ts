import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/features/checkout-redirect/server";

export async function POST() {
  try {
    const url = await createCheckoutSession();
    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
