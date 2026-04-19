import type { PaymentIntent } from "@stripe/stripe-js";

export interface ElementsPaymentReceipt {
  productLabel: string;
  amountDisplay: string;
  paymentIntentId: string;
  paymentStatus: string;
}

type PaymentIntentForReceipt = PaymentIntent & {
  metadata?: Record<string, string> | null;
};

export function buildElementsPaymentReceipt(
  paymentIntent: PaymentIntentForReceipt
): ElementsPaymentReceipt {
  const meta = paymentIntent.metadata ?? undefined;
  const productLabel =
    (meta && typeof meta.product_name === "string" && meta.product_name.length > 0
      ? meta.product_name
      : null) ??
    (paymentIntent.description && paymentIntent.description.length > 0
      ? paymentIntent.description
      : null) ??
    "Product";

  const amountDisplay = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: paymentIntent.currency.toUpperCase(),
  }).format(paymentIntent.amount / 100);

  return {
    productLabel,
    amountDisplay,
    paymentIntentId: paymentIntent.id,
    paymentStatus: paymentIntent.status,
  };
}
