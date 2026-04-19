export type CheckoutPaymentLabel = "paid" | "unpaid";

export interface CheckoutSessionDisplay {
  customerEmail: string;
  amountDisplay: string;
  paymentLabel: CheckoutPaymentLabel;
}

export interface PaymentIntentSummary {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
}
