export type ElementsPaymentMode = "payment" | "subscription";

export interface CreatePaymentIntentRequest {
  mode: ElementsPaymentMode;
  amountCents: number;
  quantity: number;
  productName: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
}
