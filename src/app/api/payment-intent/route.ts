import { NextResponse } from "next/server";
import { createPaymentIntent } from "@/features/stripe-elements-form/server";
import type { CreatePaymentIntentRequest } from "@/features/stripe-elements-form";

function parseCreatePaymentIntentRequest(
  payload: unknown
): CreatePaymentIntentRequest {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payment payload");
  }
  const source = payload as Record<string, unknown>;
  const modeRaw = source.mode;
  const amountCentsRaw = source.amountCents;
  const quantityRaw = source.quantity;
  const productNameRaw = source.productName;

  if (modeRaw !== "payment" && modeRaw !== "subscription") {
    throw new Error("Invalid mode");
  }
  if (typeof amountCentsRaw !== "number" || !Number.isFinite(amountCentsRaw)) {
    throw new Error("Invalid amountCents");
  }
  if (typeof quantityRaw !== "number" || !Number.isFinite(quantityRaw)) {
    throw new Error("Invalid quantity");
  }
  if (
    typeof productNameRaw !== "string" ||
    productNameRaw.trim().length === 0
  ) {
    throw new Error("Invalid productName");
  }
  return {
    mode: modeRaw,
    amountCents: amountCentsRaw,
    quantity: quantityRaw,
    productName: productNameRaw.trim(),
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    const params = parseCreatePaymentIntentRequest(payload);
    const clientSecret = await createPaymentIntent(params);
    return NextResponse.json({ clientSecret });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "PaymentIntent failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
