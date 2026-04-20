import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/features/checkout-redirect/server";
import type { CreateCheckoutSessionRequest } from "@/features/checkout-redirect";

function parseCreateCheckoutSessionRequest(
  payload: unknown
): CreateCheckoutSessionRequest {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid checkout payload");
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
    const params = parseCreateCheckoutSessionRequest(payload);
    const url = await createCheckoutSession(params);
    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
